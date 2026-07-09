const STORAGE_KEY = "fortnite-sprites-collection-v1";
const LANG_KEY = "fortnite-elementals-lang";
const SORT_KEY = "fortnite-elementals-sort";

const RARITY_COLORS = {
  Rare: "var(--rare)",
  Epic: "var(--epic)",
  Legendary: "var(--legendary)",
  Mythic: "var(--mythic)",
};

const TRANSLATIONS = {
  pt: {
    htmlLang: "pt-BR",
    docTitle: "Fortnite Sprites Locker",
    title: "Fortnite Sprites Locker",
    subtitle: "Acompanhe quais Elementais do Fortnite Battle Royale você já possui",
    searchPlaceholder: "Buscar Elemental pelo nome...",
    tabAll: "Todos",
    tabOwned: "Tenho",
    tabNotOwned: "Não tenho",
    tabMastered: "Dominados",
    tabNotMastered: "Não dominados",
    tabFavorites: "Favoritos ★",
    sortLabel: "Ordenar por",
    sortDefault: "Padrão",
    sortRarity: "Raridade",
    sortAlpha: "Nome (A–Z)",
    progressOwned: (owned, total) => `${owned} / ${total} coletados`,
    progressMastered: (mastered, total) => `${mastered} / ${total} dominados`,
    owned: "Tenho",
    mastered: "Dominado",
    favorite: "Favoritar",
    refresh: "Atualizar",
    close: "Fechar",
    costLabel: "Custo de invocação (Pó de Elemental)",
    costTitle:
      "Quanto de Pó de Elemental custa para invocar este Elemental numa partida",
    costVariants: "Variantes",
    collectionLabel: "Coleção",
    baseVariant: "Base",
    upcoming: "Em breve",
    empty: "Nenhum Elemental encontrado.",
    installTitle: "📱 Instale como aplicativo",
    installButton: "Instalar aplicativo",
    installGeneric:
      "Este site funciona como aplicativo: no menu do navegador (⋮), toque em “Instalar aplicativo” ou “Adicionar à tela inicial”.",
    installIos:
      "No iPhone/iPad: toque no botão Compartilhar (□↑) do Safari e escolha “Adicionar à Tela de Início”.",
    installOffline:
      "Depois de instalado, o app abre offline: seu progresso e os ícones já vistos ficam salvos no aparelho.",
    footer:
      'Dados baseados na <a href="https://fortnite.fandom.com/wiki/Sprites" target="_blank" rel="noopener noreferrer">Fortnite Wiki</a> e não afiliados à Epic Games. Progresso salvo apenas neste navegador.',
    rarities: { Rare: "Raro", Epic: "Épico", Legendary: "Lendário", Mythic: "Mítico" },
  },
  en: {
    htmlLang: "en",
    docTitle: "Fortnite Sprites Locker",
    title: "Fortnite Sprites Locker",
    subtitle: "Track which Fortnite Battle Royale Elementals you already own",
    searchPlaceholder: "Search Elementals by name...",
    tabAll: "All",
    tabOwned: "Owned",
    tabNotOwned: "Not owned",
    tabMastered: "Mastered",
    tabNotMastered: "Not mastered",
    tabFavorites: "Favorites ★",
    sortLabel: "Sort by",
    sortDefault: "Default",
    sortRarity: "Rarity",
    sortAlpha: "Name (A–Z)",
    progressOwned: (owned, total) => `${owned} / ${total} collected`,
    progressMastered: (mastered, total) => `${mastered} / ${total} mastered`,
    owned: "Owned",
    mastered: "Mastered",
    favorite: "Favorite",
    refresh: "Refresh",
    close: "Close",
    costLabel: "Summon cost (Sprite Dust)",
    costTitle: "How much Sprite Dust it costs to summon this Sprite in a match",
    costVariants: "Variants",
    collectionLabel: "Collection",
    baseVariant: "Base",
    upcoming: "Upcoming",
    empty: "No Elementals found.",
    installTitle: "📱 Install as an app",
    installButton: "Install app",
    installGeneric:
      "This site works as an app: open the browser menu (⋮) and tap “Install app” or “Add to Home screen”.",
    installIos:
      "On iPhone/iPad: tap Safari's Share button (□↑) and choose “Add to Home Screen”.",
    installOffline:
      "Once installed, the app opens offline: your progress and previously viewed icons stay saved on your device.",
    footer:
      'Data based on the <a href="https://fortnite.fandom.com/wiki/Sprites" target="_blank" rel="noopener noreferrer">Fortnite Wiki</a>, not affiliated with Epic Games. Progress is saved in this browser only.',
    rarities: { Rare: "Rare", Epic: "Epic", Legendary: "Legendary", Mythic: "Mythic" },
  },
};

