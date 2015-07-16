var may = require('./may.js');

var testObj2 = {
    m2: 'm2Value'
};

var testObj = {
    method1: function() { return testObj },
    method2: function() { return testObj },
    obj2: testObj2
};

//original value
var testVal = may(testObj)
    .pipe(function(item) { return 1 }) //rewrite original value
    .pipe(function(item) { return item + 12 }) // add 12 to 1 summary we have 13
    .pipe(function(item) { return item + 12 }) // again, we got 25
    .value;

console.log('test testObj.pipe() is 25 :=> ', testVal);

// for ex, we have 5 nested functions
var callbackHell = function() {
    var l4 = function() { return 'done' };
    var l3 = function() { return l4; };
    var l2 = function() { return l3; };
    return function() { return l2; };
};

//pass function
var cbHellTest = may(callbackHell)
    .run(function(callbackHell) { return callbackHell }) // call callbackHell()
    .run(function(l1) { return l1 }) // call l1()
    .run(function(l2) { return l2 }) // call l2()
    .run(function(l3) { return l3 }) // call l3()
    .run(function(l4) { return l4 }) // call l4() that results with "done"
    .value;

console.log('test cbHellTest.run() is "done" :=> ', cbHellTest);

//also we can combine calls
var testCall = may(testObj)
    .run(function(item) { return item.method1 }) // returns testObj
    .run(function(item) { return item.method2 }) // that returns testObj too
    .run(function(item) { return item.method3 }) // method does not exists, skip him
    .pipe(function(item) { return item.obj2 }) // item result of call item.method2()
    .pipe(function(item) { return item.m2 }) // item is resul of previous pipe
    .value;

//some test functions for ex
console.log('test testObj.run() is ', testObj2.m2, ' :=> ', testCall);
//if value null or undefined then return value passed to "or()"
console.log('test null.or(12) :=> ', may(null).or(12).value);
console.log('test 24.or(12) :=> ', may(24).or(12).value);
console.log('test 128.value :=> ', may(128).value);
console.log('test 128.map(x => x * 2) :=> ', may(128).map(function(val) { return val*2 }).value);
console.log('test 128.isEmpty :=> ', may(128).isEmpty);
console.log('test 128.isFunction :=> ', may(128).isFunction);
console.log('test may.isFunction :=> ', may(may).isFunction);
console.log('test "undefined".empty() :=> ', may(void 0).empty().value);
console.log('test "undefined".empty().pipe() is "undefined" :=> ', may(void 0).empty().pipe(function(val) { return val }).value);
