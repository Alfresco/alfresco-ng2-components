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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AmountCellComponent } from './amount-cell.component';
import { CurrencyConfig } from '../../data/data-column.model';
import { BehaviorSubject } from 'rxjs';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePL from '@angular/common/locales/pl';

describe('AmountCellComponent', () => {
    let component: AmountCellComponent;
    let fixture: ComponentFixture<AmountCellComponent>;

    const renderAndCheckCurrencyValue = (currencyConfig: CurrencyConfig, value: number, expectedResult: string) => {
        component.value$ = new BehaviorSubject<number>(value);
        component.currencyConfig = currencyConfig;

        fixture.detectChanges();
        const displayedAmount = fixture.nativeElement.querySelector('span');

        expect(displayedAmount).toBeTruthy();
        expect(displayedAmount.textContent.trim()).toBe(expectedResult);
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AmountCellComponent]
        });
        fixture = TestBed.createComponent(AmountCellComponent);
        component = fixture.componentInstance;
    });

    it('should set default currency config', () => {
        expect(component.defaultCurrencyConfig.code).toBe('USD');
        expect(component.defaultCurrencyConfig.display).toBe('symbol');
        expect(component.defaultCurrencyConfig.digitsInfo).toBeUndefined();
        expect(component.defaultCurrencyConfig.locale).toBeUndefined();
    });

    it('should render currency value', () => {
        renderAndCheckCurrencyValue(component.currencyConfig, 123.45, '$123.45');
    });

    it('should render currency value with custom currency code', () => {
        renderAndCheckCurrencyValue({ code: 'MY CUSTOM CURRENCY', display: 'symbol' }, 123.45, 'MY CUSTOM CURRENCY123.45');
    });

    it('should render currency value with custom display code', () => {
        renderAndCheckCurrencyValue({ code: 'EUR', display: 'symbol' }, 123.45, '€123.45');
    });

    it('should render currency value with custom digitsInfo', () => {
        renderAndCheckCurrencyValue({ code: 'USD', display: 'symbol', digitsInfo: '1.2-2' }, 123.456789, '$123.46');
    });
});

describe('AmountCellComponent locale', () => {
    let component: AmountCellComponent;
    let fixture: ComponentFixture<AmountCellComponent>;

    it('should render currency value with custom locale', () => {
        TestBed.configureTestingModule({
            imports: [AmountCellComponent],
            providers: [{ provide: LOCALE_ID, useValue: 'pl-PL' }]
        });

        fixture = TestBed.createComponent(AmountCellComponent);
        component = fixture.componentInstance;
        registerLocaleData(localePL);

        component.value$ = new BehaviorSubject<number>(123.45);
        component.currencyConfig = { code: 'PLN', display: 'symbol', locale: 'pl-PL' };

        fixture.detectChanges();
        const displayedAmount = fixture.nativeElement.querySelector('span');

        expect(displayedAmount).toBeTruthy();
        expect(displayedAmount.textContent.trim()).toMatch(/123,45\s?zł/);
    });
});
