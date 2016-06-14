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
} from '@angular/core/testing';

import { DocumentList } from './document-list';
import { ContentColumnModel } from '../models/content-column.model';
import { AlfrescoServiceMock } from '../assets/alfresco.service.mock';
import { MinimalNodeEntity, MinimalNodeEntryEntity } from '../models/document-library.model';
import { ContentActionModel } from '../models/content-action.model';

describe('DocumentList', () => {

    let alfrescoServiceMock: AlfrescoServiceMock;
    let documentList: DocumentList;
    let eventMock: any;

    beforeEach(() => {
        alfrescoServiceMock = new AlfrescoServiceMock();
        documentList = new DocumentList(alfrescoServiceMock);

        eventMock = {
            preventDefault: function () {
                console.log('mock preventDefault');
            }
        };
    });

    it('should setup default columns', () => {
        spyOn(documentList, 'setupDefaultColumns').and.callThrough();

        documentList.ngAfterContentInit();

        expect(documentList.setupDefaultColumns).toHaveBeenCalled();
        expect(documentList.columns.length).not.toBe(0);
    });

    it('should use custom columns instead of default ones', () => {
        let column: ContentColumnModel = {
            title: 'title',
            source: 'source',
            cssClass: 'css',
            srTitle: '',
            type: 'text',
            format: ''
        };
        documentList.columns.push(column);

        documentList.ngAfterContentInit();
        expect(documentList.columns.length).toBe(1);
        expect(documentList.columns[0]).toBe(column);
    });

    it('should setup default root for breadcrumb', () => {
        documentList.ngOnInit();
        expect(documentList.route.length).toBe(1);
        expect(documentList.route[0]).toBe(documentList.rootFolder);
    });

    it('should display custom root path', () => {
        spyOn(documentList, 'displayFolderContent').and.stub();

        let root = {
            name: '<root>',
            path: '<path>'
        };

        documentList.currentFolderPath = root.path;
        documentList.rootFolder = root;
        documentList.ngOnInit();
        expect(documentList.displayFolderContent).toHaveBeenCalledWith(root.path);
    });

    it('should fetch folder', () => {
        let folder = {
            'nodeRef': 'workspace://SpacesStore/8bb36efb-c26d-4d2b-9199-ab6922f53c28'
        };
        alfrescoServiceMock._folderToReturn = folder;
        documentList.ngOnInit();

        expect(documentList.folder).toBe(folder);
    });

    it('should return thumbnail url for a file when thumbnails turned on', () => {
        let url = 'URL';
        spyOn(alfrescoServiceMock, 'getDocumentThumbnailUrl').and.returnValue(url);

        let node = new MinimalNodeEntity();
        node.entry = new MinimalNodeEntryEntity();
        node.entry.isFile = true;
        documentList.thumbnails = true;
        let result = documentList.getThumbnailUrl(node);

        expect(result).toBe(url);
        expect(alfrescoServiceMock.getDocumentThumbnailUrl).toHaveBeenCalled();
    });

    it('should return a null thumbnail url for a null item', () => {
        let url = 'URL';
        spyOn(alfrescoServiceMock, 'getDocumentThumbnailUrl').and.returnValue(url);

        let result = documentList.getThumbnailUrl(null);

        expect(result).toBeNull();
        expect(alfrescoServiceMock.getDocumentThumbnailUrl).not.toHaveBeenCalled();
    });

    it('should return no thumbnail url without service', () => {
        let list = new DocumentList(null);
        let node = new MinimalNodeEntity();
        expect(list.getThumbnailUrl(node)).toBeNull();
    });

    it('should execute action with node', () => {
        let node = new MinimalNodeEntity();
        node.entry = new MinimalNodeEntryEntity();
        let action = new ContentActionModel();
        action.handler = function () {
            console.log('mock handler');
        };

        spyOn(action, 'handler').and.stub();

        documentList.executeContentAction(node, action);
        expect(action.handler).toHaveBeenCalledWith(node, documentList);

    });

    it('should not execute action without node provided', () => {
        let action = new ContentActionModel();
        action.handler = function () {
            console.log('mock handler');
        };

        spyOn(action, 'handler').and.stub();
        documentList.executeContentAction(null, action);
        expect(action.handler).not.toHaveBeenCalled();
    });

    it('should update current folder path', () => {
        expect(documentList.currentFolderPath).toBe(documentList.rootFolder.path);

        let path = '<path>';
        documentList.displayFolderContent(path);

        expect(documentList.currentFolderPath).toBe(path);
    });

    it('should give no content actions for empty target', () => {
        let actions = documentList.getContentActions(null, 'button');
        expect(actions.length).toBe(0);
    });

    it('should give no content actions for empty type', () => {
        let actions = documentList.getContentActions('folder', null);
        expect(actions.length).toBe(0);
    });

    it('should filter content actions for various types and targets', () => {
        let folderButton = new ContentActionModel();
        folderButton.target = 'folder';
        folderButton.type = 'button';

        let folderMenu = new ContentActionModel();
        folderMenu.target = 'folder';
        folderMenu.type = 'menu';

        let documentButton = new ContentActionModel();
        documentButton.target = 'document';
        documentButton.type = 'button';

        let documentMenu = new ContentActionModel();
        documentMenu.target = 'document';
        documentMenu.type = 'menu';

        documentList.actions = [
            folderButton,
            folderMenu,
            documentButton,
            documentMenu
        ];

        let actions = documentList.getContentActions('folder', 'button');
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(folderButton);

        actions = documentList.getContentActions('folder', 'menu');
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(folderMenu);

        actions = documentList.getContentActions('document', 'button');
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(documentButton);

        actions = documentList.getContentActions('document', 'menu');
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(documentMenu);
    });

    it('should be case insensitive when filtering content actions', () => {
        let documentButton = new ContentActionModel();
        documentButton.target = 'document';
        documentButton.type = 'button';

        documentList.actions = [documentButton];

        let actions = documentList.getContentActions('DoCuMeNt', 'BUTTON');
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(documentButton);
    });

    it('should find no content actions', () => {
        let documentButton = new ContentActionModel();
        documentButton.target = 'document';
        documentButton.type = 'button';

        documentList.actions = [documentButton];

        let actions = documentList.getContentActions('unknown', 'value');
        expect(actions.length).toBe(0);
    });

    it('should emit itemClick event', (done) => {
        let node: MinimalNodeEntity = new MinimalNodeEntity();
        documentList.itemClick.subscribe(e => {
            expect(e.value).toBe(node);
            done();
        });
        documentList.onItemClick(node);
    });

    it('should prevent default events for item click', () => {
        spyOn(eventMock, 'preventDefault').and.stub();

        documentList.onItemClick(null, eventMock);
        expect(eventMock.preventDefault).toHaveBeenCalled();
    });

    it('should display folder content on click', () => {
        let path = '/';

        let node = new MinimalNodeEntity();
        node.entry = new MinimalNodeEntryEntity();
        node.entry.isFolder = true;
        node.entry.name = '<display name>';

        spyOn(documentList, 'getNodePath').and.returnValue(path);
        spyOn(documentList, 'displayFolderContent').and.stub();

        documentList.navigationMode = 'click';
        documentList.onItemClick(node);

        expect(documentList.displayFolderContent).toHaveBeenCalledWith(path);

        let routeEntry = documentList.route.pop();
        expect(routeEntry.name).toBe(node.entry.name);
        expect(routeEntry.path).toBe(path);
    });

    it('should not display folder content when no target node provided', () => {
        expect(documentList.navigate).toBe(true);
        spyOn(documentList, 'displayFolderContent').and.stub();

        documentList.onItemClick(null);
        expect(documentList.displayFolderContent).not.toHaveBeenCalled();

    });

    it('should display folder content only on folder node click', () => {
        expect(documentList.navigate).toBe(true);
        spyOn(documentList, 'displayFolderContent').and.stub();

        let node = new MinimalNodeEntity();
        node.entry = new MinimalNodeEntryEntity();
        node.entry.isFolder = false;

        documentList.onItemClick(node);

        expect(documentList.displayFolderContent).not.toHaveBeenCalled();
    });

    it('should not display folder content on click when navigation is off', () => {
        spyOn(documentList, 'displayFolderContent').and.stub();

        let node = new MinimalNodeEntity();
        node.entry = new MinimalNodeEntryEntity();
        node.entry.isFolder = true;
        node.entry.name = '<display name>';

        documentList.navigate = false;
        documentList.onItemClick(node);

        expect(documentList.displayFolderContent).not.toHaveBeenCalled();
    });

    it('should require node to get path', () => {
        expect(documentList.getNodePath(null)).toBe(null);
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

        expect(documentList.getObjectValue(target, 'key1')).toBe('value1');
    });

    it('should return no object value when key is missing', () => {
        let target = {
            key1: 'value1'
        };
        expect(documentList.getObjectValue(target, 'missing')).toBeUndefined();
    });

    it('should return nested object value', () => {
        let target = {
            key1: {
                key2: {
                    key3: 'value1'
                }
            }
        };

        expect(documentList.getObjectValue(target, 'key1.key2.key3')).toBe('value1');
    });

});
