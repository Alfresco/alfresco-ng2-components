/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { FileModel, CoreModule, FileUploadOptions, FileUploadStatus, setupTestBed } from '@alfresco/adf-core';
import { UploadModule } from '../upload.module';
import { FileUploadingListRowComponent } from './file-uploading-list-row.component';

describe('FileUploadingListRowComponent', () => {
    let fixture: ComponentFixture<FileUploadingListRowComponent>;
    let component: FileUploadingListRowComponent;
    const file = new FileModel(<File> { name: 'fake-name' });

    setupTestBed({
        imports: [
            CoreModule.forRoot(),
            UploadModule
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

        it('should emit remove event', () => {
            spyOn(component.remove, 'emit');
            component.onRemove(component.file);

            expect(component.remove.emit).toHaveBeenCalledWith(file);
        });
    });

    it('should render node version when upload a version file', () => {
        component.file = new FileModel(<File> { name: 'fake-name' });
        component.file.options = <FileUploadOptions> { newVersion: true };
        component.file.data = { entry: { properties: { 'cm:versionLabel': '1' } } };

        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector(
            '.adf-file-uploading-row__version'
        ).textContent).toContain('1');
    });

    it('should not emit remove event on a version file', () => {
        spyOn(component.remove, 'emit');
        component.file = new FileModel(<File> { name: 'fake-name' });
        component.file.options = <FileUploadOptions> { newVersion: true };
        component.file.data = { entry: { properties: { 'cm:versionLabel': '1' } } };
        component.file.status = FileUploadStatus.Complete;

        fixture.detectChanges();
        const uploadCompleteIcon = document.querySelector('.adf-file-uploading-row__file-version .adf-file-uploading-row__status--done');
        uploadCompleteIcon.dispatchEvent(new MouseEvent('click'));

        expect(component.remove.emit).not.toHaveBeenCalled();
    });
});
