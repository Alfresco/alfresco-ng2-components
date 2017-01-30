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
import { EventEmitter } from '@angular/core';
import { DocumentList } from '../document-list';
export declare class DocumentListBreadcrumb {
    private _currentFolderPath;
    currentFolderPath: string;
    target: DocumentList;
    private rootFolder;
    route: PathNode[];
    navigate: EventEmitter<any>;
    pathChanged: EventEmitter<any>;
    onRoutePathClick(route: PathNode, e?: Event): void;
    private parsePath(path);
}
export interface PathNode {
    name: string;
    path: string;
}
