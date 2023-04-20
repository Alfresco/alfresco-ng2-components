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

import * as path from 'path';
import * as unist from '../unistHelpers';
import * as ngHelpers from '../ngHelpers';

const includedNodeTypes = [
    'root', 'paragraph', 'inlineCode', 'list', 'listItem',
    'table', 'tableRow', 'tableCell', 'emphasis', 'strong',
    'link', 'text'
];

let externalNameLinks;
let linkOverrides;
let ignoreLinkWords: any[];

export function processDocs(mdCache, aggData) {
    initPhase(aggData, mdCache);

    const pathnames = Object.keys(mdCache);

    pathnames.forEach(pathname => {
        updateFile(mdCache[pathname].mdOutTree, pathname, aggData);
    });
}

function initPhase(aggData, mdCache) {
    externalNameLinks = aggData.config.externalNameLinks;
    ignoreLinkWords = aggData.config.ignoreLinkWords;

    linkOverrides = {};
    aggData.config.linkOverrides.forEach(override => {
        linkOverrides[override.toLowerCase()] = 1;
    });

    aggData.docFiles = {};
    aggData.nameLookup = new SplitNameLookup();

    const docFilePaths = Object.keys(mdCache);

    docFilePaths.forEach(docFilePath => {
        const relPath = docFilePath.substring(docFilePath.indexOf('docs') + 5).replace(/\\/g, '/');
        const compName = path.basename(relPath, '.md');
        aggData.docFiles[compName] = relPath;
    });

    const classNames = Object.keys(aggData.classInfo);

    classNames.forEach(currClassName => {
        if (currClassName.match(/(Component|Directive|Interface|Model|Pipe|Service|Widget)$/)) {
            aggData.nameLookup.addName(currClassName);
        }
    });
}

function updateFile(tree, pathname, aggData) {
    traverseMDTree(tree);
    return true;

    function traverseMDTree(node) {
        if (!includedNodeTypes.includes(node.type)) {
            return;
        }

        if (node.type === 'link') {
            if (node.children[0] && (
                (node.children[0].type === 'inlineCode') ||
                (node.children[0].type === 'text')
            )) {

                if (!ignoreLinkWords.includes(node.children[0].value)) {
                    const link = resolveTypeLink(aggData, pathname, node.children[0].value);

                    if (link) {
                        convertNodeToTypeLink(node, node.children[0].value, link);
                    }
                }
            }
        } else if ((node.children) && (node.type !== 'heading')) {
            node.children.forEach((child, index) => {
                if ((child.type === 'text') || (child.type === 'inlineCode')) {

                    const newNodes = handleLinksInBodyText(aggData, pathname, child.value, child.type === 'inlineCode');
                    node.children.splice(index, 1, ...newNodes);

                } else {
                    traverseMDTree(child);
                }
            });
        }
    }
}

class SplitNameNode {
    children: {};

    constructor(public key: string = '', public value: string = '') {
        this.children = {};
    }

    addChild(child: SplitNameNode) {
        this.children[child.key] = child;
    }
}

class SplitNameMatchElement {
    constructor(public node: SplitNameNode, public textPos: number) {
    }
}

class SplitNameMatchResult {
    constructor(public value: string, public startPos: number) {
    }
}

class SplitNameMatcher {
    matches: SplitNameMatchElement[];

    constructor(public root: SplitNameNode) {
        this.reset();
    }

    /* Returns all names that match when this word is added. */
    nextWord(word: string, textPos: number): SplitNameMatchResult[] {
        const result = [];

        this.matches.push(new SplitNameMatchElement(this.root, textPos));

        for (let i = this.matches.length - 1; i >= 0; i--) {
            if (this.matches[i].node.children) {
                const child = this.matches[i].node.children[word];

                if (child) {
                    if (child.value) {
                        /* Using unshift to add the match to the array means that
                        * the longest matches will appear first in the array.
                        * User can then just use the first array element if only
                        * the longest match is needed.
                        */
                        result.unshift(new SplitNameMatchResult(child.value, this.matches[i].textPos));
                        this.matches.splice(i, 1);
                    } else {
                        this.matches[i] = new SplitNameMatchElement(child, this.matches[i].textPos);
                    }
                } else {
                    this.matches.splice(i, 1);
                }
            } else {
                this.matches.splice(i, 1);
            }
        }

        if (result === []) {
            return null;
        } else {
            return result;
        }
    }

    reset() {
        this.matches = [];
    }
}

class SplitNameLookup {
    root: SplitNameNode;

    constructor() {
        this.root = new SplitNameNode();
    }

    addName(name: string) {
        const spacedName = name.replace(/([A-Z])/g, ' $1');
        const segments = spacedName.trim().toLowerCase().split(' ');

        let currNode = this.root;

        segments.forEach((segment, index) => {
            let value = '';

            if (index === (segments.length - 1)) {
                value = name;
            }

            let childNode = currNode.children[segment];

            if (!childNode) {
                childNode = new SplitNameNode(segment, value);
                currNode.addChild(childNode);
            }

            currNode = childNode;
        });
    }
}

