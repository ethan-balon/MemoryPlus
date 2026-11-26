/**
 * TaskModel
 * Manages the active pool of downtime tasks (creation, reading, updating,
 * deleting, repeat-status toggling, and random selection).
 */
(function(window) {
  'use strict';

  window.App = window.App || {};

  class TaskModel {
    /**
     * @param {App.StorageService} storageService
     */
    constructor(storageService) {
      this.storage = storageService || new window.App.StorageService();
      this.storageKey = 'tasks';
    }

    _generateId() {
      return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    /**
     * Get all active tasks
     * @returns {Array<Object>}
     */
    getAll() {
      return this.storage.get(this.storageKey, []);
    }

    /**
     * Find task by ID
     * @param {string} id
     * @returns {Object|null}
     */
    getById(id) {
      const tasks = this.getAll();
      return tasks.find(t => t.id === id) || null;
    }

    /**
     * Add a new task
     * @param {string} title
     * @param {boolean} isRepeatable
     * @returns {Object} Newly created task
     */
    add(title, isRepeatable = false) {
      const cleanTitle = (title || '').trim();
      if (!cleanTitle) {
        throw new Error('Task title cannot be empty.');
      }

      const tasks = this.getAll();
      const newTask = {
        id: this._generateId(),
        title: cleanTitle,
        isRepeatable: Boolean(isRepeatable),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      tasks.push(newTask);
      this.storage.set(this.storageKey, tasks);
      return newTask;
    }

    /**
     * Update an existing task's title or attributes
     * @param {string} id
     * @param {Object} updates
     * @returns {Object|null}
     */
    update(id, updates = {}) {
      const tasks = this.getAll();
      const index = tasks.findIndex(t => t.id === id);
      if (index === -1) {
        return null;
      }

      if (updates.title !== undefined) {
        const cleanTitle = updates.title.trim();
        if (!cleanTitle) {
          throw new Error('Task title cannot be empty.');
        }
        tasks[index].title = cleanTitle;
      }

      if (updates.isRepeatable !== undefined) {
        tasks[index].isRepeatable = Boolean(updates.isRepeatable);
      }

      tasks[index].updatedAt = new Date().toISOString();
      this.storage.set(this.storageKey, tasks);
      return tasks[index];
    }

    /**
     * Toggle the repeat status of a task
     * @param {string} id
     * @returns {Object|null}
     */
    toggleRepeat(id) {
      const task = this.getById(id);
      if (!task) return null;
      return this.update(id, { isRepeatable: !task.isRepeatable });
    }

    /**
     * Delete a task by ID
     * @param {string} id
     * @returns {boolean}
     */
    delete(id) {
      const tasks = this.getAll();
      const filtered = tasks.filter(t => t.id !== id);
      if (filtered.length === tasks.length) {
        return false;
      }
      this.storage.set(this.storageKey, filtered);
      return true;
    }

    /**
     * Select a random task from the active pool.
     * Prevents picking the same task consecutively if there is more than 1 task available.
     * @param {string|null} excludeId Task ID to avoid repeating immediately
     * @returns {Object|null} Selected task or null if pool is empty
     */
    getRandom(excludeId = null) {
      const tasks = this.getAll();
      if (!tasks || tasks.length === 0) {
        return null;
      }

      if (tasks.length === 1) {
        return tasks[0];
      }

      // If excludeId is passed and we have > 1 tasks, exclude it
      let eligible = tasks;
      if (excludeId) {
        eligible = tasks.filter(t => t.id !== excludeId);
        // Fallback in case filter left nothing
        if (eligible.length === 0) eligible = tasks;
      }

      const randomIndex = Math.floor(Math.random() * eligible.length);
      return eligible[randomIndex];
    }

    /**
     * Total number of active tasks
     * @returns {number}
     */
    count() {
      return this.getAll().length;
    }
  }

  window.App.TaskModel = TaskModel;
})(window);
