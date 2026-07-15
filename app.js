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
    backToTop: "Voltar ao topo",
    navExpand: "Mostrar todos os Elementais",
    navCollapse: "Recolher o menu",
    exportLabel: "Exportar resumo",
    exportTitle: "Abre uma imagem com o resumo da sua coleção",
    exportFile: "sprites-resumo",
    exportDownload: "Baixar",
    exportCopy: "Copiar",
    exportCopied: "Copiado! ✓",
    exportTotal: (total) => `${total} itens (Base + variantes)`,
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
    backToTop: "Back to top",
    navExpand: "Show all Elementals",
    navCollapse: "Collapse the menu",
    exportLabel: "Export summary",
    exportTitle: "Opens an image summarizing your collection",
    exportFile: "sprites-summary",
    exportDownload: "Download",
    exportCopy: "Copy",
    exportCopied: "Copied! ✓",
    exportTotal: (total) => `${total} items (Base + variants)`,
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
let sortMode = ["default", "rarity", "alpha"].includes(storage.get(SORT_KEY))
  ? storage.get(SORT_KEY)
  : "default";

const grid = document.getElementById("elemental-grid");
const emptyState = document.getElementById("empty-state");
const progressBarOwned = document.getElementById("progress-bar-owned");
const progressBarMastered = document.getElementById("progress-bar-mastered");
const progressLabelOwned = document.getElementById("progress-label-owned");
const progressLabelMastered = document.getElementById("progress-label-mastered");
const filterTabs = document.getElementById("filter-tabs");
const langSwitch = document.getElementById("lang-switch");
const spriteNav = document.getElementById("sprite-nav");
const spriteNavIcons = document.getElementById("sprite-nav-icons");
const spriteNavToggle = document.getElementById("sprite-nav-toggle");
const backToTop = document.getElementById("back-to-top");

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

// Filtros de coleção valem por quadradinho (Base e cada variante), não só
// pelo Sprite: retorna o teste a aplicar em cada um, ou null quando o filtro
// ativo não é de coleção (todos os quadradinhos aparecem).
function tileFilter() {
  if (activeFilter === "owned") return (state) => state.owned;
  if (activeFilter === "not-owned") return (state) => !state.owned;
  if (activeFilter === "mastered") return (state) => state.mastered;
  if (activeFilter === "not-mastered") return (state) => !state.mastered;
  return null;
}

