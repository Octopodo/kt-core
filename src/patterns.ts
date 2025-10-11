const __KT_Patterns: any = {
    ExtendObject: function (obj: any, extension: any) {
        for (let i in extension) {
            if (!obj[i]) {
                if (typeof extension[i] === "function") {
                    obj[i] = function () {
                        return extension[i].apply(obj, arguments);
                    };
                } else {
                    obj[i] = extension[i];
                }
            }
        }
    },

    Extend: function (subClass: any, superClass: any) {
        let F: any = function () {};
        F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.constructor = subClass;
    },

    Clone: function (object: any) {
        let F: any = function () {};
        F.prototype = object;
        return new F();
    },

    /**Adds methods from one class to another
     * @function Mixin
     * @memberof KT.Core
     * @param {Constructor} receivingClass The class to augment
     * @param {Constructor} givingClass The class with the new methods
     * @param {String} methods Any number of method names to be copied
     */
    Mixin: function (receivingClass: any, givingClass: any) {
        if (arguments[2]) {
            // Only give certain methods.
            for (let i = 2, len = arguments.length; i < len; i++) {
                receivingClass.prototype[arguments[i]] =
                    givingClass.prototype[arguments[i]];
            }
        } else {
            // Give all methods.
            for (let methodName in givingClass.prototype) {
                if (!receivingClass.prototype[methodName]) {
                    receivingClass.prototype[methodName] =
                        givingClass.prototype[methodName];
                }
            }
        }
    },

    Interface: function (name: any) {
        if (arguments.length < 2) {
            throw new Error(
                "Interface constructor called with " +
                    arguments.length +
                    " arguments, but expected at least 2."
            );
        }

        function flatten(arr: any[]): any[] {
            var result: any[] = [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] instanceof Array) {
                    result = result.concat(flatten(arr[i]));
                } else {
                    result.push(arr[i]);
                }
            }
            return result;
        }
        let methods = flatten(Array.prototype.slice.call(arguments, 1));

        this.name = name;
        this.methods = [];

        for (let i = 0, len = methods.length; i < len; i++) {
            if (typeof methods[i] !== "string") {
                throw new Error(
                    "Interface constructor expects method names to be passed in as a string"
                );
            }
            this.methods.push(methods[i]);
        }
    },

    ExtendArray: function (subClass: any): Array<any> {
        // var constructorName = (/^function\s+([\w\$]+)\(/.exec( subClass.toString())[1]);
        if (!subClass.prototype.init) {
            subClass.prototype.init = function () {
                return Array.prototype.slice.call(arguments);
            };
        }
        let subArray: any = function (this: any) {
            let args = Array.prototype.slice.call(arguments),
                cons = subClass.prototype.init.apply(this, args),
                arr: any = [];
            arr.push.apply(arr, cons);
            if (typeof subClass.prototype.configure === "function") {
                subClass.prototype.configure.apply(arr, args);
            }
            arr.__proto__ = subArray.prototype;

            // arr.__instanceof__ = constructorName;

            return arr;
        };
        subArray.prototype = new Array();

        this.Mixin(subArray, subClass);

        return subArray;
    },
};

// Add implements to Interface
__KT_Patterns.Interface.implements = function (object: any) {
    if (arguments.length < 2) {
        throw new Error(
            "Function KT.Interface.implements called with " +
                arguments.length +
                " arguments, but expected at least 2"
        );
    }

    for (let i = 1, len = arguments.length; i < len; i++) {
        let kInterface = arguments[i];

        if (kInterface.constructor !== __KT_Patterns.Interface) {
            throw new Error(
                "Function KT.Interface.implements expects arguments " +
                    "two and above to be instances of Interface."
            );
        }
        for (
            let j = 0, methodsLen = kInterface.methods.length;
            j < methodsLen;
            j++
        ) {
            let method = kInterface.methods[j];
            if (!object[method] || typeof object[method] !== "function") {
                throw new Error(
                    "Function KT.Interface.implements: object " +
                        " does not implement the " +
                        kInterface.name +
                        ' interface. Method "' +
                        method +
                        '" was not found.'
                );
            }
        }
    }
};

export const KT_Paterns = __KT_Patterns;
