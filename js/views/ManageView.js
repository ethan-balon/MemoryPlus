/**
 * ManageView
 * Renders the task creation form and the table of tasks with actions
 * (inline edit text input replace, repeat toggle, delete).
 * Completely barren semantic HTML (no CSS).
 */
(function(window) {
  'use strict';

  window.App = window.App || {};
  window.App.Views = window.App.Views || {};

  class ManageView {
    constructor(containerId = 'view-manage') {
      this.container = document.getElementById(containerId);
      this.editingTaskId = null;
    }

    /**
     * Render the complete manage page
     * @param {Array<Object>} tasks - List of active tasks
     * @param {string|null} editingTaskId - ID of task currently being edited inline
     */
    render(tasks = [], editingTaskId = null) {
      this.editingTaskId = editingTaskId;
      if (!this.container) return;

      this.container.innerHTML = `
        <h2>Manage Tasks</h2>

        <!-- Div 1: Add Task Form -->
        <div id="manage-form-container">
          <input type="text" id="manage-task-input" placeholder="Type a task here..." size="40">
          <label>
            <input type="checkbox" id="manage-task-repeat"> Repeatable (re-appears after completion)
          </label>
          <button id="manage-add-btn">Add task</button>
        </div>

        <br>

        <!-- Div 2: Table of Existing Tasks -->
        <div id="manage-table-container">
          ${this._renderTableHtml(tasks)}
        </div>
      `;
    }

    _renderTableHtml(tasks) {
      if (!tasks || tasks.length === 0) {
        return '<p><em>No tasks currently stored in the database. Add some tasks using the form above!</em></p>';
      }

      let rowsHtml = '';
      tasks.forEach(task => {
        const isEditing = this.editingTaskId === task.id;

        rowsHtml += `
          <tr data-id="${task.id}">
            <td>
              ${isEditing 
                ? `<input type="text" class="edit-input-field" value="${this._escapeHtml(task.title)}" size="30">
                   <button class="save-edit-btn" data-id="${task.id}">Save</button>
                   <button class="cancel-edit-btn" data-id="${task.id}">Cancel</button>`
                : `<span>${this._escapeHtml(task.title)}</span>`
              }
            </td>
            <td>
              ${task.isRepeatable ? 'Repeats (Yes)' : 'One-time (No)'}
            </td>
            <td>
              ${isEditing 
                ? '<em>Editing...</em>' 
                : `<button class="edit-btn" data-id="${task.id}">Edit</button>
                   <button class="toggle-repeat-btn" data-id="${task.id}">Toggle repeat</button>
                   <button class="delete-btn" data-id="${task.id}">Delete</button>`
              }
            </td>
          </tr>
        `;
      });

      return `
        <table border="1" cellpadding="6" cellspacing="0">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Repeat Status</th>
              <th>Actions</th>
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

    // Event Binding Methods

    bindAddTask(handler) {
      this.container.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'manage-add-btn') {
          const input = document.getElementById('manage-task-input');
          const repeatCheckbox = document.getElementById('manage-task-repeat');
          const title = input ? input.value : '';
          const isRepeatable = repeatCheckbox ? repeatCheckbox.checked : false;

          handler(title, isRepeatable);
        }
      });

      // Also allow pressing "Enter" in the add input field
      this.container.addEventListener('keydown', (e) => {
        if (e.target && e.target.id === 'manage-task-input' && e.key === 'Enter') {
          const input = e.target;
          const repeatCheckbox = document.getElementById('manage-task-repeat');
          const title = input.value;
          const isRepeatable = repeatCheckbox ? repeatCheckbox.checked : false;

          handler(title, isRepeatable);
        }
      });
    }

    bindEditTask(handler) {
      this.container.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('edit-btn')) {
          const id = e.target.getAttribute('data-id');
          handler(id);
        }
      });
    }

    bindSaveEditTask(handler) {
      this.container.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('save-edit-btn')) {
          const id = e.target.getAttribute('data-id');
          const row = e.target.closest('tr');
          const input = row ? row.querySelector('.edit-input-field') : null;
          const newTitle = input ? input.value : '';
          handler(id, newTitle);
        }
      });

      // Allow pressing Enter in the inline edit input
      this.container.addEventListener('keydown', (e) => {
        if (e.target && e.target.classList.contains('edit-input-field') && e.key === 'Enter') {
          const row = e.target.closest('tr');
          const saveBtn = row ? row.querySelector('.save-edit-btn') : null;
          if (saveBtn) {
            saveBtn.click();
          }
        }
      });
    }

    bindCancelEditTask(handler) {
      this.container.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('cancel-edit-btn')) {
          handler();
        }
      });
    }

    bindToggleRepeat(handler) {
      this.container.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('toggle-repeat-btn')) {
          const id = e.target.getAttribute('data-id');
          handler(id);
        }
      });
    }

    bindDeleteTask(handler) {
      this.container.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('delete-btn')) {
          const id = e.target.getAttribute('data-id');
          handler(id);
        }
      });
    }

    clearInput() {
      const input = document.getElementById('manage-task-input');
      const repeatCheckbox = document.getElementById('manage-task-repeat');
      if (input) input.value = '';
      if (repeatCheckbox) repeatCheckbox.checked = false;
    }
  }

  window.App.Views.ManageView = ManageView;
})(window);
