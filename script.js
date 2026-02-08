const defaultLinks = [
  { title: "Google", url: "https://google.com" },
  { title: "YouTube", url: "https://youtube.com" },
  { title: "GitHub", url: "https://github.com" },
];

const defaultBangs = {
  "!y": "https://www.youtube.com/results?search_query=",
  "!gh": "https://github.com/search?q=",
  "!w": "https://en.wikipedia.org/wiki/Special:Search?search=",
};

let links = JSON.parse(localStorage.getItem("myLinks")) || defaultLinks;
let customBangs = JSON.parse(localStorage.getItem("myBangs")) || {};

const grid = document.getElementById("link-grid");
const modal = document.getElementById("add-modal");
const searchOverlay = document.getElementById("search-overlay");
const searchInput = document.getElementById("search-input");

function render() {
  grid.innerHTML = "";
  links.forEach((link, index) => {
    const isHotkey = index < 9;
    const a = document.createElement("a");
    a.className = "link-item";
    a.href = link.url;

    const circle = document.createElement("div");
    circle.className = "circle-number";
    circle.textContent = isHotkey ? index + 1 : "";
    if (!isHotkey) circle.style.opacity = "0";

    const span = document.createElement("span");
    span.className = "link-text";
    span.textContent = link.title;

    a.append(circle, span);
    grid.appendChild(a);
  });
}

function performSearch() {
  const query = searchInput.value.trim();
  if (!query) return;
  const parts = query.split(" ");
  const firstWord = parts[0].toLowerCase();
  const searchTerm = parts.slice(1).join(" ");
  const allBangs = { ...defaultBangs, ...customBangs };

  if (allBangs[firstWord]) {
    window.location.href = searchTerm
      ? allBangs[firstWord] + encodeURIComponent(searchTerm)
      : new URL(allBangs[firstWord]).origin;
    return;
  }
  const isURL = query.includes(".") && !query.includes(" ");
  if (query.startsWith("http") || isURL) {
    window.location.href = query.startsWith("http")
      ? query
      : "https://" + query;
  } else {
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target.tagName === "INPUT") {
    if (e.key === "Enter") performSearch();
    if (e.key === "Escape") {
      searchOverlay.classList.remove("active");
      document.body.classList.remove("search-active");
      modal.classList.remove("active");
    }
    return;
  }
  const keyNum = parseInt(e.key);
  if (!isNaN(keyNum) && keyNum > 0 && keyNum <= 9) {
    if (links[keyNum - 1]) window.location.href = links[keyNum - 1].url;
    return;
  }
  if (e.key.length === 1 && e.key !== " ") {
    e.preventDefault();
    searchOverlay.classList.add("active");
    document.body.classList.add("search-active");
    searchInput.value = e.key;
    setTimeout(() => {
      searchInput.focus();
      searchInput.setSelectionRange(1, 1);
    }, 10);
  }
});

document.getElementById("add-btn").onclick = () =>
  modal.classList.add("active");
document.getElementById("cancel-btn").onclick = () =>
  modal.classList.remove("active");
document.getElementById("save-btn").onclick = () => {
  const t = document.getElementById("input-title").value;
  let u = document.getElementById("input-url").value;
  if (t && u) {
    if (!u.startsWith("http")) u = "https://" + u;
    links.push({ title: t, url: u });
    localStorage.setItem("myLinks", JSON.stringify(links));
    render();
    modal.classList.remove("active");
  }
};
document.getElementById("save-bang-btn").onclick = () => {
  const k = document.getElementById("bang-key").value.trim();
  const u = document.getElementById("bang-url").value.trim();
  if (k.startsWith("!") && u) {
    customBangs[k] = u;
    localStorage.setItem("myBangs", JSON.stringify(customBangs));
    modal.classList.remove("active");
  }
};

const hour = new Date().getHours();
document.getElementById("greeting").textContent =
  hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";
render();
