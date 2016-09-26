/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import {
    NodePaging,
    NodeMinimalEntry,
    NodeMinimal,
    PathInfoEntity,
    ContentInfo,
    NodePagingList
} from '../models/document-library.model';

export class PageNode extends NodePaging {
    constructor(entries?: NodeMinimalEntry[]) {
        super();
        this.list = new NodePagingList();
        this.list.entries = entries || [];
    }
}

export class FileNode extends NodeMinimalEntry {
    constructor(name?: string, mimeType?: string) {
        super();
        this.entry = new NodeMinimal();
        this.entry.id = 'file-id';
        this.entry.isFile = true;
        this.entry.isFolder = false;
        this.entry.name = name;
        this.entry.path = new PathInfoEntity();
        this.entry.content = new ContentInfo();
        this.entry.content.mimeType = mimeType || 'text/plain';
    }
}

export class FolderNode extends NodeMinimalEntry {
    constructor(name?: string) {
        super();
        this.entry = new NodeMinimal();
        this.entry.id = 'folder-id';
        this.entry.isFile = false;
        this.entry.isFolder = true;
        this.entry.name = name;
        this.entry.path = new PathInfoEntity();
    }
}
