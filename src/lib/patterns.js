if(!this.KT) var KT = {};
if(!KT) KT = {};

KT.ExtendObject = function (obj, extension) {
for (var i in extension) {
    if (!obj[i]) {
    if (_.isFunction(extension[i])) {
        obj[i] = function () {
        return extension[i].apply(obj, arguments);
        };
    } else {
        obj[i] = extension[i];
    }
    }
}
};

KT.Extend = function (subClass, superClass) {
var F = function () {};
F.prototype = superClass.prototype;
subClass.prototype = new F();
subClass.prototype.constructor = subClass;
};

KT.Clone = function (object) {
function F() {}
F.prototype = object;
return new F();
};

/**Adds methods from one class to anothe
 * @function Mixin
 * @memberof KT.Core
 * @param {Constructor} recievingClass The class to augment
 * @param {Constructor} givingClass The class with the new methods
 * @param {String} methods Any number of method names to be copied
 */
KT.Mixin = function (receivingClass, givingClass) {
if (arguments[2]) {
    // Only give certain methods.
    for (var i = 2, len = arguments.length; i < len; i++) {
    receivingClass.prototype[arguments[i]] =
        givingClass.prototype[arguments[i]];
    }
} else {
    // Give all methods.
    for (methodName in givingClass.prototype) {
    if (!receivingClass.prototype[methodName]) {
        receivingClass.prototype[methodName] =
        givingClass.prototype[methodName];
    }
    }
}
};

KT.Interface = function (name) {
if (arguments.length < 2) {
    throw new Error(
    "Interface constructor called with " +
        arguments.length +
        " arguments, but expected at least 2.",
    );
}

var methods = _.flatten(Array.prototype.slice.call(arguments, 1));

this.name = name;
this.methods = [];

for (var i = 0, len = methods.length; i < len; i++) {
    if (typeof methods[i] !== "string") {
    throw new Error(
        "Interface constructor expects method names to be passed in as a string",
    );
    }
    this.methods.push(methods[i]);
}
};

KT.Interface.implements = function (object) {
if (arguments.length < 2) {
    throw new Error(
    "Function KT.Interface.implements called with " +
        arguments.length +
        " arguments, but expected at least 2",
    );
}

for (var i = 1, len = arguments.length; i < len; i++) {
    var kInterface = arguments[i];

    if (kInterface.constructor !== KT.Interface) {
    throw new Error(
        "Function KT.Interface.implements expects arguments " +
        "two and above to be instances of Interface.",
    );
    }
    for (
    var j = 0, methodsLen = kInterface.methods.length;
    j < methodsLen;
    j++
    ) {
    var method = kInterface.methods[j];
    if (!object[method] || typeof object[method] !== "function") {
        throw new Error(
        "Function KT.Interface.implements: object " +
            " does not implement the " +
            kInterface.name +
            ' interface. Method "' +
            method +
            '" was not found.',
        );
    }
    }
}
};

KT.ExtendArray = function (subClass) {
// var constructorName = (/^function\s+([\w\$]+)\(/.exec( subClass.toString())[1]);
if (!subClass.prototype.init) {
    subClass.prototype.init = function () {
    return Array.prototype.slice.call(arguments);
    };
}
function subArray() {
    var args = Array.prototype.slice.call(arguments),
    cons = subClass.prototype.init.apply(this, args),
    arr = [];
    arr.push.apply(arr, cons);
    if (_.isFunction(subClass.prototype.configure)) {
    subClass.prototype.configure.apply(arr, args);
    }
    arr.__proto__ = subArray.prototype;

    // arr.__instanceof__ = constructorName;

    return arr;
}
subArray.prototype = new Array();

KT.Mixin(subArray, subClass);

return subArray;
};

