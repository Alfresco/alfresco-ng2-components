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
import { TranslateService } from '@ngx-translate/core';
import { ClipboardService } from '../../clipboard';
import { NoopTranslateModule } from '../../testing';
import { UnitTestingUtils } from '../../testing/unit-testing-utils';
import { EditJsonDialogComponent } from './edit-json.dialog';

describe('EditJsonDialogComponent', () => {
    let fixture: ComponentFixture<EditJsonDialogComponent>;
    let clipboardService: ClipboardService;
    let translateService: TranslateService;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, EditJsonDialogComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { value: '{"key": "value"}', title: 'Test', editable: false } },
                { provide: MatDialogRef, useValue: {} }
            ]
        });

        clipboardService = TestBed.inject(ClipboardService);
        translateService = TestBed.inject(TranslateService);

        fixture = TestBed.createComponent(EditJsonDialogComponent);
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('copy button', () => {
        it('should be visible', () => {
            const copyButton = testingUtils.getByDataAutomationId('adf-edit-json-dialog-copy');
            expect(copyButton).toBeTruthy();
        });

        it('should copy the dialog value to clipboard when clicked', () => {
            spyOn(clipboardService, 'copyContentToClipboard');

            testingUtils.clickByDataAutomationId('adf-edit-json-dialog-copy');

            expect(clipboardService.copyContentToClipboard).toHaveBeenCalledWith('{"key": "value"}', jasmine.any(String));
            expect(clipboardService.copyContentToClipboard).toHaveBeenCalledTimes(1);
        });

        it('should show a confirmation notification when clicked', () => {
            const translatedMessage = 'Copied to clipboard';
            spyOn(translateService, 'instant').and.returnValue(translatedMessage);
            spyOn(clipboardService, 'copyContentToClipboard');

            testingUtils.clickByDataAutomationId('adf-edit-json-dialog-copy');

            expect(clipboardService.copyContentToClipboard).toHaveBeenCalledWith('{"key": "value"}', translatedMessage);
            expect(clipboardService.copyContentToClipboard).toHaveBeenCalledTimes(1);
        });

        it('should copy the updated value when the dialog value changes', () => {
            const updatedValue = '{"updated": true}';
            spyOn(clipboardService, 'copyContentToClipboard');
            fixture.componentRef.setInput('value', updatedValue);
            fixture.detectChanges();

            testingUtils.clickByDataAutomationId('adf-edit-json-dialog-copy');

            expect(clipboardService.copyContentToClipboard).toHaveBeenCalledWith(updatedValue, jasmine.any(String));
            expect(clipboardService.copyContentToClipboard).toHaveBeenCalledTimes(1);
        });

        it('should copy an empty value when the dialog has no content', () => {
            spyOn(clipboardService, 'copyContentToClipboard');
            fixture.componentRef.setInput('value', '');
            fixture.detectChanges();

            testingUtils.clickByDataAutomationId('adf-edit-json-dialog-copy');

            expect(clipboardService.copyContentToClipboard).toHaveBeenCalledWith('', jasmine.any(String));
            expect(clipboardService.copyContentToClipboard).toHaveBeenCalledTimes(1);
        });
    });

    describe('editable state', () => {
        it('should render the textarea as read-only when editable is false', () => {
            const textarea = fixture.nativeElement.querySelector('textarea');
            expect(textarea.getAttribute('readonly')).not.toBeNull();
        });
    });
});

describe('EditJsonDialogComponent — editable', () => {
    let fixture: ComponentFixture<EditJsonDialogComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, EditJsonDialogComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { value: '', editable: true } },
                { provide: MatDialogRef, useValue: {} }
            ]
        });

        fixture = TestBed.createComponent(EditJsonDialogComponent);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should render the textarea as editable when editable is true', () => {
        const textarea = fixture.nativeElement.querySelector('textarea');
        expect(textarea.getAttribute('readonly')).toBeNull();
    });
});
