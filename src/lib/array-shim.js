if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback, thisArg) {
        if (this == null) {
            throw new TypeError(
                "Array.prototype.forEach called on null or undefined"
            );
        }
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }
        var arr = Object(this); // Coerción segura
        var len = arr.length >>> 0; // Unsigned right shift para longitud
        for (var i = 0; i < len; i++) {
            if (i in arr) {
                // Chequea si la propiedad existe (para arrays sparse)
                callback.call(thisArg, arr[i], i, arr);
            }
        }
    };
}

if (!Array.prototype.filter) {
    Array.prototype.filter = function (callback, thisArg) {
        if (this == null) {
            throw new TypeError(
                "Array.prototype.filter called on null or undefined"
            );
        }
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }
        var arr = Object(this);
        var len = arr.length >>> 0;
        var result = [];
        for (var i = 0; i < len; i++) {
            if (i in arr) {
                if (callback.call(thisArg, arr[i], i, arr)) {
                    result.push(arr[i]);
                }
            }
        }
        return result;
    };
}

if (!Array.prototype.map) {
    Array.prototype.map = function (callback, thisArg) {
        if (this == null) {
            throw new TypeError(
                "Array.prototype.map called on null or undefined"
            );
        }
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }
        var arr = Object(this);
        var len = arr.length >>> 0;
        var result = new Array(len);
        for (var i = 0; i < len; i++) {
            if (i in arr) {
                result[i] = callback.call(thisArg, arr[i], i, arr);
            }
        }
        return result;
    };
}
if (!Array.prototype.find) {
    Array.prototype.find = function (predicate, thisArg) {
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }
        var o = Object(this);
        var len = o.length >>> 0;
        if (typeof predicate !== "function") {
            throw new TypeError("predicate must be a function");
        }
        var k = 0;
        while (k < len) {
            var kValue = o[k];
            if (predicate.call(thisArg, kValue, k, o)) {
                return kValue;
            }
            k++;
        }
        return undefined;
    };
}
if (!Array.prototype.includes) {
    Array.prototype.includes = function (searchElement, fromIndex) {
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }
        var o = Object(this);
        var len = o.length >>> 0;
        if (len === 0) {
            return false;
        }
        var n = fromIndex | 0;
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while (k < len) {
            if (o[k] === searchElement) {
                return true;
            }
            k++;
        }
        return false;
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }
        var o = Object(this);
        var len = o.length >>> 0;
        var n = fromIndex | 0;
        if (len === 0) {
            return -1;
        }
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in o && o[k] === searchElement) {
                return k;
            }
        }
        return -1;
    };
}

if (!Array.prototype.every) {
    Array.prototype.every = function (callback, thisArg) {
        if (this == null) {
            throw new TypeError(
                "Array.prototype.every called on null or undefined"
            );
        }
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }
        var arr = Object(this);
        var len = arr.length >>> 0;
        for (var i = 0; i < len; i++) {
            if (i in arr) {
                if (!callback.call(thisArg, arr[i], i, arr)) {
                    return false;
                }
            }
        }
        return true;
    };
}

if (!Array.prototype.some) {
    Array.prototype.some = function (callback, thisArg) {
        if (this == null) {
            throw new TypeError(
                "Array.prototype.some called on null or undefined"
            );
        }
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }
        var arr = Object(this);
        var len = arr.length >>> 0;
        for (var i = 0; i < len; i++) {
            if (i in arr) {
                if (callback.call(thisArg, arr[i], i, arr)) {
                    return true;
                }
            }
        }
        return false;
    };
}

if (!Array.from) {
    Array.from = function (iterable) {
        if (iterable == null) {
            throw new TypeError(
                "Array.from requires an array-like object - not null or undefined"
            );
        }
        var result = [];
        for (var i = 0; i < iterable.length; i++) {
            result.push(iterable[i]);
        }
        return result;
    };
}

if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === "[object Array]";
    };
}
