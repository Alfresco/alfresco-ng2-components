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
"use strict";
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var document_actions_service_1 = require("./document-actions.service");
var document_list_service_mock_1 = require("../assets/document-list.service.mock");
var document_library_model_mock_1 = require("../assets/document-library.model.mock");
describe('DocumentActionsService', function () {
    var service;
    var documentListService;
    var contentService;
    beforeEach(function () {
        documentListService = new document_list_service_mock_1.DocumentListServiceMock();
        contentService = new ng2_alfresco_core_1.AlfrescoContentService(null, null);
        service = new document_actions_service_1.DocumentActionsService(documentListService, contentService);
    });
    it('should register default download action', function () {
        expect(service.getHandler('download')).not.toBeNull();
    });
    it('should register custom action handler', function () {
        var handler = function (obj) { };
        service.setHandler('<key>', handler);
        expect(service.getHandler('<key>')).toBe(handler);
    });
    it('should not find handler that is not registered', function () {
        expect(service.getHandler('<missing>')).toBeNull();
    });
    it('should be case insensitive for keys', function () {
        var handler = function (obj) { };
        service.setHandler('<key>', handler);
        expect(service.getHandler('<KEY>')).toBe(handler);
    });
    it('should not find handler with invalid key', function () {
        expect(service.getHandler(null)).toBeNull();
        expect(service.getHandler('')).toBeNull();
    });
    it('should allow action execution only when service available', function () {
        var file = new document_library_model_mock_1.FileNode();
        expect(service.canExecuteAction(file)).toBeTruthy();
        service = new document_actions_service_1.DocumentActionsService(null);
        expect(service.canExecuteAction(file)).toBeFalsy();
    });
    it('should allow action execution only for file nodes', function () {
        expect(service.canExecuteAction(null)).toBeFalsy();
        expect(service.canExecuteAction(new document_library_model_mock_1.FileNode())).toBeTruthy();
        expect(service.canExecuteAction(new document_library_model_mock_1.FolderNode())).toBeFalsy();
    });
    it('should set new handler only by key', function () {
        var handler = function (obj) { };
        expect(service.setHandler(null, handler)).toBeFalsy();
        expect(service.setHandler('', handler)).toBeFalsy();
        expect(service.setHandler('my-handler', handler)).toBeTruthy();
    });
    it('should execute demo actions', function () {
        spyOn(window, 'alert').and.stub();
        service.getHandler('system1')(null);
        expect(window.alert).toHaveBeenCalledWith('standard document action 1');
        service.getHandler('system2')(null);
        expect(window.alert).toHaveBeenCalledWith('standard document action 2');
    });
    it('should register demo handlers', function () {
        expect(service.getHandler('system1')).toBeDefined();
        expect(service.getHandler('system2')).toBeDefined();
    });
    it('should register delete action', function () {
        expect(service.getHandler('delete')).toBeDefined();
    });
    it('should register download action', function () {
        expect(service.getHandler('download')).toBeDefined();
    });
    it('should execute download action and cleanup', function () {
        var file = new document_library_model_mock_1.FileNode();
        var url = 'http://<address>';
        spyOn(contentService, 'getContentUrl').and.returnValue(url);
        var link = jasmine.createSpyObj('a', [
            'setAttribute',
            'click'
        ]);
        spyOn(document, 'createElement').and.returnValue(link);
        spyOn(document.body, 'appendChild').and.stub();
        spyOn(document.body, 'removeChild').and.stub();
        service.getHandler('download')(file);
        expect(contentService.getContentUrl).toHaveBeenCalledWith(file);
        expect(document.createElement).toHaveBeenCalledWith('a');
        expect(link.setAttribute).toHaveBeenCalledWith('download', 'download');
        expect(document.body.appendChild).toHaveBeenCalledWith(link);
        expect(link.click).toHaveBeenCalled();
        expect(document.body.removeChild).toHaveBeenCalledWith(link);
    });
    it('should require internal service for download action', function () {
        var actionService = new document_actions_service_1.DocumentActionsService(null, contentService);
        var file = new document_library_model_mock_1.FileNode();
        var result = actionService.getHandler('download')(file);
        expect(result).toBeFalsy();
    });
    it('should require content service for download action', function () {
        var actionService = new document_actions_service_1.DocumentActionsService(documentListService, null);
        var file = new document_library_model_mock_1.FileNode();
        var result = actionService.getHandler('download')(file);
        expect(result).toBeFalsy();
    });
    it('should require file node for download action', function () {
        var folder = new document_library_model_mock_1.FolderNode();
        expect(service.getHandler('download')(folder)).toBeFalsy();
    });
    it('should delete file node', function () {
        spyOn(documentListService, 'deleteNode').and.callThrough();
        var file = new document_library_model_mock_1.FileNode();
        service.getHandler('delete')(file);
        expect(documentListService.deleteNode).toHaveBeenCalledWith(file.entry.id);
    });
    it('should support deletion only file node', function () {
        spyOn(documentListService, 'deleteNode').and.callThrough();
        var folder = new document_library_model_mock_1.FolderNode();
        service.getHandler('delete')(folder);
        expect(documentListService.deleteNode).not.toHaveBeenCalled();
        var file = new document_library_model_mock_1.FileNode();
        service.getHandler('delete')(file);
        expect(documentListService.deleteNode).toHaveBeenCalled();
    });
    it('should require node id to delete', function () {
        spyOn(documentListService, 'deleteNode').and.callThrough();
        var file = new document_library_model_mock_1.FileNode();
        file.entry.id = null;
        service.getHandler('delete')(file);
        expect(documentListService.deleteNode).not.toHaveBeenCalled();
    });
    it('should reload target upon node deletion', function () {
        spyOn(documentListService, 'deleteNode').and.callThrough();
        var target = jasmine.createSpyObj('obj', ['reload']);
        var file = new document_library_model_mock_1.FileNode();
        service.getHandler('delete')(file, target);
        expect(documentListService.deleteNode).toHaveBeenCalled();
        expect(target.reload).toHaveBeenCalled();
    });
});
//# sourceMappingURL=document-actions.service.spec.js.map