// localStorage pode estar indisponível (ex.: iframe em sandbox);
// nesse caso o app funciona sem persistência.
const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* sem persistência */
    }
  },
};

function loadCollection() {
  try {
    return JSON.parse(storage.get(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCollection(collection) {
  storage.set(STORAGE_KEY, JSON.stringify(collection));
}

function loadLang() {
  const saved = storage.get(LANG_KEY);
  return saved === "en" || saved === "pt" ? saved : "pt";
}

let collection = loadCollection();
let lang = loadLang();
let activeFilter = "all";
let searchTerm = "";
let sortMode = ["default", "rarity", "alpha"].includes(storage.get(SORT_KEY))
  ? storage.get(SORT_KEY)
  : "default";

const grid = document.getElementById("elemental-grid");
const emptyState = document.getElementById("empty-state");
const progressBarOwned = document.getElementById("progress-bar-owned");
const progressBarMastered = document.getElementById("progress-bar-mastered");
const progressLabelOwned = document.getElementById("progress-label-owned");
const progressLabelMastered = document.getElementById("progress-label-mastered");
const searchInput = document.getElementById("search-input");
const filterTabs = document.getElementById("filter-tabs");
const langSwitch = document.getElementById("lang-switch");
const spriteNav = document.getElementById("sprite-nav");

function t() {
  return TRANSLATIONS[lang];
}

function fmtNumber(n) {
  return n.toLocaleString(lang === "pt" ? "pt-BR" : "en-US");
}

function getEntry(id) {
  const entry = collection[id] || {
    owned: false,
    mastered: false,
    favorite: false,
  };
  if (!("mastered" in entry)) entry.mastered = false;
  if (!entry.variants) entry.variants = {};
  // Migração do formato antigo, em que a variante era só um boolean.
  Object.keys(entry.variants).forEach((key) => {
    if (typeof entry.variants[key] === "boolean") {
      entry.variants[key] = { owned: entry.variants[key], mastered: false };
    }
  });
  return entry;
}

function getVariantEntry(entry, variantId) {
  return entry.variants[variantId] || { owned: false, mastered: false };
}

function setEntry(id, patch) {
  collection[id] = { ...getEntry(id), ...patch };
  saveCollection(collection);
}

function hasAny(elemental, flag) {
  const entry = getEntry(elemental.id);
  if (entry[flag]) return true;
  return elemental.variants.some((v) => getVariantEntry(entry, v.id)[flag]);
}

function matchesFilter(elemental) {
  if (activeFilter === "all") return true;
  if (activeFilter === "owned") return hasAny(elemental, "owned");
  if (activeFilter === "not-owned") return !hasAny(elemental, "owned");
  if (activeFilter === "mastered") return hasAny(elemental, "mastered");
  if (activeFilter === "not-mastered") return !hasAny(elemental, "mastered");
  if (activeFilter === "favorites") return getEntry(elemental.id).favorite;
  return elemental.rarity === activeFilter;
}

function sortElementals(list) {
  if (sortMode === "alpha") {
    return [...list].sort((a, b) =>
      a.name[lang].localeCompare(b.name[lang], lang === "pt" ? "pt-BR" : "en")
    );
  }
  if (sortMode === "rarity") {
    return [...list].sort(
      (a, b) =>
        RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity) ||
        a.name[lang].localeCompare(b.name[lang], lang === "pt" ? "pt-BR" : "en")
    );
  }
  return list; // ordem padrão dos dados
}

function matchesSearch(elemental) {
  if (!searchTerm) return true;
  const term = searchTerm.toLowerCase();
  return (
    elemental.name.pt.toLowerCase().includes(term) ||
    elemental.name.en.toLowerCase().includes(term)
  );
}

function applyLanguage() {
  const s = t();
  document.documentElement.lang = s.htmlLang;
  document.title = s.docTitle;
  document.getElementById("app-title").textContent = s.title;
  document.getElementById("app-subtitle").textContent = s.subtitle;
  document.getElementById("app-footer").innerHTML = s.footer;
  searchInput.placeholder = s.searchPlaceholder;
  emptyState.textContent = s.empty;

  [...filterTabs.children].forEach((tab) => {
    const key = tab.dataset.rarity;
    if (key === "all") tab.textContent = s.tabAll;
    else if (key === "owned") tab.textContent = s.tabOwned;
    else if (key === "not-owned") tab.textContent = s.tabNotOwned;
    else if (key === "mastered") tab.textContent = s.tabMastered;
    else if (key === "not-mastered") tab.textContent = s.tabNotMastered;
    else if (key === "favorites") tab.textContent = s.tabFavorites;
    else tab.textContent = s.rarities[key];
  });

  document.getElementById("sort-label").textContent = s.sortLabel;
  const sortSelect = document.getElementById("sort-select");
  const sortNames = {
    default: s.sortDefault,
    rarity: s.sortRarity,
    alpha: s.sortAlpha,
  };
  [...sortSelect.options].forEach((opt) => {
    opt.textContent = sortNames[opt.value];
  });
  sortSelect.value = sortMode;

  const refreshBtn = document.getElementById("refresh-btn");
  refreshBtn.title = s.refresh;
  refreshBtn.setAttribute("aria-label", s.refresh);
  document.getElementById("refresh-label").textContent = s.refresh;
  document.getElementById("install-close").title = s.close;

  [...langSwitch.children].forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.lang === lang)
  );

  renderNav(); // os títulos dos ícones seguem o idioma
  renderInstallBox();
}

// ---- Instalação como aplicativo (PWA) ----
const INSTALL_TOAST_KEY = "install-toast-dismissed";
const installBox = document.getElementById("install-box");
const installBtn = document.getElementById("install-btn");
let deferredInstallPrompt = null;

// Detecta a versão instalada (app): o toast de instalação só existe na web.
const isStandalone = () =>
  ["standalone", "fullscreen", "minimal-ui", "window-controls-overlay"].some(
    (mode) => window.matchMedia(`(display-mode: ${mode})`).matches
  ) || window.navigator.standalone === true;

const isIos = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

function renderInstallBox() {
  const s = t();
  if (isStandalone() || storage.get(INSTALL_TOAST_KEY)) {
    // Já está rodando como app instalado, ou o usuário fechou o aviso.
    installBox.hidden = true;
    return;
  }
  installBox.hidden = false;
  document.getElementById("install-title").textContent = s.installTitle;
  document.getElementById("install-text").textContent = deferredInstallPrompt
    ? ""
    : isIos()
      ? s.installIos
      : s.installGeneric;
  document.getElementById("install-offline").textContent = s.installOffline;
  installBtn.hidden = !deferredInstallPrompt;
  installBtn.textContent = s.installButton;
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  renderInstallBox();
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  installBox.hidden = true;
});

