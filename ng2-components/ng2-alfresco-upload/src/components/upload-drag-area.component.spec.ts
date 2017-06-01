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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { EventEmitter, DebugElement } from '@angular/core';
import { AlfrescoTranslationService, CoreModule, LogService, LogServiceMock } from 'ng2-alfresco-core';

import { UploadDragAreaComponent } from './upload-drag-area.component';
import { FileDraggableDirective } from '../directives/file-draggable.directive';
import { TranslationMock } from '../assets/translation.service.mock';
import { UploadService } from '../services/upload.service';
import { FileModel } from '../models/file.model';

describe('UploadDragAreaComponent', () => {

    let component: UploadDragAreaComponent;
    let fixture: ComponentFixture<UploadDragAreaComponent>;
    let debug: DebugElement;
    let element: HTMLElement;
    let uploadService: UploadService;
    let logService: LogService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                FileDraggableDirective,
                UploadDragAreaComponent
            ],
            providers: [
                UploadService,
                { provide: AlfrescoTranslationService, useClass: TranslationMock },
                { provide: LogService, useClass: LogServiceMock }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        logService = TestBed.get(LogService);
        fixture = TestBed.createComponent(UploadDragAreaComponent);
        uploadService = TestBed.get(UploadService);

        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should upload the list of files dropped', () => {
        component.currentFolderPath = '/root-fake-/sites-fake/folder-fake';
        component.onSuccess = null;
        component.showNotificationBar = false;
        uploadService.addToQueue = jasmine.createSpy('addToQueue');
        uploadService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');

        fixture.detectChanges();
        const file = <File> {name: 'fake-name-1', size: 10, webkitRelativePath: 'fake-folder1/fake-name-1.json'};
        let fileFake = new FileModel(file);
        let filesList = [fileFake];

        component.onFilesDropped(filesList);
        expect(uploadService.addToQueue).toHaveBeenCalledWith(fileFake);
        expect(uploadService.uploadFilesInTheQueue).toHaveBeenCalledWith('-root-', '/root-fake-/sites-fake/folder-fake', null);
    });

    it('should show the loading messages in the notification bar when the files are dropped', () => {
        component.currentFolderPath = '/root-fake-/sites-fake/folder-fake';
        component.onSuccess = null;
        component.showNotificationBar = true;
        uploadService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');
        component.showUndoNotificationBar = jasmine.createSpy('_showUndoNotificationBar');

        fixture.detectChanges();
        let fileFake = new FileModel(<File> {name: 'fake-name-1', size: 10, webkitRelativePath: 'fake-folder1/fake-name-1.json'});
        let filesList = [fileFake];

        component.onFilesDropped(filesList);
        expect(uploadService.uploadFilesInTheQueue).toHaveBeenCalledWith('-root-', '/root-fake-/sites-fake/folder-fake', null);
        expect(component.showUndoNotificationBar).toHaveBeenCalled();
    });

    it('should upload a file when dropped', () => {
        component.currentFolderPath = '/root-fake-/sites-fake/document-library-fake';
        component.onSuccess = null;

        fixture.detectChanges();
        spyOn(uploadService, 'uploadFilesInTheQueue');

        let itemEntity = {
            fullPath: '/folder-fake/file-fake.png',
            isDirectory: false,
            isFile: true,
            name: 'file-fake.png',
            file: (callbackFile) => {
                let fileFake = new File(['fakefake'], 'file-fake.png', {type: 'image/png'});
                callbackFile(fileFake);
            }
        };

        component.onFilesEntityDropped(itemEntity);
        expect(uploadService.uploadFilesInTheQueue)
            .toHaveBeenCalledWith('-root-', '/root-fake-/sites-fake/document-library-fake/folder-fake/', null);
    });

    it('should upload a file with a custom root folder ID when dropped', () => {
        component.currentFolderPath = '/root-fake-/sites-fake/document-library-fake';
        component.rootFolderId = '-my-';
        component.onSuccess = null;

        fixture.detectChanges();
        spyOn(uploadService, 'uploadFilesInTheQueue');

        let itemEntity = {
            fullPath: '/folder-fake/file-fake.png',
            isDirectory: false,
            isFile: true,
            name: 'file-fake.png',
            file: (callbackFile) => {
                let fileFake = new File(['fakefake'], 'file-fake.png', {type: 'image/png'});
                callbackFile(fileFake);
            }
        };

        component.onFilesEntityDropped(itemEntity);
        expect(uploadService.uploadFilesInTheQueue)
            .toHaveBeenCalledWith('-my-', '/root-fake-/sites-fake/document-library-fake/folder-fake/', null);
    });
});
