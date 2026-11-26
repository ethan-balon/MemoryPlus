/**
 * HistoryModel
 * Manages the lifetime log of completed tasks.
 */
(function(window) {
  'use strict';

  window.App = window.App || {};

  class HistoryModel {
    /**
     * @param {App.StorageService} storageService
     */
    constructor(storageService) {
      this.storage = storageService || new window.App.StorageService();
      this.storageKey = 'history';
    }

    _generateId() {
      return `hist_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    /**
     * Get all completed tasks, sorted newest first
     * @returns {Array<Object>}
     */
    getAll() {
      const history = this.storage.get(this.storageKey, []);
      // Return sorted by completedAt descending (newest first)
      return history.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    }

    /**
     * Record a task as completed
     * @param {Object} task Active task object being completed
     * @returns {Object} The recorded history entry
     */
    recordCompletion(task) {
      if (!task || !task.title) {
        throw new Error('A valid task with a title is required to record completion.');
      }

      const history = this.storage.get(this.storageKey, []);
      const entry = {
        id: this._generateId(),
        originalTaskId: task.id || null,
        title: task.title,
        isRepeatable: Boolean(task.isRepeatable),
        completedAt: new Date().toISOString()
      };

      // Add to beginning of history array
      history.unshift(entry);
      this.storage.set(this.storageKey, history);
      return entry;
    }

    /**
     * Total lifetime count of completed tasks
     * @returns {number}
     */
    getCount() {
      const history = this.storage.get(this.storageKey, []);
      return history.length;
    }

    /**
     * Clear all completion history
     * @returns {boolean}
     */
    clear() {
      return this.storage.set(this.storageKey, []);
    }
  }

  window.App.HistoryModel = HistoryModel;
})(window);
