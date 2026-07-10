#!/usr/bin/env node
// Detecta Sprites novos na Fortnite Wiki e os acrescenta em
// data/elementals-auto.js (só adiciona, nunca remove). Roda diariamente no
// GitHub Actions (.github/workflows/update-sprites.yml).
//
// Uso:
//   node scripts/update-sprites.mjs                  # busca a página real
//   node scripts/update-sprites.mjs --fixture x.txt  # usa wikitext local (teste)
//
// Sai com código != 0 quando a página não pôde ser lida ou o parse parece
// quebrado — nesses casos NADA é escrito (fail-closed).

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANUAL_FILE = join(ROOT, "data", "elementals.js");
const AUTO_FILE = join(ROOT, "data", "elementals-auto.js");

// O WAF da Fandom bloqueia clientes "não navegador" (ver pages.yml).
const UA =
  "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0";

const PAGE = "Sprites";
const API_URL = `https://fortnite.fandom.com/api.php?action=parse&page=${PAGE}&prop=wikitext&format=json`;
const RAW_URL = `https://fortnite.fandom.com/wiki/${PAGE}?action=raw`;

// Prefixos de variantes: "Gold Water Sprite" não é um Sprite novo.
const VARIANT_PREFIXES = [
  "Base",
  "Gold",
  "Gummy",
  "Galaxy",
  "Gem",
  "Holofoil",
  "Cube",
  "Quack",
  "Rift",
];

const RARITIES = ["Mythic", "Legendary", "Epic", "Rare"];

// Custos (invocação / variantes) por raridade, iguais aos da lista manual.
const COSTS = {
  Rare: { dust: 100, variantCost: 4000 },
  Epic: { dust: 3000, variantCost: 6000 },
  Legendary: { dust: 5000, variantCost: 10000 },
  Mythic: { dust: 7500, variantCost: 15000 },
};

// Se o parse "encontrar" mais novidades que isso de uma vez, é quase certo
// que o formato da página mudou e o parser quebrou — aborta sem escrever.
const MAX_NEW_PER_RUN = 10;

async function fetchWikitext() {
  const attempts = [
    async () => {
      const res = await fetch(API_URL, { headers: { "User-Agent": UA } });
      if (!res.ok) throw new Error(`api.php HTTP ${res.status}`);
      const data = await res.json();
      const text = data?.parse?.wikitext?.["*"];
      if (!text) throw new Error("api.php sem wikitext na resposta");
      return text;
    },
    async () => {
      const res = await fetch(RAW_URL, { headers: { "User-Agent": UA } });
      if (!res.ok) throw new Error(`action=raw HTTP ${res.status}`);
      return res.text();
    },
  ];

  let lastError;
  for (const attempt of attempts) {
    try {
      return await attempt();
    } catch (err) {
      lastError = err;
      console.warn(`Tentativa de download falhou: ${err.message}`);
    }
  }
  throw new Error(`Não consegui baixar a página ${PAGE}: ${lastError.message}`);
}

// Avalia os arquivos de dados do app (JS puro e autossuficiente) para obter
// a lista atual de Sprites conhecidos.
function loadKnownElementals() {
  const manual = readFileSync(MANUAL_FILE, "utf8");
  const auto = readFileSync(AUTO_FILE, "utf8");
  return new Function(`${manual}\n${auto}\n;return ELEMENTALS;`)();
}

function loadAutoEntries() {
  const auto = readFileSync(AUTO_FILE, "utf8");
  return new Function(
    `const ELEMENTALS=[],WIKI_ITEM=()=>"",makeVariants=()=>[];` +
      `${auto}\n;return AUTO_ELEMENTALS;`
  )();
}

const startsWithVariant = (name) =>
  VARIANT_PREFIXES.some((p) => name === p || name.startsWith(`${p} `));

