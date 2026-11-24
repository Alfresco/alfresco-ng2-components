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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInput } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { NoopTranslateModule } from '../../../../../src/lib/testing/noop-translate.module';
import { typeInto } from '../testing/widget-testing.mock';
import { SignalAmountInputControlComponent } from './amount-input-control.component';

describe('SignalAmountInputControlComponent', () => {
    const amountInput = (fixture: ComponentFixture<SignalAmountInputControlComponent>): HTMLInputElement =>
        fixture.nativeElement.querySelector('input');
    const prefixText = (fixture: ComponentFixture<SignalAmountInputControlComponent>): string | undefined =>
        fixture.nativeElement.querySelector('.adf-amount-widget__prefix-spacing')?.textContent;

    const createControl = (value: string | number | null): ComponentFixture<SignalAmountInputControlComponent> => {
        const fixture = TestBed.createComponent(SignalAmountInputControlComponent);
        fixture.componentRef.setInput('inputId', 'price');
        fixture.componentRef.setInput('value', value);
        return fixture;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule],
            providers: [{ provide: TranslationService, useValue: { getLocale: () => 'en-US' } }]
        });
    });

    it('should show the dollar sign before the amount when no currency is given', () => {
        const fixture = createControl(12);
        fixture.detectChanges();
        const prefix = prefixText(fixture);

        expect(prefix).toContain('$');
    });

    it('should show the given currency before the amount', () => {
        const fixture = createControl(12);
        fixture.componentRef.setInput('currency', '€');
        fixture.detectChanges();
        const prefix = prefixText(fixture);

        expect(prefix).toContain('€');
    });

    it('should show the amount as it is when locale amounts are off', () => {
        const fixture = createControl(1234.5);
        fixture.detectChanges();
        const shownAmount = amountInput(fixture).value;

        expect(shownAmount).toBe('1234.5');
    });

    it('should show an empty input when the amount is missing', () => {
        const fixture = createControl(null);
        fixture.detectChanges();
        const shownAmount = amountInput(fixture).value;

        expect(shownAmount).toBe('');
    });

    it('should write what is typed into the value', () => {
        const fixture = createControl(null);
        fixture.detectChanges();

        typeInto(amountInput(fixture), '12.5');
        const value = fixture.componentInstance.value();

        expect(value).toBe('12.5');
    });

    it('should keep the typed text while the value changes, and show the new value once the user leaves', () => {
        const fixture = createControl(null);
        fixture.detectChanges();
        amountInput(fixture).dispatchEvent(new Event('focus'));
        typeInto(amountInput(fixture), '12');

        fixture.componentRef.setInput('value', '99');
        fixture.detectChanges();
        const whileEditing = amountInput(fixture).value;

        amountInput(fixture).dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        const afterLeaving = amountInput(fixture).value;

        expect(whileEditing).toBe('12');
        expect(afterLeaving).toBe('99');
    });

    it('should mark the control touched once the user leaves it', () => {
        const fixture = createControl(null);
        fixture.detectChanges();

        amountInput(fixture).dispatchEvent(new Event('blur'));
        const touched = fixture.componentInstance.touched();

        expect(touched).toBeTrue();
    });

    it('should show the amount for the locale, without the currency prefix, when locale amounts are on', () => {
        const fixture = createControl('1234.5');
        fixture.componentRef.setInput('localeAmounts', true);
        fixture.componentRef.setInput('enableFractions', true);
        fixture.detectChanges();
        const shownAmount = amountInput(fixture).value;
        const prefix = prefixText(fixture);

        expect(shownAmount).toBe('1,234.50');
        expect(prefix).toBeUndefined();
    });

    it('should show the amount without fractions for the locale when fractions are off', () => {
        const fixture = createControl('1234.5');
        fixture.componentRef.setInput('localeAmounts', true);
        fixture.detectChanges();
        const shownAmount = amountInput(fixture).value;

        expect(shownAmount).toBe('1,235');
    });

    it('should show the placeholder for the locale when locale amounts are on', () => {
        const fixture = createControl(null);
        fixture.componentRef.setInput('localeAmounts', true);
        fixture.componentRef.setInput('enableFractions', true);
        fixture.componentRef.setInput('placeholder', '1000');
        fixture.detectChanges();
        const shownPlaceholder = amountInput(fixture).placeholder;

        expect(shownPlaceholder).toBe('1,000.00');
    });

    it('should leave a text that is not a number as it is when locale amounts are on', () => {
        const fixture = createControl('abc');
        fixture.componentRef.setInput('localeAmounts', true);
        fixture.detectChanges();
        const shownAmount = amountInput(fixture).value;

        expect(shownAmount).toBe('abc');
    });

    it('should show the typed amount while editing and the locale amount once the user leaves, when locale amounts are on', () => {
        const fixture = createControl(null);
        fixture.componentRef.setInput('localeAmounts', true);
        fixture.componentRef.setInput('enableFractions', true);
        fixture.detectChanges();
        amountInput(fixture).dispatchEvent(new Event('focus'));
        typeInto(amountInput(fixture), '1234.5');
        fixture.detectChanges();
        const whileEditing = amountInput(fixture).value;

        amountInput(fixture).dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        const afterLeaving = amountInput(fixture).value;

        expect(whileEditing).toBe('1234.5');
        expect(afterLeaving).toBe('1,234.50');
    });

    it('should disable the input while the control is disabled', () => {
        const fixture = createControl(12);
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();
        const disabled = amountInput(fixture).disabled;

        expect(disabled).toBeTrue();
    });

    it('should disable the input while the control is read-only', () => {
        const fixture = createControl(12);
        fixture.componentRef.setInput('readonly', true);
        fixture.detectChanges();
        const disabled = amountInput(fixture).disabled;

        expect(disabled).toBeTrue();
    });

    it('should leave the input enabled while the control is neither disabled nor read-only', () => {
        const fixture = createControl(12);
        fixture.detectChanges();
        const disabled = amountInput(fixture).disabled;

        expect(disabled).toBeFalse();
    });

    it('should put the Material input in error once it has an error', () => {
        const fixture = createControl(null);
        fixture.componentRef.setInput('error', { key: 'FORM.FIELD.REQUIRED' });
        fixture.detectChanges();
        const materialInput = fixture.debugElement.query(By.directive(MatInput)).injector.get(MatInput);
        const errorState = materialInput.errorState;

        expect(errorState).toBeTrue();
    });

    it('should show the error it is given', () => {
        const fixture = createControl(null);
        fixture.componentRef.setInput('error', { key: 'FORM.FIELD.REQUIRED' });
        fixture.detectChanges();
        fixture.detectChanges();
        const errorText = fixture.nativeElement.querySelector('.adf-error-text')?.textContent?.trim();

        expect(errorText).toBe('FORM.FIELD.REQUIRED');
    });
});
