// --- Initial Data & State ---
const defaultLinks = [
  { title: "Google", url: "https://google.com" },
  { title: "YouTube", url: "https://youtube.com" },
  { title: "GitHub", url: "https://github.com" },
  { title: "Reddit", url: "https://reddit.com" },
];

let links = JSON.parse(localStorage.getItem("myLinks")) || defaultLinks;

// --- DOM Elements ---
const grid = document.getElementById("link-grid");
const modal = document.getElementById("add-modal");
const greetingEl = document.getElementById("greeting");
const searchOverlay = document.getElementById("search-overlay");
const searchInput = document.getElementById("search-input");

// --- Greeting Logic ---
function updateGreeting() {
  const hour = new Date().getHours();
  let text = "Hello";

  if (hour >= 5 && hour < 12) text = "Good Morning";
  else if (hour >= 12 && hour < 18) text = "Good Afternoon";
  else text = "Good Evening";

  greetingEl.textContent = text;
}

// --- Render Logic ---
function render() {
  grid.innerHTML = "";

  links.forEach((link, index) => {
    const isHotkey = index < 9;
    const number = isHotkey ? index + 1 : "";

    const a = document.createElement("a");
    a.className = "link-item";
    a.href = link.url;

    a.innerHTML = `
            <div class="circle-number" style="${!isHotkey ? "opacity:0" : ""}">
                ${number}
            </div>
            <span class="link-text">${link.title}</span>
            <button class="delete-btn" title="Delete">&times;</button>
        `;

    const deleteBtn = a.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (confirm(`Remove "${link.title}"?`)) {
        links.splice(index, 1);
        saveAndRender();
      }
    });

    grid.appendChild(a);
  });
}

function saveAndRender() {
  localStorage.setItem("myLinks", JSON.stringify(links));
  render();
}

// --- Search Logic ---
// --- Smart Search/Navigate Logic ---
function performSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  // Check if it's a direct URL (contains a dot and no spaces) or starts with http
  const isDirectURL = query.includes(".") && !query.includes(" ");
  const hasProtocol =
    query.startsWith("http://") || query.startsWith("https://");

  if (hasProtocol) {
    window.location.href = query;
  } else if (isDirectURL) {
    window.location.href = "https://" + query;
  } else {
    // Fallback to Google Search
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }
}

// --- Unified Keydown Listener ---
document.addEventListener("keydown", (e) => {
  // 1. If an input is focused, handle specific control keys
  if (e.target.tagName === "INPUT") {
    if (e.key === "Enter") performSearch();
    if (e.key === "Escape") {
      searchOverlay.classList.remove("active");
      modal.classList.remove("active"); // Also close "Add URL" modal if open
      searchInput.value = "";
      searchInput.blur();
    }
    return;
  }

  // 2. Ignore system keys/shortcuts (Ctrl+C, Cmd+R, etc.)
  if (
    e.metaKey ||
    e.ctrlKey ||
    e.altKey ||
    e.key === "Tab" ||
    e.key === "CapsLock"
  )
    return;

  // 3. Number Hotkeys (1-9)
  const keyNum = parseInt(e.key);
  if (!isNaN(keyNum) && keyNum > 0 && keyNum <= 9) {
    const index = keyNum - 1;
    if (links[index]) {
      window.location.href = links[index].url;
      return;
    }
  }

  // 4. Direct Search: Any other single character key
  if (e.key.length === 1) {
    searchOverlay.classList.add("active");
    searchInput.focus();
    // Note: The browser will naturally insert the character into the focused input
  }
});

// --- Modal Controls (Add URL) ---
document.getElementById("add-btn").addEventListener("click", () => {
  modal.classList.add("active");
  document.getElementById("input-title").focus();
});

document.getElementById("cancel-btn").addEventListener("click", () => {
  modal.classList.remove("active");
});

document.getElementById("save-btn").addEventListener("click", () => {
  const title = document.getElementById("input-title").value;
  let url = document.getElementById("input-url").value;

  if (!title || !url) return;
  if (!url.startsWith("http")) url = "https://" + url;

  links.push({ title, url });
  saveAndRender();
  modal.classList.remove("active");
});

// --- Initialize ---
updateGreeting();
render();
setInterval(updateGreeting, 60000);
