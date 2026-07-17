// ARQUIVO GERADO AUTOMATICAMENTE — não edite à mão.
// Gerado por scripts/update-sprites.mjs (workflow update-sprites.yml), que
// consulta a página "Sprites" da Fortnite Wiki todo dia e ADICIONA aqui os
// Sprites do Chapter 7 em diante que ainda não existem em
// data/elementals.js. Sprites de capítulos anteriores ficam fora do app.
//
// Para traduzir/curar um Sprite desta lista (nome em PT, habilidade,
// variantes especiais etc.), MOVA a entrada para data/elementals.js: o
// gerador pula Sprites que já estão na lista manual e a cópia daqui some na
// próxima execução.
const AUTO_ELEMENTALS = [
  {
    "id": "batman",
    "name": {
      "pt": "Batman",
      "en": "Batman"
    },
    "wikiName": "Batman Sprite",
    "rarity": "Rare",
    "autoAdded": "2026-07-16",
    "ability": {
      "pt": "Habilidade ainda não revelada.",
      "en": "Ability not yet revealed."
    },
    "dust": 100,
    "variantCost": 4000,
    "image": "",
    "variants": []
  },
  {
    "id": "pollo",
    "name": {
      "pt": "Pollo",
      "en": "Pollo"
    },
    "wikiName": "Pollo Sprite",
    "rarity": "Rare",
    "autoAdded": "2026-07-17",
    "ability": {
      "pt": "Habilidade ainda não revelada.",
      "en": "Ability not yet revealed."
    },
    "dust": 100,
    "variantCost": 4000
  },
  {
    "id": "vini-jr",
    "name": {
      "pt": "Vini Jr.",
      "en": "Vini Jr."
    },
    "wikiName": "Vini Jr. Sprite",
    "rarity": "Rare",
    "autoAdded": "2026-07-17",
    "ability": {
      "pt": "Habilidade ainda não revelada.",
      "en": "Ability not yet revealed."
    },
    "dust": 100,
    "variantCost": 4000
  }
];

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
