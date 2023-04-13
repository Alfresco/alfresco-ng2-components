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

import { FileAutoDownloadComponent } from './file-auto-download.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { CoreTestingModule } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const mockDialog = {
    close: jasmine.createSpy('close')
};
describe('FileAutoDownloadComponent', () => {
    let matDialogRef: MatDialogRef<FileAutoDownloadComponent>;
    let fixture: ComponentFixture<FileAutoDownloadComponent>;

    const getButton = (buttonId: string) => fixture.debugElement.query(By.css(buttonId)).nativeElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FileAutoDownloadComponent],
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule
            ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: MatDialogRef, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: null }
            ]
        });

        fixture = TestBed.createComponent(FileAutoDownloadComponent);
        matDialogRef = TestBed.inject(MatDialogRef);
        fixture.detectChanges();
    });

    it('should emit FileAutoDownloadActionsEnum.CANCEL and close dialog when clicking on the cancel button', async () => {
        const waitButton = getButton('#cancelButton');
        waitButton.dispatchEvent(new Event('click'));

        await fixture.detectChanges();
        await fixture.whenStable();

        expect(matDialogRef.close).toHaveBeenCalled();
    });

    it('should emit FileAutoDownloadActionsEnum.DOWNLOAD and close dialog when clicking on the wait button', async () => {
        const waitButton = getButton('#downloadButton');
        waitButton.dispatchEvent(new Event('click'));

        await fixture.detectChanges();
        await fixture.whenStable();

        expect(matDialogRef.close).toHaveBeenCalled();
    });
});
