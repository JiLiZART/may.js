(function (global) {
    'use strict';

    /**
     * Checks if given argument null or undef
     * @param expr
     * @returns {Boolean}
     */
    var empty = function (expr) {
            return typeof expr === 'undefined' || expr === null;
        },

        /**
         * Checks if given argument a function
         * @param f
         * @returns {Boolean}
         */
        isFunction = function (f) {
            return typeof(f) === "function"
        };

    /**
     * @typedef {Function} May
     * @property {Function} or
     * @property {Function} empty
     * @property {Function} pipe
     * @property {Function} run
     * @property {Function} map
     */

    /**
     * Monad like function
     * @param {*} val
     * @returns May
     */
    function may(val) {
        var tempValue = val,

            /**
             * Checks old value and returns May instance if empty
             * @param oldValue
             * @param newValue
             * @returns May
             */
            or = function (oldValue, newValue) {
                return empty(oldValue) ? may(newValue) : self;
            },

            /**
             * @type May
             */
            self = {
                /**
                 * Value itself
                 */
                value: tempValue,

                /**
                 * Checked is empty value
                 * @var boolean
                 */
                isEmpty: empty(tempValue),

                /**
                 * Checked is function value
                 * @var boolean
                 */
                isFunction: isFunction(tempValue),

                /**
                 * Sets new value if old is empty
                 * @param {*} newValue
                 * @returns May
                 */
                or: or.bind(self, tempValue),

                /**
                 * @returns May
                 */
                empty: function () {
                    return empty(tempValue) ? may(true) : may(false);
                },

                /**
                 * @param {Function} callback
                 * @returns May
                 */
                pipe: function (callback) {
                    var cbVal = callback(tempValue),
                        orMay = empty(cbVal) ? self : may(cbVal);

                    tempValue = orMay.value;

                    return orMay;
                },

                /**
                 * Runs value from function as function
                 * @param {Function} func
                 * @returns May
                 */
                run: function (func) {
                    var mapMay = self.map(func(tempValue));

                    tempValue = mapMay.value;

                    return mapMay;
                },

                /**
                 * Map value to function
                 * @param {Function} func
                 * @returns {*}
                 */
                map: function (func) {
                    return isFunction(func) ? may(func(tempValue)) : self;
                },

                /**
                 * Proxy passed value toString function
                 * @returns {*}
                 */
                toString: function () {
                    return self.value.toString ? self.value.toString() : self.value;
                }
            };

        return self;
    }

    var defineAsGlobal = true;

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = may;
        defineAsGlobal = false;
    }

    if (typeof modules === 'object' && isFunction(modules.define)) {
        modules.define('may', function (provide) {
            provide(may);
        });
        defineAsGlobal = false;
    }

    if (typeof define === "function") {
        define(function (require, exports, module) {
            module.exports = may;
        });
        defineAsGlobal = false;
    }

    defineAsGlobal && (global.may = may);
})(this);
