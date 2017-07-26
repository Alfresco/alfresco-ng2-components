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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileModel } from 'ng2-alfresco-core';
import { UploadModule } from '../../index';
import { FileUploadingListRowComponent } from './file-uploading-list-row.component';

describe('FileUploadingListRowComponent', () => {
    let fixture: ComponentFixture<FileUploadingListRowComponent>;
    let component: FileUploadingListRowComponent;
    let file = new FileModel(<File> { name: 'fake-name' });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                UploadModule
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FileUploadingListRowComponent);
        component = fixture.componentInstance;
        component.file = file;
    });

    it('emits cancel event', () => {
        spyOn(component.cancel, 'emit');
        component.onCancel(component.file);

        expect(component.cancel.emit).toHaveBeenCalledWith(file);
    });

    it('emits remove event', () => {
        spyOn(component.remove, 'emit');
        component.onRemove(component.file);

        expect(component.remove.emit).toHaveBeenCalledWith(file);
    });
});
