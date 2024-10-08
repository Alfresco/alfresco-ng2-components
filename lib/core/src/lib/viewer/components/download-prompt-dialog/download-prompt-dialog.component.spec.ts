/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { CoreTestingModule } from '../../../testing';
import { DownloadPromptActions } from '../../models/download-prompt.actions';
import { DownloadPromptDialogComponent } from './download-prompt-dialog.component';

const mockDialog = {
    close: jasmine.createSpy('close')
};

describe('DownloadPromptDialogComponent', () => {
    let matDialogRef: MatDialogRef<DownloadPromptDialogComponent>;
    let fixture: ComponentFixture<DownloadPromptDialogComponent>;

    const getButton = (buttonId: string) => fixture.debugElement.query(By.css(buttonId)).nativeElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule, DownloadPromptDialogComponent],
            providers: [{ provide: MatDialogRef, useValue: mockDialog }]
        });
        matDialogRef = TestBed.inject(MatDialogRef);

        fixture = TestBed.createComponent(DownloadPromptDialogComponent);
        fixture.detectChanges();
    });

    it('should emit DownloadPromptActions.WAIT and close dialog when clicking on the wait button', async () => {
        const waitButton = getButton('#waitButton');
        waitButton.dispatchEvent(new Event('click'));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(matDialogRef.close).toHaveBeenCalledWith(DownloadPromptActions.WAIT);
    });

    it('should emit DownloadPromptActions.DOWNLOAD and close dialog when clicking on the download button', async () => {
        const waitButton = getButton('#downloadButton');
        waitButton.dispatchEvent(new Event('click'));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(matDialogRef.close).toHaveBeenCalledWith(DownloadPromptActions.DOWNLOAD);
    });
});
