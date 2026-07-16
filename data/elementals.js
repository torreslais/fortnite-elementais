// Dados dos Elementais ("Sprites") do Fortnite Battle Royale
// (Capítulo 7, Temporada 3 + evento "Gone Wild").
// Fonte: fortnite.fandom.com/wiki/Sprites e cobertura da comunidade (jul/2026).
// ESCOPO: apenas Sprites do Chapter 7 em diante — os do Chapter 6 (e
// anteriores) não fazem parte do app.
// Esta é a lista CURADA (nomes em PT, habilidades, exceções de variantes).
// Sprites novos chegam sozinhos via data/elementals-auto.js (workflow
// update-sprites.yml) e devem ser movidos para cá ao serem traduzidos.
//
// As imagens vêm da Fortnite Wiki via Special:FilePath (redireciona para o
// arquivo atual da wiki). Os arquivos seguem o padrão
// "{Nome} - Item - Fortnite.png" (ex.: "Water Sprite - Item - Fortnite.png",
// "Gold Water Sprite - Item - Fortnite.png"). Se uma imagem falhar, o app
// usa o ícone SVG local como fallback.
const WIKI_ITEM = (fileBase) =>
  `https://fortnite.fandom.com/wiki/Special:FilePath/${encodeURIComponent(
    `${fileBase} - Item - Fortnite.png`
  )}`;

// Variantes padrão dos Sprites. Exceções (conforme a wiki):
//  - Burnt Peanut (Mítico) não tem variante nenhuma (noVariants);
//  - Dream e Punk não têm a variante Metalizado/Holofoil (noHolofoil);
//  - Cubo existe só para Dream, Punk e Zero Point, e Quack só para o
//    Zero Point (extraVariants).
// Todas as variantes herdam a raridade do Sprite base — são versões
// "especiais" com drop menor, não um tier de raridade próprio.
// Linha do tempo: Goma habilitada em 11/jun, Galáxia em 18/jun; Gema e
// Metalizado chegaram nas Fendas Anômalas (Sprite Hunt Rift Anomalies) e
// foram desabilitadas em 25/jun; o Metalizado voltou em 09/jul/2026 (a
// Gema segue desabilitada no jogo, mas continua aqui para quem já tem).
const SPRITE_VARIANTS = [
  {
    id: "gold",
    name: { pt: "Dourado", en: "Gold" },
    effect: {
      pt: "3x XP bônus em eliminações",
      en: "3x bonus XP on eliminations",
    },
  },
  {
    id: "gummy",
    name: { pt: "Goma", en: "Gummy" },
    effect: {
      pt: "+20% de Pó de Elemental ao extrair",
      en: "20% more Sprite Dust on extraction",
    },
  },
  {
    id: "galaxy",
    name: { pt: "Galáxia", en: "Galaxy" },
    effect: {
      pt: "+30% de munição ao saquear",
      en: "30% more ammo when looting",
    },
  },
  {
    id: "gem",
    name: { pt: "Gema", en: "Gem" },
    effect: { pt: "-30% de dano de queda", en: "30% less fall damage" },
  },
  {
    id: "holofoil",
    name: { pt: "Metalizado", en: "Holofoil" },
    effect: {
      pt: "30% de chance do esquadrão achar Sprites raros em contêineres",
      en: "30% chance for your squad to find rare Sprites from containers",
    },
  },
];

// Variantes especiais de colecionador, exclusivas de alguns Sprites.
// O efeito delas ainda não foi revelado (a wiki lista como "??").
const EXTRA_VARIANTS = {
  cube: {
    id: "cube",
    name: { pt: "Cubo", en: "Cube" },
    effect: { pt: "Efeito ainda não revelado", en: "Effect not yet revealed" },
  },
  quack: {
    id: "quack",
    name: { pt: "Quack", en: "Quack" },
    effect: { pt: "Efeito ainda não revelado", en: "Effect not yet revealed" },
  },
};

