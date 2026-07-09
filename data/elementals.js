// Dados dos Elementais ("Sprites") do Fortnite Battle Royale
// (Capítulo 7, Temporada 3 + evento "Gone Wild").
// Fonte: fortnite.fandom.com/wiki/Sprites e cobertura da comunidade (jul/2026).
// Atualize esta lista manualmente quando novos Elementais forem lançados.
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

// Variantes padrão dos Sprites. Todos os Sprites têm as cinco variantes,
// exceto o Burnt Peanut (Mítico), que não tem nenhuma.
const SPRITE_VARIANTS = [
  {
    id: "gold",
    name: "Gold",
    effect: { pt: "XP bônus em eliminações", en: "Bonus XP on eliminations" },
  },
  {
    id: "gummy",
    name: "Gummy",
    effect: {
      pt: "Mais Sprite Dust ao extrair",
      en: "More Sprite Dust on extraction",
    },
  },
  {
    id: "galaxy",
    name: "Galaxy",
    effect: { pt: "Mais munição ao saquear", en: "More ammo when looting" },
  },
  {
    id: "gem",
    name: "Gem",
    effect: { pt: "Reduz dano de queda", en: "Reduces fall damage" },
  },
  {
    id: "holofoil",
    name: "Holofoil",
    effect: {
      pt: "Chance do esquadrão achar Sprites raros",
      en: "Chance for your squad to find rare Sprites",
    },
  },
];

const makeVariants = (wikiName) =>
  SPRITE_VARIANTS.map((v) => ({
    ...v,
    image: WIKI_ITEM(`${v.name} ${wikiName}`),
  }));

const ELEMENTALS = [
  {
    id: "water",
    name: "Water",
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
    name: "Earth",
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
    name: "Fire",
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
    name: "Fishy",
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
    id: "duck",
    name: "Duck",
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
    name: "Ghost",
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
    name: "Demon",
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
    name: "King",
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
    name: "Aura",
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
    name: "Striker",
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
    name: "Dream",
    wikiName: "Dream Sprite",
    rarity: "Legendary",
    ability: {
      pt: "Dropa loot aleatório a cada level up, culminando em itens lendários no nível máximo.",
      en: "Drops random loot at every level up, culminating in legendary items at max level.",
    },
    dust: 5000,
    variantCost: 10000,
  },
  {
    id: "punk",
    name: "Punk",
    wikiName: "Punk Sprite",
    rarity: "Legendary",
    ability: {
      pt: "Chance de munição infinita ou recarga automática.",
      en: "Chance for infinite ammo or auto-reload.",
    },
    dust: 5000,
    variantCost: 10000,
  },
  {
    id: "boss",
    name: "Boss",
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
    id: "zero-point",
    name: "Zero Point",
    wikiName: "Zero Point Sprite",
    rarity: "Mythic",
    ability: {
      pt: "Cria automaticamente uma Shield Bubble Jr. sempre que você se cura.",
      en: "Automatically deploys a Shield Bubble Jr. whenever you heal.",
    },
    dust: 7500,
    variantCost: 15000,
  },
  {
    id: "burnt-peanut",
    name: "Burnt Peanut",
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
    name: "Grim",
    wikiName: "Grim Sprite",
    rarity: "Mythic",
    ability: {
      pt: "Marca no seu HUD, por um tempo, qualquer inimigo que te atacar.",
      en: "Marks any enemy who attacks you on your HUD for a duration.",
    },
    dust: 7500,
    variantCost: 15000,
  },
];

ELEMENTALS.forEach((e) => {
  e.image = WIKI_ITEM(e.wikiName);
  e.variants = e.noVariants ? [] : makeVariants(e.wikiName);
});
