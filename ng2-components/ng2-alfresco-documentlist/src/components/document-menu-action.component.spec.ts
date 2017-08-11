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

import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { MaterialModule } from './../material.module';
import { DocumentListService } from './../services/document-list.service';
import { DocumentMenuActionComponent } from './document-menu-action.component';

declare let jasmine: any;

let exampleFolderWithCreate = {
    'entry': {
        'aspectNames': ['cm:auditable'],
        'allowableOperations': ['create'],
        'createdAt': '2017-04-03T11:34:35.708+0000',
        'isFolder': true,
        'isFile': false,
        'createdByUser': { 'id': 'admin', 'displayName': 'Administrator' },
        'modifiedAt': '2017-04-03T11:34:35.708+0000',
        'modifiedByUser': { 'id': 'admin', 'displayName': 'Administrator' },
        'name': 'test-folder2',
        'id': 'c0284dc3-841d-48b2-955c-bcb2218e2b03',
        'nodeType': 'cm:folder',
        'parentId': '1ee81bf8-52d6-4cfc-a924-1efbc79306bf'
    }
};

let exampleFolderWithPermissions = {
    'entry': {
        'aspectNames': ['cm:auditable'],
        'allowableOperations': ['check'],
        'createdAt': '2017-04-03T11:34:35.708+0000',
        'isFolder': true,
        'isFile': false,
        'createdByUser': { 'id': 'admin', 'displayName': 'Administrator' },
        'modifiedAt': '2017-04-03T11:34:35.708+0000',
        'modifiedByUser': { 'id': 'admin', 'displayName': 'Administrator' },
        'name': 'test-folder2',
        'id': 'c0284dc3-841d-48b2-955c-bcb2218e2b03',
        'nodeType': 'cm:folder',
        'parentId': '1ee81bf8-52d6-4cfc-a924-1efbc79306bf'
    }
};

let exampleFolderWithNoOperations = {
    'entry': {
        'aspectNames': ['cm:auditable'],
        'createdAt': '2017-04-03T11:34:35.708+0000',
        'isFolder': true,
        'isFile': false,
        'createdByUser': { 'id': 'admin', 'displayName': 'Administrator' },
        'modifiedAt': '2017-04-03T11:34:35.708+0000',
        'modifiedByUser': { 'id': 'admin', 'displayName': 'Administrator' },
        'name': 'test-folder2',
        'id': 'c0284dc3-841d-48b2-955c-bcb2218e2b03',
        'nodeType': 'cm:folder',
        'parentId': '1ee81bf8-52d6-4cfc-a924-1efbc79306bf'
    }
};

describe('Document menu action', () => {

    let component: DocumentMenuActionComponent;
    let fixture: ComponentFixture<DocumentMenuActionComponent>;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                MaterialModule
            ],
            declarations: [DocumentMenuActionComponent],
            providers: [
                AlfrescoTranslationService,
                DocumentListService
            ]
        });

        TestBed.compileComponents();

        let translateService = TestBed.get(AlfrescoTranslationService);
        spyOn(translateService, 'get').and.returnValue({ value: 'fake translated message' });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DocumentMenuActionComponent);

        element = fixture.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();

        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    describe('Folder creation', () => {

        it('should createFolder fire a success event if the folder has been created', (done) => {
            component.allowableOperations = ['create'];
            component.showDialog();

            component.createFolder('test-folder');

            component.success.subscribe(() => {
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify(exampleFolderWithCreate)
            });
        });

        it('should createFolder fire an error event if the folder has not been created', (done) => {
            component.allowableOperations = ['create'];
            component.showDialog();

            component.createFolder('test-folder');

            component.error.subscribe(() => {
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
            });
        });

        it('should createFolder fire an error when folder already exists', (done) => {
            component.allowableOperations = ['create'];
            component.showDialog();

            component.createFolder('test-folder');

            component.error.subscribe((err) => {
                expect(err.message).toEqual('fake translated message');
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403,
                responseText: JSON.stringify({ message: 'Fake folder exists', error: { statusCode: 409 } })
            });
        });
    });

    describe('Check Permissions', () => {

        it('should get the folder permission when folderId is changed', async(() => {
            let change = new SimpleChange('folder-id', 'new-folder-id', true);
            component.ngOnChanges({ 'folderId': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify(exampleFolderWithCreate)
            });

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let createButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#folder-create-button');
                expect(createButton).toBeDefined();
                expect(component.allowableOperations).toBeDefined();
                expect(component.allowableOperations).not.toBeNull();
                expect(createButton.disabled).toBeFalsy();
            });
        }));

        it('should disable the create button if folder does not have any allowable operations', async(() => {
            let change = new SimpleChange('folder-id', 'new-folder-id', true);
            component.ngOnChanges({ 'folderId': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify(exampleFolderWithNoOperations)
            });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let createButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#folder-create-button');
                expect(createButton).toBeDefined();
                expect(createButton.disabled).toBeTruthy();
            });
        }));

        it('should disable the create button if folder does not have create permission', async(() => {
            let change = new SimpleChange('folder-id', 'new-folder-id', true);
            component.ngOnChanges({ 'folderId': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify(exampleFolderWithPermissions)
            });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let createButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#folder-create-button');
                expect(createButton).toBeDefined();
                expect(createButton.disabled).toBeTruthy();
            });
        }));

        it('should not disable the option when disableWithNoPermission is false', async(() => {
            component.disableWithNoPermission = false;
            let change = new SimpleChange('folder-id', 'new-folder-id', true);
            component.ngOnChanges({ 'folderId': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify(exampleFolderWithNoOperations)
            });

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let createButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#folder-create-button');
                expect(createButton).toBeDefined();
                expect(createButton.disabled).toBeFalsy();
            });
        }));

        it('should emit permission event error when user does not have create permission', async(() => {
            let change = new SimpleChange('folder-id', 'new-folder-id', true);
            component.ngOnChanges({ 'folderId': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify(exampleFolderWithNoOperations)
            });

            component.permissionErrorEvent.subscribe((error) => {
                expect(error.type).toEqual('folder');
                expect(error.action).toEqual('create');
            });
            component.showDialog();
            component.createFolder('not-allowed');
        }));
    });
});
