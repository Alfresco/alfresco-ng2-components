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
import { NumberCellComponent } from './number-cell.component';
import { DecimalConfig } from '../../data/data-column.model';
import { BehaviorSubject } from 'rxjs';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePL from '@angular/common/locales/pl';

describe('NumberCellComponent', () => {
    let component: NumberCellComponent;
    let fixture: ComponentFixture<NumberCellComponent>;

    const renderAndCheckNumberValue = (decimalConfig: DecimalConfig, value: number, expectedResult: string) => {
        component.value$ = new BehaviorSubject<number>(value);
        component.decimalConfig = decimalConfig;

        fixture.detectChanges();
        const displayedNumber = fixture.nativeElement.querySelector('span');

        expect(displayedNumber).toBeTruthy();
        expect(displayedNumber.textContent.trim()).toBe(expectedResult);
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NumberCellComponent]
        });
        fixture = TestBed.createComponent(NumberCellComponent);
        component = fixture.componentInstance;
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
});

describe('NumberCellComponent locale', () => {
    let component: NumberCellComponent;
    let fixture: ComponentFixture<NumberCellComponent>;

    it('should render decimal value with custom locale', () => {
        TestBed.configureTestingModule({
            imports: [NumberCellComponent],
            providers: [{ provide: LOCALE_ID, useValue: 'pl-PL' }]
        });

        fixture = TestBed.createComponent(NumberCellComponent);
        component = fixture.componentInstance;
        registerLocaleData(localePL);

        component.value$ = new BehaviorSubject<number>(123.45);
        component.decimalConfig = { locale: 'pl-PL' };

        fixture.detectChanges();
        const displayedNumber = fixture.nativeElement.querySelector('span');

        expect(displayedNumber).toBeTruthy();
        expect(displayedNumber.textContent.trim()).toBe('123,45');
    });
});