installBtn.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  renderInstallBox();
});

document.getElementById("install-close").addEventListener("click", () => {
  storage.set(INSTALL_TOAST_KEY, "1");
  installBox.hidden = true;
});

// Service worker: cache do app e das imagens já vistas, para uso offline.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      /* offline/cache indisponível — o site continua funcionando online */
    });
  });
}

const RARITY_ORDER = ["Rare", "Epic", "Legendary", "Mythic"];

// Barra segmentada: cada raridade contribui com uma fatia na sua cor.
function renderProgressBar(bar, byRarity, total) {
  const s = t();
  bar.innerHTML = RARITY_ORDER.map((rarity) => {
    const count = byRarity[rarity] || 0;
    const width = total === 0 ? 0 : (count / total) * 100;
    return `<div class="progress-seg" style="width:${width}%; background:${RARITY_COLORS[rarity]}"
                 title="${s.rarities[rarity]}: ${count}"></div>`;
  }).join("");
}

function renderProgress() {
  let total = 0;
  const owned = { count: 0, byRarity: {} };
  const mastered = { count: 0, byRarity: {} };

  const tally = (bucket, rarity, flag) => {
    if (!flag) return;
    bucket.count += 1;
    bucket.byRarity[rarity] = (bucket.byRarity[rarity] || 0) + 1;
  };

  ELEMENTALS.forEach((e) => {
    if (e.upcoming) return; // não lançados não contam no progresso
    const entry = getEntry(e.id);
    total += 1 + e.variants.length;
    tally(owned, e.rarity, entry.owned);
    tally(mastered, e.rarity, entry.mastered);
    e.variants.forEach((v) => {
      const state = getVariantEntry(entry, v.id);
      tally(owned, e.rarity, state.owned);
      tally(mastered, e.rarity, state.mastered);
    });
  });

  const s = t();
  renderProgressBar(progressBarOwned, owned.byRarity, total);
  renderProgressBar(progressBarMastered, mastered.byRarity, total);
  progressLabelOwned.textContent = s.progressOwned(owned.count, total);
  progressLabelMastered.textContent = s.progressMastered(mastered.count, total);
}