// O nome do arquivo na wiki usa sempre o nome em inglês da variante.
const makeVariants = (elemental) => {
  const base = SPRITE_VARIANTS.filter(
    (v) => !(elemental.noHolofoil && v.id === "holofoil")
  );
  const extras = (elemental.extraVariants || []).map((id) => EXTRA_VARIANTS[id]);
  return [...base, ...extras].map((v) => ({
    ...v,
    image: WIKI_ITEM(`${v.name.en} ${elemental.wikiName}`),
  }));
};

const ELEMENTALS = [
  {
    id: "water",
    name: { pt: "Água", en: "Water" },
    wikiName: "Water Sprite",
    rarity: "Rare",
    ability: {
      pt: "Regenera o escudo seu e do seu esquadrão enquanto vocês estiverem na água.",
      en: "Regenerates shields for you and your squad while you're in water.",
    },
    dust: 100,
    variantCost: 4000,
  },
  {
    id: "earth",
    name: { pt: "Terra", en: "Earth" },
    wikiName: "Earth Sprite",
    rarity: "Rare",
    ability: {
      pt: "Aumenta a chance de encontrar itens raros dentro de baús.",
      en: "Increases your chance of finding rare items in chests.",
    },
    dust: 100,
    variantCost: 4000,
  },
  {
    id: "fire",
    name: { pt: "Fogo", en: "Fire" },
    wikiName: "Fire Sprite",
    rarity: "Rare",
    ability: {
      pt: "Cria uma explosão de dano extra depois de acertar o mesmo inimigo repetidas vezes.",
      en: "Creates a burst of extra damage after hitting the same enemy repeatedly.",
    },
    dust: 100,
    variantCost: 4000,
  },
  {
    id: "fishy",
    name: { pt: "Peixoto", en: "Fishy" },
    wikiName: "Fishy Sprite",
    rarity: "Rare",
    ability: {
      pt: "Aumenta bastante a velocidade de natação e dá um boost de velocidade ao levar dano.",
      en: "Greatly increases swim speed and grants a speed boost when you take damage.",
    },
    dust: 100,
    variantCost: 4000,
  },
  {
    id: "air",
    name: { pt: "Ar", en: "Air" },
    wikiName: "Air Sprite",
    rarity: "Rare",
    ability: {
      pt: "Aumenta a velocidade de corrida e a altura do pulo, e anula dano de queda.",
      en: "Increases sprint speed and jump height, and nullifies fall damage.",
    },
    dust: 100,
    variantCost: 4000,
  },
  {
    id: "duck",
    name: { pt: "Pato", en: "Duck" },
    wikiName: "Duck Sprite",
    rarity: "Epic",
    ability: {
      pt: "Emotar ou usar o Jam recupera escudo.",
      en: "Emoting or Jamming replenishes shields.",
    },
    dust: 3000,
    variantCost: 6000,
  },
  {
    id: "ghost",
    name: { pt: "Fantasma", en: "Ghost" },
    wikiName: "Ghost Sprite",
    rarity: "Epic",
    ability: {
      pt: "Concede uma breve janela furtiva sempre que você recarrega a arma.",
      en: "Grants a brief stealth window whenever you reload.",
    },
    dust: 3000,
    variantCost: 6000,
  },
  {
    id: "demon",
    name: { pt: "Demônio", en: "Demon" },
    wikiName: "Demon Sprite",
    rarity: "Epic",
    ability: {
      pt: "Rouba um pouco de vida e escudo ao eliminar um oponente.",
      en: "Siphons some health and shields when you eliminate an opponent.",
    },
    dust: 3000,
    variantCost: 6000,
  },
  {
    id: "king",
    name: { pt: "Rei", en: "King" },
    wikiName: "King Sprite",
    rarity: "Epic",
    ability: {
      pt: "Sua picareta causa mais dano.",
      en: "Your pickaxe deals more damage.",
    },
    dust: 3000,
    variantCost: 6000,
  },
  {
    id: "aura",
    name: { pt: "Aura", en: "Aura" },
    wikiName: "Aura Sprite",
    rarity: "Epic",
    ability: {
      pt: "Ganha uma carga de Shock Rock ao causar dano suficiente em inimigos.",
      en: "Gain a Shock Rock charge when you deal enough damage to enemies.",
    },
    dust: 3000,
    variantCost: 6000,
  },
  {
    id: "striker",
    name: { pt: "Atacante", en: "Striker" },
    wikiName: "Striker Sprite",
    rarity: "Epic",
    ability: {
      pt: "Ganha Overdrive ao subir (Mantle) ou saltar obstáculos (Hurdle).",
      en: "Gain Overdrive when you Mantle or Hurdle.",
    },
    dust: 3000,
    variantCost: 6000,
  },
  {
    id: "dream",
    name: { pt: "Sonhos", en: "Dream" },
    wikiName: "Dream Sprite",
    rarity: "Legendary",
    noHolofoil: true,
    extraVariants: ["cube"],
    ability: {
      pt: "Dropa loot aleatório a cada level up, culminando em itens lendários no nível máximo.",
      en: "Drops random loot at every level up, culminating in legendary items at max level.",
    },
    dust: 5000,
    variantCost: 10000,
  },
  {
    id: "punk",
    name: { pt: "Punk", en: "Punk" },
    wikiName: "Punk Sprite",
    rarity: "Legendary",
    noHolofoil: true,
    extraVariants: ["cube"],
    ability: {
      pt: "Chance de munição infinita ou recarga automática.",
      en: "Chance for infinite ammo or auto-reload.",
    },
    dust: 5000,
    variantCost: 10000,
  },
  {
    id: "boss",
    name: { pt: "Chefe", en: "Boss" },
    wikiName: "Boss Sprite",
    rarity: "Legendary",
    ability: {
      pt: "Aumenta o HP e o Shield máximos.",
      en: "Increases your maximum HP and Shield.",
    },
    dust: 5000,
    variantCost: 10000,
  },
  {
    id: "seven",
    name: { pt: "Sete", en: "Seven" },
    wikiName: "Seven Sprite",
    rarity: "Legendary",
    ability: {
      pt: "Revela ao seu esquadrão os rastros de passos dos inimigos.",
      en: "Makes enemy foot trails visible to your squad.",
    },
    dust: 5000,
    variantCost: 10000,
  },
  {
    id: "zero-point",
    name: { pt: "Ponto Zero", en: "Zero Point" },
    wikiName: "Zero Point Sprite",
    rarity: "Mythic",
    extraVariants: ["cube", "quack"],
    ability: {
      pt: "Cria automaticamente uma Shield Bubble Jr. sempre que você se cura.",
      en: "Automatically deploys a Shield Bubble Jr. whenever you heal.",
    },
    dust: 7500,
    variantCost: 15000,
  },
  {
    id: "burnt-peanut",
    name: { pt: "Amendoim Queimado", en: "Burnt Peanut" },
    wikiName: "Burnt Peanut",
    rarity: "Mythic",
    noVariants: true,
    ability: {
      pt: "Mais chance de encontrar loot extra ao eliminar jogadores.",
      en: "Higher chance of finding extra loot when eliminating players.",
    },
    dust: 7500,
    variantCost: 15000,
  },
  {
    id: "grim-reaper",
    name: { pt: "Ceifador", en: "Grim" },
    wikiName: "Grim Sprite",
    rarity: "Mythic",
    ability: {
      pt: "Marca no seu HUD, por um tempo, qualquer inimigo que te atacar.",
      en: "Marks any enemy who attacks you on your HUD for a duration.",
    },
    dust: 7500,
    variantCost: 15000,
  },
  // Sprites já listados na wiki mas ainda não lançados no jogo
  // (upcoming: true desabilita os checkboxes e tira do progresso).
  {
    id: "john-wick",
    name: { pt: "John Wick", en: "John Wick" },
    wikiName: "John Wick Sprite",
    rarity: "Mythic",
    upcoming: true,
    noVariants: true,
    ability: {
      pt: "Habilidade ainda não revelada.",
      en: "Ability not yet revealed.",
    },
    dust: 7500,
    variantCost: 15000,
  },
];

ELEMENTALS.forEach((e) => {
  e.image = WIKI_ITEM(e.wikiName);
  e.variants = e.noVariants ? [] : makeVariants(e);
});
