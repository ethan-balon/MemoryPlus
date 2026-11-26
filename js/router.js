/**
 * Router
 * Client-side hash-based router (#main, #manage, #about).
 * Triggers registered view handlers and handles default/fallback routing.
 */
(function(window) {
  'use strict';

  window.App = window.App || {};

  class Router {
    constructor() {
      this.routes = {};
      this.currentRoute = null;

      window.addEventListener('hashchange', () => this._handleRouteChange());
      window.addEventListener('load', () => this._handleRouteChange());
    }

    /**
     * Register a route path and its callback
     * @param {string} path - e.g. 'main', 'manage', 'about'
     * @param {Function} handler - callback invoked when route matches
     */
    addRoute(path, handler) {
      const cleanPath = path.replace(/^[#/]+/, '');
      this.routes[cleanPath] = handler;
      return this;
    }

    /**
     * Navigate to a route programmatically
     * @param {string} path
     */
    navigate(path) {
      const cleanPath = path.replace(/^[#/]+/, '');
      window.location.hash = `#${cleanPath}`;
    }

    /**
     * Get current active route name
     * @returns {string|null}
     */
    getCurrentRoute() {
      return this.currentRoute;
    }

    _handleRouteChange() {
      let hash = window.location.hash.replace(/^[#/]+/, '').trim();
      
      // Default to 'main' if no hash provided
      if (!hash) {
        this.navigate('main');
        return;
      }

      if (this.routes[hash]) {
        this.currentRoute = hash;
        this.routes[hash]();
      } else {
        // Fallback to 'main' if route is not recognized
        console.warn(`[Router] Unrecognized route "#${hash}", redirecting to "#main"`);
        this.navigate('main');
      }
    }
  }

  window.App.Router = Router;
})(window);
