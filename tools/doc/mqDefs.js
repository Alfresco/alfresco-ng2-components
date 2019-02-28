"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
export namespace MQ {
    export class Node {
        constructor(private data: UNIST.Node) {}

        type(): string { return this.data.type };
    }

    export class Parent {
        constructor(private data: UNIST.Parent) {}

        children(): Node[] { return this.data.children.map(x => new Node(x)) }
    }
}
*/
var MQNode = /** @class */ (function () {
    function MQNode(orig) {
        this.orig = orig;
    }
    MQNode.prototype.type = function () {
        return this.orig.type;
    };
    MQNode.prototype.depth = function () {
        return this.orig['depth'] || null;
    };
    MQNode.prototype.lang = function () {
        return this.orig['lang'] || null;
    };
    MQNode.prototype.ordered = function () {
        return this.orig['ordered'] || null;
    };
    MQNode.prototype.start = function () {
        return this.orig['start'] || null;
    };
    MQNode.prototype.loose = function () {
        return this.orig['loose'] || null;
    };
    MQNode.prototype.align = function () {
        return this.orig['align'] || null;
    };
    MQNode.prototype.title = function () {
        return this.orig['title'] || null;
    };
    MQNode.prototype.url = function () {
        return this.orig['title'] || null;
    };
    MQNode.prototype.children = function () {
        if (this.orig['children']) {
            return this.orig['children'].map(function (x) { return new MQNode(x); });
        }
        else {
            return null;
        }
    };
    return MQNode;
}());
exports.MQNode = MQNode;
