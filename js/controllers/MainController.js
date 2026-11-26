/**
 * MainController
 * Orchestrates the Main Page random task generation, task switching,
 * and completion tracking.
 */
(function(window) {
  'use strict';

  window.App = window.App || {};
  window.App.Controllers = window.App.Controllers || {};

  class MainController {
    /**
     * @param {App.TaskModel} taskModel
     * @param {App.HistoryModel} historyModel
     * @param {App.Views.MainView} mainView
     */
    constructor(taskModel, historyModel, mainView) {
      this.taskModel = taskModel;
      this.historyModel = historyModel;
      this.mainView = mainView;

      this.currentTask = null;
      this.rendered = false;

      this._bindEvents();
    }

    _bindEvents() {
      this.mainView.bindFetchTask(() => this.handleFetchTask());
      this.mainView.bindMarkDone(() => this.handleMarkDone());
    }

    render() {
      if (!this.rendered) {
        this.mainView.render();
        this.rendered = true;
      }
    }

    handleFetchTask() {
      // Pick random task, excluding current task ID to avoid immediate repeat if > 1 tasks exist
      const excludeId = this.currentTask ? this.currentTask.id : null;
      const task = this.taskModel.getRandom(excludeId);

      if (!task) {
        this.currentTask = null;
        this.mainView.displayNoTasks('No tasks available in database.');
        return;
      }

      this.currentTask = task;
      this.mainView.displayTask(task);
    }

    handleMarkDone() {
      if (!this.currentTask) return;

      const completedTask = this.currentTask;

      // 1. Record into lifetime completed history
      this.historyModel.recordCompletion(completedTask);

      // 2. If task is not repeatable, delete it from active pool
      if (!completedTask.isRepeatable) {
        this.taskModel.delete(completedTask.id);
      }

      // 3. Update view
      this.mainView.displayTaskCompleted(completedTask.title, completedTask.isRepeatable);

      // 4. Reset current active selection
      this.currentTask = null;
    }
  }

  window.App.Controllers.MainController = MainController;
})(window);
