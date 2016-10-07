/**
 *
 * @author Vladimir Kozhin <affka@affka.ru>
 * @license MIT
 */

'use strict';

var Jii = require('jii');
var BaseResponse = require('jii/base/Response');

/**
 * @class Jii.clientRouter.Response
 * @extends Jii.base.Response
 */
var Response = Jii.defineClass('Jii.clientRouter.Response', /** @lends Jii.clientRouter.Response.prototype */{

	__extends: BaseResponse


});

module.exports = Response;