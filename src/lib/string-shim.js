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

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (search, pos) {
        return (
            this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search
        );
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (search, this_len) {
        if (this_len === undefined || this_len > this.length) {
            this_len = this.length;
        }
        return this.substring(this_len - search.length, this_len) === search;
    };
}
