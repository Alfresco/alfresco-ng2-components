/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { Component, input, model } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ClipboardService } from '../../clipboard';
import { NoopTranslateModule } from '../../testing';
import { UnitTestingUtils } from '../../testing/unit-testing-utils';
import { EditJsonDialogComponent } from './edit-json.dialog';
import { EDIT_JSON_EDITOR, JsonEditorComponent } from './edit-json-editor.token';

@Component({ template: '<span data-automation-id="stub-json-editor">{{ value() }}</span>' })
class StubJsonEditorComponent implements JsonEditorComponent {
    readonly value = model('');
    readonly readOnly = input(false);
}

describe('EditJsonDialogComponent', () => {
    let fixture: ComponentFixture<EditJsonDialogComponent>;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, EditJsonDialogComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { value: '{"key": "value"}', title: 'Test', editable: false } },
                { provide: MatDialogRef, useValue: {} }
            ]
        });

        fixture = TestBed.createComponent(EditJsonDialogComponent);
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('copy button', () => {
        it('should not be visible when no custom editor is provided', () => {
            const copyButton = testingUtils.getByDataAutomationId('adf-edit-json-dialog-copy');
            expect(copyButton).toBeFalsy();
        });
    });

    describe('editor fallback', () => {
        it('should render the textarea when no custom editor is provided', () => {
            expect(fixture.nativeElement.querySelector('textarea')).not.toBeNull();
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

describe('EditJsonDialogComponent — custom editor', () => {
    let fixture: ComponentFixture<EditJsonDialogComponent>;

    const getEditor = (): StubJsonEditorComponent => fixture.debugElement.query(By.directive(StubJsonEditorComponent)).componentInstance;

    const setup = async (data: { value?: string; editable?: boolean }) => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, EditJsonDialogComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: data },
                { provide: MatDialogRef, useValue: {} },
                { provide: EDIT_JSON_EDITOR, useValue: StubJsonEditorComponent }
            ]
        });

        fixture = TestBed.createComponent(EditJsonDialogComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    };

    afterEach(() => {
        fixture.destroy();
    });

    it('should render the provided custom editor instead of the textarea', async () => {
        await setup({ value: '{"key": "value"}', editable: true });

        expect(fixture.nativeElement.querySelector('textarea')).toBeNull();
        expect(fixture.nativeElement.querySelector('[data-automation-id="stub-json-editor"]')).toBeTruthy();
    });

    it('should pass the initial value into the custom editor', async () => {
        await setup({ value: '{"key": "value"}', editable: true });

        expect(getEditor().value()).toBe('{"key": "value"}');
    });

    it('should bind readOnly to the negation of the editable flag', async () => {
        await setup({ value: '{}', editable: false });

        expect(getEditor().readOnly()).toBe(true);
    });

    it('should reflect edits from the custom editor back into the dialog value (two-way binding)', async () => {
        await setup({ value: '{"key": "value"}', editable: true });

        getEditor().value.set('{"updated": true}');
        fixture.detectChanges();

        expect(fixture.componentInstance.value()).toBe('{"updated": true}');
    });
});

describe('EditJsonDialogComponent — copy button with custom editor', () => {
    let fixture: ComponentFixture<EditJsonDialogComponent>;
    let clipboardService: ClipboardService;
    let translateService: TranslateService;
    let testingUtils: UnitTestingUtils;

    const setup = (data: { value?: string; editable?: boolean }) => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, EditJsonDialogComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: data },
                { provide: MatDialogRef, useValue: {} },
                { provide: EDIT_JSON_EDITOR, useValue: StubJsonEditorComponent }
            ]
        });

        clipboardService = TestBed.inject(ClipboardService);
        translateService = TestBed.inject(TranslateService);

        fixture = TestBed.createComponent(EditJsonDialogComponent);
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        fixture.detectChanges();
    };

    afterEach(() => {
        fixture.destroy();
    });

    it('should be visible', () => {
        setup({ value: '{"key": "value"}', editable: false });

        const copyButton = testingUtils.getByDataAutomationId('adf-edit-json-dialog-copy');
        expect(copyButton).toBeTruthy();
    });

    it('should copy the dialog value to clipboard when clicked', () => {
        setup({ value: '{"key": "value"}', editable: false });
        spyOn(clipboardService, 'copyContentToClipboard');

        testingUtils.clickByDataAutomationId('adf-edit-json-dialog-copy');

        expect(clipboardService.copyContentToClipboard).toHaveBeenCalledWith('{"key": "value"}', jasmine.any(String));
        expect(clipboardService.copyContentToClipboard).toHaveBeenCalledTimes(1);
    });

    it('should show a confirmation notification when clicked', () => {
        setup({ value: '{"key": "value"}', editable: false });
        const translatedMessage = 'Copied to clipboard';
        spyOn(translateService, 'instant').and.returnValue(translatedMessage);
        spyOn(clipboardService, 'copyContentToClipboard');

        testingUtils.clickByDataAutomationId('adf-edit-json-dialog-copy');

        expect(clipboardService.copyContentToClipboard).toHaveBeenCalledWith('{"key": "value"}', translatedMessage);
        expect(clipboardService.copyContentToClipboard).toHaveBeenCalledTimes(1);
    });

    it('should copy the updated value when the dialog value changes', () => {
        setup({ value: '{"key": "value"}', editable: false });
        const updatedValue = '{"updated": true}';
        spyOn(clipboardService, 'copyContentToClipboard');
        fixture.componentInstance.value.set(updatedValue);
        fixture.detectChanges();

        testingUtils.clickByDataAutomationId('adf-edit-json-dialog-copy');

        expect(clipboardService.copyContentToClipboard).toHaveBeenCalledWith(updatedValue, jasmine.any(String));
        expect(clipboardService.copyContentToClipboard).toHaveBeenCalledTimes(1);
    });

    it('should copy an empty value when the dialog has no content', () => {
        setup({ value: '', editable: false });
        spyOn(clipboardService, 'copyContentToClipboard');

        testingUtils.clickByDataAutomationId('adf-edit-json-dialog-copy');

        expect(clipboardService.copyContentToClipboard).toHaveBeenCalledWith('', jasmine.any(String));
        expect(clipboardService.copyContentToClipboard).toHaveBeenCalledTimes(1);
    });
});
