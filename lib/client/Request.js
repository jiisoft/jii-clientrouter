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
 * @class Jii.clientRouter.Request
 * @extends Jii.base.HttpRequest
 */
Jii.defineClass('Jii.clientRouter.Request', /** @lends Jii.clientRouter.Request.prototype */{

	__extends: 'Jii.base.HttpRequest',

    constructor: function(location) {
        if (!(location instanceof Location)) {
            throw new Jii.exceptions.InvalidConfigException('Location is not instanceof class browser Location.');
        }
        this._location = Jii._.clone(location);

        this.init();
    },

    getMethod: function() {
        return 'GET';
    },

    /**
     * Return if the request is sent via secure channel (https).
     * @return {boolean} If the request is sent via secure channel (https)
     */
    isSecureConnection: function() {
        return this._location.protocol === 'https:';
    },

    /**
     * Returns the server name.
     * @return {string} Server name
     */
    getServerName: function() {
        return this._location.hostname;
    },

    /**
     * Returns the server port number.
     * @return {number} Server port number
     */
    getServerPort: function() {
        return this._location.port || 80;
    },

    /**
     * Returns the URL referrer, null if not present
     * @return string URL referrer, null if not present
     */
    getReferrer: function() {
        return document.referrer;
    },

    /**
     * Returns the user agent, null if not present.
     * @return string user agent, null if not present
     */
    getUserAgent: function() {
        return navigator.userAgent;
    },

    /**
     * Parsing query string to key-value object
     * @see http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
     * @returns {object}
     * @private
     */
    _parseParams: function() {
        var spaceRegexp = /\+/g;  // Regex for replacing addition symbol with a space
        var searchRegexp = /([^&=]+)=?([^&]*)/g;
        var query  = this._location.search.substring(1);
        var decode = function (s) {
            return decodeURIComponent(s.replace(spaceRegexp, " "));
        };

        var match;
        var urlParams = {};
        while (match = searchRegexp.exec(query)) {
            urlParams[decode(match[1])] = decode(match[2]);
        }

        return urlParams;
    },

    _parsePathInfo: function() {
        return Jii._s.ltrim(this._location.pathname, '/');
    }

});