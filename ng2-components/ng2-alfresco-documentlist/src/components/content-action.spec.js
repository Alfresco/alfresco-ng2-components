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
var core_1 = require("@angular/core");
var document_list_1 = require("./document-list");
var document_list_service_mock_1 = require("../assets/document-list.service.mock");
var content_action_list_1 = require("./content-action-list");
var content_action_1 = require("./content-action");
var document_actions_service_1 = require("../services/document-actions.service");
var folder_actions_service_1 = require("../services/folder-actions.service");
var document_library_model_mock_1 = require("../assets/document-library.model.mock");
describe('ContentAction', function () {
    var documentList;
    var actionList;
    var documentActions;
    var folderActions;
    beforeEach(function () {
        var documentServiceMock = new document_list_service_mock_1.DocumentListServiceMock();
        documentActions = new document_actions_service_1.DocumentActionsService(null, null);
        folderActions = new folder_actions_service_1.FolderActionsService(null);
        documentList = new document_list_1.DocumentList(documentServiceMock, null, null);
        actionList = new content_action_list_1.ContentActionList(documentList);
    });
    it('should register within parent actions list', function () {
        spyOn(actionList, 'registerAction').and.stub();
        var action = new content_action_1.ContentAction(actionList, null, null);
        action.ngOnInit();
        expect(actionList.registerAction).toHaveBeenCalled();
    });
    it('should setup and register model', function () {
        var action = new content_action_1.ContentAction(actionList, null, null);
        action.target = 'document';
        action.title = '<title>';
        action.icon = '<icon>';
        expect(documentList.actions.length).toBe(0);
        action.ngOnInit();
        expect(documentList.actions.length).toBe(1);
        var model = documentList.actions[0];
        expect(model.target).toBe(action.target);
        expect(model.title).toBe(action.title);
        expect(model.icon).toBe(action.icon);
    });
    it('should get action handler from document actions service', function () {
        var handler = function () { };
        spyOn(documentActions, 'getHandler').and.returnValue(handler);
        var action = new content_action_1.ContentAction(actionList, documentActions, null);
        action.target = 'document';
        action.handler = '<handler>';
        action.ngOnInit();
        expect(documentActions.getHandler).toHaveBeenCalledWith(action.handler);
        expect(documentList.actions.length).toBe(1);
        var model = documentList.actions[0];
        expect(model.handler).toBe(handler);
    });
    it('should get action handler from folder actions service', function () {
        var handler = function () { };
        spyOn(folderActions, 'getHandler').and.returnValue(handler);
        var action = new content_action_1.ContentAction(actionList, null, folderActions);
        action.target = 'folder';
        action.handler = '<handler>';
        action.ngOnInit();
        expect(folderActions.getHandler).toHaveBeenCalledWith(action.handler);
        expect(documentList.actions.length).toBe(1);
        var model = documentList.actions[0];
        expect(model.handler).toBe(handler);
    });
    it('should require target to get system handler', function () {
        spyOn(folderActions, 'getHandler').and.stub();
        spyOn(documentActions, 'getHandler').and.stub();
        var action = new content_action_1.ContentAction(actionList, documentActions, folderActions);
        action.handler = '<handler>';
        action.ngOnInit();
        expect(documentList.actions.length).toBe(1);
        expect(folderActions.getHandler).not.toHaveBeenCalled();
        expect(documentActions.getHandler).not.toHaveBeenCalled();
        action.target = 'document';
        action.ngOnInit();
        expect(documentActions.getHandler).toHaveBeenCalled();
        action.target = 'folder';
        action.ngOnInit();
        expect(folderActions.getHandler).toHaveBeenCalled();
    });
    it('should be case insensitive for document target', function () {
        spyOn(documentActions, 'getHandler').and.stub();
        var action = new content_action_1.ContentAction(actionList, documentActions, null);
        action.target = 'DoCuMeNt';
        action.handler = '<handler>';
        action.ngOnInit();
        expect(documentActions.getHandler).toHaveBeenCalledWith(action.handler);
    });
    it('should be case insensitive for folder target', function () {
        spyOn(folderActions, 'getHandler').and.stub();
        var action = new content_action_1.ContentAction(actionList, null, folderActions);
        action.target = 'FoLdEr';
        action.handler = '<handler>';
        action.ngOnInit();
        expect(folderActions.getHandler).toHaveBeenCalledWith(action.handler);
    });
    it('should use custom "execute" emitter', function (done) {
        var emitter = new core_1.EventEmitter();
        emitter.subscribe(function (e) {
            expect(e.value).toBe('<obj>');
            done();
        });
        var action = new content_action_1.ContentAction(actionList, null, null);
        action.target = 'document';
        action.execute = emitter;
        action.ngOnInit();
        expect(documentList.actions.length).toBe(1);
        var model = documentList.actions[0];
        model.handler('<obj>');
    });
    it('should sync localizable fields with model', function () {
        var action = new content_action_1.ContentAction(actionList, null, null);
        action.title = 'title1';
        action.ngOnInit();
        expect(action.model.title).toBe(action.title);
        action.title = 'title2';
        action.ngOnChanges(null);
        expect(action.model.title).toBe('title2');
    });
    it('should not find document action handler with missing service', function () {
        var action = new content_action_1.ContentAction(actionList, null, null);
        expect(action.getSystemHandler('document', 'name')).toBeNull();
    });
    it('should not find folder action handler with missing service', function () {
        var action = new content_action_1.ContentAction(actionList, null, null);
        expect(action.getSystemHandler('folder', 'name')).toBeNull();
    });
    it('should find document action handler via service', function () {
        var handler = function (obj, target) { };
        var action = new content_action_1.ContentAction(actionList, documentActions, null);
        spyOn(documentActions, 'getHandler').and.returnValue(handler);
        expect(action.getSystemHandler('document', 'name')).toBe(handler);
    });
    it('should find folder action handler via service', function () {
        var handler = function (obj, target) { };
        var action = new content_action_1.ContentAction(actionList, null, folderActions);
        spyOn(folderActions, 'getHandler').and.returnValue(handler);
        expect(action.getSystemHandler('folder', 'name')).toBe(handler);
    });
    it('should not find actions for unknown target type', function () {
        spyOn(folderActions, 'getHandler').and.stub();
        spyOn(documentActions, 'getHandler').and.stub();
        var action = new content_action_1.ContentAction(actionList, documentActions, folderActions);
        expect(action.getSystemHandler('unknown', 'name')).toBeNull();
        expect(folderActions.getHandler).not.toHaveBeenCalled();
        expect(documentActions.getHandler).not.toHaveBeenCalled();
    });
    it('should wire model with custom event handler', function (done) {
        var action = new content_action_1.ContentAction(actionList, documentActions, folderActions);
        var file = new document_library_model_mock_1.FileNode();
        var handler = new core_1.EventEmitter();
        handler.subscribe(function (e) {
            expect(e.value).toBe(file);
            done();
        });
        action.execute = handler;
        action.ngOnInit();
        action.model.handler(file);
    });
    it('should allow registering model without handler', function () {
        var action = new content_action_1.ContentAction(actionList, documentActions, folderActions);
        spyOn(actionList, 'registerAction').and.callThrough();
        action.execute = null;
        action.ngOnInit();
        expect(action.model.handler).toBeUndefined();
        expect(actionList.registerAction).toHaveBeenCalledWith(action.model);
    });
    it('should register on init', function () {
        var action = new content_action_1.ContentAction(actionList, null, null);
        spyOn(action, 'register').and.callThrough();
        action.ngOnInit();
        expect(action.register).toHaveBeenCalled();
    });
    it('should require action list to register action with', function () {
        var action = new content_action_1.ContentAction(actionList, null, null);
        expect(action.register()).toBeTruthy();
        action = new content_action_1.ContentAction(null, null, null);
        expect(action.register()).toBeFalsy();
    });
});
//# sourceMappingURL=content-action.spec.js.map