class WordScanner {
    separators: string;
    index: number;
    nextSeparator: number;
    current: string;

    constructor(public text: string) {
        this.separators = ' \n\r\t.;:<>[]&|';
        this.index = 0;
        this.nextSeparator = 0;
        this.next();
    }

    finished() {
        return this.index >= this.text.length;
    }

    next(): void {
        this.advanceIndex();
        this.advanceNextSeparator();
        this.current = this.text.substring(this.index, this.nextSeparator);
    }

    advanceNextSeparator() {
        for (let i = this.index; i < this.text.length; i++) {
            if (this.separators.indexOf(this.text[i]) !== -1) {
                this.nextSeparator = i;
                return;
            }
        }

        this.nextSeparator = this.text.length;
    }

    advanceIndex() {
        for (let i = this.nextSeparator; i < this.text.length; i++) {
            if (this.separators.indexOf(this.text[i]) === -1) {
                this.index = i;
                return;
            }
        }

        this.index = this.text.length;
    }
}

function handleLinksInBodyText(aggData, docFilePath: string, text: string, wrapInlineCode: boolean = false): Node[] {
    const result = [];
    let currTextStart = 0;
    const matcher = new SplitNameMatcher(aggData.nameLookup.root);

    for (const scanner = new WordScanner(text); !scanner.finished(); scanner.next()) {


        const word = scanner.current
            .replace(/'s$/, '')
            .replace(/^[;:,\."']+/g, '')
            .replace(/[;:,\."']+$/g, '');

        if (!ignoreLinkWords.includes(word)) {

            let link = resolveTypeLink(aggData, docFilePath, word);
            let matchStart;

            if (!link) {
                const match = matcher.nextWord(word.toLowerCase(), scanner.index);

                if (match && match[0]) {
                    link = resolveTypeLink(aggData, docFilePath, match[0].value);
                    matchStart = match[0].startPos;
                }
            } else {
                matchStart = scanner.index;
            }

            if (link) {
                const linkText = text.substring(matchStart, scanner.nextSeparator);
                let linkTitle;

                if (wrapInlineCode) {
                    linkTitle = unist.makeInlineCode(linkText);
                } else {
                    linkTitle = unist.makeText(linkText);
                }

                const linkNode = unist.makeLink(linkTitle, link);
                const prevText = text.substring(currTextStart, matchStart);

                if (prevText) {
                    if (wrapInlineCode) {
                        result.push(unist.makeInlineCode(prevText));
                    } else {
                        result.push(unist.makeText(prevText));
                    }
                }

                result.push(linkNode);
                currTextStart = scanner.nextSeparator;
                matcher.reset();
            }
        }
    }

    const remainingText = text.substring(currTextStart, text.length);

    if (remainingText) {
        if (wrapInlineCode) {
            result.push(unist.makeInlineCode(remainingText));
        } else {
            result.push(unist.makeText(remainingText));
        }
    }

    return result;
}

function resolveTypeLink(aggData, docFilePath, text): string {
    const possTypeName = cleanTypeName(text);

    if (possTypeName === 'constructor') {
        return '';
    }

    const classInfo = aggData.classInfo[possTypeName];

    if (linkOverrides[possTypeName.toLowerCase()]) {
        return '';
    } else if (externalNameLinks[possTypeName]) {
        return externalNameLinks[possTypeName];
    } else if (classInfo) {
        const kebabName = ngHelpers.kebabifyClassName(possTypeName);
        const possDocFile = aggData.docFiles[kebabName];

        let url = fixRelSrcUrl(docFilePath, classInfo.sourcePath);

        if (possDocFile) {
            url = fixRelDocUrl(docFilePath, possDocFile);
        }

        return url;
    } else {
        return '';
    }
}

function fixRelSrcUrl(docPath: string, srcPath: string) {
    const relDocPath = docPath.substring(docPath.indexOf('docs'));
    const docPathSegments = relDocPath.split(/[\\\/]/);
    let dotPathPart = '';

    for (let i = 0; i < (docPathSegments.length - 1); i++) {
        dotPathPart += '../';
    }

    return dotPathPart + srcPath;
}

function fixRelDocUrl(docPathFrom: string, docPathTo: string) {
    const relDocPathFrom = docPathFrom.substring(docPathFrom.indexOf('docs'));
    const docPathSegments = relDocPathFrom.split(/[\\\/]/);
    let dotPathPart = '';

    for (let i = 0; i < (docPathSegments.length - 2); i++) {
        dotPathPart += '../';
    }

    return dotPathPart + docPathTo;
}

function cleanTypeName(text) {
    const matches = text.match(/[a-zA-Z0-9_]+<([a-zA-Z0-9_]+)(\[\])?>/);

    if (matches) {
        return matches[1];
    } else {
        return text.replace(/\[\]$/, '');
    }
}

function convertNodeToTypeLink(node, text, url, title = null) {
    const linkDisplayText = unist.makeInlineCode(text);
    node.type = 'link';
    node.title = title;
    node.url = url;
    node.children = [linkDisplayText];
}
