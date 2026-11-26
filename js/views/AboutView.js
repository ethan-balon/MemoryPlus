/**
 * AboutView
 * Renders the About page:
 * - Application description explaining the downtime productivity concept
 * - Table of lifetime completed tasks
 * - Backup (Export/Import JSON) utility
 * Completely barren semantic HTML (no CSS).
 */
(function(window) {
  'use strict';

  window.App = window.App || {};
  window.App.Views = window.App.Views || {};

  class AboutView {
    constructor(containerId = 'view-about') {
      this.container = document.getElementById(containerId);
    }

    /**
     * Render the about page with lifetime history
     * @param {Array<Object>} history - List of completed task records
     * @param {number} totalCount - Total number of completions
     */
    render(history = [], totalCount = 0) {
      if (!this.container) return;

      this.container.innerHTML = `
        <h2>About This Application</h2>

        <!-- Application Description Section -->
        <div>
          <p>
            <strong>Randomized Downtime Task Generator</strong> is designed to solve two common productivity problems:
          </p>
          <ol>
            <li>
              <strong>Mental Offloading Without Overwhelm:</strong> When you have chores or tasks with no strict due dates 
              (e.g., cleaning the backyard, organizing a closet, practicing an instrument), you can offload them from your mind 
              into this app. They stay in a local database out of immediate sight, so you never feel intimidated by a massive, 
              cluttered to-do list.
            </li>
            <li>
              <strong>Downtime Activation:</strong> When you find yourself with unexpected free time and want to do something 
              productive, the app eliminates decision fatigue by picking a single random task for you. If it's not suitable right now, 
              simply fetch another!
            </li>
          </ol>
          <p>
            <em>All data is stored 100% locally on your device in your browser. Nothing is sent to any external server.</em>
          </p>
        </div>

        <hr>

        <!-- Lifetime Completed Tasks Section -->
        <div>
          <h3>Lifetime Completed Tasks</h3>
          <p><strong>Total tasks completed to date:</strong> ${totalCount}</p>
          ${this._renderHistoryTable(history)}
        </div>

        <hr>

        <!-- Data Backup & Restore Section -->
        <div>
          <h3>Data Backup & Restore</h3>
          <p>Because all tasks are stored locally on your device, you can export a backup file or restore previously saved data at any time:</p>
          <button id="about-export-btn">Export Data (JSON)</button>
          &nbsp;
          <input type="file" id="about-import-file" accept=".json" style="display: none;">
          <button id="about-import-btn">Import Data (JSON)</button>
          &nbsp;
          ${totalCount > 0 ? '<button id="about-clear-history-btn">Clear History</button>' : ''}
        </div>
      `;
    }

    _renderHistoryTable(history) {
      if (!history || history.length === 0) {
        return '<p><em>No tasks have been completed yet. When you complete tasks on the Main Page, they will be recorded here!</em></p>';
      }

      let rowsHtml = '';
      history.forEach(entry => {
        const formattedDate = new Date(entry.completedAt).toLocaleString();
        const typeLabel = entry.isRepeatable ? 'Repeatable' : 'One-time';

        rowsHtml += `
          <tr>
            <td>${this._escapeHtml(entry.title)}</td>
            <td>${typeLabel}</td>
            <td>${formattedDate}</td>
          </tr>
        `;
      });

      return `
        <table border="1" cellpadding="6" cellspacing="0">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Task Type</th>
              <th>Date & Time Completed</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      `;
    }

    _escapeHtml(str) {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // Event Bindings

    bindExport(handler) {
      this.container.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'about-export-btn') {
          handler();
        }
      });
    }

    bindImport(handler) {
      this.container.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'about-import-btn') {
          const fileInput = document.getElementById('about-import-file');
          if (fileInput) {
            fileInput.click();
          }
        }
      });

      this.container.addEventListener('change', (e) => {
        if (e.target && e.target.id === 'about-import-file' && e.target.files.length > 0) {
          const file = e.target.files[0];
          handler(file);
          e.target.value = ''; // Reset file input
        }
      });
    }

    bindClearHistory(handler) {
      this.container.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'about-clear-history-btn') {
          handler();
        }
      });
    }
  }

  window.App.Views.AboutView = AboutView;
})(window);
