# Randomized Downtime Task Generator (Barren Prototype)

A local-first, zero-dependency web application designed to solve two core downtime scenarios:
1. **Brain Offloading**: Storing open-ended, non-urgent tasks out of sight so you don't feel overwhelmed.
2. **Downtime Activation**: Randomly rolling one task from your backlog when you have free time, eliminating decision paralysis.

---

## Architecture (Client-Side MVC)

The application is built in **Vanilla JavaScript** with a strict **Model-View-Controller (MVC)** structure and **100% local-device persistence**:

- **Model Layer**:
  - [`StorageService`](js/models/Storage.js): Handles `localStorage` access, JSON serialization, and full backup Export/Import.
  - [`TaskModel`](js/models/TaskModel.js): Manages active tasks, addition, inline edits, repeat toggles, deletions, and non-repeating random selection.
  - [`HistoryModel`](js/models/HistoryModel.js): Tracks lifetime completed tasks with timestamps and total completion counts.
- **View Layer** (Completely Barren / Semantic HTML):
  - [`MainView`](js/views/MainView.js): Center textbox, "Fetch task" button, conditional "Mark as done" button.
  - [`ManageView`](js/views/ManageView.js): Input form + "Add task" button, and active tasks table with Edit, Toggle Repeat, and Delete actions.
  - [`AboutView`](js/views/AboutView.js): App description, lifetime completed tasks table, and JSON Export/Import buttons.
- **Controller Layer**:
  - [`MainController`](js/controllers/MainController.js): Coordinates random rolls, rerolls, and task completion lifecycles.
  - [`ManageController`](js/controllers/ManageController.js): Coordinates task CRUD and inline row editing.
  - [`AboutController`](js/controllers/AboutController.js): Coordinates lifetime stats display and backup downloads/restores.
- **Routing & Shell**:
  - [`Router`](js/router.js): Hash-based client-side router (`#main`, `#manage`, `#about`).
  - [`Application`](js/app.js): Bootstrap entry point.
  - [`index.html`](index.html): Un-styled single-page application shell.

---

## How to Run

1. Open `index.html` directly in any web browser (Chrome, Edge, Firefox, Safari) by double-clicking it or opening `file:///c:/ANTIGRAVITY_SANDBOX/index.html`.
2. No local server, node modules, or database daemons are required. All data remains strictly in your browser's `localStorage`.
