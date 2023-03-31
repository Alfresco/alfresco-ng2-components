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

import { FileAutoDownloadComponent } from './file-auto-download.component';
import { MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { FileAutoDownloadActionsEnum } from '../../models/file-auto-download-actions.enum';
import { CoreTestingModule } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';

const mockDialog = {
    close: jasmine.createSpy('close')
};
describe('FileAutoDownloadComponent', () => {
    let matDialogRef: MatDialogRef<FileAutoDownloadComponent>;
    let fixture: ComponentFixture<FileAutoDownloadComponent>;

    const getButton = (buttonId: string) => {
        return fixture.debugElement.query(By.css(buttonId)).nativeElement;
    };

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [FileAutoDownloadComponent],
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule
            ],
            providers: [
                { provide: MatDialogRef, useValue: mockDialog }
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

        expect(matDialogRef.close).toHaveBeenCalledWith(FileAutoDownloadActionsEnum.CANCEL);
    });

    it('should emit FileAutoDownloadActionsEnum.DOWNLOAD and close dialog when clicking on the wait button', async () => {
        const waitButton = getButton('#downloadButton');
        waitButton.dispatchEvent(new Event('click'));

        await fixture.detectChanges();
        await fixture.whenStable();

        expect(matDialogRef.close).toHaveBeenCalledWith(FileAutoDownloadActionsEnum.DOWNLOAD);
    });
});
