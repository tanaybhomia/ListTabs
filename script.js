const defaultLinks = [
  { title: "Google", url: "https://google.com" },
  { title: "YouTube", url: "https://youtube.com" },
  { title: "GitHub", url: "https://github.com" },
];

let links = JSON.parse(localStorage.getItem("myLinks")) || defaultLinks;
const grid = document.getElementById("link-grid");
const searchOverlay = document.getElementById("search-overlay");
const searchInput = document.getElementById("search-input");
const modal = document.getElementById("add-modal");

function render() {
  grid.innerHTML = "";
  links.forEach((link, index) => {
    const item = document.createElement("div");
    item.className = "link-item";

    // Create Delete Button
    const delBtn = document.createElement("div");
    delBtn.className = "delete-btn";
    delBtn.innerHTML = "×";
    delBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation(); // Stop click from triggering the link
      links.splice(index, 1);
      localStorage.setItem("myLinks", JSON.stringify(links));
      render();
    };

    // Link structure
    const linkContent = `
        <div class="circle-number">${index < 9 ? index + 1 : ""}</div>
        <a href="${link.url}" class="link-text">${link.title}</a>
    `;

    item.innerHTML = linkContent;
    item.appendChild(delBtn);
    grid.appendChild(item);
  });
}

// Open Settings (Add Shortcut Modal)
function openSettings() {
  modal.classList.add("active");
}

// Close Settings
function closeSettings() {
  modal.classList.remove("active");
}

document.getElementById("add-btn").onclick = openSettings;
document.getElementById("cancel-btn").onclick = closeSettings;

function activateSearch(key) {
  searchOverlay.classList.add("active");
  searchInput.value = key;
  searchInput.focus();
  setTimeout(() => searchInput.focus(), 1);
}

document.addEventListener("keydown", (e) => {
  // Prevent catching keys when typing in the modal
  if (modal.classList.contains("active")) {
    if (e.key === "Escape") closeSettings();
    return;
  }

  if (searchOverlay.classList.contains("active")) {
    if (e.key === "Escape") {
      searchOverlay.classList.remove("active");
      searchInput.value = "";
    }
    if (e.key === "Enter") {
      const q = searchInput.value.trim();
      if (q)
        window.location.href = `https://google.com/search?q=${encodeURIComponent(q)}`;
    }
    return;
  }

  if (e.ctrlKey || e.metaKey || e.altKey) return;

  // Hotkeys 1-9
  const n = parseInt(e.key);
  if (n > 0 && n <= 9 && links[n - 1]) {
    window.location.href = links[n - 1].url;
    return;
  }

  // Direct key catch for search
  if (e.key.length === 1 && e.key !== " ") {
    e.preventDefault();
    activateSearch(e.key);
  }
});

document.getElementById("save-btn").onclick = () => {
  const t = document.getElementById("input-title").value;
  let u = document.getElementById("input-url").value;
  if (t && u) {
    if (!u.startsWith("http")) u = "https://" + u;
    links.push({ title: t, url: u });
    localStorage.setItem("myLinks", JSON.stringify(links));
    render();
    document.getElementById("input-title").value = "";
    document.getElementById("input-url").value = "";
    closeSettings(); // Auto close on save
  }
};

document.getElementById("save-bang-btn").onclick = () => {
  const k = document.getElementById("bang-key").value;
  const u = document.getElementById("bang-url").value;
  if (k && u) {
    // Logic for custom bangs can be added here
    document.getElementById("bang-key").value = "";
    document.getElementById("bang-url").value = "";
  }
};

// Set Greeting
const hour = new Date().getHours();
const greet = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";
document.getElementById("greeting").textContent = greet;

render();
// Clean up the previous fix if you added it
window.onload = () => {
  const trap = document.getElementById("focus-trap");
  if (trap) {
    trap.focus();
    // Keep the trap clear so it doesn't store typed characters
    trap.onblur = () => {
      trap.value = "";
    };
  }
};
