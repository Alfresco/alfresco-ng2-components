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

import { TestBed } from '@angular/core/testing';
import { NoopTranslateModule } from '../../../../../../src/lib/testing/noop-translate.module';
import { createFieldsForm, errorText, pasteInto, renderWidget, typeInto } from '../../testing/widget-testing.mock';
import { SignalTextWidgetComponent } from './text-widget.component';

describe('SignalTextWidgetComponent', () => {
    const textInput = (element: HTMLElement): HTMLInputElement => element.querySelector('input');

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [NoopTranslateModule] });
    });

    it('should write what is typed into the form', () => {
        const form = createFieldsForm([{ id: 'name', name: 'Name', type: 'text' }]);
        const fixture = renderWidget(SignalTextWidgetComponent, form, 'name');

        typeInto(textInput(fixture.nativeElement), 'Ada');
        fixture.detectChanges();

        expect(form.submittedValues()['name']).toBe('Ada');
    });

    it('should refuse a paste that makes the text too long, until the text is edited', () => {
        const form = createFieldsForm([{ id: 'code', type: 'text', value: 'Ada', maxLength: 5 }]);
        const fixture = renderWidget(SignalTextWidgetComponent, form, 'code');
        const element: HTMLElement = fixture.nativeElement;

        const refused = pasteInto(textInput(element), 'Byron');
        fixture.detectChanges();

        expect(refused.defaultPrevented).toBeTrue();
        expect(errorText(element)).toBe('FORM.FIELD.VALIDATOR.NO_LONGER_THAN');

        typeInto(textInput(element), 'Adam');
        fixture.detectChanges();

        expect(errorText(element)).toBeUndefined();
    });

    it('should keep a refused paste reported while the input event is the paste itself', () => {
        const form = createFieldsForm([{ id: 'code', type: 'text', value: 'Ada', maxLength: 5 }]);
        const fixture = renderWidget(SignalTextWidgetComponent, form, 'code');
        const element: HTMLElement = fixture.nativeElement;

        pasteInto(textInput(element), 'Byron');
        textInput(element).dispatchEvent(new InputEvent('input', { inputType: 'insertFromPaste' }));
        fixture.detectChanges();

        expect(errorText(element)).toBe('FORM.FIELD.VALIDATOR.NO_LONGER_THAN');
    });

    it('should refuse a paste that makes a string field longer than its text limit', () => {
        const form = createFieldsForm([{ id: 'code', type: 'string', value: 'Ada', maxLength: 5 }]);
        const fixture = renderWidget(SignalTextWidgetComponent, form, 'code');

        const refused = pasteInto(textInput(fixture.nativeElement), 'Byron');
        fixture.detectChanges();

        expect(refused.defaultPrevented).toBeTrue();
        expect(errorText(fixture.nativeElement)).toBe('FORM.FIELD.VALIDATOR.NO_LONGER_THAN');
    });

    it('should accept a paste that fits', () => {
        const form = createFieldsForm([{ id: 'code', type: 'text', value: 'Ada', maxLength: 5 }]);
        const fixture = renderWidget(SignalTextWidgetComponent, form, 'code');

        const accepted = pasteInto(textInput(fixture.nativeElement), 'Jo');

        expect(accepted.defaultPrevented).toBeFalse();
    });

    it('should style text fields as today', () => {
        const form = createFieldsForm([{ id: 'name', type: 'text' }]);

        const fixture = renderWidget(SignalTextWidgetComponent, form, 'name');
        const styledElement = fixture.nativeElement.querySelector('.adf-text-widget');

        expect(styledElement).not.toBeNull();
    });
});
