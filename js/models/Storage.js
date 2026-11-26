/**
 * StorageService
 * Wrapper for browser localStorage with error handling, JSON serialization,
 * and data backup (import/export) support.
 */
(function(window) {
  'use strict';

  window.App = window.App || {};

  class StorageService {
    constructor(prefix = 'dt_') {
      this.prefix = prefix;
    }

    _getKey(key) {
      return `${this.prefix}${key}`;
    }

    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(this._getKey(key));
        if (item === null) {
          return defaultValue;
        }
        return JSON.parse(item);
      } catch (error) {
        console.error(`[StorageService] Failed to read key "${key}":`, error);
        return defaultValue;
      }
    }

    set(key, value) {
      try {
        localStorage.setItem(this._getKey(key), JSON.stringify(value));
        return true;
      } catch (error) {
        console.error(`[StorageService] Failed to write key "${key}":`, error);
        return false;
      }
    }

    remove(key) {
      try {
        localStorage.removeItem(this._getKey(key));
        return true;
      } catch (error) {
        console.error(`[StorageService] Failed to remove key "${key}":`, error);
        return false;
      }
    }

    clear() {
      try {
        // Only clear keys starting with this prefix to prevent wiping unrelated localStorage
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(this.prefix)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        return true;
      } catch (error) {
        console.error('[StorageService] Failed to clear storage:', error);
        return false;
      }
    }

    /**
     * Export all app data as a JSON string for backup
     */
    exportData() {
      const exportObj = {
        version: 1,
        exportedAt: new Date().toISOString(),
        tasks: this.get('tasks', []),
        history: this.get('history', [])
      };
      return JSON.stringify(exportObj, null, 2);
    }

    /**
     * Import app data from a JSON string
     */
    importData(jsonString) {
      try {
        const data = JSON.parse(jsonString);
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid JSON format');
        }
        if (Array.isArray(data.tasks)) {
          this.set('tasks', data.tasks);
        }
        if (Array.isArray(data.history)) {
          this.set('history', data.history);
        }
        return { success: true };
      } catch (error) {
        console.error('[StorageService] Import failed:', error);
        return { success: false, error: error.message };
      }
    }
  }

  window.App.StorageService = StorageService;
})(window);
