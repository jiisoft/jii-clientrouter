/**
 *
 * @author Vladimir Kozhin <affka@affka.ru>
 * @license MIT
 */

'use strict';

/**
 * @namespace Jii
 * @ignore
 */
var Jii = require('jii');

/**
 * @class Jii.clientRouter.Router
 * @extends Jii.base.Component
 */
Jii.defineClass('Jii.clientRouter.Router', /** @lends Jii.clientRouter.Router.prototype */{

	__extends: Jii.base.Component,

    __static: /** @lends Jii.clientRouter.Router */{

        MODE_PUSH_STATE: 'push_state',
        MODE_HASH: 'hash'

    },

    /**
     * @type {Jii.controller.UrlManager|string}
     */
    urlManager: 'urlManager',

    mode: null,

    _bindRouteFunction: null,

    init: function () {
        this._bindRouteFunction = this._onRoute.bind(this);

        if (Jii._.isString(this.urlManager)) {
            this.urlManager = Jii.app.getComponent(this.urlManager);
        }
        if (this.mode === null) {
            this.mode = window.history && window.history.pushState ?
                this.__static.MODE_PUSH_STATE :
                this.__static.MODE_HASH;
        }
    },

    start: function () {
        switch(this.mode) {
            case this.__static.MODE_PUSH_STATE:
                window.addEventListener('popstate', this._bindRouteFunction, false);
                break;

            case this.__static.MODE_HASH:
                if (window.addEventListener) {
                    window.addEventListener("hashchange", this._bindRouteFunction, false);
                } else if (window.attachEvent) {
                    window.attachEvent("onhashchange", this._bindRouteFunction);
                }
                break;
        }

        // Run
        setTimeout(this._bindRouteFunction);
    },

    stop: function () {
        switch(this.mode) {
            case this.__static.MODE_PUSH_STATE:
                window.removeEventListener('popstate', this._bindRouteFunction);
                break;

            case this.__static.MODE_HASH:
                if (window.removeEventListener) {
                    window.removeEventListener("hashchange", this._bindRouteFunction, false);
                } else if (window.attachEvent) {
                    window.detachEvent("onhashchange", this._bindRouteFunction);
                }
                break;
        }
    },

    createUrl: function(route, params) {
        var url = this.urlManager.createUrl(route, params);

        switch(this.mode) {
            case this.__static.MODE_HASH:
                url = '/' + this.urlManager.getBaseUrl() + '#' + url;
                break;
        }

        return url;
    },

    _getHash: function () {
        var match = window.location.href.match(/#(.*)$/);
        return match && match[1] ? match[1] : '';
    },

    _onRoute: function () {
        switch(this.mode) {
            case this.__static.MODE_PUSH_STATE:
                if (location.hash) {
                    history.replaceState({}, '', location.hash.substr(1));
                }
                break;

            case this.__static.MODE_HASH:
                break;
        }

        var request = new Jii.clientRouter.Request(location);
        var result = this.urlManager.parseRequest(request);
        if (result !== false) {
            var route = result[0];
            var params = result[1];

            // Append parsed params to request
            var queryParams = request.getQueryParams();
            request.setQueryParams(Jii._.extend(queryParams, params));

            var context = Jii.createContext();
            context.setComponent('request', request);
            context.setComponent('response', new Jii.clientRouter.Response());

            Jii.app.runAction(route, context);
        }
    }

});