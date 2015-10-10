var assert = require('assert');
var may = require('../may.js');

describe('May', () => {
    var testObj2, testObj, callbackHell;

    before(() => {
        testObj2 = {
            m2: 'm2Value'
        };

        testObj = {
            method1: () =>  testObj,
            method2: () => testObj,
            obj2: testObj2
        };

        callbackHell = () => {
            var l4 = () => 'done';
            var l3 = () => l4;
            var l2 = () => l3;

            return () => l2;
        }
    });

    it('test may("someval") as string', () => {
        assert.ok(String(may('someval')) === 'someval');
    });

    it('test may(12) as number', () => {
        assert.ok(Number(may(12)) === 12);
    });

    it('test cbHellTest.run() is "done"', () => {
        var cbHellTest = may(callbackHell)
            .run(callbackHell => callbackHell) // call callbackHell()
            .run(l1 => l1) // call l1()
            .run(l2 => l2) // call l2()
            .run(l3 => l3) // call l3()
            .run(l4 => l4) // call l4() that results with "done"
            .value;

        assert.ok(cbHellTest === 'done');
    });

    it('test pipe() with testObj and return value 25', () => {
        var value = may(testObj)
            .pipe(item => 1) //rewrite original value
            .pipe(item => item + 12) // add 12 to 1 summary we have 13
            .pipe(item => item + 12) // again, we got 25
            .value;

        assert.ok(value === 25, 'is 25');
    });

    it('test testObj.run()', () => {
        var testCall = may(testObj)
            .run(testObj => testObj.method1) // returns testObj
            .run(testObj => testObj.method2) // that returns testObj too
            .run(testObj => testObj.method3) // method does not exists, skip him
            .pipe(testObj => testObj.obj2) // item result of call item.method2()
            .pipe(obj2 => obj2.m2) // item is result of previous pipe
            .value;

        assert.ok(testObj2.m2 === testCall)
    });

    it('test null.or(12)', () => {
        assert.ok(may(null).or(12).value === 12, 'is 12');
    });

    it('test 24.or(12)', () => {
        assert.ok(may(24).or(12).value === 24, 'is 24');
    });

    it('test 128.value', () => {
        assert.ok(may(128).value === 128, 'is 128');
    });

    it('test 128.map(x => x * 2)', () => {
        assert.ok(may(128).map(x => x * 2).value === 256);
    });

    it('test 128.isEmpty', () => {
        assert.ok(may(128).isEmpty === false);
    });

    it('128.isFunction', () => {
        assert.ok(may(128).isFunction === false);
    });

    it('test may.isFunction', () => {
        assert.ok(may(may).isFunction === true);
    });

    it('test "undefined".empty()', () => {
        assert.ok(may(void 0).isEmpty === true);
    });

    it('test "undefined".empty().pipe() is "undefined"', () => {
        assert.ok(may(void 0).empty().pipe(val => val).value === true);
    });
});