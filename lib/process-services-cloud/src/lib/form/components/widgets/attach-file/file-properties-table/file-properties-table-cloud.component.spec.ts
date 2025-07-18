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

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilePropertiesTableCloudComponent } from './file-properties-table-cloud.component';
import { By } from '@angular/platform-browser';
import { NoopTranslateModule } from '@alfresco/adf-core';

describe('FilePropertiesTableCloudComponent', () => {
    let widget: FilePropertiesTableCloudComponent;
    let fixture: ComponentFixture<FilePropertiesTableCloudComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, FilePropertiesTableCloudComponent]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FilePropertiesTableCloudComponent);
        widget = fixture.componentInstance;

        widget.uploadedFiles = [
            {
                id: 'id',
                name: 'download.png',
                mimeType: 'image/png',
                isExternal: true,
                isFile: true,
                isFolder: false,
                content: {
                    mimeType: 'image/png'
                }
            },
            {
                id: 'id2',
                name: 'download2.png',
                mimeType: 'image/png',
                isExternal: true,
                isFile: true,
                isFolder: false,
                content: {
                    mimeType: 'image/png'
                }
            }
        ];

        widget.hasFile = true;

        widget.displayedColumns = ['icon', 'fileName', 'title'];

        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should emit attachFileClick', () => {
        const attachFileClickSpy = spyOn(widget.attachFileClick, 'emit').and.callThrough();

        const attachedFile = fixture.debugElement.query(By.css('#file-id')).nativeElement as HTMLButtonElement;
        attachedFile.click();
        fixture.detectChanges();

        expect(attachFileClickSpy).toHaveBeenCalledWith(widget.uploadedFiles[0]);
    });
});
