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
import { MatInput } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { NoopTranslateModule } from '../../../../../src/lib/testing/noop-translate.module';
import { typeInto } from '../testing/widget-testing.mock';
import { DateFieldValue } from '../../definition/form-definition.interface';
import { SignalDateInputControlComponent } from './date-input-control.component';

describe('SignalDateInputControlComponent', () => {
    const dateInput = (fixture: ComponentFixture<SignalDateInputControlComponent>): HTMLInputElement => fixture.nativeElement.querySelector('input');

    const createControl = (value: DateFieldValue): ComponentFixture<SignalDateInputControlComponent> => {
        const fixture = TestBed.createComponent(SignalDateInputControlComponent);
        fixture.componentRef.setInput('inputId', 'due');
        fixture.componentRef.setInput('value', value);
        fixture.componentRef.setInput('displayFormat', 'DD/MM/YYYY');
        return fixture;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [NoopTranslateModule] });
    });

    it('should show the date in the display format', () => {
        const fixture = createControl(new Date(2024, 2, 15));
        fixture.detectChanges();
        const shownDate = dateInput(fixture).value;

        expect(shownDate).toBe('15/03/2024');
    });

    it('should show a date the value changes to from outside', () => {
        const fixture = createControl(new Date(2024, 2, 15));
        fixture.detectChanges();

        fixture.componentRef.setInput('value', new Date(2025, 0, 2));
        fixture.detectChanges();
        const shownDate = dateInput(fixture).value;

        expect(shownDate).toBe('02/01/2025');
    });

    it('should show an empty input when the date is missing', () => {
        const fixture = createControl(null);
        fixture.detectChanges();
        const shownDate = dateInput(fixture).value;

        expect(shownDate).toBe('');
    });

    it('should write the date typed into the value', () => {
        const fixture = createControl(null);
        fixture.detectChanges();

        typeInto(dateInput(fixture), '15-3-2024');
        const value = fixture.componentInstance.value();

        expect(value).toEqual(new Date(2024, 2, 15));
    });

    it('should write text that is not a date as an invalid date', () => {
        const fixture = createControl(null);
        fixture.detectChanges();

        typeInto(dateInput(fixture), 'Ada');
        const value = fixture.componentInstance.value();
        const valueTime = value instanceof Date ? value.getTime() : undefined;

        expect(valueTime).toBeNaN();
    });

    it('should show an empty input when the value is text', () => {
        const fixture = createControl('Ada');
        fixture.detectChanges();
        const shownText = dateInput(fixture).value;

        expect(shownText).toBe('');
    });

    it('should write text that is not a date as an invalid date once the input changes', () => {
        const fixture = createControl(null);
        fixture.detectChanges();

        typeInto(dateInput(fixture), 'Ada');
        dateInput(fixture).dispatchEvent(new Event('change'));
        const value = fixture.componentInstance.value();
        const valueTime = value instanceof Date ? value.getTime() : undefined;

        expect(valueTime).toBeNaN();
    });

    it('should write no date when the text is cleared', () => {
        const fixture = createControl(new Date(2024, 2, 15));
        fixture.detectChanges();

        typeInto(dateInput(fixture), '');
        const value = fixture.componentInstance.value();

        expect(value).toBeNull();
    });

    it('should keep the text being typed as it is', () => {
        const fixture = createControl(null);
        fixture.detectChanges();

        typeInto(dateInput(fixture), '1-1-2024');
        fixture.detectChanges();
        const shownText = dateInput(fixture).value;

        expect(shownText).toBe('1-1-2024');
    });

    it('should mark the control touched once the user leaves it', () => {
        const fixture = createControl(null);
        fixture.detectChanges();

        dateInput(fixture).dispatchEvent(new Event('blur'));
        const touched = fixture.componentInstance.touched();

        expect(touched).toBeTrue();
    });

    it('should disable the input while the control is disabled', () => {
        const fixture = createControl(null);
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();
        const disabled = dateInput(fixture).disabled;

        expect(disabled).toBeTrue();
    });

    it('should disable the input while the control is read-only', () => {
        const fixture = createControl(null);
        fixture.componentRef.setInput('readonly', true);
        fixture.detectChanges();
        const disabled = dateInput(fixture).disabled;

        expect(disabled).toBeTrue();
    });

    it('should leave the input enabled while the control is neither disabled nor read-only', () => {
        const fixture = createControl(null);
        fixture.detectChanges();
        const disabled = dateInput(fixture).disabled;

        expect(disabled).toBeFalse();
    });

    it('should mark the input required while the control is required', () => {
        const fixture = createControl(null);
        fixture.componentRef.setInput('required', true);
        fixture.detectChanges();
        const required = dateInput(fixture).required;

        expect(required).toBeTrue();
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
