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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { setupTestBed } from '@alfresco/adf-core';
import { ConfirmDialogComponent } from './confirm.dialog';
import { ContentTestingModule } from '../testing/content.testing.module';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

describe('Confirm Dialog Component', () => {
    let fixture: ComponentFixture<ConfirmDialogComponent>;
    let component: ConfirmDialogComponent;

    const dialogRef = {
        close: jasmine.createSpy('close')
    };

    const data = {
        title: 'Fake Title',
        message: 'Base Message',
        yesLabel: 'TAKE THIS',
        noLabel: 'MAYBE NO'
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        providers: [
            { provide: MatDialogRef, useValue: dialogRef },
            { provide: MAT_DIALOG_DATA, useValue: data }
        ]
    });

    beforeEach(() => {
        dialogRef.close.calls.reset();
        fixture = TestBed.createComponent(ConfirmDialogComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('When no html is given', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        it('should init form with folder name and description', () => {
            expect(component.title).toBe('Fake Title');
            expect(component.message).toBe('Base Message');
            expect(component.yesLabel).toBe('TAKE THIS');
            expect(component.noLabel).toBe('MAYBE NO');
        });

        it('should render the title', () => {
            const titleElement = fixture.debugElement.query(
                By.css('[data-automation-id="adf-confirm-dialog-title"]')
            );
            expect(titleElement).not.toBeNull();
            expect(titleElement.nativeElement.innerText).toBe('Fake Title');
        });

        it('should render the message', () => {
            const messageElement = fixture.debugElement.query(
                By.css('[data-automation-id="adf-confirm-dialog-base-message"]')
            );
            expect(messageElement).not.toBeNull();
            expect(messageElement.nativeElement.innerText).toBe('Base Message');
        });

        it('should render the YES label', () => {
            const messageElement = fixture.debugElement.query(
                By.css('[data-automation-id="adf-confirm-dialog-confirmation"]')
            );
            expect(messageElement).not.toBeNull();
            expect(messageElement.nativeElement.innerText).toBe('TAKE THIS');
        });

        it('should render the NO label', () => {
            const messageElement = fixture.debugElement.query(
                By.css('[data-automation-id="adf-confirm-dialog-reject"]')
            );
            expect(messageElement).not.toBeNull();
            expect(messageElement.nativeElement.innerText).toBe('MAYBE NO');
        });
    });

    describe('When custom html is given', () => {
        beforeEach(() => {
            component.htmlContent = `<div> I am about to do to you what Limp Bizkit did to music in the late ’90s.</div>`;
            fixture.detectChanges();
        });

        it('should render the title', () => {
            const titleElement = fixture.debugElement.query(
                By.css('[data-automation-id="adf-confirm-dialog-title"]')
            );
            expect(titleElement).not.toBeNull();
            expect(titleElement.nativeElement.innerText).toBe('Fake Title');
        });

        it('should render the custom html', () => {
            const customElement = fixture.nativeElement.querySelector(
                '[data-automation-id="adf-confirm-dialog-custom-content"] div'
            );
            expect(customElement).not.toBeNull();
            expect(customElement.innerText).toBe(
                'I am about to do to you what Limp Bizkit did to music in the late ’90s.'
            );
        });

        it('should render the YES label', () => {
            const messageElement = fixture.debugElement.query(
                By.css('[data-automation-id="adf-confirm-dialog-confirmation"]')
            );
            expect(messageElement).not.toBeNull();
            expect(messageElement.nativeElement.innerText).toBe('TAKE THIS');
        });

        it('should render the NO label', () => {
            const messageElement = fixture.debugElement.query(
                By.css('[data-automation-id="adf-confirm-dialog-reject"]')
            );
            expect(messageElement).not.toBeNull();
            expect(messageElement.nativeElement.innerText).toBe('MAYBE NO');
        });
    });

    describe('thirdOptionLabel is given', () => {

        it('should NOT render the thirdOption if is thirdOptionLabel is not passed', () => {
            component.thirdOptionLabel = undefined;
            fixture.detectChanges();
            const thirdOptionElement = fixture.debugElement.query(
                By.css('[data-automation-id="adf-confirm-dialog-confirm-all"]')
            );
            expect(thirdOptionElement).toBeFalsy();
        });

        it('should render the thirdOption if thirdOptionLabel is passed', () => {
            component.thirdOptionLabel = 'Yes All';
            fixture.detectChanges();
            const thirdOptionElement = fixture.debugElement.query(
                By.css('[data-automation-id="adf-confirm-dialog-confirm-all"]')
            );
            expect(thirdOptionElement).not.toBeNull();
            expect(thirdOptionElement.nativeElement.innerText).toBe('YES ALL');
        });
    });
});
