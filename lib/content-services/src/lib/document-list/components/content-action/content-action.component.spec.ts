/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { SimpleChange, EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FileNode } from '../../../mock';
import { ContentActionModel } from './../../models/content-action.model';
import { DocumentActionsService } from './../../services/document-actions.service';
import { FolderActionsService } from './../../services/folder-actions.service';
import { DocumentListComponent } from './../document-list.component';
import { ContentActionListComponent } from './content-action-list.component';
import { ContentActionComponent } from './content-action.component';
import { NoopAuthModule } from '@alfresco/adf-core';

describe('ContentAction', () => {
    let documentList: DocumentListComponent;
    let actionList: ContentActionListComponent;
    let documentActionsService: DocumentActionsService;
    let folderActionsService: FolderActionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAuthModule]
        });

        const docListFixture = TestBed.createComponent(DocumentListComponent);
        documentList = docListFixture.componentInstance;

        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [NoopAuthModule],
            providers: [
                { provide: DocumentListComponent, useValue: documentList },
                ContentActionListComponent,
                DocumentActionsService,
                FolderActionsService
            ]
        });
        actionList = TestBed.inject(ContentActionListComponent);
        documentActionsService = TestBed.inject(DocumentActionsService);
        folderActionsService = TestBed.inject(FolderActionsService);
    });

    afterEach(() => {
        documentList.actions = [];
    });

    it('should register within parent actions list', () => {
        spyOn(actionList, 'registerAction').and.stub();

        const action = TestBed.createComponent(ContentActionComponent).componentInstance as ContentActionComponent;
        action.ngOnInit();

        expect(actionList.registerAction).toHaveBeenCalled();
    });

    it('should setup and register model', () => {
        const action = TestBed.createComponent(ContentActionComponent).componentInstance as ContentActionComponent;
        action.target = 'document';
        action.title = '<title>';
        action.icon = '<icon>';

        expect(documentList.actions.length).toBe(0);
        action.ngOnInit();

        expect(documentList.actions.length).toBe(1);

        const model = documentList.actions[0];
        expect(model.target).toBe(action.target);
        expect(model.title).toBe(action.title);
        expect(model.icon).toBe(action.icon);
    });

    it('should update visibility binding', () => {
        const action = TestBed.createComponent(ContentActionComponent).componentInstance as ContentActionComponent;
        action.target = 'document';
        action.title = '<title>';
        action.icon = '<icon>';

        action.visible = true;
        action.ngOnInit();
        expect(action.documentActionModel.visible).toBeTruthy();

        action.visible = false;
        action.ngOnChanges({
            visible: new SimpleChange(true, false, false)
        });

        expect(action.documentActionModel.visible).toBeFalsy();
    });

    it('should get action handler from document actions service', () => {
        const handler = () => {};
        spyOn(documentActionsService, 'getHandler').and.returnValue(handler);

        const action = TestBed.createComponent(ContentActionComponent).componentInstance as ContentActionComponent;

        action.target = 'document';
        action.handler = '<handler>';
        action.ngOnInit();

        expect(documentActionsService.getHandler).toHaveBeenCalledWith(action.handler);
        expect(documentList.actions.length).toBe(1);

        const model = documentList.actions[0];
        expect(model.handler).toBe(handler);
    });

    it('should get action handler from folder actions service', () => {
        const handler = () => {};
        spyOn(folderActionsService, 'getHandler').and.returnValue(handler);

        const action = TestBed.createComponent(ContentActionComponent).componentInstance as ContentActionComponent;

        action.target = 'folder';
        action.handler = '<handler>';
        action.ngOnInit();

        expect(folderActionsService.getHandler).toHaveBeenCalledWith(action.handler);
        expect(documentList.actions.length).toBe(1);

        const model = documentList.actions[0];
        expect(model.handler).toBe(handler);
    });

    it('should create document and folder action when there is no target', () => {
        spyOn(folderActionsService, 'getHandler').and.stub();
        spyOn(documentActionsService, 'getHandler').and.stub();

        const action = TestBed.createComponent(ContentActionComponent).componentInstance as ContentActionComponent;

        action.handler = '<handler>';

        action.ngOnInit();
        expect(documentList.actions.length).toBe(2);
        expect(folderActionsService.getHandler).toHaveBeenCalled();
        expect(documentActionsService.getHandler).toHaveBeenCalled();
    });

    it('should create document action when target is document', () => {
        spyOn(folderActionsService, 'getHandler').and.stub();
        spyOn(documentActionsService, 'getHandler').and.stub();

        const action = TestBed.createComponent(ContentActionComponent).componentInstance as ContentActionComponent;

        action.handler = '<handler>';
        action.target = 'document';

        action.ngOnInit();
        expect(documentList.actions.length).toBe(1);
        expect(folderActionsService.getHandler).not.toHaveBeenCalled();
        expect(documentActionsService.getHandler).toHaveBeenCalled();
    });

    it('should create folder action when target is folder', () => {
        spyOn(folderActionsService, 'getHandler').and.stub();
        spyOn(documentActionsService, 'getHandler').and.stub();

        const action = TestBed.createComponent(ContentActionComponent).componentInstance as ContentActionComponent;

        action.handler = '<handler>';
        action.target = 'folder';

        action.ngOnInit();
        expect(documentList.actions.length).toBe(1);
        expect(folderActionsService.getHandler).toHaveBeenCalled();
        expect(documentActionsService.getHandler).not.toHaveBeenCalled();
    });

    it('should be case insensitive for document target', () => {
        spyOn(documentActionsService, 'getHandler').and.stub();

        const action = TestBed.createComponent(ContentActionComponent).componentInstance as ContentActionComponent;

        action.target = 'DoCuMeNt';
        action.handler = '<handler>';

        action.ngOnInit();
        expect(documentActionsService.getHandler).toHaveBeenCalledWith(action.handler);
    });

    it('should be case insensitive for folder target', () => {
        spyOn(folderActionsService, 'getHandler').and.stub();

        const action = TestBed.createComponent(ContentActionComponent).componentInstance as ContentActionComponent;

        action.target = 'FoLdEr';
        action.handler = '<handler>';

        action.ngOnInit();
        expect(folderActionsService.getHandler).toHaveBeenCalledWith(action.handler);
    });

    it('should use custom "execute" emitter', (done) => {
        const action = TestBed.createComponent(ContentActionComponent).componentInstance as ContentActionComponent;
        const emitter = new EventEmitter();

        emitter.subscribe((e) => {
            expect(e.value).toBe('<obj>');
            done();
        });

        action.target = 'document';
        action.execute = emitter;

        action.ngOnInit();
        expect(documentList.actions.length).toBe(1);

        const model = documentList.actions[0];
        model.execute('<obj>');
    });

    it('should not find document action handler with missing service', () => {
        const action = TestBed.createComponent(ContentActionComponent).componentInstance as ContentActionComponent;
        expect(action.getSystemHandler('document', 'name')).toBeNull();
    });

    it('should not find folder action handler with missing service', () => {
        const action = TestBed.createComponent(ContentActionComponent).componentInstance as ContentActionComponent;
        expect(action.getSystemHandler('folder', 'name')).toBeNull();
    });

    it('should find document action handler via service', () => {
        const handler = () => {};
        spyOn(documentActionsService, 'getHandler').and.returnValue(handler);

        const action = TestBed.createComponent(ContentActionComponent).componentInstance as ContentActionComponent;
        expect(action.getSystemHandler('document', 'name')).toBe(handler);
    });

    it('should find folder action handler via service', () => {
        const handler = () => {};
        spyOn(folderActionsService, 'getHandler').and.returnValue(handler);

        const action = TestBed.createComponent(ContentActionComponent).componentInstance as ContentActionComponent;
        expect(action.getSystemHandler('folder', 'name')).toBe(handler);
    });

    it('should not find actions for unknown target type', () => {
        spyOn(folderActionsService, 'getHandler').and.stub();
        spyOn(documentActionsService, 'getHandler').and.stub();

        const action = TestBed.createComponent(ContentActionComponent).componentInstance as ContentActionComponent;

        expect(action.getSystemHandler('unknown', 'name')).toBeNull();
        expect(folderActionsService.getHandler).not.toHaveBeenCalled();
        expect(documentActionsService.getHandler).not.toHaveBeenCalled();
    });

    it('should wire model with custom event handler', (done) => {
        const action = TestBed.createComponent(ContentActionComponent).componentInstance as ContentActionComponent;
        const file = new FileNode();

        const handler = new EventEmitter();
        handler.subscribe((e) => {
            expect(e.value).toBe(file);
            done();
        });

        action.execute = handler;

        action.ngOnInit();
        documentList.actions[0].execute(file);
    });

    it('should allow registering model without handler', () => {
        spyOn(actionList, 'registerAction').and.callThrough();

        const action = TestBed.createComponent(ContentActionComponent).componentInstance as ContentActionComponent;

        action.execute = null;
        action.handler = null;
        action.target = 'document';
        action.ngOnInit();

        expect(actionList.registerAction).toHaveBeenCalledWith(documentList.actions[0]);
    });

    it('should register on init', () => {
        const action = TestBed.createComponent(ContentActionComponent).componentInstance as ContentActionComponent;
        spyOn(action, 'register').and.callThrough();

        action.ngOnInit();
        expect(action.register).toHaveBeenCalled();
    });

    it('should require action list to register action with', () => {
        const fakeModel = new ContentActionModel();
        let action = TestBed.createComponent(ContentActionComponent).componentInstance as ContentActionComponent;
        expect(action.register(fakeModel)).toBeTruthy();

        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [NoopAuthModule],
            providers: [{ provide: ContentActionListComponent, useValue: null }]
        });
        action = TestBed.createComponent(ContentActionComponent).componentInstance as ContentActionComponent;
        expect(action.register(fakeModel)).toBeFalsy();
    });
});
