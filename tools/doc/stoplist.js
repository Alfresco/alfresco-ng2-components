"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stoplist = void 0;
var fs = require("fs");
/* "Stoplist" of regular expressions to match against strings. */
var Stoplist = /** @class */ (function () {
    function Stoplist(slFilePath) {
        var listExpressions = JSON.parse(fs.readFileSync(slFilePath, 'utf8'));
        this.regexes = [];
        if (listExpressions) {
            for (var i = 0; i < listExpressions.length; i++) {
                this.regexes.push(new RegExp(listExpressions[i]));
            }
        }
        else {
            this.regexes = [];
        }
    }
    // Check if an item is covered by the stoplist and reject it if so.
    Stoplist.prototype.isRejected = function (itemName) {
        for (var i = 0; i < this.regexes.length; i++) {
            if (this.regexes[i].test(itemName)) {
                return true;
            }
        }
        return false;
    };
    return Stoplist;
}());
exports.Stoplist = Stoplist;