// Fallback: se a imagem da wiki não carregar, mostra o ícone SVG local.
function iconFallback(img, id) {
  const holder = img.closest(".elemental-icon");
  if (holder) holder.innerHTML = ELEMENTAL_ICONS[id] || "";
}
window.iconFallback = iconFallback;

// Mesmo fallback para os ícones do menu de navegação rápida.
// Sem SVG local (ex.: Elementais "Em breve"), mostra a inicial do nome.
function navIconFallback(img, id) {
  const holder = img.closest(".nav-icon");
  if (!holder) return;
  const elemental = ELEMENTALS.find((e) => e.id === id);
  holder.innerHTML =
    ELEMENTAL_ICONS[id] ||
    `<span class="nav-letter">${elemental ? elemental.name[lang][0] : "?"}</span>`;
}
window.navIconFallback = navIconFallback;

// Menu de navegação rápida: um botão com o ícone de cada Elemental base.
function renderNav() {
  spriteNav.innerHTML = ELEMENTALS.map(
    (e) => `
    <button class="nav-icon${e.upcoming ? " upcoming" : ""}" type="button"
            data-nav="${e.id}" title="${e.name[lang]}" aria-label="${e.name[lang]}"
            style="--rarity-color:${RARITY_COLORS[e.rarity]}">
      <img src="${e.image}" alt="" width="32" height="32" loading="lazy"
           onerror="navIconFallback(this, '${e.id}')" />
    </button>`
  ).join("");
}

spriteNav.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-nav]");
  if (!btn) return;

  const id = btn.dataset.nav;
  let card = document.getElementById(`card-${id}`);
  if (!card) {
    // O card está oculto pelo filtro/busca atual — limpa tudo para navegar.
    activeFilter = "all";
    searchTerm = "";
    searchInput.value = "";
    [...filterTabs.children].forEach((el) =>
      el.classList.toggle("active", el.dataset.rarity === "all")
    );
    render();
    card = document.getElementById(`card-${id}`);
  }
  if (!card) return;

  card.scrollIntoView({ behavior: "smooth", block: "start" });
  // Reinicia a animação de destaque mesmo em cliques repetidos.
  card.classList.remove("nav-flash");
  void card.offsetWidth;
  card.classList.add("nav-flash");
});

// Fallback das variantes: se a imagem da wiki falhar, o chip fica só com o nome.
// Esconde sem remover: o espaço fica reservado e o layout não "pula"
// (remover deslocaria a página durante a navegação rápida).
function variantImgFallback(img) {
  img.style.visibility = "hidden";
}
window.variantImgFallback = variantImgFallback;

function spriteTile(elemental, s, { variantId, name, image, title, state }) {
  const checkbox = (action, checked, label) => `
    <label class="tile-check">
      <input type="checkbox" ${checked ? "checked" : ""}
             ${elemental.upcoming ? "disabled" : ""}
             data-action="${action}" data-id="${elemental.id}"
             data-variant="${variantId}" />
      ${label}
    </label>`;

  return `
    <div class="sprite-tile${state.owned ? " owned" : ""}${state.mastered ? " mastered" : ""}"
         title="${title}">
      <img class="tile-img" src="${image}" alt="" width="36" height="36"
           loading="lazy" onerror="variantImgFallback(this)" />
      <span class="tile-name">${name}</span>
      <div class="tile-checks">
        ${checkbox("own", state.owned, s.owned)}
        ${checkbox("master", state.mastered, s.mastered)}
      </div>
    </div>`;
}

function collectionTiles(elemental, entry, s) {
  // Quadradinho do Sprite base em cima, um para cada variante abaixo.
  const baseTile = spriteTile(elemental, s, {
    variantId: "base",
    name: s.baseVariant,
    image: elemental.image,
    title: `${elemental.name[lang]} — ${s.baseVariant}`,
    state: entry,
  });

  const variantTiles = elemental.variants
    .map((v) =>
      spriteTile(elemental, s, {
        variantId: v.id,
        name: v.name[lang],
        image: v.image,
        title: `${v.name[lang]} — ${v.effect[lang]}`,
        state: getVariantEntry(entry, v.id),
        isBase: false,
      })
    )
    .join("");

  return `
    <div class="variants">
      <span class="variants-label">${s.collectionLabel}</span>
      <div class="sprite-tiles">${baseTile}${variantTiles}</div>
    </div>`;
}

