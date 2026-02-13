// --- Configuration ---
const defaultLinks = [
  { title: "Google", url: "https://google.com" },
  { title: "YouTube", url: "https://youtube.com" },
  { title: "GitHub", url: "https://github.com" },
];

const defaultBangs = {
  "!yt": "https://www.youtube.com/results?search_query=",
  "!gh": "https://github.com/search?q=",
  "!r": "https://www.reddit.com/search/?q=",
  "!g": "https://www.google.com/search?q=",
  "!d": "https://duckduckgo.com/?q=",
};

// --- State ---
let links = JSON.parse(localStorage.getItem("myLinks")) || defaultLinks;
let customBangs = JSON.parse(localStorage.getItem("myBangs")) || {};
let allBangs = { ...defaultBangs, ...customBangs };

// --- Elements ---
const grid = document.getElementById("link-grid");
const searchOverlay = document.getElementById("search-overlay");
const searchInput = document.getElementById("search-input");
const modal = document.getElementById("add-modal");

// --- Core Functions ---

function render() {
  grid.innerHTML = "";
  links.forEach((link, index) => {
    const item = document.createElement("div");
    item.className = "link-item";

    // FIX 1: Dynamic Animation Delay
    // This ensures item 5, 6, 7... all animate correctly
    item.style.animationDelay = `${0.2 + index * 0.1}s`;

    // Delete Button
    const delBtn = document.createElement("div");
    delBtn.className = "delete-btn";
    delBtn.innerHTML = "×";
    delBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      links.splice(index, 1);
      localStorage.setItem("myLinks", JSON.stringify(links));
      render();
    };

    const linkContent = `
        <div class="circle-number">${index < 9 ? index + 1 : ""}</div>
        <a href="${link.url}" class="link-text">${link.title}</a>
    `;

    item.innerHTML = linkContent;
    item.appendChild(delBtn);
    grid.appendChild(item);
  });
}

function openSettings() {
  modal.classList.add("active");
  document.getElementById("input-title").focus();
}

function closeSettings() {
  modal.classList.remove("active");
}

function activateSearch(key) {
  searchOverlay.classList.add("active");
  searchInput.value = key;
  searchInput.focus();
  setTimeout(() => searchInput.focus(), 1);
}

// --- Event Listeners ---

// 1. Settings Buttons
document.getElementById("add-btn").onclick = openSettings;
document.getElementById("cancel-btn").onclick = closeSettings;

// 2. Save New Link
document.getElementById("save-btn").onclick = () => {
  const t = document.getElementById("input-title").value.trim();
  let u = document.getElementById("input-url").value.trim();
  if (t && u) {
    if (!u.startsWith("http")) u = "https://" + u;
    links.push({ title: t, url: u });
    localStorage.setItem("myLinks", JSON.stringify(links));
    render();
    document.getElementById("input-title").value = "";
    document.getElementById("input-url").value = "";
    closeSettings();
  }
};

// 3. Save Custom Bang
document.getElementById("save-bang-btn").onclick = () => {
  const k = document.getElementById("bang-key").value.trim();
  let u = document.getElementById("bang-url").value.trim();

  if (k && u) {
    const key = k.startsWith("!") ? k : "!" + k;
    if (!u.startsWith("http")) u = "https://" + u;

    customBangs[key] = u;
    localStorage.setItem("myBangs", JSON.stringify(customBangs));
    allBangs = { ...defaultBangs, ...customBangs }; // Update active bangs

    document.getElementById("bang-key").value = "";
    document.getElementById("bang-url").value = "";
    closeSettings();
  }
};

// 4. Global Keydown Logic
document.addEventListener("keydown", (e) => {
  // If Modal is open, only listen for Escape
  if (modal.classList.contains("active")) {
    if (e.key === "Escape") closeSettings();
    return;
  }

  // If Search is active
  if (searchOverlay.classList.contains("active")) {
    if (e.key === "Escape") {
      searchOverlay.classList.remove("active");
      searchInput.value = "";
    }
    if (e.key === "Enter") {
      const val = searchInput.value.trim();
      if (!val) return;

      // FIX 2: Bang Detection Logic
      // Check if the first word matches a known bang
      const parts = val.split(" ");
      const firstWord = parts[0];

      if (allBangs[firstWord]) {
        // It is a bang! (e.g., !yt cats)
        // Get everything AFTER the bang
        const query = val.substring(firstWord.length).trim();
        const url = allBangs[firstWord] + encodeURIComponent(query);
        window.location.href = url;
      } else {
        // Not a bang, regular Google search
        window.location.href = `https://google.com/search?q=${encodeURIComponent(val)}`;
      }
    }
    return;
  }

  // Ignore modifiers
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  // Hotkeys 1-9
  const n = parseInt(e.key);
  if (n > 0 && n <= 9 && links[n - 1]) {
    window.location.href = links[n - 1].url;
    return;
  }

  // Activate Search on single letter
  if (e.key.length === 1 && e.key !== " ") {
    e.preventDefault();
    activateSearch(e.key);
  }
});

// --- Initialization ---

// Greeting
const hour = new Date().getHours();
const greet = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";
document.getElementById("greeting").textContent = greet;

// Render Grid
render();

// Focus Trap Logic (Best Effort)
window.onload = () => {
  const trap = document.getElementById("focus-trap");
  if (trap) {
    trap.focus();
    trap.onblur = () => {
      trap.value = "";
    };
  }
};
