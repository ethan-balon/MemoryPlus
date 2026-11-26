/**
 * ManageController
 * Handles user actions on the Manage Tasks page and orchestrates updates
 * between TaskModel and ManageView.
 */
(function(window) {
  'use strict';

  window.App = window.App || {};
  window.App.Controllers = window.App.Controllers || {};

  class ManageController {
    /**
     * @param {App.TaskModel} taskModel
     * @param {App.Views.ManageView} manageView
     */
    constructor(taskModel, manageView) {
      this.taskModel = taskModel;
      this.manageView = manageView;
      this.editingTaskId = null;

      this._bindEvents();
    }

    _bindEvents() {
      this.manageView.bindAddTask((title, isRepeatable) => this.handleAddTask(title, isRepeatable));
      this.manageView.bindEditTask((id) => this.handleEditTask(id));
      this.manageView.bindSaveEditTask((id, newTitle) => this.handleSaveEditTask(id, newTitle));
      this.manageView.bindCancelEditTask(() => this.handleCancelEditTask());
      this.manageView.bindToggleRepeat((id) => this.handleToggleRepeat(id));
      this.manageView.bindDeleteTask((id) => this.handleDeleteTask(id));
    }

    render() {
      const tasks = this.taskModel.getAll();
      this.manageView.render(tasks, this.editingTaskId);
    }

    handleAddTask(title, isRepeatable) {
      const cleanTitle = (title || '').trim();
      if (!cleanTitle) {
        alert('Please enter a task title before clicking "Add task".');
        return;
      }

      this.taskModel.add(cleanTitle, isRepeatable);
      this.editingTaskId = null;
      this.render();
      this.manageView.clearInput();
    }

    handleEditTask(id) {
      this.editingTaskId = id;
      this.render();
    }

    handleSaveEditTask(id, newTitle) {
      const cleanTitle = (newTitle || '').trim();
      if (!cleanTitle) {
        alert('Task title cannot be empty.');
        return;
      }

      this.taskModel.update(id, { title: cleanTitle });
      this.editingTaskId = null;
      this.render();
    }

    handleCancelEditTask() {
      this.editingTaskId = null;
      this.render();
    }

    handleToggleRepeat(id) {
      this.taskModel.toggleRepeat(id);
      this.render();
    }

    handleDeleteTask(id) {
      const task = this.taskModel.getById(id);
      const title = task ? task.title : 'this task';
      if (confirm(`Are you sure you want to delete "${title}"?`)) {
        this.taskModel.delete(id);
        if (this.editingTaskId === id) {
          this.editingTaskId = null;
        }
        this.render();
      }
    }
  }

  window.App.Controllers.ManageController = ManageController;
})(window);
