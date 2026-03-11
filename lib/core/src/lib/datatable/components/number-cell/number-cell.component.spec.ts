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
import { NumberCellComponent } from './number-cell.component';
import { DecimalConfig } from '../../data/data-column.model';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePL from '@angular/common/locales/pl';
import { UnitTestingUtils } from '../../../testing/unit-testing-utils';

describe('NumberCellComponent', () => {
    let component: NumberCellComponent;
    let fixture: ComponentFixture<NumberCellComponent>;
    let testingUtils: UnitTestingUtils;

    const renderAndCheckNumberValue = (decimalConfig: DecimalConfig, value: number, expectedResult: string) => {
        component.decimalConfig = decimalConfig;
        component.value$.next(value);

        fixture.detectChanges();
        const displayedNumber = testingUtils.getByCSS('span');

        expect(displayedNumber).toBeTruthy();
        expect(displayedNumber.nativeElement.textContent.trim()).toBe(expectedResult);
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NumberCellComponent]
        });
        fixture = TestBed.createComponent(NumberCellComponent);
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
    });

    it('should set default decimal config', () => {
        expect(component.defaultDecimalConfig.digitsInfo).toBeUndefined();
        expect(component.defaultDecimalConfig.locale).toBeUndefined();
    });

    it('should render number value', () => {
        renderAndCheckNumberValue(component.decimalConfig, 123.45, '123.45');
    });

    it('should render decimal value with custom digitsInfo', () => {
        renderAndCheckNumberValue({ digitsInfo: '1.2-2' }, 123.456789, '123.46');
    });

    describe('numberValue validation', () => {
        it('should return valid number for integer input', () => {
            component.value$.next(42);
            fixture.detectChanges();
            expect(component.numberValue()).toBe(42);
        });

        it('should return valid number for float input', () => {
            component.value$.next(3.14159);
            fixture.detectChanges();
            expect(component.numberValue()).toBe(3.14159);
        });

        it('should return valid number for negative number', () => {
            component.value$.next(-123.45);
            fixture.detectChanges();
            expect(component.numberValue()).toBe(-123.45);
        });

        it('should return valid number for zero', () => {
            component.value$.next(0);
            fixture.detectChanges();
            expect(component.numberValue()).toBe(0);
        });

        it('should return valid number for numeric string', () => {
            component.value$.next('456.78');
            fixture.detectChanges();
            expect(component.numberValue()).toBe(456.78);
        });

        it('should return null for boolean true', () => {
            (component.value$ as { next: (v: unknown) => void }).next(true);
            fixture.detectChanges();
            expect(component.numberValue()).toBeNull();
        });

        it('should return null for NaN', () => {
            component.value$.next(NaN);
            fixture.detectChanges();
            expect(component.numberValue()).toBeNull();
        });

        it('should return null for non-numeric string', () => {
            component.value$.next('not a number');
            fixture.detectChanges();
            expect(component.numberValue()).toBeNull();
        });

        it('should not render span when value is invalid', () => {
            component.value$.next(null);
            fixture.detectChanges();
            const displayedNumber = testingUtils.getByCSS('span');
            expect(displayedNumber).toBeFalsy();
        });
    });
});

describe('NumberCellComponent locale', () => {
    let component: NumberCellComponent;
    let fixture: ComponentFixture<NumberCellComponent>;
    let testingUtils: UnitTestingUtils;

    it('should render decimal value with custom locale', () => {
        TestBed.configureTestingModule({
            imports: [NumberCellComponent],
            providers: [{ provide: LOCALE_ID, useValue: 'pl-PL' }]
        });

        fixture = TestBed.createComponent(NumberCellComponent);
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        registerLocaleData(localePL);

        component.decimalConfig = { locale: 'pl-PL' };
        component.value$.next(123.45);

        fixture.detectChanges();
        const displayedNumber = testingUtils.getByCSS('span');

        expect(displayedNumber).toBeTruthy();
        expect(displayedNumber.nativeElement.textContent.trim()).toBe('123,45');
    });
});
