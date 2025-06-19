# battle
# Neon Arena – Ultimate Gaming Platform

Neon Arena is a fully responsive, pixel-perfect gaming website inspired by modern gamer aesthetics and accessibility best practices. It features a neon/3D look, interactive dashboard, memory game, social features, and smooth light/dark mode transitions. Built with semantic HTML5, modular CSS, and clean JavaScript—no frameworks required.

## 🚀 Features

- Loader Page: Neon animated spinner, loading bar, and percentage.
- 3D Animated Background: Canvas-based neon particles and gradients, adapts to light/dark mode.
- Responsive Navigation: Hamburger menu and sidebar, accessible and mobile-first.
- Hero Section: Eye-catching intro with SVG logo and call-to-action.
- Social Dashboard:
  - Community Feed: Post and display messages (localStorage).
  - Gamer Profiles: Add friends, view featured gamers.
  - Friends/Connections: Add/remove friends, open chat.
  - Chat/DM Modal: Per-friend chat, persistent via localStorage.
- Game Zone: Memory Card Game (20 cards, 10 pairs), timer, moves, last score.
- Stats & Counters: Animated stats for gamers, matches, tournaments, awards.
- Features/Cards: Highlighted platform features with icons.
- Gallery: Responsive, random gaming images with badges.
- Testimonials: Slider with gamer reviews.
- Contact/Join Form: Accessible, validated form for new members.
- Accessibility: ARIA labels, roles, keyboard navigation, focus management, high contrast.
- Light/Dark Mode: Toggle with smooth transitions and localStorage persistence.
- Animations: Subtle 3D, hover, focus, scroll-in, loader, and background effects.
- Mobile-First: All sections and elements are visually separated and optimized for all devices.

## 🗂️ Project Structure

```
.
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── public/
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   ├── window.svg
│   └── file.svg
├── .vscode/
│   └── settings.json
```

- index.html: Main HTML file, all sections and modals.
- css/style.css: Modular, responsive, and theme-aware styles.
- js/main.js: Handles loader, navigation, dashboard, game logic, chat, accessibility, and all interactivity.
- public/: SVG assets for icons and UI.
- .vscode/settings.json: (Optional) Sets Live Server port to 5502 for local development.

## 🖥️ Getting Started

1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd battle
   ```

2. Open with Live Server (recommended for localStorage and JS features):
   - If using VSCode, install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
   - Right-click `index.html` and select Open with Live Server.
   - Or run:
     ```sh
     npx live-server --port=5502
     ```
   - The site will open at http://localhost:5502

3. Enjoy Neon Arena!

## 📱 Responsiveness

- All layouts adapt from mobile to 4K screens.
- Touch-friendly navigation, cards, and game.
- Hamburger menu and sidebar for small screens.

## ♿ Accessibility

- Semantic HTML5, ARIA roles/labels, keyboard navigation.
- Focus management for modals, menus, and forms.
- High-contrast color schemes and visible focus states.

## 🌗 Light/Dark Mode

- Toggle in sidebar or with keyboard shortcut.
- Theme preference is saved in localStorage.
- All neon/3D effects adapt to the current theme.

## 🕹️ Game & Dashboard

- Memory Game: Flip cards, match pairs, track moves and time.
- Social Dashboard: Post to feed, manage friends, chat in modals.
- All data: Stored in localStorage for persistence.

## 🖼️ Gallery

- Randomized, high-quality gaming images.
- Badges and captions for each image.
- Fully responsive grid.

## 🛠️ Customization

- All colors, gradients, and neon effects are easily adjustable in css/style.css.
- Add or replace SVGs in public/ for new icons.

## 📝 Contributing

1. Fork the repo and create your branch.
2. Make changes with clean, modular HTML/CSS/JS.
3. Ensure accessibility and responsiveness.
4. Submit a pull request!

## 📄 License

MIT License. See LICENSE for details.

## 🙏 Credits

- [Unsplash](https://unsplash.com/) for gallery images.
- [Google Fonts – Orbitron](https://fonts.google.com/specimen/Orbitron) for the gamer font.
- SVG icons by [Vercel](https://vercel.com/) and custom.

---

Level up. Game on. Welcome to Neon Arena! 
