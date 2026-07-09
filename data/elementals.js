// Dados dos Elementais ("Sprites") do Fortnite Battle Royale
// (Capítulo 7, Temporada 3 + evento "Gone Wild").
// Fonte: fortnite.fandom.com/wiki/Sprites e cobertura da comunidade (jun/2026).
// Atualize esta lista manualmente quando novos Elementais forem lançados.
//
// As imagens vêm da Fortnite Wiki via Special:FilePath (redireciona para o
// arquivo atual da wiki). Se uma imagem falhar, o app usa o ícone SVG local.
const WIKI_FILE = (name) =>
  `https://fortnite.fandom.com/wiki/Special:FilePath/${encodeURIComponent(name)}%20-%20Icon%20-%20Fortnite.png`;

const ELEMENTALS = [
  {
    id: "water",
    name: "Water",
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
    rarity: "Mythic",
    ability: {
      pt: "Mais chance de encontrar loot extra ao eliminar jogadores.",
      en: "Higher chance of finding extra loot when eliminating players.",
    },
    dust: 7500,
    variantCost: 15000,
  },
  {
    id: "grim-reaper",
    name: "Grim Reaper",
    rarity: "Mythic",
    ability: {
      pt: "Marca no seu HUD, por um tempo, qualquer inimigo que te atacar.",
      en: "Marks any enemy who attacks you on your HUD for a duration.",
    },
    dust: 7500,
    variantCost: 15000,
  },
];
