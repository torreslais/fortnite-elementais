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
    progress: (owned, total) => `${owned} / ${total} Elementais coletados`,
    owned: "Eu possuo",
    favorite: "Favoritar",
    variant: "(variante)",
    empty: "Nenhum Elemental encontrado.",
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
    progress: (owned, total) => `${owned} / ${total} Elementals collected`,
    owned: "I own it",
    favorite: "Favorite",
    variant: "(variant)",
    empty: "No Elementals found.",
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
  return collection[id] || { owned: false, favorite: false };
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
  return elemental.name.toLowerCase().includes(searchTerm.toLowerCase());
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
}

function renderProgress() {
  const total = ELEMENTALS.length;
  const owned = ELEMENTALS.filter((e) => getEntry(e.id).owned).length;
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

function createCard(elemental) {
  const s = t();
  const entry = getEntry(elemental.id);
  const card = document.createElement("article");
  card.className = "elemental-card" + (entry.owned ? " owned" : "");
  card.style.setProperty("--rarity-color", RARITY_COLORS[elemental.rarity]);

  const imgUrl = elemental.image || WIKI_FILE(`${elemental.name} Sprite`);

  card.innerHTML = `
    <div class="card-head">
      <div class="elemental-icon">
        <img src="${imgUrl}" alt="${elemental.name}" loading="lazy"
             onerror="iconFallback(this, '${elemental.id}')" />
      </div>
      <div class="card-title">
        <h3 class="elemental-name">${elemental.name}</h3>
        <span class="rarity-badge">${s.rarities[elemental.rarity]}</span>
      </div>
    </div>
    <p class="elemental-ability">${elemental.ability[lang]}</p>
    <div class="elemental-costs">
      <span>💠 ${elemental.dust} Dust</span>
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
