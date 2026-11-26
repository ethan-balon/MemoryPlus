/**
 * AboutController
 * Coordinates data display for the About page, lifetime history rendering,
 * and data backup import/export.
 */
(function(window) {
  'use strict';

  window.App = window.App || {};
  window.App.Controllers = window.App.Controllers || {};

  class AboutController {
    /**
     * @param {App.HistoryModel} historyModel
     * @param {App.TaskModel} taskModel
     * @param {App.StorageService} storageService
     * @param {App.Views.AboutView} aboutView
     */
    constructor(historyModel, taskModel, storageService, aboutView) {
      this.historyModel = historyModel;
      this.taskModel = taskModel;
      this.storageService = storageService;
      this.aboutView = aboutView;

      this._bindEvents();
    }

    _bindEvents() {
      this.aboutView.bindExport(() => this.handleExport());
      this.aboutView.bindImport((file) => this.handleImport(file));
      this.aboutView.bindClearHistory(() => this.handleClearHistory());
    }

    render() {
      const history = this.historyModel.getAll();
      const count = this.historyModel.getCount();
      this.aboutView.render(history, count);
    }

    handleExport() {
      const dataStr = this.storageService.exportData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      const dateTag = new Date().toISOString().slice(0, 10);
      a.download = `downtime_tasks_backup_${dateTag}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    handleImport(file) {
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const result = this.storageService.importData(content);

        if (result.success) {
          alert('Data imported successfully!');
          this.render();
        } else {
          alert(`Failed to import data: ${result.error}`);
        }
      };
      reader.onerror = () => {
        alert('An error occurred reading the selected file.');
      };
      reader.readAsText(file);
    }

    handleClearHistory() {
      if (confirm('Are you sure you want to clear your lifetime completed tasks history? This cannot be undone.')) {
        this.historyModel.clear();
        this.render();
      }
    }
  }

  window.App.Controllers.AboutController = AboutController;
})(window);
