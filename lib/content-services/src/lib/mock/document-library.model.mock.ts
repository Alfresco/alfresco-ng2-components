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

import { ContentInfo, Node, NodeEntry, PathInfo } from '@alfresco/js-api';

export class FileNode extends NodeEntry {
    constructor(name?: string, mimeType?: string, id?: string) {
        super();
        this.entry = new Node();
        this.entry.id = id || 'file-id';
        this.entry.isFile = true;
        this.entry.isFolder = false;
        this.entry.name = name;
        this.entry.path = new PathInfo();
        this.entry.content = new ContentInfo();
        this.entry.content.mimeType = mimeType || 'text/plain';
        this.entry.properties = {};
    }
}

export class FolderNode extends NodeEntry {
    constructor(name?: string) {
        super();
        this.entry = new Node();
        this.entry.id = 'folder-id';
        this.entry.isFile = false;
        this.entry.isFolder = true;
        this.entry.name = name;
        this.entry.path = new PathInfo();
        this.entry.aspectNames = ['cm:folder'];
        this.entry.properties = {};
    }
}

export class SmartFolderNode extends NodeEntry {
    constructor(name?: string) {
        super();
        this.entry = new Node();
        this.entry.id = 'smart-folder-id';
        this.entry.isFile = false;
        this.entry.isFolder = true;
        this.entry.name = name;
        this.entry.path = new PathInfo();
        this.entry.aspectNames = ['smf:systemConfigSmartFolder'];
        this.entry.properties = {};
    }
}

export class RuleFolderNode extends NodeEntry {
    constructor(name?: string) {
        super();
        this.entry = new Node();
        this.entry.id = 'rule-folder-id';
        this.entry.isFile = false;
        this.entry.isFolder = true;
        this.entry.name = name;
        this.entry.path = new PathInfo();
        this.entry.aspectNames = ['rule:rules'];
        this.entry.properties = {};
    }
}

export class LinkFolderNode extends NodeEntry {
    constructor(name?: string) {
        super();
        this.entry = new Node();
        this.entry.id = 'link-folder-id';
        this.entry.isFile = false;
        this.entry.isFolder = true;
        this.entry.nodeType = 'app:folderlink';
        this.entry.name = name;
        this.entry.path = new PathInfo();
        this.entry.properties = {};
    }
}
