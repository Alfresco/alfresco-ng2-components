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

import {
    it,
    describe,
    expect
} from 'angular2/testing';
import {DocumentList} from '../../src/components/document-list';
import {ContentColumnModel} from '../../src/models/content-column.model';
import {AlfrescoServiceMock} from '../assets/alfresco.service.mock';
import {DocumentEntity} from '../../src/models/document-library.model';
import {ContentActionModel} from '../../src/models/content-action.model';

describe('document-list', () => {

    let alfrescoServiceMock: AlfrescoServiceMock;
    let documentList: DocumentList;

    beforeEach(() => {
        alfrescoServiceMock = new AlfrescoServiceMock();
        documentList = new DocumentList(alfrescoServiceMock);
    });

    it('should setup default columns', () => {
        documentList.ngAfterContentInit();
        expect(documentList.columns.length).not.toBe(0);
    });

    it('should use custom columns instead of default ones', () => {
        let column: ContentColumnModel = {
            title: 'title',
            source: 'source',
            cssClass: 'css'
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

    it('should get content url', () => {
        let url = 'URL';
        spyOn(alfrescoServiceMock, 'getContentUrl').and.returnValue(url);

        let result = documentList.getContentUrl(null);

        expect(result).toBe(url);
        expect(alfrescoServiceMock.getContentUrl).toHaveBeenCalled();
    });

    it('should get thumbnail url', () => {
        let url = 'URL';
        spyOn(alfrescoServiceMock, 'getDocumentThumbnailUrl').and.returnValue(url);

        let result = documentList.getDocumentThumbnailUrl(null);

        expect(result).toBe(url);
        expect(alfrescoServiceMock.getDocumentThumbnailUrl).toHaveBeenCalled();
    });
    
    it('should execute action with node', () => {
        let node = new DocumentEntity();
        let action = new ContentActionModel();
        action.handler = function() {};

        spyOn(action, 'handler').and.stub();

        documentList.executeContentAction(node, action);
        expect(action.handler).toHaveBeenCalledWith(node);

    });

    it('should execute action without node provided', () => {
        let action = new ContentActionModel();
        action.handler = function() {};

        spyOn(action, 'handler').and.stub();
        documentList.executeContentAction(null, action);
        expect(action.handler).toHaveBeenCalledWith(null);
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
        var folderButton = new ContentActionModel();
        folderButton.target = "folder";
        folderButton.type = "button";

        var folderMenu = new ContentActionModel();
        folderMenu.target = "folder";
        folderMenu.type = "menu";

        var documentButton = new ContentActionModel();
        documentButton.target = "document";
        documentButton.type = "button";

        var documentMenu = new ContentActionModel();
        documentMenu.target = "document";
        documentMenu.type = "menu";

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
        var documentButton = new ContentActionModel();
        documentButton.target = 'document';
        documentButton.type = 'button';

        documentList.actions = [documentButton];

        var actions = documentList.getContentActions('DoCuMeNt', 'BUTTON');
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(documentButton);
    });

    it('should find no content actions', () => {
        var documentButton = new ContentActionModel();
        documentButton.target = 'document';
        documentButton.type = 'button';

        documentList.actions = [documentButton];

        var actions = documentList.getContentActions('unknown', 'value');
        expect(actions.length).toBe(0);
    });

});
