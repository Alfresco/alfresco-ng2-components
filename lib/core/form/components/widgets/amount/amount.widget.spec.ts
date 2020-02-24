/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldModel } from './../core/form-field.model';
import { AmountWidgetComponent, ADF_AMOUNT_SETTINGS } from './amount.widget';
import { setupTestBed } from '../../../../testing/setup-test-bed';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormBaseModule } from '../../../form-base.module';
import { TranslateStore } from '@ngx-translate/core';
import { TranslationService } from '../../../../services/translation.service';
import { TranslationMock } from '../../../../mock/translation.service.mock';
import { FormModel } from '../core';

describe('AmountWidgetComponent', () => {

    let widget: AmountWidgetComponent;
    let fixture: ComponentFixture<AmountWidgetComponent>;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            FormBaseModule
        ],
        providers: [
            { provide: TranslationService, useClass: TranslationMock },
            TranslateStore
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AmountWidgetComponent);

        widget = fixture.componentInstance;
    });

    it('should setup currency from field', () => {
        const currency = 'UAH';
        widget.field = new FormFieldModel(null, {
            currency: currency
        });

        widget.ngOnInit();
        expect(widget.currency).toBe(currency);
    });

    it('should setup default currency', () => {
        widget.field = null;
        widget.ngOnInit();
        expect(widget.currency).toBe(AmountWidgetComponent.DEFAULT_CURRENCY);
    });

    it('should setup empty placeholder in readOnly mode', () => {
        widget.field = new FormFieldModel(null, {
            readOnly: true,
            placeholder: '1234'
        });

        widget.ngOnInit();
        expect(widget.placeholder).toBe('');
    });

    it('should setup placeholder when readOnly is false', () => {
        widget.field = new FormFieldModel(null, {
            readOnly: false,
            placeholder: '1234'
        });

        widget.ngOnInit();
        expect(widget.placeholder).toBe('1234');
    });
});


describe('AmountWidgetComponent - rendering', () => {

    let widget: AmountWidgetComponent;
    let fixture: ComponentFixture<AmountWidgetComponent>;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            FormBaseModule
        ],
        providers: [
            { provide: TranslationService, useClass: TranslationMock },
            TranslateStore
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AmountWidgetComponent);
        widget = fixture.componentInstance;
    });

    it('[C309692] - Should be possible to set the General Properties for Amount Widget', async () =>{
        widget.field = new FormFieldModel(new FormModel(), {
            id: 'TestAmount1',
            name: 'Test Amount',
            type: 'amount',
            required: true,
            colspan: 2,
            placeholder: 'Check Placeholder Text',
            minValue: null,
            maxValue: null,
            visibilityCondition: null,
            params: {
                existingColspan: 1,
                maxColspan: 2
            },
            enableFractions: false,
            currency: '$'
        });
        fixture.detectChanges();
        await fixture.whenStable();

        const requiredAsteriscElement = fixture.nativeElement.querySelector('.mat-placeholder-required');
        expect(requiredAsteriscElement.textContent).toContain('*');
        const widgetPlaceholder = fixture.nativeElement.querySelector('label.mat-form-field-label');
        expect(widgetPlaceholder.textContent).toBe('Check Placeholder Text *');
        const widgetLabel = fixture.nativeElement.querySelector('label.adf-label');
        expect(widgetLabel.textContent).toBe('Test Amount*');
        const widgetPrefix = fixture.nativeElement.querySelector('div.mat-form-field-prefix');
        expect(widgetPrefix.textContent).toBe('$');
        expect(widget.field.isValid).toBe(false);
        const widgetById: HTMLInputElement = fixture.nativeElement.querySelector('#TestAmount1');
        expect(widgetById).toBeDefined();
        expect(widgetById).not.toBeNull();

        widgetById.value = '90';
        widgetById.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(widget.field.isValid).toBe(true, 'amount widget with a valid field');

        widgetById.value = 'gdfgdf';
        widgetById.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(widget.field.isValid).toBe(false, 'amount widget with an invalid field');
        const errorWidget = fixture.nativeElement.querySelector('error-widget .adf-error-text');
        expect(errorWidget.textContent).toBe('FORM.FIELD.VALIDATOR.INVALID_NUMBER');
    });
});

describe('AmountWidgetComponent settings', () => {
    let widget: AmountWidgetComponent;
    let fixture: ComponentFixture<AmountWidgetComponent>;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            FormBaseModule
        ],
        providers: [
            { provide: TranslationService, useClass: TranslationMock },
            TranslateStore,
            {
                provide: ADF_AMOUNT_SETTINGS,
                useValue: {
                    showReadonlyPlaceholder: true
                }
            }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AmountWidgetComponent);

        widget = fixture.componentInstance;
    });

    it('should display placeholder via injected settings', () => {
        const field: any = {
            readOnly: true,
            placeholder: 'some placeholder'
        };
        widget.field = field;
        expect(widget.placeholder).toBe('some placeholder');
    });
});
