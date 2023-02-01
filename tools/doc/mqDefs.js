"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Docset = exports.Text = exports.Link = exports.Paragraph = exports.Heading = exports.Root = exports.Parent = exports.Node = exports.schema = void 0;
var mdToString = require("mdast-util-to-string");
var jsyaml = require("js-yaml");
exports.schema = "\n    type Query {\n        documents(idFilter: String = \"\"): [Root]\n    }\n\n    type Root {\n        id: ID\n        type: String\n        folder(depth: Int = 1): String\n        metadata(key: String): String\n        heading(depth: Int = 0): Heading\n        headings(depth: Int = 0): [Heading]\n        paragraph: Paragraph\n        paragraphs: [Paragraph]\n        link: Link\n        links: [Link]\n        text: Text\n        texts: [Text]\n        children: [Node]\n    }\n\n    type Heading {\n        depth: Int\n        plaintext: String\n        paragraph: Paragraph\n        paragraphs: [Paragraph]\n        link: Link\n        links: [Link]\n        children: [Node]\n    }\n\n    type Paragraph {\n        plaintext: String\n    }\n\n    type Link {\n        plaintext: String\n        title: String\n        url: String\n        paragraph: Paragraph\n        paragraphs: [Paragraph]\n        text: Text\n        texts: [Text]\n    }\n\n    type Text {\n        value: String\n    }\n\n    type Node {\n        type: String\n        children: [Node]\n    }\n";
var Node = /** @class */ (function () {
    function Node(orig) {
        this.orig = orig;
    }
    Node.prototype.type = function () {
        return this.orig.type;
    };
    Node.prototype.depth = function () {
        return this.orig['depth'] || null;
    };
    Node.prototype.lang = function () {
        return this.orig['lang'] || null;
    };
    Node.prototype.ordered = function () {
        return this.orig['ordered'] || null;
    };
    Node.prototype.start = function () {
        return this.orig['start'] || null;
    };
    Node.prototype.loose = function () {
        return this.orig['loose'] || null;
    };
    Node.prototype.align = function () {
        return this.orig['align'] || null;
    };
    Node.prototype.title = function () {
        return this.orig['title'] || null;
    };
    Node.prototype.url = function () {
        return this.orig['title'] || null;
    };
    Node.prototype.children = function () {
        if (this.orig['children']) {
            return this.orig['children'].map(function (x) { return new Node(x); });
        }
        else {
            return null;
        }
    };
    return Node;
}());
exports.Node = Node;
var Parent = /** @class */ (function () {
    function Parent(orig) {
        this.orig = orig;
    }
    Parent.prototype.plaintext = function () {
        return mdToString(this.orig);
    };
    Parent.prototype.paragraph = function () {
        return new Paragraph(this.orig.children.find(function (ch) { return (ch.type === 'paragraph'); }));
    };
    Parent.prototype.paragraphs = function () {
        return this.orig.children.filter(function (ch) {
            return (ch.type === 'paragraph');
        })
            .map(function (ch) { return new Paragraph(ch); });
    };
    Parent.prototype.link = function () {
        return new Link(this.orig.children.find(function (ch) { return (ch.type === 'link'); }));
    };
    Parent.prototype.links = function () {
        return this.orig.children.filter(function (ch) {
            return (ch.type === 'link');
        })
            .map(function (ch) { return new Link(ch); });
    };
    Parent.prototype.text = function () {
        return new Text(this.orig.children.find(function (ch) { return (ch.type === 'text'); }));
    };
    Parent.prototype.texts = function () {
        return this.orig.children.filter(function (ch) {
            return (ch.type === 'text');
        })
            .map(function (ch) { return new Text(ch); });
    };
    return Parent;
}());
exports.Parent = Parent;
var Root = /** @class */ (function (_super) {
    __extends(Root, _super);
    function Root() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Root.prototype.type = function () {
        return 'root';
    };
    Root.prototype.folder = function (args) {
        var depth = args['depth'];
        var relPath = this.id.substring(this.id.indexOf('docs'));
        var pathSegments = relPath.split(/[\\\/]/);
        return pathSegments[depth];
    };
    Root.prototype.metadata = function (args) {
        if (!this._meta) {
            var yamlElement = this.orig.children.find(function (ch) { return (ch.type === 'yaml'); });
            if (yamlElement) {
                this._meta = jsyaml.safeLoad(yamlElement.value);
            }
            else {
                this._meta = {};
            }
        }
        if (this._meta[args['key']]) {
            return this._meta[args['key']];
        }
        else {
            return '';
        }
    };
    Root.prototype.heading = function (args) {
        var depth = args['depth'];
        return new Heading(this.orig.children.find(function (ch) {
            return (ch.type === 'heading') &&
                ((depth === 0) || (depth === ch.depth));
        }));
    };
    Root.prototype.headings = function (args) {
        var depth = args['depth'];
        return this.orig.children.filter(function (ch) {
            return (ch.type === 'heading') &&
                ((depth === 0) || (depth === ch.depth));
        })
            .map(function (ch) { return new Heading(ch); });
    };
    return Root;
}(Parent));
exports.Root = Root;
var Heading = /** @class */ (function (_super) {
    __extends(Heading, _super);
    function Heading() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Heading.prototype.depth = function () {
        return this.orig.depth;
    };
    return Heading;
}(Parent));
exports.Heading = Heading;
var Paragraph = /** @class */ (function (_super) {
    __extends(Paragraph, _super);
    function Paragraph() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Paragraph;
}(Parent));
exports.Paragraph = Paragraph;
var Link = /** @class */ (function (_super) {
    __extends(Link, _super);
    function Link() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Link.prototype.title = function () {
        return this.orig.title;
    };
    Link.prototype.url = function () {
        return this.orig.url;
    };
    return Link;
}(Parent));
exports.Link = Link;
var Text = /** @class */ (function () {
    function Text(orig) {
        this.orig = orig;
    }
    Text.prototype.value = function () {
        return this.orig.value;
    };
    return Text;
}());
exports.Text = Text;
var libNamesRegex = /content-services|core|extensions|insights|process-services|process-services-cloud/;
var Docset = /** @class */ (function () {
    function Docset(mdCache) {
        var _this = this;
        this.docs = [];
        var pathnames = Object.keys(mdCache);
        pathnames.forEach(function (pathname) {
            if (!pathname.match(/README/) &&
                pathname.match(libNamesRegex)) {
                var doc = new Root(mdCache[pathname].mdInTree);
                doc.id = pathname.replace(/\\/g, '/');
                _this.docs.push(doc);
            }
        });
    }
    Docset.prototype.documents = function (args) {
        if (args['idFilter'] === '') {
            return this.docs;
        }
        else {
            return this.docs.filter(function (doc) { return doc.id.indexOf(args['idFilter'] + '/') !== -1; });
        }
    };
    Docset.prototype.size = function () {
        return this.docs.length;
    };
    return Docset;
}());
exports.Docset = Docset;
