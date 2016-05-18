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
    it,
    describe,
    expect,
    beforeEach
} from 'angular2/testing';

import { DataTableComponent } from './datatable.component';
import { DataColumnModel } from './../models/data-column.model';
import { AlfrescoServiceMock } from '../assets/alfresco.service.mock';
import { MinimalNodeEntity, MinimalNodeEntryEntity } from '../models/document-library.model';
import { DataActionModel } from './../models/data-action.model';

describe('DocumentList', () => {

    let alfrescoServiceMock: AlfrescoServiceMock;
    let dataTable: DataTableComponent;
    let eventMock: any;

    beforeEach(() => {
        alfrescoServiceMock = new AlfrescoServiceMock();
        dataTable = new DataTableComponent(alfrescoServiceMock);

        eventMock = {
            preventDefault: function () {
                console.log('mock preventDefault');
            }
        };
    });

    it('should setup default columns', () => {
        spyOn(dataTable, 'setupDefaultColumns').and.callThrough();

        dataTable.ngAfterContentInit();

        expect(dataTable.setupDefaultColumns).toHaveBeenCalled();
        expect(dataTable.columns.length).not.toBe(0);
    });

    it('should use custom columns instead of default ones', () => {
        let column: DataColumnModel = {
            title: 'title',
            source: 'source',
            cssClass: 'css',
            srTitle: ''
        };
        dataTable.columns.push(column);

        dataTable.ngAfterContentInit();
        expect(dataTable.columns.length).toBe(1);
        expect(dataTable.columns[0]).toBe(column);
    });

    it('should setup default root for breadcrumb', () => {
        dataTable.ngOnInit();
        expect(dataTable.route.length).toBe(1);
        expect(dataTable.route[0]).toBe(dataTable.rootFolder);
    });

    it('should display custom root path', () => {
        spyOn(dataTable, 'displayFolderContent').and.stub();

        let root = {
            name: '<root>',
            path: '<path>'
        };

        dataTable.currentFolderPath = root.path;
        dataTable.rootFolder = root;
        dataTable.ngOnInit();
        expect(dataTable.displayFolderContent).toHaveBeenCalledWith(root.path);
    });

    it('should fetch folder', () => {
        let folder = {
            'nodeRef': 'workspace://SpacesStore/8bb36efb-c26d-4d2b-9199-ab6922f53c28'
        };
        alfrescoServiceMock._folderToReturn = folder;
        dataTable.ngOnInit();

        expect(dataTable.folder).toBe(folder);
    });

    it('should get content url', () => {
        let url = 'URL';
        spyOn(alfrescoServiceMock, 'getContentUrl').and.returnValue(url);

        let result = dataTable.getContentUrl(null);

        expect(result).toBe(url);
        expect(alfrescoServiceMock.getContentUrl).toHaveBeenCalled();
    });

    it('should return no content url without service', () => {
        let table = new DataTableComponent(null);
        let node = new MinimalNodeEntity();
        expect(table.getContentUrl(node)).toBeNull();
    });

    it('should get thumbnail url', () => {
        let url = 'URL';
        spyOn(alfrescoServiceMock, 'getDocumentThumbnailUrl').and.returnValue(url);

        let result = dataTable.getDocumentThumbnailUrl(null);

        expect(result).toBe(url);
        expect(alfrescoServiceMock.getDocumentThumbnailUrl).toHaveBeenCalled();
    });

    it('should get no thumbnail url without service', () => {
        let table = new DataTableComponent(null);
        let node = new MinimalNodeEntity();
        expect(table.getDocumentThumbnailUrl(node)).toBeNull();
    });

    it('should execute action with node', () => {
        let node = new MinimalNodeEntity();
        let action = new DataActionModel();
        action.handler = function () {
            console.log('mock handler');
        };

        spyOn(action, 'handler').and.stub();

        dataTable.executeContentAction(node, action);
        expect(action.handler).toHaveBeenCalledWith(node);

    });

    it('should execute action without node provided', () => {
        let action = new DataActionModel();
        action.handler = function () {
            console.log('mock handler');
        };

        spyOn(action, 'handler').and.stub();
        dataTable.executeContentAction(null, action);
        expect(action.handler).toHaveBeenCalledWith(null);
    });

    it('should update current folder path', () => {
        expect(dataTable.currentFolderPath).toBe(dataTable.rootFolder.path);

        let path = '<path>';
        dataTable.displayFolderContent(path);

        expect(dataTable.currentFolderPath).toBe(path);
    });

    it('should give no content actions for empty target', () => {
        let actions = dataTable.getContentActions(null, 'button');
        expect(actions.length).toBe(0);
    });

    it('should give no content actions for empty type', () => {
        let actions = dataTable.getContentActions('folder', null);
        expect(actions.length).toBe(0);
    });

    it('should filter content actions for various types and targets', () => {
        let folderButton = new DataActionModel();
        folderButton.target = 'folder';
        folderButton.type = 'button';

        let folderMenu = new DataActionModel();
        folderMenu.target = 'folder';
        folderMenu.type = 'menu';

        let documentButton = new DataActionModel();
        documentButton.target = 'document';
        documentButton.type = 'button';

        let documentMenu = new DataActionModel();
        documentMenu.target = 'document';
        documentMenu.type = 'menu';

        dataTable.actions = [
            folderButton,
            folderMenu,
            documentButton,
            documentMenu
        ];

        let actions = dataTable.getContentActions('folder', 'button');
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(folderButton);

        actions = dataTable.getContentActions('folder', 'menu');
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(folderMenu);

        actions = dataTable.getContentActions('document', 'button');
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(documentButton);

        actions = dataTable.getContentActions('document', 'menu');
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(documentMenu);
    });

    it('should be case insensitive when filtering content actions', () => {
        let documentButton = new DataActionModel();
        documentButton.target = 'document';
        documentButton.type = 'button';

        dataTable.actions = [documentButton];

        let actions = dataTable.getContentActions('DoCuMeNt', 'BUTTON');
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(documentButton);
    });

    it('should find no content actions', () => {
        let documentButton = new DataActionModel();
        documentButton.target = 'document';
        documentButton.type = 'button';

        dataTable.actions = [documentButton];

        let actions = dataTable.getContentActions('unknown', 'value');
        expect(actions.length).toBe(0);
    });

    it('should emit itemClick event', (done) => {
        let node: MinimalNodeEntity = new MinimalNodeEntity();
        dataTable.itemClick.subscribe(e => {
            expect(e.value).toBe(node);
            done();
        });
        dataTable.onItemClick(node);
    });

    it('should prevent default events for item click', () => {
        spyOn(eventMock, 'preventDefault').and.stub();

        dataTable.onItemClick(null, eventMock);
        expect(eventMock.preventDefault).toHaveBeenCalled();
    });

    it('should display folder content on click', () => {
        let path = '/';

        let node = new MinimalNodeEntity();
        node.entry = new MinimalNodeEntryEntity();
        node.entry.isFolder = true;
        node.entry.name = '<display name>';

        spyOn(dataTable, 'getNodePath').and.returnValue(path);
        spyOn(dataTable, 'displayFolderContent').and.stub();

        dataTable.onItemClick(node);

        expect(dataTable.displayFolderContent).toHaveBeenCalledWith(path);

        let routeEntry = dataTable.route.pop();
        expect(routeEntry.name).toBe(node.entry.name);
        expect(routeEntry.path).toBe(path);
    });

    it('should not display folder content when no target node provided', () => {
        expect(dataTable.navigate).toBe(true);
        spyOn(dataTable, 'displayFolderContent').and.stub();

        dataTable.onItemClick(null);
        expect(dataTable.displayFolderContent).not.toHaveBeenCalled();

    });

    it('should display folder content only on folder node click', () => {
        expect(dataTable.navigate).toBe(true);
        spyOn(dataTable, 'displayFolderContent').and.stub();

        let node = new MinimalNodeEntity();
        node.entry = new MinimalNodeEntryEntity();
        node.entry.isFolder = false;

        dataTable.onItemClick(node);

        expect(dataTable.displayFolderContent).not.toHaveBeenCalled();
    });

    it('should not display folder content on click when navigation is off', () => {
        spyOn(dataTable, 'displayFolderContent').and.stub();

        let node = new MinimalNodeEntity();
        node.entry = new MinimalNodeEntryEntity();
        node.entry.isFolder = true;
        node.entry.name = '<display name>';

        dataTable.navigate = false;
        dataTable.onItemClick(node);

        expect(dataTable.displayFolderContent).not.toHaveBeenCalled();
    });

    it('should require node to get path', () => {
        expect(dataTable.getNodePath(null)).toBe(null);
    });

    /*
    it('should get node path', () => {
        let location = new LocationEntity();
        location.site = 'swsdp';
        location.container = 'documentLibrary';
        location.path = '\/';

        let node = new DocumentEntity();
        node.fileName = 'fileName';
        node.location = location;

        expect(documentList.getNodePath(node)).toBe('swsdp/documentLibrary/fileName');
    });
    */

    it('should return root object value', () => {
        let target = {
            key1: 'value1'
        };

        expect(dataTable.getObjectValue(target, 'key1')).toBe('value1');
    });

    it('should return no object value when key is missing', () => {
        let target = {
            key1: 'value1'
        };
        expect(dataTable.getObjectValue(target, 'missing')).toBeUndefined();
    });

    it('should return nested object value', () => {
        let target = {
            key1: {
                key2: {
                    key3: 'value1'
                }
            }
        };

        expect(dataTable.getObjectValue(target, 'key1.key2.key3')).toBe('value1');
    });

});
