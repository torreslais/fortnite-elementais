// Ícones SVG originais (estilo "espírito") para cada Elemental.
// São arte própria do projeto, não os sprites oficiais da Epic — para usar
// imagens oficiais, substitua o SVG retornado aqui por uma tag <img>.
const ELEMENTAL_ICONS = (() => {
  const eyes = (color = "#1c2230") =>
    `<circle cx="26.5" cy="34" r="2.4" fill="${color}"/>` +
    `<circle cx="37.5" cy="34" r="2.4" fill="${color}"/>`;

  const body = (fill, opacity = 1) =>
    `<ellipse cx="32" cy="36" rx="15" ry="16" fill="${fill}" opacity="${opacity}"/>` +
    `<path d="M32 51l-4 7 4-2.5 4 2.5z" fill="${fill}" opacity="${opacity}"/>`;

  const wrap = (bg, inner) =>
    `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">` +
    `<circle cx="32" cy="32" r="30" fill="${bg}" opacity="0.18"/>${inner}</svg>`;

  const sparkle = (x, y, s, fill) =>
    `<path d="M${x} ${y - s}l${s * 0.3} ${s * 0.7} ${s * 0.7} ${s * 0.3} ` +
    `-${s * 0.7} ${s * 0.3} -${s * 0.3} ${s * 0.7} -${s * 0.3} -${s * 0.7} ` +
    `-${s * 0.7} -${s * 0.3} ${s * 0.7} -${s * 0.3}z" fill="${fill}"/>`;

  return {
    water: wrap(
      "#29B6F6",
      body("#4FC3F7") +
        `<path d="M32 4c2.8 4 5.5 6.8 5.5 10a5.5 5.5 0 0 1-11 0c0-3.2 2.7-6 5.5-10z" fill="#0288D1"/>` +
        eyes()
    ),
    earth: wrap(
      "#8D6E63",
      body("#A1887F") +
        `<path d="M34 18c-7.5 1-11.5-4-9.5-11.5 7.5-1 11.5 4 9.5 11.5z" fill="#66BB6A"/>` +
        `<path d="M31 19c1.5-3 4-6 7-8" stroke="#33691E" stroke-width="1.4" fill="none" stroke-linecap="round"/>` +
        eyes()
    ),
    fire: wrap(
      "#FF7043",
      body("#FFA726") +
        `<path d="M32 2c3.5 4.5 6.5 7.5 6.5 11.5a6.5 6.5 0 0 1-13 0c0-2.4 1.2-4.4 2.9-6.3-.1 1.8.7 3 1.9 3.4-.9-2.8-.2-5.7 1.7-8.6z" fill="#FF5722"/>` +
        `<path d="M32 9c1.6 2.2 3 3.7 3 5.6a3 3 0 0 1-6 0c0-1.9 1.4-3.4 3-5.6z" fill="#FFD54F"/>` +
        eyes()
    ),
    fishy: wrap(
      "#26C6DA",
      body("#4DD0E1") +
        `<path d="M27 21l5-9 5 9z" fill="#00ACC1"/>` +
        `<circle cx="49" cy="12" r="3" fill="#81D4FA"/>` +
        `<circle cx="54" cy="19" r="2" fill="#81D4FA"/>` +
        `<circle cx="50" cy="25" r="1.5" fill="#81D4FA"/>` +
        eyes()
    ),
    duck: wrap(
      "#FDD835",
      body("#FFEE58") +
        `<path d="M25 39h14c-.5 3.5-3.5 5.5-7 5.5s-6.5-2-7-5.5z" fill="#FB8C00"/>` +
        `<path d="M32 15c0-4.5 4.5-6.5 7-4.5" stroke="#F9A825" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
        eyes()
    ),
    ghost: wrap(
      "#B0BEC5",
      body("#ECEFF1", 0.85) +
        `<circle cx="32" cy="42" r="2.6" fill="#455A64"/>` +
        eyes("#455A64")
    ),
    demon: wrap(
      "#EF5350",
      body("#EF5350") +
        `<path d="M22 19c-3.5-2-5.5-6.5-4.5-12 4.5 2.2 6.8 5.6 6.5 10z" fill="#B71C1C"/>` +
        `<path d="M42 19c3.5-2 5.5-6.5 4.5-12-4.5 2.2-6.8 5.6-6.5 10z" fill="#B71C1C"/>` +
        `<path d="M23 29l6 2.4M41 29l-6 2.4" stroke="#7f1010" stroke-width="1.8" stroke-linecap="round"/>` +
        eyes("#3b0a0a")
    ),
    king: wrap(
      "#AB47BC",
      body("#BA68C8") +
        `<path d="M22 20v-8.5l5 4 5-7.5 5 7.5 5-4V20z" fill="#FFD54F" stroke="#F9A825" stroke-width="1"/>` +
        eyes()
    ),
    aura: wrap(
      "#4DD0E1",
      body("#80DEEA") +
        sparkle(12, 22, 5, "#FFF176") +
        sparkle(52, 14, 4, "#FFF176") +
        sparkle(53, 40, 3.2, "#FFEE58") +
        eyes()
    ),
    striker: wrap(
      "#7E57C2",
      body("#9575CD") +
        `<path d="M50 4l-9 13h5.5L42 28l12-13.5h-6.5L52 4z" fill="#FFEE58" stroke="#F9A825" stroke-width="0.8"/>` +
        eyes()
    ),
    dream: wrap(
      "#9575CD",
      body("#B39DDB") +
        `<path d="M46 6a8.5 8.5 0 1 0 8.5 11.5A7 7 0 0 1 46 6z" fill="#FFF176"/>` +
        `<circle cx="12" cy="16" r="1.6" fill="#FFF176"/>` +
        `<circle cx="17" cy="9" r="1.1" fill="#FFF176"/>` +
        eyes()
    ),
    punk: wrap(
      "#26A69A",
      body("#4DB6AC") +
        `<path d="M24.5 20l1.5-9.5 3 7.5 3-11 3 11 3-7.5 1.5 9.5z" fill="#E91E63"/>` +
        eyes()
    ),
    boss: wrap(
      "#EC407A",
      body("#F06292") +
        `<path d="M32 33l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z" fill="#FFD54F" stroke="#F9A825" stroke-width="0.8"/>` +
        eyes()
    ),
    "zero-point": wrap(
      "#40C4FF",
      body("#5C6BC0") +
        `<path d="M32 2l7 9-7 9-7-9z" fill="#40C4FF"/>` +
        `<path d="M32 6l4 5-4 5-4-5z" fill="#E1F5FE"/>` +
        eyes()
    ),
    "burnt-peanut": wrap(
      "#8D6E63",
      body("#8D6E63") +
        `<ellipse cx="26" cy="42" rx="3" ry="2.2" fill="#4E342E"/>` +
        `<ellipse cx="39" cy="45" rx="2.4" ry="1.8" fill="#4E342E"/>` +
        `<path d="M35 14c0-3.5 3-4 3-7" stroke="#78909C" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
        `<path d="M29 15c0-3 2.4-3.4 2.4-6" stroke="#78909C" stroke-width="1.3" fill="none" stroke-linecap="round"/>` +
        eyes("#2b1a12")
    ),
    "grim-reaper": wrap(
      "#546E7A",
      body("#B0BEC5") +
        `<path d="M15 37c0-13 7.6-22 17-22s17 9 17 22c-3.5-5.5-9-8.5-17-8.5S18.5 31.5 15 37z" fill="#37474F"/>` +
        `<path d="M51 12v28" stroke="#6D4C41" stroke-width="2" stroke-linecap="round"/>` +
        `<path d="M51 11c-7.5-5-15.5-3-18.5 2 6.5-1 13.5 1 18.5 4z" fill="#90A4AE"/>` +
        eyes("#263238")
    ),
  };
})();
