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
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { NoopTranslateModule } from '../../../../../../src/lib/testing/noop-translate.module';
import { createFieldsForm, renderWidget, typeInto } from '../../testing/widget-testing.mock';
import { SignalDecimalWidgetComponent, SignalIntegerWidgetComponent, SignalTextWidgetComponent } from './text-widget.component';

describe('SignalTextWidgetComponent', () => {
    const errorText = (element: HTMLElement): string | undefined => element.querySelector('.adf-error-text')?.textContent?.trim();
    const textInput = (element: HTMLElement): HTMLInputElement => element.querySelector('input');
    const floatingLabel = async (fixture: ComponentFixture<SignalTextWidgetComponent>): Promise<string | null> =>
        (await TestbedHarnessEnvironment.loader(fixture).getHarness(MatFormFieldHarness)).getLabel();

    const paste = (input: HTMLInputElement, text: string): ClipboardEvent => {
        const clipboardData = new DataTransfer();
        clipboardData.setData('text', text);
        const event = new ClipboardEvent('paste', { clipboardData, cancelable: true });
        input.dispatchEvent(event);
        return event;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [NoopTranslateModule] });
    });

    it('should show the field label and write what is typed into the form', async () => {
        const form = createFieldsForm([{ id: 'name', name: 'Name', type: 'text' }]);
        const fixture = renderWidget(SignalTextWidgetComponent, form, 'name');
        const element: HTMLElement = fixture.nativeElement;

        typeInto(textInput(element), 'Ada');
        fixture.detectChanges();

        expect(await floatingLabel(fixture)).toBe('Name');
        expect(textInput(element).id).toBe('name');
        expect(form.submittedValues()['name']).toBe('Ada');
    });

    it('should show a missing value only once the field is touched', () => {
        const form = createFieldsForm([{ id: 'name', name: 'Name', type: 'text', required: true }]);
        const fixture = renderWidget(SignalTextWidgetComponent, form, 'name');
        const element: HTMLElement = fixture.nativeElement;

        expect(errorText(element)).toBeUndefined();

        textInput(element).dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(errorText(element)).toBe('FORM.FIELD.REQUIRED');
    });

    it('should show any other error at once', () => {
        const form = createFieldsForm([{ id: 'code', type: 'text', value: 'abc', regexPattern: '[0-9]+' }]);
        const fixture = renderWidget(SignalTextWidgetComponent, form, 'code');

        expect(errorText(fixture.nativeElement)).toBe('FORM.FIELD.VALIDATOR.INVALID_VALUE');
    });

    it('should refuse a paste that makes the text too long, until the text is edited', () => {
        const form = createFieldsForm([{ id: 'code', type: 'text', value: 'abc', maxLength: 5 }]);
        const fixture = renderWidget(SignalTextWidgetComponent, form, 'code');
        const element: HTMLElement = fixture.nativeElement;

        const refused = paste(textInput(element), 'defgh');
        fixture.detectChanges();

        expect(refused.defaultPrevented).toBeTrue();
        expect(errorText(element)).toBe('FORM.FIELD.VALIDATOR.NO_LONGER_THAN');

        typeInto(textInput(element), 'abcd');
        fixture.detectChanges();

        expect(errorText(element)).toBeUndefined();
    });

    it('should keep a refused paste reported while the input event is the paste itself', () => {
        const form = createFieldsForm([{ id: 'code', type: 'text', value: 'abc', maxLength: 5 }]);
        const fixture = renderWidget(SignalTextWidgetComponent, form, 'code');
        const element: HTMLElement = fixture.nativeElement;

        paste(textInput(element), 'defgh');
        textInput(element).dispatchEvent(new InputEvent('input', { inputType: 'insertFromPaste' }));
        fixture.detectChanges();

        expect(errorText(element)).toBe('FORM.FIELD.VALIDATOR.NO_LONGER_THAN');
    });

    it('should not limit a paste into a field without a maximum length', () => {
        const form = createFieldsForm([{ id: 'ratio', type: 'bigdecimal' }]);
        const fixture = renderWidget(SignalDecimalWidgetComponent, form, 'ratio');

        expect(paste(textInput(fixture.nativeElement), '1'.repeat(2000)).defaultPrevented).toBeFalse();
    });

    it('should accept a paste without clipboard data', () => {
        const form = createFieldsForm([{ id: 'code', type: 'text', value: 'abc', maxLength: 5 }]);
        const fixture = renderWidget(SignalTextWidgetComponent, form, 'code');
        const empty = new ClipboardEvent('paste', { cancelable: true });

        textInput(fixture.nativeElement).dispatchEvent(empty);

        expect(empty.defaultPrevented).toBeFalse();
    });

    it('should accept a paste that fits', () => {
        const form = createFieldsForm([{ id: 'code', type: 'text', value: 'abc', maxLength: 5 }]);
        const fixture = renderWidget(SignalTextWidgetComponent, form, 'code');

        expect(paste(textInput(fixture.nativeElement), 'de').defaultPrevented).toBeFalse();
    });

    it('should edit the text through the input mask when the field has one', () => {
        const form = createFieldsForm([
            { id: 'phone', type: 'text', params: { inputMask: '(000) 000-0000', inputMaskPlaceholder: '(___) ___-____' } }
        ]);
        const fixture = renderWidget(SignalTextWidgetComponent, form, 'phone');
        const element: HTMLElement = fixture.nativeElement;

        typeInto(textInput(element), '1234567890');
        fixture.detectChanges();

        expect(element.querySelector('adf-signal-masked-text-input')).not.toBeNull();
        expect(textInput(element).placeholder).toBe('(___) ___-____');
        expect(form.submittedValues()['phone']).toBe('(123) 456-7890');
    });

    it('should show the label to the left when the form asks for it', async () => {
        const form = createFieldsForm([{ id: 'name', name: 'Name', type: 'text', required: true }], { leftLabels: true });
        const fixture = renderWidget(SignalTextWidgetComponent, form, 'name');
        const element: HTMLElement = fixture.nativeElement;

        expect(element.querySelector('label.adf-signal-form-left-label[for="name"]')?.textContent).toContain('Name');
        expect(await floatingLabel(fixture)).toBeNull();
    });

    it('should style integer and decimal fields as today', () => {
        const form = createFieldsForm([
            { id: 'count', type: 'integer' },
            { id: 'ratio', type: 'bigdecimal' }
        ]);

        expect(renderWidget(SignalIntegerWidgetComponent, form, 'count').nativeElement.querySelector('.adf-number-widget')).not.toBeNull();
        expect(renderWidget(SignalDecimalWidgetComponent, form, 'ratio').nativeElement.querySelector('.adf-decimal-widget')).not.toBeNull();
    });
});
