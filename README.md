# Minimalist Firefox Startpage

A clean, high-performance, and distraction-free "New Tab" page for Firefox. Built with a 3-column grid, dynamic time-based greetings, and keyboard-driven navigation.

✨ Features

1. 3-Column Layout: Perfectly centered and symmetrical grid.

2. Dynamic Greeting: Displays "Good Morning/Afternoon/Evening" based on system time.

3. Auto-Theme: Automatically detects and matches your system's light or dark mode.

4. Keyboard Navigation: Press keys 1 through 9 to instantly open your shortcuts.

5. Minimalist UI: Links are displayed as text with numbers in elegant circles—no borders, no clutter.

6. Hidden Controls: Add or remove links via a hidden settings menu in the top-right corner.

## 🚀 Setup Instructions
1. Host the Page

The easiest way to use this is via GitHub Pages:

    Push these files to a GitHub repository.

    Go to Settings > Pages and enable deployment from the main branch.

    Copy your live URL (e.g., https://username.github.io/repo-name/).

2. Configure Firefox

Firefox doesn't allow you to set a custom URL for new tabs natively, so you'll need a small extension:

    - Install the New Tab Override extension.

    - Open the extension settings.

    - Change the Option dropdown to Custom URL.

    - Paste your GitHub Pages URL.

    - (Optional) Set Focus to "Website" to ensure your hotkeys work immediately upon opening a tab.

## 🛠️ Customization

To change the design, edit the style.css file:

    - Column Gap: Adjust the gap property in the .link-grid class.

    - Typography: Change the font-family in the body tag.

    - Colors: Modify the CSS variables under :root and @media (prefers-color-scheme: dark).

## ⌨️ Hotkeys

    - 1 - 9: Open the corresponding link in the current tab.

    - Hover Top-Right: Reveal the "Add URL" button.

    - Hover Link: Reveal the "Delete" button (X).

## How to add this to your Repo:

    - Create a new file in your local folder named README.md.

    - Paste the content above into it.

    - Run the final push:
    
    Bash

    ```
    git add README.md
    git commit -m "Add project documentation"
    git push origin main
    ```