function matchesFilter(elemental) {
  if (activeFilter === "all") return true;
  if (activeFilter === "favorites") return getEntry(elemental.id).favorite;

  // O card aparece se qualquer quadradinho dele passa no filtro de coleção.
  const byTile = tileFilter();
  if (byTile) {
    const entry = getEntry(elemental.id);
    return (
      byTile(entry) ||
      elemental.variants.some((v) => byTile(getVariantEntry(entry, v.id)))
    );
  }

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

function applyLanguage() {
  const s = t();
  document.documentElement.lang = s.htmlLang;
  document.title = s.docTitle;
  document.getElementById("app-title").textContent = s.title;
  document.getElementById("app-subtitle").textContent = s.subtitle;
  document.getElementById("app-footer").innerHTML = s.footer;
  emptyState.textContent = s.empty;
  backToTop.title = s.backToTop;
  backToTop.setAttribute("aria-label", s.backToTop);

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

  const exportBtn = document.getElementById("export-btn");
  exportBtn.title = s.exportTitle;
  document.getElementById("export-label").textContent = s.exportLabel;
  document.getElementById("export-download").textContent = s.exportDownload;
  document.getElementById("export-copy").textContent = s.exportCopy;
  document.getElementById("export-close").textContent = s.close;

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
  renderNavToggle();
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
  spriteNavIcons.innerHTML = ELEMENTALS.map(
    (e) => `
    <button class="nav-icon${e.upcoming ? " upcoming" : ""}" type="button"
            data-nav="${e.id}" title="${e.name[lang]}" aria-label="${e.name[lang]}"
            style="--rarity-color:${RARITY_COLORS[e.rarity]}">
      <img src="${e.image}" alt="" width="32" height="32" loading="lazy"
           onerror="navIconFallback(this, '${e.id}')" />
    </button>`
  ).join("");
}

// Recolhido: uma linha rolável. Expandido: várias linhas com todos os ícones.
const NAV_OPEN_KEY = "fortnite-elementals-nav-open";
let navExpanded = storage.get(NAV_OPEN_KEY) !== "0";

function renderNavToggle() {
  const s = t();
  spriteNav.classList.toggle("expanded", navExpanded);
  spriteNavToggle.textContent = navExpanded ? "▴" : "▾";
  const label = navExpanded ? s.navCollapse : s.navExpand;
  spriteNavToggle.title = label;
  spriteNavToggle.setAttribute("aria-label", label);
  spriteNavToggle.setAttribute("aria-expanded", navExpanded ? "true" : "false");
}

function setNavExpanded(value) {
  navExpanded = value;
  storage.set(NAV_OPEN_KEY, value ? "1" : "0");
  renderNavToggle();
}

spriteNavToggle.addEventListener("click", () => {
  setNavExpanded(!navExpanded);
});

spriteNav.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-nav]");
  if (!btn) return;

  const id = btn.dataset.nav;
  let card = document.getElementById(`card-${id}`);
  if (!card) {
    // O card está oculto pelo filtro atual — limpa o filtro para navegar.
    activeFilter = "all";
    [...filterTabs.children].forEach((el) =>
      el.classList.toggle("active", el.dataset.rarity === "all")
    );
    render();
    card = document.getElementById(`card-${id}`);
  }
  if (!card) return;

  // Recolhe o menu antes de rolar, para o card não parar escondido
  // atrás da barra expandida.
  if (navExpanded) setNavExpanded(false);

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
  // Com um filtro de coleção ativo, só os quadradinhos que passam no
  // filtro aparecem (ex.: "Não tenho" lista apenas o que falta).
  const byTile = tileFilter();

  const baseTile =
    !byTile || byTile(entry)
      ? spriteTile(elemental, s, {
          variantId: "base",
          name: s.baseVariant,
          image: elemental.image,
          title: `${elemental.name[lang]} — ${s.baseVariant}`,
          state: entry,
        })
      : "";

  const variantTiles = elemental.variants
    .filter((v) => !byTile || byTile(getVariantEntry(entry, v.id)))
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
  const visible = sortElementals(ELEMENTALS.filter((e) => matchesFilter(e)));

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

// ---- Exportar resumo da coleção como PNG ----
// Desenha tudo em canvas com formas e texto (sem imagens externas: as da
// wiki são cross-origin e "sujariam" o canvas, impedindo o toBlob).
// Cores fixas do tema escuro, iguais às de styles.css.
const EXPORT_COLORS = {
  bg: "#0f1115",
  surface: "#1a1d24",
  border: "#2b2f38",
  text: "#f2f3f5",
  muted: "#9aa1ac",
  star: "#f2a33d",
  rarity: {
    Rare: "#5b9bd5",
    Epic: "#b16fe0",
    Legendary: "#f2a33d",
    Mythic: "#ef5b7c",
  },
};

// Ajusta o texto ao espaço SEM usar o maxWidth do fillText: no WebKit/Safari
// textos maiores que o maxWidth podem simplesmente não ser desenhados
// (quadrinhos "vazios" no resumo). Mede de verdade: diminui a fonte até
// caber e, em último caso, corta com reticências. Deixa ctx.font ajustada.
function fitText(ctx, text, maxWidth, size, weight, font) {
  for (let s = size; s >= 8; s--) {
    ctx.font = `${weight} ${s}px ${font}`;
    if (ctx.measureText(text).width <= maxWidth) return text;
  }
  let cut = text;
  while (cut.length > 1 && ctx.measureText(`${cut}…`).width > maxWidth) {
    cut = cut.slice(0, -1);
  }
  return `${cut}…`;
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
}