// Extrai os nomes "X Sprite" citados na página (links, templates e arquivos),
// junto com a raridade encontrada na mesma linha, quando houver.
function parseSprites(wikitext) {
  const found = new Map(); // nome -> raridade | null

  // ":" fora das classes evita capturar prefixos como "File:".
  const patterns = [
    // [[Water Sprite]], [[Water Sprite/Chapter 7|Water Sprite]]
    /\[\[([A-Z][^[\]|#/{}:\n]*? Sprite)(?:\/[^[\]|]*)?(?:\|[^[\]]*)?\]\]/g,
    // {{Item|Water Sprite|...}} e afins
    /\{\{[^{}|]*\|\s*([A-Z][^{}|=:\n]*? Sprite)\s*[|}]/g,
    // File:Water Sprite - Item - Fortnite.png
    /([A-Z][^[\]{}|=:\n]*? Sprite) - Item - Fortnite\.(?:png|webp|jpg)/g,
  ];

  for (const line of wikitext.split("\n")) {
    const rarity =
      RARITIES.find((r) => new RegExp(`\\b${r}\\b`, "i").test(line)) || null;
    for (const pattern of patterns) {
      pattern.lastIndex = 0;
      for (const match of line.matchAll(pattern)) {
        const name = match[1].trim();
        if (startsWithVariant(name)) continue;
        if (!found.has(name) || (rarity && !found.get(name))) {
          found.set(name, rarity);
        }
      }
    }
  }
  return found;
}

const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function makeEntry(wikiName, rarity, today) {
  const display = wikiName.replace(/ Sprite$/, "");
  const costs = COSTS[rarity];
  return {
    id: slug(display),
    name: { pt: display, en: display },
    wikiName,
    rarity,
    // Marca a origem e a data para facilitar a curadoria manual.
    autoAdded: today,
    ability: {
      pt: "Habilidade ainda não revelada.",
      en: "Ability not yet revealed.",
    },
    dust: costs.dust,
    variantCost: costs.variantCost,
  };
}

function writeAutoFile(entries) {
  const body = JSON.stringify(entries, null, 2);
  const content = `// ARQUIVO GERADO AUTOMATICAMENTE — não edite à mão.
// Gerado por scripts/update-sprites.mjs (workflow update-sprites.yml), que
// consulta a página "Sprites" da Fortnite Wiki todo dia e ADICIONA aqui os
// Sprites que ainda não existem em data/elementals.js.
//
// Para traduzir/curar um Sprite desta lista (nome em PT, habilidade,
// variantes especiais etc.), MOVA a entrada para data/elementals.js: o
// gerador pula Sprites que já estão na lista manual e a cópia daqui some na
// próxima execução.
const AUTO_ELEMENTALS = ${body};

// Anexa à lista principal os que ainda não existem lá, montando imagem e
// variantes com os mesmos helpers de data/elementals.js.
AUTO_ELEMENTALS.forEach((e) => {
  if (ELEMENTALS.some((x) => x.id === e.id || x.wikiName === e.wikiName)) {
    return;
  }
  e.image = WIKI_ITEM(e.wikiName);
  e.variants = e.noVariants ? [] : makeVariants(e);
  ELEMENTALS.push(e);
});
`;
  writeFileSync(AUTO_FILE, content);
}

async function main() {
  const fixtureIdx = process.argv.indexOf("--fixture");
  const wikitext =
    fixtureIdx !== -1
      ? readFileSync(process.argv[fixtureIdx + 1], "utf8")
      : await fetchWikitext();

  const known = loadKnownElementals();
  const knownNames = new Set(known.map((e) => e.wikiName));
  // Os "Em breve" (upcoming) podem ainda não aparecer na página da wiki —
  // as travas de sanidade valem só para os Sprites já lançados.
  const releasedNames = known.filter((e) => !e.upcoming).map((e) => e.wikiName);

  // Fail-closed 1: todos os Sprites lançados precisam continuar citados na
  // página. Se algum sumiu, ou a página foi reformulada, ou recebemos um
  // HTML de desafio do WAF — não mexe em nada.
  const missing = releasedNames.filter((n) => !wikitext.includes(n));
  if (missing.length > 0) {
    throw new Error(
      `Parse suspeito: a página não cita mais ${missing.join(", ")}. ` +
        "Nada foi alterado."
    );
  }

  const parsed = parseSprites(wikitext);
  console.log(`Sprites citados na página: ${parsed.size}`);
  for (const [name, rarity] of parsed) {
    console.log(`  - ${name} (${rarity || "raridade não encontrada"})`);
  }

  // Fail-closed 2: os padrões de extração precisam reencontrar os Sprites
  // lançados. Se não reencontram nem os conhecidos, também não achariam os
  // novos — o formato da página mudou e o parser precisa de ajuste.
  // (Só vale para nomes com sufixo " Sprite": itens como "Burnt Peanut"
  // não são extraíveis por padrão e ficam cobertos pela checagem 1.)
  const notParsed = releasedNames.filter(
    (n) => n.endsWith(" Sprite") && !parsed.has(n)
  );
  if (notParsed.length > 0) {
    throw new Error(
      `Parse suspeito: os padrões não reencontraram ${notParsed.join(", ")}. ` +
        "O formato da página deve ter mudado; nada foi alterado."
    );
  }

  const newNames = [...parsed.keys()].filter((n) => !knownNames.has(n));
  if (newNames.length > MAX_NEW_PER_RUN) {
    throw new Error(
      `Parse suspeito: ${newNames.length} Sprites "novos" de uma vez ` +
        `(limite ${MAX_NEW_PER_RUN}). Nada foi alterado.`
    );
  }

  if (newNames.length === 0) {
    console.log("Nenhum Sprite novo — nada a fazer.");
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const entries = [
    ...loadAutoEntries(),
    ...newNames.map((n) => makeEntry(n, parsed.get(n) || "Rare", today)),
  ];
  writeAutoFile(entries);
  console.log(`Adicionados: ${newNames.join(", ")}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
