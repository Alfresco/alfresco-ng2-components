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

// note: contains only limited subset of available fields

export class NodePaging {
    list: NodePagingList;
}

export class NodePagingList {
    pagination: Pagination;
    entries: MinimalNodeEntity[];
}

// TODO: rename to NodeMinimalEntry
export class MinimalNodeEntity {
    entry: MinimalNodeEntryEntity;
}

export class Pagination {
    count: number;
    hasMoreItems: boolean;
    totalItems: number;
    skipCount: number;
    maxItems: number;
}

// TODO: rename to NodeMinimal
export class MinimalNodeEntryEntity {
    id: string;
    parentId: string;
    name: string;
    nodeType: string;
    isFolder: boolean;
    isFile: boolean;
    modifiedAt: string;
    modifiedByUser: UserInfo;
    createdAt: string;
    createdByUser: UserInfo;
    content: ContentInfo;
    path: PathInfoEntity;
}

export class UserInfo {
    displayName: string;
    id: string;
}

export class ContentInfo {
    mimeType: string;
    mimeTypeName: string;
    sizeInBytes: number;
    encoding: string;
}

export class PathInfoEntity {
    elements: PathElementEntity;
    isComplete: boolean;
    name: string;
}

export class PathElementEntity {
    id: string;
    name: string;
}
