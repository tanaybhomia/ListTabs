const defaultLinks = [
  { title: "Google", url: "https://google.com" },
  { title: "YouTube", url: "https://youtube.com" },
  { title: "GitHub", url: "https://github.com" },
  { title: "Reddit", url: "https://reddit.com" },
];

let links = JSON.parse(localStorage.getItem("myLinks")) || defaultLinks;

const grid = document.getElementById("link-grid");
const modal = document.getElementById("add-modal");
const greetingEl = document.getElementById("greeting");
const searchOverlay = document.getElementById("search-overlay");
const searchInput = document.getElementById("search-input");

function updateGreeting() {
  const hour = new Date().getHours();
  let text = "Hello";
  if (hour >= 5 && hour < 12) text = "Good Morning";
  else if (hour >= 12 && hour < 18) text = "Good Afternoon";
  else text = "Good Evening";
  greetingEl.textContent = text;
}

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

  const isDirectURL = query.includes(".") && !query.includes(" ");
  if (query.startsWith("http") || isDirectURL) {
    window.location.href = query.startsWith("http")
      ? query
      : "https://" + query;
  } else {
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  // 1. Existing Input Logic
  if (e.target.tagName === "INPUT") {
    if (e.key === "Enter") performSearch();
    if (e.key === "Escape") {
      searchOverlay.classList.remove("active");
      document.body.classList.remove("search-active");
      searchInput.value = "";
    }
    return;
  }

  // 2. Numbers 1-9
  const keyNum = parseInt(e.key);
  if (!isNaN(keyNum) && keyNum > 0 && keyNum <= 9) {
    if (links[keyNum - 1]) window.location.href = links[keyNum - 1].url;
    return;
  }

  // 3. Smart Search Capture (Fixes "lost first letter")
  if (e.key.length === 1 && e.key !== " ") {
    // Prevent default so the letter isn't double-typed or lost
    e.preventDefault();

    searchOverlay.classList.add("active");
    document.body.classList.add("search-active");

    // Manually inject the first key pressed
    searchInput.value = e.key;

    // Focus and move cursor to the end
    setTimeout(() => {
      searchInput.focus();
      searchInput.setSelectionRange(1, 1);
    }, 0);
  }
});

// Modal Logic
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

updateGreeting();
render();
