(function (thisObj) {// ----- EXTENDSCRIPT INCLUDES ------ //"object"!=typeof JSON&&(JSON={}),function(){"use strict";var rx_one=/^[\],:{}\s]*$/,rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rx_four=/(?:^|:|,)(?:\s*\[)+/g,rx_escapable=/[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta,rep;function f(t){return t<10?"0"+t:t}function this_value(){return this.valueOf()}function quote(t){return rx_escapable.lastIndex=0,rx_escapable.test(t)?'"'+t.replace(rx_escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var r,n,o,u,f,a=gap,i=e[t];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(t)),"function"==typeof rep&&(i=rep.call(e,t,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";if(gap+=indent,f=[],"[object Array]"===Object.prototype.toString.apply(i)){for(u=i.length,r=0;r<u;r+=1)f[r]=str(r,i)||"null";return o=0===f.length?"[]":gap?"[\n"+gap+f.join(",\n"+gap)+"\n"+a+"]":"["+f.join(",")+"]",gap=a,o}if(rep&&"object"==typeof rep)for(u=rep.length,r=0;r<u;r+=1)"string"==typeof rep[r]&&(o=str(n=rep[r],i))&&f.push(quote(n)+(gap?": ":":")+o);else for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(o=str(n,i))&&f.push(quote(n)+(gap?": ":":")+o);return o=0===f.length?"{}":gap?"{\n"+gap+f.join(",\n"+gap)+"\n"+a+"}":"{"+f.join(",")+"}",gap=a,o}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},Boolean.prototype.toJSON=this_value,Number.prototype.toJSON=this_value,String.prototype.toJSON=this_value),"function"!=typeof JSON.stringify&&(meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,r){var n;if(gap="",indent="","number"==typeof r)for(n=0;n<r;n+=1)indent+=" ";else"string"==typeof r&&(indent=r);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw new Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){var j;function walk(t,e){var r,n,o=t[e];if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(void 0!==(n=walk(o,r))?o[r]=n:delete o[r]);return reviver.call(t,e,o)}if(text=String(text),rx_dangerous.lastIndex=0,rx_dangerous.test(text)&&(text=text.replace(rx_dangerous,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();// ---------------------------------- //// ----- EXTENDSCRIPT PONYFILLS -----function __defineProperty(obj, prop, descriptor) { if (descriptor && descriptor.value !== undefined) { obj[prop] = descriptor.value; } return obj; };// ---------------------------------- //function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? __defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

var __KT_Patterns = {
  ExtendObject: function ExtendObject(obj, extension) {
    var _loop = function _loop(i) {
      if (!obj[i]) {
        if (_.isFunction(extension[i])) {
          obj[i] = function () {
            return extension[i].apply(obj, arguments);
          };
        } else {
          obj[i] = extension[i];
        }
      }
    };
    for (var i in extension) {
      _loop(i);
    }
  },
  Extend: function Extend(subClass, superClass) {
    var F = function F() {};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
  },
  Clone: function Clone(object) {
    var F = function F() {};
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
  Mixin: function Mixin(receivingClass, givingClass) {
    if (arguments[2]) {
      // Only give certain methods.
      for (var i = 2, len = arguments.length; i < len; i++) {
        receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
      }
    } else {
      // Give all methods.
      for (var methodName in givingClass.prototype) {
        if (!receivingClass.prototype[methodName]) {
          receivingClass.prototype[methodName] = givingClass.prototype[methodName];
        }
      }
    }
  },
  Interface: function Interface(name) {
    if (arguments.length < 2) {
      throw new Error("Interface constructor called with " + arguments.length + " arguments, but expected at least 2.");
    }
    var methods = _.flatten(Array.prototype.slice.call(arguments, 1));
    this.name = name;
    this.methods = [];
    for (var i = 0, len = methods.length; i < len; i++) {
      if (typeof methods[i] !== "string") {
        throw new Error("Interface constructor expects method names to be passed in as a string");
      }
      this.methods.push(methods[i]);
    }
  },
  ExtendArray: function ExtendArray(subClass) {
    // var constructorName = (/^function\s+([\w\$]+)\(/.exec( subClass.toString())[1]);
    if (!subClass.prototype.init) {
      subClass.prototype.init = function () {
        return Array.prototype.slice.call(arguments);
      };
    }
    var _subArray = function subArray() {
      var args = Array.prototype.slice.call(arguments),
        cons = subClass.prototype.init.apply(this, args),
        arr = [];
      arr.push.apply(arr, cons);
      if (_.isFunction(subClass.prototype.configure)) {
        subClass.prototype.configure.apply(arr, args);
      }
      arr.__proto__ = _subArray.prototype;

      // arr.__instanceof__ = constructorName;

      return arr;
    };
    _subArray.prototype = new Array();
    this.Mixin(_subArray, subClass);
    return _subArray;
  }
};

// Add implements to Interface
__KT_Patterns.Interface.implements = function (object) {
  if (arguments.length < 2) {
    throw new Error("Function KT.Interface.implements called with " + arguments.length + " arguments, but expected at least 2");
  }
  for (var i = 1, len = arguments.length; i < len; i++) {
    var kInterface = arguments[i];
    if (kInterface.constructor !== __KT_Patterns.Interface) {
      throw new Error("Function KT.Interface.implements expects arguments " + "two and above to be instances of Interface.");
    }
    for (var j = 0, methodsLen = kInterface.methods.length; j < methodsLen; j++) {
      var method = kInterface.methods[j];
      if (!object[method] || typeof object[method] !== "function") {
        throw new Error("Function KT.Interface.implements: object " + " does not implement the " + kInterface.name + ' interface. Method "' + method + '" was not found.');
      }
    }
  }
};
var KT_Paterns = new __KT_Patterns();

var KT = /*#__PURE__*/function () {
  function KT() {
    _defineProperty(this, "name", "KtCore");
    _defineProperty(this, "version", "1.0.0");
  }
  KT.salute = function salute() {
    var obj = {
      name: "KtCore",
      version: "1.0.0"
    };
    alert(JSON.stringify(obj));
    alert("Hello from ".concat(this.name, " "));
  };
  KT.init = function init() {
    return this.name;
  };
  KT.Module = function Module(name, module) {
    if (this[name]) {
      $.writeln("Module ".concat(name, " already exists"));
      return;
    }
    this[name] = module;
  };
  return KT;
}();
_defineProperty(KT, "patterns", KT_Paterns);

KT.init();
})(this);