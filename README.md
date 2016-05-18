# may.js
Very small monad like function in pure js

```js
//test data
var testObj2 = {
  m2: 'm2Value'
}

var testObj = {
  method1: () => testObj,
  method2: () => testObj,
  obj2: testObj2
}

//original value
var testVal = may(testObj)
  .pipe((obj) => 1) //rewrite original value
  .pipe((val) => val + 12) // add 12 to 1 summary we have 13
  .pipe((val) => val + 12) // again, we got 25
  .value

console.log('test testObj.pipe() is 25 :=> ', testVal);

// for ex, we have 5 nested functions
var callbackHell = () => {
  var l4 = () => 'done';
  var l3 = () => l4;
  var l2 = () => l3;
  var l1 = () => l2;
  
  return l1;
}

//pass function
var cbHellTest = may(callbackHell)
  .run((callbackHell) => callbackHell) // call callbackHell()
  .run((l1) => l1) // call l1()
  .run((l2) => l2) // call l2()
  .run((l3) => l3) // call l3()
  .run((l4) => l4) // call l4() that results with "done"
  .value;

console.log('test cbHellTest.run() is "done" :=> ', cbHellTest);

//also we can combine calls
var testCall = may(testObj)
  .run((item) => item.method1) // returns testObj
  .run((item) => item.method2) // that returns testObj too
  .run((item) => item.method3) // method does not exists, skip him
  .pipe((item) => item.obj2) // item result of call item.method2()
  .pipe((item) => item.m2) // item is resul of previous pipe
  .value

//some test functions for ex
console.log('test testObj.run() is ', testObj2.m2, ' :=> ', testCall);
//if value null or undefined then return value passed to "or()"
console.log('test null.or(12) :=> ', may(null).or(12).value);
console.log('test 24.or(12) :=> ', may(24).or(12).value);
console.log('test 128.value :=> ', may(128).value);
console.log('test 128.map(x => x * 2) :=> ', may(128).map((val) => val*2).value);
console.log('test "undefined".empty() :=> ', may(void 0).empty().value);
console.log('test "undefined".empty().pipe() is "undefined" :=> ', may(void 0).empty().pipe((val) => val).value);
```
