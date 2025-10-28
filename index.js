// Año footer
document.getElementById("year").textContent =
  new Date().getFullYear();

// Mobile menu toggle
const btnMenu = document.getElementById("btnMenu");
const menuMobile = document.getElementById("menuMobile");
btnMenu?.addEventListener("click", () =>
  menuMobile.classList.toggle("hidden")
);

// Tabs servicios
const tabButtons = document.querySelectorAll(".tab-btn");
const panels = {
  acne: document.getElementById("tab-acne"),
  manchas: document.getElementById("tab-manchas"),
  alopecia: document.getElementById("tab-alopecia"),
  botox: document.getElementById("tab-botox"),
  rellenos: document.getElementById("tab-rellenos"),
};
function activateTab(key) {
  Object.entries(panels).forEach(([k, el]) => {
    if (k === key) {
      el.classList.remove("hidden");
    } else {
      el.classList.add("hidden");
    }
  });
  tabButtons.forEach(
    (btn) => (btn.dataset.active = btn.dataset.tab === key)
  );
}
tabButtons.forEach((btn) =>
  btn.addEventListener("click", () => activateTab(btn.dataset.tab))
);
activateTab("acne");

// Before/After sliders - Nuevo comportamiento de superposición
function bindBA(rangeId, topId, handleId) {
  const range = document.getElementById(rangeId);
  const top = document.getElementById(topId);
  const handle = document.getElementById(handleId);
  const setPos = (v) => {
    const pct = Math.max(0, Math.min(100, v));
    // Usar clip-path para crear el efecto de superposición
    top.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = `calc(${pct}% - 1px)`;
  };
  range.addEventListener("input", (e) => setPos(e.target.value));
  setPos(range.value);
}
bindBA("ba1-range", "ba1-top", "ba1-handle");
bindBA("ba2-range", "ba2-top", "ba2-handle");
