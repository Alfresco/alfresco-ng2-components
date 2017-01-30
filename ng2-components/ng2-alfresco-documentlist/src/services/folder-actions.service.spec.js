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
var folder_actions_service_1 = require("./folder-actions.service");
var document_library_model_mock_1 = require("../assets/document-library.model.mock");
var document_list_service_mock_1 = require("../assets/document-list.service.mock");
describe('FolderActionsService', function () {
    var service;
    var documentListService;
    beforeEach(function () {
        documentListService = new document_list_service_mock_1.DocumentListServiceMock();
        service = new folder_actions_service_1.FolderActionsService(documentListService);
    });
    it('should register custom action handler', function () {
        var handler = function (obj) {
        };
        service.setHandler('<key>', handler);
        expect(service.getHandler('<key>')).toBe(handler);
    });
    it('should not find handler that is not registered', function () {
        expect(service.getHandler('<missing>')).toBeNull();
    });
    it('should be case insensitive for keys', function () {
        var handler = function (obj) {
        };
        service.setHandler('<key>', handler);
        expect(service.getHandler('<KEY>')).toBe(handler);
    });
    it('should not find handler with invalid key', function () {
        expect(service.getHandler(null)).toBeNull();
        expect(service.getHandler('')).toBeNull();
    });
    it('should allow action execution only when service available', function () {
        var folder = new document_library_model_mock_1.FolderNode();
        expect(service.canExecuteAction(folder)).toBeTruthy();
        service = new folder_actions_service_1.FolderActionsService(null);
        expect(service.canExecuteAction(folder)).toBeFalsy();
    });
    it('should allow action execution only for folder nodes', function () {
        expect(service.canExecuteAction(null)).toBeFalsy();
        expect(service.canExecuteAction(new document_library_model_mock_1.FileNode())).toBeFalsy();
        expect(service.canExecuteAction(new document_library_model_mock_1.FolderNode())).toBeTruthy();
    });
    it('should set new handler only by key', function () {
        var handler = function (obj) {
        };
        expect(service.setHandler(null, handler)).toBeFalsy();
        expect(service.setHandler('', handler)).toBeFalsy();
        expect(service.setHandler('my-handler', handler)).toBeTruthy();
    });
    it('should execute demo actions', function () {
        spyOn(window, 'alert').and.stub();
        service.getHandler('system1')(null);
        expect(window.alert).toHaveBeenCalledWith('standard folder action 1');
        service.getHandler('system2')(null);
        expect(window.alert).toHaveBeenCalledWith('standard folder action 2');
    });
    it('should register demo handlers', function () {
        expect(service.getHandler('system1')).toBeDefined();
        expect(service.getHandler('system2')).toBeDefined();
    });
    it('should register delete action', function () {
        expect(service.getHandler('delete')).toBeDefined();
    });
    it('should delete folder node', function () {
        spyOn(documentListService, 'deleteNode').and.callThrough();
        var folder = new document_library_model_mock_1.FolderNode();
        service.getHandler('delete')(folder);
        expect(documentListService.deleteNode).toHaveBeenCalledWith(folder.entry.id);
    });
    it('should support deletion only folder node', function () {
        spyOn(documentListService, 'deleteNode').and.callThrough();
        var file = new document_library_model_mock_1.FileNode();
        service.getHandler('delete')(file);
        expect(documentListService.deleteNode).not.toHaveBeenCalled();
        var folder = new document_library_model_mock_1.FolderNode();
        service.getHandler('delete')(folder);
        expect(documentListService.deleteNode).toHaveBeenCalled();
    });
    it('should require node id to delete', function () {
        spyOn(documentListService, 'deleteNode').and.callThrough();
        var folder = new document_library_model_mock_1.FolderNode();
        folder.entry.id = null;
        service.getHandler('delete')(folder);
        expect(documentListService.deleteNode).not.toHaveBeenCalled();
    });
    it('should reload target upon node deletion', function () {
        spyOn(documentListService, 'deleteNode').and.callThrough();
        var target = jasmine.createSpyObj('obj', ['reload']);
        var folder = new document_library_model_mock_1.FolderNode();
        service.getHandler('delete')(folder, target);
        expect(documentListService.deleteNode).toHaveBeenCalled();
        expect(target.reload).toHaveBeenCalled();
    });
});
//# sourceMappingURL=folder-actions.service.spec.js.map