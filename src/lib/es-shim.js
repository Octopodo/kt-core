var dummyVar = 1; // Evita que Babel marque el archivo como módulo

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

if (!Object.keys) {
    Object.keys = function (obj) {
        if (obj !== Object(obj)) {
            throw new TypeError("Object.keys called on a non-object");
        }
        var keys = [];
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                keys.push(key);
            }
        }
        return keys;
    };
}

if (!Object.getOwnPropertyDescriptor) {
    Object.getOwnPropertyDescriptor = function (obj, prop) {
        if (obj !== Object(obj)) {
            throw new TypeError(
                "Object.getOwnPropertyDescriptor called on a non-object"
            );
        }
        if (!(prop in obj)) {
            return undefined; // Prop no existe
        }
        // Asume descriptor de datos (no accessors en ES3)
        var isEnumerable = obj.propertyIsEnumerable(prop);
        var isWritable = true; // Default; chequea con try-catch
        var value = obj[prop];
        try {
            obj[prop] = value; // Intenta reasignar (si falla, no writable)
            isWritable = true;
        } catch (e) {
            isWritable = false;
        }
        return {
            value: value,
            writable: isWritable,
            enumerable: isEnumerable,
            configurable: true, // Asume configurable en ES3
        };
    };
}

if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        if (typeof start !== "number") {
            start = 0;
        }
        return this.indexOf(search, start) !== -1;
    };
}

if (!String.prototype.toLowerCase) {
    String.prototype.toLowerCase = function () {
        return this.replace(/[A-Z]/g, function (c) {
            return String.fromCharCode(c.charCodeAt(0) + 32);
        });
    };
}

if (!String.prototype.toUpperCase) {
    String.prototype.toUpperCase = function () {
        return this.replace(/[a-z]/g, function (c) {
            return String.fromCharCode(c.charCodeAt(0) - 32);
        });
    };
}
