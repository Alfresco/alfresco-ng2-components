"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDNav = void 0;
var MDNav = /** @class */ (function () {
    function MDNav(root, pos) {
        if (pos === void 0) { pos = 0; }
        this.root = root;
        this.pos = pos;
    }
    MDNav.prototype.find = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        if (!this.root || !this.root.children) {
            return new MDNav(null);
        }
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
    MDNav.prototype.findAll = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        if (!this.root || !this.root.children) {
            return [];
        }
        var result = [];
        var currIndex = 0;
        for (var i = this.pos; i < this.root.children.length; i++) {
            var child = this.root.children[i];
            if (test(child)) {
                if (currIndex === index) {
                    result.push(new MDNav(this.root, i));
                }
                else {
                    currIndex++;
                }
            }
        }
        return result;
    };
    MDNav.prototype.emph = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        return this.find(function (h) {
            return h.type === 'emphasis' && test(h);
        }, index);
    };
    MDNav.prototype.heading = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        return this.find(function (h) {
            return h.type === 'heading' && test(h);
        }, index);
    };
    MDNav.prototype.headings = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        return this.findAll(function (h) {
            return h.type === 'heading' && test(h);
        }, index);
    };
    MDNav.prototype.html = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        return this.find(function (h) {
            return h.type === 'html' && test(h);
        }, index);
    };
    MDNav.prototype.link = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        return this.find(function (h) {
            return h.type === 'link' && test(h);
        }, index);
    };
    MDNav.prototype.links = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        return this.findAll(function (h) {
            return h.type === 'link' && test(h);
        }, index);
    };
    MDNav.prototype.list = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        return this.find(function (h) {
            return h.type === 'list' && test(h);
        }, index);
    };
    MDNav.prototype.listItem = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        return this.find(function (h) {
            return h.type === 'listItem' && test(h);
        }, index);
    };
    MDNav.prototype.listItems = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        return this.findAll(function (h) {
            return h.type === 'listItem' && test(h);
        }, index);
    };
    MDNav.prototype.paragraph = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        return this.find(function (h) {
            return h.type === 'paragraph' && test(h);
        }, index);
    };
    MDNav.prototype.strong = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        return this.find(function (h) {
            return h.type === 'strong' && test(h);
        }, index);
    };
    MDNav.prototype.table = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        return this.find(function (h) {
            return h.type === 'table' && test(h);
        }, index);
    };
    MDNav.prototype.tableRow = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        return this.find(function (h) {
            return h.type === 'tableRow' && test(h);
        }, index);
    };
    MDNav.prototype.tableCell = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        return this.find(function (h) {
            return h.type === 'tableCell' && test(h);
        }, index);
    };
    MDNav.prototype.text = function (test, index) {
        if (test === void 0) { test = function () { return true; }; }
        if (index === void 0) { index = 0; }
        return this.find(function (h) {
            return h.type === 'text' && test(h);
        }, index);
    };
    Object.defineProperty(MDNav.prototype, "item", {
        get: function () {
            if (!this.root || !this.root.children) {
                return undefined;
            }
            else {
                return this.root.children[this.pos];
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDNav.prototype, "empty", {
        get: function () {
            return !this.root ||
                !this.root.children ||
                (this.pos >= this.root.children.length);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDNav.prototype, "childNav", {
        get: function () {
            return new MDNav(this.item);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDNav.prototype, "value", {
        get: function () {
            if (this.item && this.item['value']) {
                return this.item.value;
            }
            else {
                return '';
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDNav.prototype, "textValue", {
        get: function () {
            if (this.item) {
                if (this.item['value']) {
                    return this.item.value;
                }
                else if (this.item.children &&
                    (this.item.children.length > 0) &&
                    (this.item.children[0].type === 'text')) {
                    return this.item.children[0].value;
                }
                else {
                    return '';
                }
            }
            else {
                return '';
            }
        },
        enumerable: false,
        configurable: true
    });
    return MDNav;
}());
exports.MDNav = MDNav;