function createCard(elemental) {
  const s = t();
  const entry = getEntry(elemental.id);
  const card = document.createElement("article");
  card.id = `card-${elemental.id}`;
  card.className = "elemental-card" + (entry.owned ? " owned" : "");
  card.style.setProperty("--rarity-color", RARITY_COLORS[elemental.rarity]);

  card.innerHTML = `
    <div class="card-head">
      <div class="elemental-icon">
        <img src="${elemental.image}" alt="${elemental.name[lang]}" width="56" height="56"
             loading="lazy" onerror="iconFallback(this, '${elemental.id}')" />
      </div>
      <div class="card-title">
        <h3 class="elemental-name">${elemental.name[lang]}</h3>
        <span class="rarity-badge">${s.rarities[elemental.rarity]}</span>
        ${elemental.upcoming ? `<span class="upcoming-badge">${s.upcoming}</span>` : ""}
      </div>
    </div>
    <p class="elemental-ability">${elemental.ability[lang]}</p>
    ${collectionTiles(elemental, entry, s)}
    <div class="costs-block" title="${s.costTitle}">
      <span class="variants-label">${s.costLabel}</span>
      <div class="elemental-costs">
        <span>💠 ${s.baseVariant}: ${fmtNumber(elemental.dust)}</span>
        ${
          elemental.variants.length
            ? `<span>🪙 ${s.costVariants}: ${fmtNumber(elemental.variantCost)}</span>`
            : ""
        }
      </div>
    </div>
    <button class="favorite-btn ${entry.favorite ? "active" : ""}" data-action="favorite" data-id="${elemental.id}" title="${s.favorite}">
      ${entry.favorite ? "★" : "☆"}
    </button>
  `;

  return card;
}

function render() {
  const visible = sortElementals(
    ELEMENTALS.filter((e) => matchesFilter(e) && matchesSearch(e))
  );

  grid.innerHTML = "";
  visible.forEach((elemental) => grid.appendChild(createCard(elemental)));

  emptyState.hidden = visible.length > 0;
  renderProgress();
}

grid.addEventListener("click", (e) => {
  const target = e.target.closest("[data-action]");
  if (!target) return;

  const id = target.dataset.id;
  const action = target.dataset.action;

  if (action === "own" || action === "master") {
    const variantId = target.dataset.variant;
    const checked = target.checked;
    const entry = getEntry(id);

    // "Dominado" marcado implica "Possui"; desmarcar "Possui" limpa "Dominado".
    const apply = (state) => {
      if (action === "master") {
        return { owned: checked ? true : state.owned, mastered: checked };
      }
      return { owned: checked, mastered: checked ? state.mastered : false };
    };

    if (variantId === "base") {
      setEntry(id, apply(entry));
    } else {
      const variants = { ...entry.variants };
      variants[variantId] = apply(getVariantEntry(entry, variantId));
      setEntry(id, { variants });
    }
    render();
  } else if (action === "favorite") {
    setEntry(id, { favorite: !getEntry(id).favorite });
    render();
  }
});

searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value.trim();
  render();
});

filterTabs.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-tab");
  if (!btn) return;

  const clicked = btn.dataset.rarity;
  // Clicar no filtro já ativo desfaz o filtro (volta para "Todos").
  activeFilter = clicked !== "all" && clicked === activeFilter ? "all" : clicked;
  [...filterTabs.children].forEach((el) =>
    el.classList.toggle("active", el.dataset.rarity === activeFilter)
  );
  render();
});

document.getElementById("refresh-btn").addEventListener("click", () => {
  window.location.reload();
});

document.getElementById("sort-select").addEventListener("change", (e) => {
  sortMode = e.target.value;
  storage.set(SORT_KEY, sortMode);
  render();
});

langSwitch.addEventListener("click", (e) => {
  const btn = e.target.closest(".lang-btn");
  if (!btn || btn.dataset.lang === lang) return;

  lang = btn.dataset.lang;
  storage.set(LANG_KEY, lang);
  applyLanguage();
  render();
});

applyLanguage();
render();
