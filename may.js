(function (global) {
    'use strict';

    var empty = function (expr) {
            return typeof expr === 'undefined' || expr === null;
        },
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
            or = function (oVal, nVal) {
                return empty(oVal) ? may(nVal) : self;
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
                 * @param {Function} cb
                 * @returns May
                 */
                pipe: function (cb) {
                    var cbVal = cb(tempValue),
                        orMay = empty(cbVal) ? self : may(cbVal);
                    tempValue = orMay.value;
                    return orMay;
                },
                /**
                 * Runs value from function as function
                 * @param {Function} f
                 * @returns May
                 */
                run: function (f) {
                    var mapMay = self.map(f(tempValue));
                    tempValue = mapMay.value;
                    return mapMay;
                },
                /**
                 * Map value to function
                 * @param {Function} f
                 * @returns {*}
                 */
                map: function (f) {
                    return isFunction(f) ? may(f(tempValue)) : self;
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
