function may(val) {
    var value = val, tempValue = value,
        empty = function (expr) { return typeof expr === 'undefined' || expr === null; },
        or = function (oVal, nVal) { return empty(oVal) ? may(nVal) : self; },
        self = {
            value: tempValue,
            or: or.bind(self, tempValue),
            empty: function() { return empty(tempValue) ? may(true) : self; },
            pipe: function (cb) {
                var cbVal = cb(tempValue),
                    orMay = empty(cbVal) ? self : may(cbVal);
                tempValue = orMay.value;
                return orMay;
            },
            run: function(f) {
              var mapMay = self.map(f(tempValue));
              tempValue = mapMay.value;
              return mapMay;
            },
            map: function (f) { return typeof(f) === "function" ? may(f(tempValue)) : self; }
        };
    return self;
}
