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

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { ContentTestingModule } from '../testing/content.testing.module';
import { MimeTypeDialogComponentData } from './mime-type-dialog.interface';
import { MimeTypeDialogComponent } from './mime-type-dialog.component';
import { MimeTypeService } from './mime-type.service';

describe('Content Type Dialog Component', () => {
    let fixture: ComponentFixture<MimeTypeDialogComponent>;
    let mimeTypeService: MimeTypeService;
    let data: MimeTypeDialogComponentData;

    beforeEach(async () => {
        data = <MimeTypeDialogComponentData> {
            title: 'Title',
            description: 'Twinkle twinkle little star',
            confirmMessage: 'Do you wonder what is it? Y/N',
            select: new Subject<boolean>()
        };

        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule,
                MatDialogModule
            ],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: data },
                {
                    provide: MatDialogRef,
                    useValue: {
                        keydownEvents: () => of(null),
                        backdropClick: () => of(null),
                        close: jasmine.createSpy('close')
                    }
                }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        mimeTypeService = TestBed.inject(MimeTypeService);
        spyOn(mimeTypeService, 'getMimeTypeOptions').and.returnValue(
            of([
                {'mimetype': 'audio/mp4' , 'display': 'MPEG4 Audio'},
                {'mimetype': 'video/mp4' , 'display': 'MPEG4 Video'}]));
        fixture = TestBed.createComponent(MimeTypeDialogComponent);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should show basic information for the dialog', () => {
        const dialogTitle = fixture.nativeElement.querySelector('[data-automation-id="mime-type-dialog-title"]');
        expect(dialogTitle).not.toBeNull();
        expect(dialogTitle.innerText).toBe(data.title);

        const description = fixture.nativeElement.querySelector('[data-automation-id="mime-type-dialog-description"]');
        expect(description).not.toBeNull();
        expect(description.innerText).toBe(data.description);

        const confirmMessage = fixture.nativeElement.querySelector('[data-automation-id="mime-type-dialog-confirm-message"]');
        expect(confirmMessage).not.toBeNull();
        expect(confirmMessage.innerText).toBe(data.confirmMessage);

    });

    it('should complete the select stream Cancel button is clicked', (done) => {
        data.select.subscribe(() => { }, () => { }, () => done());
        const cancelButton: HTMLButtonElement = fixture.nativeElement.querySelector('#conten-type-dialog-actions-cancel');
        expect(cancelButton).toBeDefined();
        cancelButton.click();
        fixture.detectChanges();
    });

    it('should emit true when apply is clicked', (done) => {
        data.select.subscribe((value) => {
            expect(value).toBe(true);
         }, () => { }, () => done());
        const applyButton: HTMLButtonElement = fixture.nativeElement.querySelector('#mime-type-dialog-apply-button');
        expect(applyButton).toBeDefined();
        applyButton.click();
        fixture.detectChanges();
    });

});
