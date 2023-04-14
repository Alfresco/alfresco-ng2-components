/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { MDAST } from 'mdast';
import { UNIST } from 'unist';
import * as mdToString from 'mdast-util-to-string';
import * as jsyaml from 'js-yaml';

export const schema = `
    type Query {
        documents(idFilter: String = ""): [Root]
    }

    type Root {
        id: ID
        type: String
        folder(depth: Int = 1): String
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
    id: string;

    type(): string {
        return 'root';
    }

    folder(args): string {
        const depth = args['depth'];
        const relPath = this.id.substring(this.id.indexOf('docs'));
        const pathSegments = relPath.split(/[\\\/]/);

        return pathSegments[depth];
    }

    metadata(args): string {
        if (!this._meta) {
            const yamlElement: any = this.orig.children.find(
                (ch: UNIST.Node) => (ch.type === 'yaml')
            );

            if (yamlElement) {
                this._meta = jsyaml.safeLoad(yamlElement.value);
            } else {
                this._meta = {};
            }
        }

        if (this._meta[args['key']]) {
            return this._meta[args['key']];
        } else {
            return '';
        }
    }

    heading(args): Heading {
        const depth = args['depth'];

        return new Heading(<MDAST.Heading> this.orig.children.find(
            (ch: UNIST.Node) =>
                (ch.type === 'heading') &&
                ((depth === 0) || (depth === (<MDAST.Heading> ch).depth))
        ));
    }

    headings(args): Heading[] {
        const depth = args['depth'];

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

const libNamesRegex = /content-services|core|extensions|insights|process-services|process-services-cloud/;

export class Docset {
    public docs: Root[];

    constructor(mdCache) {
        this.docs = [];

        const pathnames = Object.keys(mdCache);

        pathnames.forEach(pathname => {

            if (!pathname.match(/README/) &&
                pathname.match(libNamesRegex)
            ) {
                const doc = new Root(mdCache[pathname].mdInTree);
                doc.id = pathname.replace(/\\/g, '/');
                this.docs.push(doc);
            }
        });
    }

    documents(args): Root[] {
        if (args['idFilter'] === '') {
            return this.docs;
        } else {
            return this.docs.filter(doc => doc.id.indexOf(args['idFilter'] + '/') !== -1);
        }
    }

    size(): number {
        return this.docs.length;
    }
}
