/**
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
import { OnInit, EventEmitter, AfterContentInit, AfterViewChecked } from 'angular2/core';
import { AlfrescoService } from './../services/alfresco.service';
import { FolderEntity, DocumentEntity } from './../models/document-library.model';
import { ContentActionModel } from './../models/content-action.model';
import { ContentColumnModel } from './../models/content-column.model';
export declare class DocumentList implements OnInit, AfterViewChecked, AfterContentInit {
    private _alfrescoService;
    navigate: boolean;
    breadcrumb: boolean;
    folderIcon: string;
    itemClick: EventEmitter<any>;
    rootFolder: {
        name: string;
        path: string;
    };
    currentFolderPath: string;
    folder: FolderEntity;
    errorMessage: any;
    route: any[];
    actions: ContentActionModel[];
    columns: ContentColumnModel[];
    /**
     * Determines whether navigation to parent folder is available.
     * @returns {boolean}
     */
    canNavigateParent(): boolean;
    constructor(_alfrescoService: AlfrescoService);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngAfterViewChecked(): void;
    /**
     * Get a list of content actions based on target and type.
     * @param target Target to filter actions by.
     * @param type Type to filter actions by.
     * @returns {ContentActionModel[]} List of actions filtered by target and type.
     */
    getContentActions(target: string, type: string): ContentActionModel[];
    /**
     * Invoked when 'parent folder' element is clicked.
     * @param e DOM event
     */
    onNavigateParentClick(e: any): void;
    /**
     * Invoked when list row is clicked.
     * @param item Underlying node item
     * @param e DOM event (optional)
     */
    onItemClick(item: DocumentEntity, e?: any): void;
    /**
     * Invoked when a breadcrumb route is clicked.
     * @param r Route to navigate to
     * @param e DOM event
     */
    goToRoute(r: any, e: any): void;
    /**
     * Gets content URL for the given node.
     * @param node Node to get URL for.
     * @returns {string} URL address.
     */
    getContentUrl(node: DocumentEntity): string;
    /**
     * Gets thumbnail URL for the given document node.
     * @param node Node to get URL for.
     * @returns {string} URL address.
     */
    getDocumentThumbnailUrl(node: DocumentEntity): string;
    /**
     * Invoked when executing content action for a document or folder.
     * @param node Node to be the context of the execution.
     * @param action Action to be executed against the context.
     */
    executeContentAction(node: DocumentEntity, action: ContentActionModel): void;
    /**
     * Loads and displays folder content
     * @param path Node path
     */
    displayFolderContent(path: any): void;
    /**
     * Gets a path for a given node.
     * @param node
     * @returns {string}
     */
    getNodePath(node: DocumentEntity): string;
    /**
     * Gets a value from an object by composed key
     * documentList.getObjectValue({ item: { nodeType: 'cm:folder' }}, 'item.nodeType') ==> 'cm:folder'
     * @param target
     * @param key
     * @returns {string}
     */
    getObjectValue(target: any, key: string): any;
    /**
     * Creates a set of predefined columns.
     */
    setupDefaultColumns(): void;
}
