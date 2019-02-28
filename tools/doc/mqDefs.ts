import { MDAST } from 'mdast';
import { UNIST } from 'unist';

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

export class MQNode {
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

    children(): MQNode[] {
        if (this.orig['children']) {
            return this.orig['children'].map(x => new MQNode(x));
        } else {
            return null;
        }
    }
}