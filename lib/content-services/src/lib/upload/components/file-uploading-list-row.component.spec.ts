/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { FileUploadingListRowComponent } from './file-uploading-list-row.component';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { FileModel, FileUploadStatus } from '../../common/models/file.model';

describe('FileUploadingListRowComponent', () => {
    let fixture: ComponentFixture<FileUploadingListRowComponent>;
    let component: FileUploadingListRowComponent;
    const file = new FileModel({ name: 'fake-name' } as File);

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FileUploadingListRowComponent);
        component = fixture.componentInstance;
    });

    describe('events', () => {
        beforeEach(() => {
            component.file = file;
        });

        it('should emit cancel event', () => {
            spyOn(component.cancel, 'emit');
            component.onCancel(component.file);

            expect(component.cancel.emit).toHaveBeenCalledWith(file);
        });
    });

    it('should render node version when upload a version file', () => {
        component.file = new FileModel({ name: 'fake-name' } as File);
        component.file.options = { newVersion: true };
        component.file.data = { entry: { properties: { 'cm:versionLabel': '1' } } };

        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector(
            '.adf-file-uploading-row__version'
        ).textContent).toContain('1');
    });

    it('should show cancel button when upload is in progress', async () => {
        component.file = new FileModel({ name: 'fake-name' } as File);
        component.file.data = { entry: { properties: { 'cm:versionLabel': '1' } } };
        component.file.status = FileUploadStatus.Progress;

        fixture.detectChanges();
        await fixture.whenStable();

        const cancelButton = fixture.debugElement.query(By.css('[data-automation-id="cancel-upload-progress"]'));
        expect(cancelButton).not.toBeNull();
    });

    it('should show cancel button when upload is starting', async () => {
        component.file = new FileModel({ name: 'fake-name' } as File);
        component.file.data = { entry: { properties: { 'cm:versionLabel': '1' } } };
        component.file.status = FileUploadStatus.Starting;

        fixture.detectChanges();
        await fixture.whenStable();

        const cancelButton = fixture.debugElement.query(By.css('[data-automation-id="cancel-upload-progress"]'));
        expect(cancelButton).not.toBeNull();
    });

    it('should hide cancel button when upload is complete', async () => {
        component.file = new FileModel({ name: 'fake-name' } as File);
        component.file.data = { entry: { properties: { 'cm:versionLabel': '1' } } };
        component.file.status = FileUploadStatus.Complete;

        fixture.detectChanges();
        await fixture.whenStable();

        const cancelButton = fixture.debugElement.query(By.css('[data-automation-id="cancel-upload-progress"]'));
        expect(cancelButton).toBeNull();
    });

    it('should provide tooltip for the cancel button', async () => {
        component.file = new FileModel({ name: 'fake-name' } as File);
        component.file.data = { entry: { properties: { 'cm:versionLabel': '1' } } };
        component.file.status = FileUploadStatus.Progress;

        fixture.detectChanges();
        await fixture.whenStable();

        const cancelButton: HTMLDivElement = fixture.debugElement.query(By.css('[data-automation-id="cancel-upload-progress"]')).nativeElement;
        expect(cancelButton.title).toBe('ADF_FILE_UPLOAD.BUTTON.STOP_FILE');
    });
});
