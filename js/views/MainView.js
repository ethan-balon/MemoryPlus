/**
 * MainView
 * Renders the center random task generator view:
 * - A textbox for displaying the random task
 * - A "Fetch task" button beside it
 * - A conditionally visible "Mark as done" button
 * Completely barren semantic HTML (no CSS).
 */
(function(window) {
  'use strict';

  window.App = window.App || {};
  window.App.Views = window.App.Views || {};

  class MainView {
    constructor(containerId = 'view-main') {
      this.container = document.getElementById(containerId);
    }

    render() {
      if (!this.container) return;

      this.container.innerHTML = `
        <h2>Downtime Task Generator</h2>
        <p>Got some spare time on your hands? Fetch a random task from your backlog to do right now!</p>

        <!-- Center Generator Div -->
        <div id="generator-center-box">
          <input 
            type="text" 
            id="main-task-display" 
            readonly 
            size="45" 
            placeholder="Click 'Fetch task' to pick a task..."
          >
          <button id="main-fetch-btn">Fetch task</button>
          <button id="main-done-btn" style="display: none;">Mark as done</button>
        </div>

        <p id="main-status-msg"></p>
      `;
    }

    /**
     * Display a fetched task in the textbox and show "Mark as done" button
     * @param {Object} task
     */
    displayTask(task) {
      const displayInput = document.getElementById('main-task-display');
      const doneBtn = document.getElementById('main-done-btn');
      const statusMsg = document.getElementById('main-status-msg');

      if (displayInput) {
        displayInput.value = task.title + (task.isRepeatable ? ' [Repeatable]' : '');
      }

      if (doneBtn) {
        doneBtn.style.display = 'inline-block';
      }

      if (statusMsg) {
        statusMsg.textContent = '';
      }
    }

    /**
     * Display message when no tasks exist in the database
     * @param {string} message
     */
    displayNoTasks(message) {
      const displayInput = document.getElementById('main-task-display');
      const doneBtn = document.getElementById('main-done-btn');
      const statusMsg = document.getElementById('main-status-msg');

      if (displayInput) {
        displayInput.value = message;
      }

      if (doneBtn) {
        doneBtn.style.display = 'none';
      }

      if (statusMsg) {
        statusMsg.textContent = 'Go to "Manage Tasks" in the navigation above to add tasks.';
      }
    }

    /**
     * Reset textbox and hide "Mark as done" after completing a task
     * @param {string} taskTitle
     * @param {boolean} wasRepeatable
     */
    displayTaskCompleted(taskTitle, wasRepeatable) {
      const displayInput = document.getElementById('main-task-display');
      const doneBtn = document.getElementById('main-done-btn');
      const statusMsg = document.getElementById('main-status-msg');

      if (displayInput) {
        displayInput.value = '';
      }

      if (doneBtn) {
        doneBtn.style.display = 'none';
      }

      if (statusMsg) {
        const note = wasRepeatable 
          ? ' (Repeatable: remains in your active pool for the future)' 
          : ' (One-time: removed from active pool)';
        statusMsg.textContent = `Completed "${taskTitle}"! Logged to lifetime history.${note}`;
      }
    }

    // Event Bindings

    bindFetchTask(handler) {
      this.container.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'main-fetch-btn') {
          handler();
        }
      });
    }

    bindMarkDone(handler) {
      this.container.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'main-done-btn') {
          handler();
        }
      });
    }
  }

  window.App.Views.MainView = MainView;
})(window);
