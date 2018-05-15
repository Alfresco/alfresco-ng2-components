"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MDNav = /** @class */ (function () {
    function MDNav(root, pos) {
        if (pos === void 0) { pos = 0; }
        this.root = root;
        this.pos = pos;
    }
    MDNav.prototype.find = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        var currIndex = 0;
        for (var i = this.pos; i < this.root.children.length; i++) {
            var child = this.root.children[i];
            if (test(child)) {
                if (currIndex === index) {
                    return new MDNav(this.root, i);
                }
                else {
                    currIndex++;
                }
            }
        }
        return new MDNav(this.root, this.root.children.length);
    };
    MDNav.prototype.heading = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        return this.find(function (h) {
            return h.type === "heading" && test(h);
        }, index);
    };
    MDNav.prototype.table = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        return this.find(function (h) {
            return h.type === "table" && test(h);
        }, index);
    };
    MDNav.prototype.text = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        return this.find(function (h) {
            return h.type === "text" && test(h);
        }, index);
    };
    MDNav.prototype.tableRow = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        return this.find(function (h) {
            return h.type === "tableRow" && test(h);
        }, index);
    };
    MDNav.prototype.tableCell = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        return this.find(function (h) {
            return h.type === "tableCell" && test(h);
        }, index);
    };
    Object.defineProperty(MDNav.prototype, "item", {
        get: function () {
            return this.root.children[this.pos];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDNav.prototype, "empty", {
        get: function () {
            return !this.root ||
                !this.root.children ||
                (this.pos >= this.root.children.length);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDNav.prototype, "childNav", {
        get: function () {
            return new MDNav(this.item);
        },
        enumerable: true,
        configurable: true
    });
    return MDNav;
}());
exports.MDNav = MDNav;
