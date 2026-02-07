// --- Initial Data ---
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
    // Hotkey number (only 1-9)
    const isHotkey = index < 9;
    const number = isHotkey ? index + 1 : "";

    const a = document.createElement("a");
    a.className = "link-item";
    a.href = link.url;

    // HTML Structure: Circle -> Text -> Delete Button
    a.innerHTML = `
            <div class="circle-number" style="${!isHotkey ? "opacity:0" : ""}">
                ${number}
            </div>
            <span class="link-text">${link.title}</span>
            <button class="delete-btn">&times;</button>
        `;

    // Delete Logic
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

// --- Modal Logic ---
document.getElementById("add-btn").addEventListener("click", () => {
  modal.classList.add("active");
  document.getElementById("input-title").focus();
});

document.getElementById("cancel-btn").addEventListener("click", closeModal);

document.getElementById("save-btn").addEventListener("click", () => {
  const title = document.getElementById("input-title").value;
  let url = document.getElementById("input-url").value;

  if (!title || !url) return;
  if (!url.startsWith("http")) url = "https://" + url;

  links.push({ title, url });
  saveAndRender();
  closeModal();
});

function closeModal() {
  modal.classList.remove("active");
  document.getElementById("input-title").value = "";
  document.getElementById("input-url").value = "";
}

// --- Hotkey Logic ---
document.addEventListener("keydown", (e) => {
  // Ignore hotkeys if the user is typing in the input box
  if (document.activeElement.tagName === "INPUT") return;

  const key = parseInt(e.key);
  // 1-9 keys
  if (!isNaN(key) && key > 0 && key <= 9) {
    const index = key - 1;
    if (links[index]) {
      window.location.href = links[index].url;
    }
  }
});

// --- Initialize ---
updateGreeting();
render();

// Update greeting every minute
setInterval(updateGreeting, 60000);

// Add these to your existing DOM elements at the top
const searchOverlay = document.getElementById("search-overlay");
const searchInput = document.getElementById("search-input");

// Handle Search logic
function performSearch() {
  const query = searchInput.value.trim();
  if (query) {
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }
}

// Update your keydown listener
document.addEventListener("keydown", (e) => {
  // If we are typing in an input already, don't trigger hotkeys
  if (e.target.tagName === "INPUT") {
    if (e.key === "Enter" && e.target.id === "search-input") performSearch();
    if (e.key === "Escape") {
      searchOverlay.classList.remove("active");
      searchInput.value = "";
    }
    return;
  }

  // Toggle Search with 's'
  if (e.key.toLowerCase() === "s") {
    e.preventDefault();
    searchOverlay.classList.add("active");
    searchInput.focus();
  }

  // Existing Number Hotkeys (1-9)
  const key = parseInt(e.key);
  if (!isNaN(key) && key > 0 && key <= 9) {
    const index = key - 1;
    if (links[index]) window.location.href = links[index].url;
  }
});
