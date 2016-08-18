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

    constructor(location) {
        if (!(location instanceof Location)) {
            throw new Jii.exceptions.InvalidConfigException('Location is not instanceof class browser Location.');
        }
        this._location = Jii._.clone(location);

        this.init();
    },

    getMethod() {
        return 'GET';
    },

    /**
     * Return if the request is sent via secure channel (https).
     * @return {boolean} If the request is sent via secure channel (https)
     */
    isSecureConnection() {
        return this._location.protocol === 'https:';
    },

    /**
     * Returns the server name.
     * @return {string} Server name
     */
    getServerName() {
        return this._location.hostname;
    },

    /**
     * Returns the server port number.
     * @return {number} Server port number
     */
    getServerPort() {
        return this._location.port || 80;
    },

    /**
     * Returns the URL referrer, null if not present
     * @return string URL referrer, null if not present
     */
    getReferrer() {
        return document.referrer;
    },

    /**
     * Returns the user agent, null if not present.
     * @return string user agent, null if not present
     */
    getUserAgent() {
        return navigator.userAgent;
    },

    /**
     * Parsing query string to key-value object
     * @see http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
     * @returns {object}
     * @private
     */
    _parseParams() {
        var spaceRegexp = /\+/g;  // Regex for replacing addition symbol with a space
        var searchRegexp = /([^&=]+)=?([^&]*)/g;
        var query  = this._location.search.substring(1);
        var decode = (s) => {
            return decodeURIComponent(s.replace(spaceRegexp, " "));
        };

        var match;
        var urlParams = {};
        while (match = searchRegexp.exec(query)) {
            urlParams[decode(match[1])] = decode(match[2]);
        }

        return urlParams;
    },

    _parsePathInfo() {
        return Jii._s.trim(this._location.pathname, '/');
    }

});