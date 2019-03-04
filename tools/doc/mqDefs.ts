import { MDAST } from 'mdast';
import { UNIST } from 'unist';
import * as mdToString from 'mdast-util-to-string';

import * as jsyaml from 'js-yaml';

export let schema = `
    type Query {
        document: Root
    }

    type Root {
        type: String
        metadata(key: String): String
        heading(depth: Int = 0): Heading
        headings(depth: Int = 0): [Heading]
        paragraph: Paragraph
        paragraphs: [Paragraph]
        link: Link
        links: [Link]
        text: Text
        texts: [Text]
        children: [Node]
    }

    type Heading {
        depth: Int
        plaintext: String
        paragraph: Paragraph
        paragraphs: [Paragraph]
        link: Link
        links: [Link]
        children: [Node]
    }

    type Paragraph {
        plaintext: String
    }

    type Link {
        plaintext: String
        title: String
        url: String
        paragraph: Paragraph
        paragraphs: [Paragraph]
        text: Text
        texts: [Text]
    }

    type Text {
        value: String
    }

    type Node {
        type: String
        children: [Node]
    }
`;

export class Node {
    constructor(private orig: UNIST.Node) {}

    type(): string {
        return this.orig.type;
    }

    depth(): number {
        return this.orig['depth'] || null;
    }

    lang(): string {
        return this.orig['lang'] || null;
    }

    ordered(): boolean {
        return this.orig['ordered'] || null;
    }

    start(): number {
        return this.orig['start'] || null;
    }

    loose(): boolean {
        return this.orig['loose'] || null;
    }

    align(): MDAST.AlignType {
        return this.orig['align'] || null;
    }

    title(): string {
        return this.orig['title'] || null;
    }

    url(): string {
        return this.orig['title'] || null;
    }

    children(): Node[] {
        if (this.orig['children']) {
            return this.orig['children'].map(x => new Node(x));
        } else {
            return null;
        }
    }
}


export class Parent {

    constructor(protected orig: UNIST.Parent) {}

    plaintext(): string {
        return mdToString(this.orig);
    }

    paragraph(): Paragraph {
        return new Paragraph(<MDAST.Paragraph> this.orig.children.find(
            (ch: UNIST.Node) => (ch.type === 'paragraph')
        ));
    }

    paragraphs(): Paragraph[] {
        return this.orig.children.filter(
            (ch: UNIST.Node) =>
                 (ch.type === 'paragraph')
            )
        .map(ch => new Paragraph(<MDAST.Paragraph> ch));
    }

    link(): Link {
        return new Link(<MDAST.Link> this.orig.children.find(
            (ch: UNIST.Node) => (ch.type === 'link')
        ));
    }

    links(): Link[] {
        return this.orig.children.filter(
            (ch: UNIST.Node) =>
                 (ch.type === 'link')
            )
        .map(ch => new Link(<MDAST.Link> ch));
    }

    text(): Text {
        return new Text(<MDAST.TextNode> this.orig.children.find(
            (ch: UNIST.Node) => (ch.type === 'text')
        ));
    }

    texts(): Text[] {
        return this.orig.children.filter(
            (ch: UNIST.Node) =>
                 (ch.type === 'text')
            )
        .map(ch => new Text(<MDAST.TextNode> ch));
    }
}

export class Root extends Parent {
    _meta: {};


    type(): string {
        return 'root';
    }

    metadata(args): String {
        if (!this._meta) {
            let yamlElement: MDAST.YAML = this.orig.children.find(
                (ch: UNIST.Node) => (ch.type === 'yaml')
            );

            if (yamlElement) {
                this._meta = jsyaml.safeLoad(yamlElement.value)
            } else {
                this._meta = {};
            }
        }

        if (this._meta[args['key']]) {
            return this._meta[args['key']]
        } else {
            return '';
        }
    }

    heading(args, _context, _info): Heading {
        let depth = args['depth'];
        
        return new Heading(<MDAST.Heading> this.orig.children.find(
            (ch: UNIST.Node) =>
                (ch.type === 'heading') &&
                ((depth === 0) || (depth === (<MDAST.Heading> ch).depth))
        ));
    }

    
    headings(args): Heading[] {
        let depth = args['depth'];

        return this.orig.children.filter(
            (ch: UNIST.Node) =>
                 (ch.type === 'heading') &&
                ((depth === 0) || (depth === (<MDAST.Heading> ch).depth)))
        .map(ch => new Heading(<MDAST.Heading> ch));
    }    
}

export class Heading extends Parent {

    depth(): number {
        return (<MDAST.Heading> this.orig).depth;
    }
}


export class Paragraph extends Parent {
}


export class Link extends Parent {
    
    title(): string {
        return (<MDAST.Link> this.orig).title;
    }

    url(): string {
        return (<MDAST.Link> this.orig).url;
    }
}

export class Text {
    constructor(protected orig: MDAST.TextNode) {}

    value(): String {
        return this.orig.value;
    }
}