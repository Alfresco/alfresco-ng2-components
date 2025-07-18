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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PdfPasswordDialogComponent } from './pdf-viewer-password-dialog';

declare const pdfjsLib: any;

describe('PdfPasswordDialogComponent', () => {
    let component: PdfPasswordDialogComponent;
    let fixture: ComponentFixture<PdfPasswordDialogComponent>;
    let dialogRef: MatDialogRef<PdfPasswordDialogComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [PdfPasswordDialogComponent],
            providers: [
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        reason: null
                    }
                },
                {
                    provide: MatDialogRef,
                    useValue: {
                        close: jasmine.createSpy('open')
                    }
                }
            ]
        });
        fixture = TestBed.createComponent(PdfPasswordDialogComponent);
        component = fixture.componentInstance;
        dialogRef = TestBed.inject(MatDialogRef);
    });

    it('should have empty default value', () => {
        fixture.detectChanges();

        expect(component.passwordFormControl.value).toBe('');
    });

    describe('isError', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        it('should return false', () => {
            component.data.reason = pdfjsLib.PasswordResponses.NEED_PASSWORD;

            expect(component.isError()).toBe(false);
        });

        it('should return true', () => {
            component.data.reason = pdfjsLib.PasswordResponses.INCORRECT_PASSWORD;

            expect(component.isError()).toBe(true);
        });
    });

    describe('isValid', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        it('should return false when input has no value', () => {
            component.passwordFormControl.setValue('');

            expect(component.isValid()).toBe(false);
        });

        it('should return true when input has a valid value', () => {
            component.passwordFormControl.setValue('some-text');

            expect(component.isValid()).toBe(true);
        });
    });

    it('should close dialog with input value', () => {
        fixture.detectChanges();

        component.passwordFormControl.setValue('some-value');
        component.submit();

        expect(dialogRef.close).toHaveBeenCalledWith('some-value');
    });
});
