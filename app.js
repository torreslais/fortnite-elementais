const STORAGE_KEY = "fortnite-sprites-collection-v1";
const LANG_KEY = "fortnite-elementals-lang";

const RARITY_COLORS = {
  Rare: "var(--rare)",
  Epic: "var(--epic)",
  Legendary: "var(--legendary)",
  Mythic: "var(--mythic)",
};

const TRANSLATIONS = {
  pt: {
    htmlLang: "pt-BR",
    docTitle: "Fortnite — Painel de Elementais",
    title: "Painel de Elementais",
    subtitle: "Acompanhe quais Elementais do Fortnite Battle Royale você já possui",
    searchPlaceholder: "Buscar Elemental pelo nome...",
    tabAll: "Todos",
    tabOwned: "Tenho",
    tabMastered: "Dominados",
    progress: (owned, total, mastered) =>
      `${owned} / ${total} coletados · ${mastered} dominados`,
    owned: "Tenho",
    mastered: "Dominado",
    favorite: "Favoritar",
    refresh: "Atualizar",
    variant: "(variante)",
    dust: "Pó de Elemental",
    collectionLabel: "Coleção",
    baseVariant: "Base",
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
    docTitle: "Fortnite — Elementals Dashboard",
    title: "Elementals Dashboard",
    subtitle: "Track which Fortnite Battle Royale Elementals you already own",
    searchPlaceholder: "Search Elementals by name...",
    tabAll: "All",
    tabOwned: "Owned",
    tabMastered: "Mastered",
    progress: (owned, total, mastered) =>
      `${owned} / ${total} collected · ${mastered} mastered`,
    owned: "Owned",
    mastered: "Mastered",
    favorite: "Favorite",
    refresh: "Refresh",
    variant: "(variant)",
    dust: "Sprite Dust",
    collectionLabel: "Collection",
    baseVariant: "Base",
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

const grid = document.getElementById("elemental-grid");
const emptyState = document.getElementById("empty-state");
const progressFill = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");
const searchInput = document.getElementById("search-input");
const filterTabs = document.getElementById("filter-tabs");
const langSwitch = document.getElementById("lang-switch");

function t() {
  return TRANSLATIONS[lang];
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
  if (activeFilter === "mastered") return hasAny(elemental, "mastered");
  return elemental.rarity === activeFilter;
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
    else if (key === "mastered") tab.textContent = s.tabMastered;
    else tab.textContent = s.rarities[key];
  });

  const refreshBtn = document.getElementById("refresh-btn");
  refreshBtn.title = s.refresh;
  refreshBtn.setAttribute("aria-label", s.refresh);

  [...langSwitch.children].forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.lang === lang)
  );

  renderInstallBox();
}

// ---- Instalação como aplicativo (PWA) ----
const installBox = document.getElementById("install-box");
const installBtn = document.getElementById("install-btn");
let deferredInstallPrompt = null;

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

const isIos = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

function renderInstallBox() {
  const s = t();
  if (isStandalone()) {
    // Já está rodando como app instalado — sem necessidade de orientação.
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

// Service worker: cache do app e das imagens já vistas, para uso offline.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      /* offline/cache indisponível — o site continua funcionando online */
    });
  });
}

function renderProgress() {
  let total = 0;
  let owned = 0;
  let mastered = 0;
  ELEMENTALS.forEach((e) => {
    const entry = getEntry(e.id);
    total += 1 + e.variants.length;
    if (entry.owned) owned += 1;
    if (entry.mastered) mastered += 1;
    e.variants.forEach((v) => {
      const state = getVariantEntry(entry, v.id);
      if (state.owned) owned += 1;
      if (state.mastered) mastered += 1;
    });
  });
  const pct = total === 0 ? 0 : Math.round((owned / total) * 100);
  progressFill.style.width = `${pct}%`;
  progressLabel.textContent = t().progress(owned, total, mastered);
}

// Fallback: se a imagem da wiki não carregar, mostra o ícone SVG local.
function iconFallback(img, id) {
  const holder = img.closest(".elemental-icon");
  if (holder) holder.innerHTML = ELEMENTAL_ICONS[id] || "";
}
window.iconFallback = iconFallback;

// Fallback das variantes: se a imagem da wiki falhar, o chip fica só com o nome.
function variantImgFallback(img) {
  img.remove();
}
window.variantImgFallback = variantImgFallback;

function spriteTile(elemental, s, { variantId, name, image, title, state }) {
  const checkbox = (action, checked, label) => `
    <label class="tile-check">
      <input type="checkbox" ${checked ? "checked" : ""}
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
      </div>
    </div>
    <p class="elemental-ability">${elemental.ability[lang]}</p>
    ${collectionTiles(elemental, entry, s)}
    <div class="elemental-costs">
      <span>💠 ${elemental.dust} ${s.dust}</span>
      <span>🪙 ${elemental.variantCost} ${s.variant}</span>
    </div>
    <button class="favorite-btn ${entry.favorite ? "active" : ""}" data-action="favorite" data-id="${elemental.id}" title="${s.favorite}">
      ${entry.favorite ? "★" : "☆"}
    </button>
  `;

  return card;
}

function render() {
  const visible = ELEMENTALS.filter((e) => matchesFilter(e) && matchesSearch(e));

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

  activeFilter = btn.dataset.rarity;
  [...filterTabs.children].forEach((el) => el.classList.toggle("active", el === btn));
  render();
});

document.getElementById("refresh-btn").addEventListener("click", () => {
  window.location.reload();
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
