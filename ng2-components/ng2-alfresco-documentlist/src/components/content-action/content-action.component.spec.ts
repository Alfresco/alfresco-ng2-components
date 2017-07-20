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
import { async, TestBed } from '@angular/core/testing';
import { AlfrescoContentService, AlfrescoTranslationService, CoreModule, NotificationService } from 'ng2-alfresco-core';
import { FileNode } from './../../assets/document-library.model.mock';
import { DocumentListServiceMock } from './../../assets/document-list.service.mock';
import { ContentActionHandler } from './../../models/content-action.model';
import { DocumentActionsService } from './../../services/document-actions.service';
import { FolderActionsService } from './../../services/folder-actions.service';
import { DocumentListComponent } from './../document-list.component';
import { ContentActionListComponent } from './content-action-list.component';
import { ContentActionComponent } from './content-action.component';

describe('ContentAction', () => {

    let documentList: DocumentListComponent;
    let actionList: ContentActionListComponent;
    let documentActions: DocumentActionsService;
    let folderActions: FolderActionsService;

    let contentService: AlfrescoContentService;
    let translateService: AlfrescoTranslationService;
    let notificationService: NotificationService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            providers: [
                AlfrescoContentService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        contentService = TestBed.get(AlfrescoContentService);
        translateService = <AlfrescoTranslationService> { addTranslationFolder: () => {}};
        notificationService = new NotificationService(null);
        let documentServiceMock = new DocumentListServiceMock();
        documentActions = new DocumentActionsService(null, translateService, notificationService);
        folderActions = new FolderActionsService(null, contentService);

        documentList = new DocumentListComponent(documentServiceMock, null, null, null);
        actionList = new ContentActionListComponent(documentList);
    });

    it('should register within parent actions list', () => {
        spyOn(actionList, 'registerAction').and.stub();

        let action = new ContentActionComponent(actionList, null, null);
        action.ngOnInit();

        expect(actionList.registerAction).toHaveBeenCalled();
    });

    it('should setup and register model', () => {
        let action = new ContentActionComponent(actionList, null, null);
        action.target = 'document';
        action.title = '<title>';
        action.icon = '<icon>';

        expect(documentList.actions.length).toBe(0);
        action.ngOnInit();

        expect(documentList.actions.length).toBe(1);

        let model = documentList.actions[0];
        expect(model.target).toBe(action.target);
        expect(model.title).toBe(action.title);
        expect(model.icon).toBe(action.icon);
    });

    it('should get action handler from document actions service', () => {

        let handler = function () {
        };
        spyOn(documentActions, 'getHandler').and.returnValue(handler);

        let action = new ContentActionComponent(actionList, documentActions, null);
        action.target = 'document';
        action.handler = '<handler>';
        action.ngOnInit();

        expect(documentActions.getHandler).toHaveBeenCalledWith(action.handler);
        expect(documentList.actions.length).toBe(1);

        let model = documentList.actions[0];
        expect(model.handler).toBe(handler);
    });

    it('should get action handler from folder actions service', () => {
        let handler = function () {
        };
        spyOn(folderActions, 'getHandler').and.returnValue(handler);

        let action = new ContentActionComponent(actionList, null, folderActions);
        action.target = 'folder';
        action.handler = '<handler>';
        action.ngOnInit();

        expect(folderActions.getHandler).toHaveBeenCalledWith(action.handler);
        expect(documentList.actions.length).toBe(1);

        let model = documentList.actions[0];
        expect(model.handler).toBe(handler);
    });

    it('should require target to get system handler', () => {
        spyOn(folderActions, 'getHandler').and.stub();
        spyOn(documentActions, 'getHandler').and.stub();

        let action = new ContentActionComponent(actionList, documentActions, folderActions);
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

    it('should be case insensitive for document target', () => {
        spyOn(documentActions, 'getHandler').and.stub();

        let action = new ContentActionComponent(actionList, documentActions, null);
        action.target = 'DoCuMeNt';
        action.handler = '<handler>';

        action.ngOnInit();
        expect(documentActions.getHandler).toHaveBeenCalledWith(action.handler);
    });

    it('should be case insensitive for folder target', () => {
        spyOn(folderActions, 'getHandler').and.stub();

        let action = new ContentActionComponent(actionList, null, folderActions);
        action.target = 'FoLdEr';
        action.handler = '<handler>';

        action.ngOnInit();
        expect(folderActions.getHandler).toHaveBeenCalledWith(action.handler);
    });

    it('should use custom "execute" emitter', (done) => {
        let emitter = new EventEmitter();

        emitter.subscribe(e => {
            expect(e.value).toBe('<obj>');
            done();
        });

        let action = new ContentActionComponent(actionList, null, null);
        action.target = 'document';
        action.execute = emitter;

        action.ngOnInit();
        expect(documentList.actions.length).toBe(1);

        let model = documentList.actions[0];
        model.execute('<obj>');
    });

    it('should sync localizable fields with model', () => {

        let action = new ContentActionComponent(actionList, null, null);
        action.title = 'title1';
        action.ngOnInit();

        expect(action.model.title).toBe(action.title);

        action.title = 'title2';
        action.ngOnChanges(null);

        expect(action.model.title).toBe('title2');
    });

    it('should not find document action handler with missing service', () => {
        let action = new ContentActionComponent(actionList, null, null);
        expect(action.getSystemHandler('document', 'name')).toBeNull();
    });

    it('should not find folder action handler with missing service', () => {
        let action = new ContentActionComponent(actionList, null, null);
        expect(action.getSystemHandler('folder', 'name')).toBeNull();
    });

    it('should find document action handler via service', () => {
        let handler = <ContentActionHandler> function (obj: any, target?: any) {
        };
        let action = new ContentActionComponent(actionList, documentActions, null);
        spyOn(documentActions, 'getHandler').and.returnValue(handler);
        expect(action.getSystemHandler('document', 'name')).toBe(handler);
    });

    it('should find folder action handler via service', () => {
        let handler = <ContentActionHandler> function (obj: any, target?: any) {
        };
        let action = new ContentActionComponent(actionList, null, folderActions);
        spyOn(folderActions, 'getHandler').and.returnValue(handler);
        expect(action.getSystemHandler('folder', 'name')).toBe(handler);
    });

    it('should not find actions for unknown target type', () => {
        spyOn(folderActions, 'getHandler').and.stub();
        spyOn(documentActions, 'getHandler').and.stub();

        let action = new ContentActionComponent(actionList, documentActions, folderActions);

        expect(action.getSystemHandler('unknown', 'name')).toBeNull();
        expect(folderActions.getHandler).not.toHaveBeenCalled();
        expect(documentActions.getHandler).not.toHaveBeenCalled();

    });

    it('should wire model with custom event handler', (done) => {
        let action = new ContentActionComponent(actionList, documentActions, folderActions);
        let file = new FileNode();

        let handler = new EventEmitter();
        handler.subscribe((e) => {
            expect(e.value).toBe(file);
            done();
        });

        action.execute = handler;

        action.ngOnInit();
        action.model.execute(file);
    });

    it('should allow registering model without handler', () => {
        let action = new ContentActionComponent(actionList, documentActions, folderActions);

        spyOn(actionList, 'registerAction').and.callThrough();
        action.execute = null;
        action.ngOnInit();

        expect(action.model.handler).toBeUndefined();
        expect(actionList.registerAction).toHaveBeenCalledWith(action.model);
    });

    it('should register on init', () => {
        let action = new ContentActionComponent(actionList, null, null);
        spyOn(action, 'register').and.callThrough();

        action.ngOnInit();
        expect(action.register).toHaveBeenCalled();
    });

    it('should require action list to register action with', () => {
        let action = new ContentActionComponent(actionList, null, null);
        expect(action.register()).toBeTruthy();

        action = new ContentActionComponent(null, null, null);
        expect(action.register()).toBeFalsy();
    });
});
