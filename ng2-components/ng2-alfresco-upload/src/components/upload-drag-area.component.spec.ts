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

import { describe, expect, it, inject, beforeEach, beforeEachProviders } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { UploadDragAreaComponent } from './upload-drag-area.component';
import { AlfrescoTranslationService, AlfrescoSettingsService } from 'ng2-alfresco-core';
import { AlfrescoSettingsServiceMock } from '../assets/AlfrescoSettingsService.service.mock';
import { TranslationMock } from '../assets/translation.service.mock';
import { UploadServiceMock } from '../assets/upload.service.mock';
import { UploadService } from '../services/upload.service';
import { AlfrescoApiMock } from '../assets/AlfrescoApi.mock';

declare var AlfrescoApi: any;

describe('AlfrescoUploadDragArea', () => {

    let componentFixture;

    beforeEach( () => {
        window['AlfrescoApi'] = AlfrescoApiMock;
    });

    beforeEachProviders(() => {
        return [
            { provide: AlfrescoSettingsService, useClass: AlfrescoSettingsServiceMock },
            { provide: AlfrescoTranslationService, useClass: TranslationMock },
            { provide: UploadService, useClass: UploadServiceMock }
        ];
    });

    beforeEach( inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(UploadDragAreaComponent)
            .then(fixture => componentFixture = fixture);
    }));

    it('should show an folder non supported error in console when the file type is empty', () => {
        let component = componentFixture.componentInstance;
        component.showUdoNotificationBar = false;
        spyOn(console, 'error');

        let fileFake = new File([''], 'folder-fake', {type: ''});
        component.onFilesDropped([fileFake]);

        expect(console.error).toHaveBeenCalledWith('FILE_UPLOAD.MESSAGES.FOLDER_NOT_SUPPORTED');
    });

    it('should show an folder non supported error in the notification bar when the file type is empty', () => {
        let component = componentFixture.componentInstance;
        component._showErrorNotificationBar = jasmine.createSpy('_showErrorNotificationBar');
        component.showUdoNotificationBar = true;

        let fileFake = new File([''], 'folder-fake', {type: ''});
        component.onFilesDropped([fileFake]);

        expect(component._showErrorNotificationBar).toHaveBeenCalledWith('FILE_UPLOAD.MESSAGES.FOLDER_NOT_SUPPORTED');
    });

    it('should upload the list of files dropped', () => {
        let component = componentFixture.componentInstance;
        component.currentFolderPath = '/root-fake-/sites-fake/folder-fake';
        component.onSuccess = null;
        component.showUdoNotificationBar = false;
        component._uploaderService.addToQueue = jasmine.createSpy('addToQueue');
        component._uploaderService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');

        componentFixture.detectChanges();
        let fileFake = {name: 'fake-name-1', size: 10, webkitRelativePath: 'fake-folder1/fake-name-1.json'};
        let filesList = [fileFake];

        component.onFilesDropped(filesList);
        expect(component._uploaderService.addToQueue).toHaveBeenCalledWith(filesList);
        expect(component._uploaderService.uploadFilesInTheQueue).toHaveBeenCalledWith('/root-fake-/sites-fake/folder-fake', null);
    });

    it('should show the loading messages in the notification bar when the files are dropped', () => {
        let component = componentFixture.componentInstance;
        component.currentFolderPath = '/root-fake-/sites-fake/folder-fake';
        component.onSuccess = null;
        component.showUdoNotificationBar = true;
        component._uploaderService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');
        component._showUndoNotificationBar = jasmine.createSpy('_showUndoNotificationBar');

        componentFixture.detectChanges();
        let fileFake = {name: 'fake-name-1', size: 10, webkitRelativePath: 'fake-folder1/fake-name-1.json'};
        let filesList = [fileFake];

        component.onFilesDropped(filesList);
        expect(component._uploaderService.uploadFilesInTheQueue).toHaveBeenCalledWith('/root-fake-/sites-fake/folder-fake', null);
        expect(component._showUndoNotificationBar).toHaveBeenCalled();
    });

});
