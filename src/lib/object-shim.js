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

if (!Object.values) {
    Object.values = function (obj) {
        if (obj !== Object(obj)) {
            throw new TypeError("Object.values called on a non-object");
        }
        var values = [];
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                values.push(obj[key]);
            }
        }
        return values;
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
