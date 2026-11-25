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

import { TranslationService } from '@alfresco/adf-core';
import { TestBed } from '@angular/core/testing';
import { NoopTranslateModule } from '../../../../../../src/lib/testing/noop-translate.module';
import { createFieldsForm, renderWidget, typeInto } from '../../testing/widget-testing.mock';
import { SignalAmountWidgetComponent } from './amount-widget.component';

describe('SignalAmountWidgetComponent', () => {
    const amountInput = (element: HTMLElement): HTMLInputElement => element.querySelector('input');

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule],
            providers: [{ provide: TranslationService, useValue: { getLocale: () => 'en-US' } }]
        });
    });

    it('should show the currency of the amount before it', () => {
        const form = createFieldsForm([{ id: 'price', name: 'Price', type: 'amount', currency: '€', enableFractions: true }]);

        const fixture = renderWidget(SignalAmountWidgetComponent, form, 'price');
        const prefixText = fixture.nativeElement.querySelector('.adf-amount-widget__prefix-spacing')?.textContent;

        expect(prefixText).toContain('€');
    });

    it('should submit the typed amount as a number', () => {
        const form = createFieldsForm([{ id: 'price', name: 'Price', type: 'amount', enableFractions: true }]);
        const fixture = renderWidget(SignalAmountWidgetComponent, form, 'price');

        typeInto(amountInput(fixture.nativeElement), '12.5');
        fixture.detectChanges();
        const submittedPrice = form.submittedValues()['price'];

        expect(submittedPrice).toBe(12.5);
    });

    it('should keep the typed amount while a rule changes it, and show the new value once the user leaves', () => {
        const form = createFieldsForm([{ id: 'price', type: 'amount' }]);
        const fixture = renderWidget(SignalAmountWidgetComponent, form, 'price');
        const element: HTMLElement = fixture.nativeElement;
        amountInput(element).dispatchEvent(new Event('focus'));
        typeInto(amountInput(element), '12');

        form.setValue('price', '99');
        fixture.detectChanges();
        const whileEditing = amountInput(element).value;

        amountInput(element).dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        const afterLeaving = amountInput(element).value;

        expect(whileEditing).toBe('12');
        expect(afterLeaving).toBe('99');
    });

    it('should show an amount for the locale while not edited, and as typed while edited, when the form has locale amounts on', () => {
        const form = createFieldsForm(
            [{ id: 'price', name: 'Price', type: 'amount', enableFractions: true, placeholder: '1000' }],
            {},
            { features: { localeAmounts: true } }
        );
        const fixture = renderWidget(SignalAmountWidgetComponent, form, 'price');
        const element: HTMLElement = fixture.nativeElement;
        const prefix = element.querySelector('.adf-amount-widget__prefix-spacing');
        const shownPlaceholder = amountInput(element).placeholder;

        expect(shownPlaceholder).toBe('1,000.00');
        expect(prefix).withContext('the locale format brings its own symbol').toBeNull();

        amountInput(element).dispatchEvent(new Event('focus'));
        typeInto(amountInput(element), '1234.5');
        amountInput(element).dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        const shownAfterLeaving = amountInput(element).value;
        const submittedPrice = form.submittedValues()['price'];

        expect(shownAfterLeaving).withContext('formatted once the user leaves the field').toBe('1,234.50');
        expect(submittedPrice).toBe(1234.5);

        amountInput(element).dispatchEvent(new Event('focus'));
        fixture.detectChanges();
        const shownWhileEditing = amountInput(element).value;

        expect(shownWhileEditing).toBe('1234.5');
    });

    it('should show its label to the left when the form asks for it', () => {
        const form = createFieldsForm([{ id: 'price', name: 'Price', type: 'amount' }], { leftLabels: true });

        const fixture = renderWidget(SignalAmountWidgetComponent, form, 'price');
        const leftLabelText = fixture.nativeElement.querySelector('label.adf-signal-form-left-label[for="price"]')?.textContent;

        expect(leftLabelText).toContain('Price');
    });
});
