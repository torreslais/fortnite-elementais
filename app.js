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
    tabOwned: "Meus ★",
    progress: (owned, total) => `${owned} / ${total} coletados (Sprites e variantes)`,
    owned: "Eu possuo",
    favorite: "Favoritar",
    variant: "(variante)",
    dust: "Pó de Elemental",
    variantsLabel: "Variantes",
    noVariants: "Sem variantes",
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
    tabOwned: "Mine ★",
    progress: (owned, total) => `${owned} / ${total} collected (Sprites and variants)`,
    owned: "I own it",
    favorite: "Favorite",
    variant: "(variant)",
    dust: "Sprite Dust",
    variantsLabel: "Variants",
    noVariants: "No variants",
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
  const entry = collection[id] || { owned: false, favorite: false };
  if (!entry.variants) entry.variants = {};
  return entry;
}

function setEntry(id, patch) {
  collection[id] = { ...getEntry(id), ...patch };
  saveCollection(collection);
}

function matchesFilter(elemental) {
  if (activeFilter === "all") return true;
  if (activeFilter === "owned") return getEntry(elemental.id).owned;
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
    else tab.textContent = s.rarities[key];
  });

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
  ELEMENTALS.forEach((e) => {
    const entry = getEntry(e.id);
    total += 1 + e.variants.length;
    if (entry.owned) owned += 1;
    owned += e.variants.filter((v) => entry.variants[v.id]).length;
  });
  const pct = total === 0 ? 0 : Math.round((owned / total) * 100);
  progressFill.style.width = `${pct}%`;
  progressLabel.textContent = t().progress(owned, total);
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

function variantChips(elemental, entry, s) {
  if (!elemental.variants.length) {
    return `<div class="variants"><span class="variants-label">${s.noVariants}</span></div>`;
  }

  const chips = elemental.variants
    .map((v) => {
      const ownedVariant = Boolean(entry.variants[v.id]);
      return `
        <button type="button"
                class="variant-chip${ownedVariant ? " owned" : ""}"
                data-action="variant" data-id="${elemental.id}" data-variant="${v.id}"
                title="${v.name[lang]} — ${v.effect[lang]}"
                aria-pressed="${ownedVariant}">
          <img src="${v.image}" alt="" loading="lazy"
               onerror="variantImgFallback(this)" />
          <span>${v.name[lang]}</span>
        </button>`;
    })
    .join("");

  return `
    <div class="variants">
      <span class="variants-label">${s.variantsLabel}</span>
      <div class="variant-chips">${chips}</div>
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
        <img src="${elemental.image}" alt="${elemental.name[lang]}" loading="lazy"
             onerror="iconFallback(this, '${elemental.id}')" />
      </div>
      <div class="card-title">
        <h3 class="elemental-name">${elemental.name[lang]}</h3>
        <span class="rarity-badge">${s.rarities[elemental.rarity]}</span>
      </div>
    </div>
    <p class="elemental-ability">${elemental.ability[lang]}</p>
    ${variantChips(elemental, entry, s)}
    <div class="elemental-costs">
      <span>💠 ${elemental.dust} ${s.dust}</span>
      <span>🪙 ${elemental.variantCost} ${s.variant}</span>
    </div>
    <div class="card-actions">
      <label class="owned-toggle">
        <input type="checkbox" ${entry.owned ? "checked" : ""} data-action="owned" data-id="${elemental.id}" />
        ${s.owned}
      </label>
      <button class="favorite-btn ${entry.favorite ? "active" : ""}" data-action="favorite" data-id="${elemental.id}" title="${s.favorite}">
        ${entry.favorite ? "★" : "☆"}
      </button>
    </div>
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

  if (action === "owned") {
    setEntry(id, { owned: target.checked });
    render();
  } else if (action === "favorite") {
    setEntry(id, { favorite: !getEntry(id).favorite });
    render();
  } else if (action === "variant") {
    const variantId = target.dataset.variant;
    const variants = { ...getEntry(id).variants };
    variants[variantId] = !variants[variantId];
    setEntry(id, { variants });
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