// Carrega uma imagem da wiki com CORS liberado para poder desenhá-la no
// canvas sem "sujá-lo". O ?cors=1 evita colidir com as respostas opacas já
// guardadas pelo service worker. Resolve null se falhar ou demorar demais —
// nesse caso a linha usa a bolinha colorida com a inicial.
function loadCorsImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    let settled = false;
    const done = (ok) => {
      if (!settled) {
        settled = true;
        resolve(ok ? img : null);
      }
    };
    img.onload = () => done(true);
    img.onerror = () => done(false);
    setTimeout(() => done(false), 5000);
    img.src = `${url}${url.includes("?") ? "&" : "?"}cors=1`;
  });
}

async function exportSummary() {
  const s = t();
  const c = EXPORT_COLORS;
  const list = ELEMENTALS.filter((e) => !e.upcoming);

  // Ícones oficiais dos Sprites (os que falharem viram bolinha + inicial).
  const icons = await Promise.all(list.map((e) => loadCorsImage(e.image)));

  const W = 840;
  const HEADER = 196;
  const ROW = 46;
  const FOOTER = 44;
  const H = HEADER + list.length * ROW + FOOTER;

  const canvas = document.createElement("canvas");
  const scale = 2; // nitidez em telas retina e no zoom
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  const FONT = '-apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = c.bg;
  ctx.fillRect(0, 0, W, H);

  // Totais: tenho / não tenho e dominados / não dominados (de um total
  // que conta o Base e cada variante de todos os Elementais lançados).
  let owned = 0;
  let mastered = 0;
  let total = 0;
  list.forEach((e) => {
    const entry = getEntry(e.id);
    const states = [entry, ...e.variants.map((v) => getVariantEntry(entry, v.id))];
    total += states.length;
    states.forEach((st) => {
      if (st.owned) owned += 1;
      if (st.mastered) mastered += 1;
    });
  });

  ctx.fillStyle = c.text;
  ctx.font = `700 24px ${FONT}`;
  ctx.textBaseline = "middle";
  ctx.fillText(s.title, 24, 34);

  const date = new Date().toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US");
  ctx.font = `400 14px ${FONT}`;
  ctx.fillStyle = c.muted;
  ctx.fillText(`${date} — ${s.exportTotal(total)}`, 24, 62);

  // Números grandes, um bloco por total.
  const stats = [
    { value: owned, label: `✓ ${s.tabOwned}`, color: "#7dd3fc" },
    { value: total - owned, label: s.tabNotOwned, color: c.muted },
    { value: mastered, label: `★ ${s.tabMastered}`, color: c.star },
    { value: total - mastered, label: s.tabNotMastered, color: c.muted },
  ];
  stats.forEach((stat, i) => {
    const x = 24 + i * 200;
    ctx.fillStyle = stat.color;
    ctx.font = `700 42px ${FONT}`;
    ctx.fillText(String(stat.value), x, 116);
    ctx.fillStyle = c.muted;
    ctx.font = `600 13px ${FONT}`;
    ctx.fillText(stat.label, x, 150);
  });

  ctx.strokeStyle = c.border;
  ctx.beginPath();
  ctx.moveTo(24, HEADER - 14);
  ctx.lineTo(W - 24, HEADER - 14);
  ctx.stroke();

  // Uma linha por Elemental: bolinha na cor da raridade com a inicial,
  // nome e um chip por quadradinho (Base + variantes).
  const NAME_X = 62;
  const CHIPS_X = 218;
  const CHIP_W = 72;
  const CHIP_H = 26;
  const CHIP_GAP = 4;

  list.forEach((e, i) => {
    const y = HEADER + i * ROW + ROW / 2;
    const entry = getEntry(e.id);
    const color = c.rarity[e.rarity];

    if (icons[i]) {
      ctx.drawImage(icons[i], 21, y - 17, 34, 34);
    } else {
      ctx.beginPath();
      ctx.arc(38, y, 13, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.fillStyle = c.bg;
      ctx.font = `700 13px ${FONT}`;
      ctx.textAlign = "center";
      ctx.fillText(e.name[lang][0].toUpperCase(), 38, y + 1);
      ctx.textAlign = "left";
    }

    ctx.fillStyle = c.text;
    const name = fitText(ctx, e.name[lang], CHIPS_X - NAME_X - 12, 15, 700, FONT);
    ctx.fillText(name, NAME_X, y);

    const items = [
      { label: s.baseVariant, state: entry },
      ...e.variants.map((v) => ({
        label: v.name[lang],
        state: getVariantEntry(entry, v.id),
      })),
    ];

    items.forEach((item, j) => {
      const x = CHIPS_X + j * (CHIP_W + CHIP_GAP);
      roundedRect(ctx, x, y - CHIP_H / 2, CHIP_W, CHIP_H, 7);
      if (item.state.owned) {
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = c.bg;
      } else {
        ctx.fillStyle = c.surface;
        ctx.fill();
        ctx.strokeStyle = c.border;
        ctx.stroke();
        ctx.fillStyle = c.muted;
      }
      const mark = item.state.mastered ? "★ " : item.state.owned ? "✓ " : "";
      const label = fitText(ctx, `${mark}${item.label}`, CHIP_W - 14, 11, 600, FONT);
      ctx.fillText(label, x + 8, y + 1);
    });
  });

  // Rodapé.
  ctx.fillStyle = c.muted;
  ctx.font = `400 12px ${FONT}`;
  ctx.fillText("fortnite-elementais — GitHub Pages", 24, H - FOOTER / 2);

  // Mostra a imagem num visualizador com opção de baixar,
  // em vez de disparar o download direto.
  canvas.toBlob((blob) => {
    if (!blob) return;
    exportBlob = blob;
    exportCopyBtn.textContent = s.exportCopy;
    exportUrl = URL.createObjectURL(blob);
    exportImg.src = exportUrl;
    exportDownloadLink.href = exportUrl;
    exportDownloadLink.download = `${s.exportFile}-${new Date()
      .toISOString()
      .slice(0, 10)}.png`;
    exportOverlay.hidden = false;
  }, "image/png");
}

const exportOverlay = document.getElementById("export-overlay");
const exportImg = document.getElementById("export-img");
const exportDownloadLink = document.getElementById("export-download");
const exportCopyBtn = document.getElementById("export-copy");
let exportUrl = null;
let exportBlob = null;

// Copiar imagem só existe onde o navegador suporta imagem no clipboard
// (Chrome/Edge/Safari; Firefox ainda não).
exportCopyBtn.hidden = !(navigator.clipboard && window.ClipboardItem);

exportCopyBtn.addEventListener("click", async () => {
  if (!exportBlob) return;
  try {
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": exportBlob }),
    ]);
    exportCopyBtn.textContent = t().exportCopied;
    setTimeout(() => {
      exportCopyBtn.textContent = t().exportCopy;
    }, 2000);
  } catch {
    /* usuário negou permissão ou o clipboard falhou — mantém o botão */
  }
});

function closeExportOverlay() {
  exportOverlay.hidden = true;
  exportImg.removeAttribute("src");
  if (exportUrl) {
    URL.revokeObjectURL(exportUrl);
    exportUrl = null;
  }
}

document.getElementById("export-close").addEventListener("click", closeExportOverlay);
exportOverlay.addEventListener("click", (e) => {
  // Clique no fundo escuro (fora da caixa) também fecha.
  if (e.target === exportOverlay) closeExportOverlay();
});

document.getElementById("export-btn").addEventListener("click", () => {
  exportSummary();
});

// Botão flutuante de voltar ao topo: aparece depois de rolar um pouco.
window.addEventListener(
  "scroll",
  () => {
    backToTop.hidden = window.scrollY < 400;
  },
  { passive: true }
);

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
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
