/**
 * Application Bootstrap
 * Initializes models, views, controllers, and router.
 */
(function(window) {
  'use strict';

  window.App = window.App || {};

  class Application {
    constructor() {
      // 1. Initialize Models & Services
      this.storageService = new window.App.StorageService();
      this.taskModel = new window.App.TaskModel(this.storageService);
      this.historyModel = new window.App.HistoryModel(this.storageService);

      // 2. Initialize Views
      this.mainView = new window.App.Views.MainView('view-main');
      this.manageView = new window.App.Views.ManageView('view-manage');
      this.aboutView = new window.App.Views.AboutView('view-about');

      // 3. Initialize Controllers
      this.mainController = new window.App.Controllers.MainController(
        this.taskModel, 
        this.historyModel, 
        this.mainView
      );
      this.manageController = new window.App.Controllers.ManageController(
        this.taskModel, 
        this.manageView
      );
      this.aboutController = new window.App.Controllers.AboutController(
        this.historyModel,
        this.taskModel,
        this.storageService,
        this.aboutView
      );

      // 4. Initialize Router
      this.router = new window.App.Router();

      // 5. Cache view container DOM references
      this.views = {
        main: document.getElementById('view-main'),
        manage: document.getElementById('view-manage'),
        about: document.getElementById('view-about')
      };
    }

    init() {
      // Register routes and connect them to container visibility & controller renders
      this.router.addRoute('main', () => {
        this.switchView('main');
        this.mainController.render();
      });

      this.router.addRoute('manage', () => {
        this.switchView('manage');
        this.manageController.render();
      });

      this.router.addRoute('about', () => {
        this.switchView('about');
        this.aboutController.render();
      });

      console.log('[App] Application initialized. All Controllers, Views, and Router active.');
    }

    /**
     * Show the target view container and hide all other view containers
     * @param {string} viewName - 'main' | 'manage' | 'about'
     */
    switchView(viewName) {
      Object.keys(this.views).forEach(key => {
        const container = this.views[key];
        if (container) {
          container.style.display = (key === viewName) ? 'block' : 'none';
        }
      });
      console.log(`[App] Active view: ${viewName}`);
    }
  }

  window.App.Application = Application;

  // Initialize once DOM is completely loaded
  document.addEventListener('DOMContentLoaded', () => {
    window.appInstance = new Application();
    window.appInstance.init();
  });
})(window);
