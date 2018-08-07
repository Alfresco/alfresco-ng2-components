/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import moment from 'moment-es6';
import { FormFieldModel } from './../core/form-field.model';
import { FormModel } from './../core/form.model';
import { DateWidgetComponent } from './date.widget';
import { setupTestBed } from '../../../../testing/setupTestBed';
import { CoreModule } from '../../../../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DateWidgetComponent', () => {

    let widget: DateWidgetComponent;
    let fixture: ComponentFixture<DateWidgetComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DateWidgetComponent);

        element = fixture.nativeElement;
        widget = fixture.componentInstance;
    });

    it('should setup min value for date picker', () => {
        let minValue = '13-03-1982';
        widget.field = new FormFieldModel(null, {
            id: 'date-id',
            name: 'date-name',
            minValue: minValue
        });

        widget.ngOnInit();

        let expected = moment(minValue, widget.field.dateDisplayFormat);
        expect(widget.minDate.isSame(expected)).toBeTruthy();
    });

    it('should date field be present', () => {
        let minValue = '13-03-1982';
        widget.field = new FormFieldModel(null, {
            minValue: minValue
        });

        fixture.detectChanges();

        expect(element.querySelector('#data-widget')).toBeDefined();
        expect(element.querySelector('#data-widget')).not.toBeNull();
    });

    it('should setup max value for date picker', () => {
        let maxValue = '31-03-1982';
        widget.field = new FormFieldModel(null, {
            maxValue: maxValue
        });
        widget.ngOnInit();

        let expected = moment(maxValue, widget.field.dateDisplayFormat);
        expect(widget.maxDate.isSame(expected)).toBeTruthy();
    });

    it('should eval visibility on date changed', () => {
        spyOn(widget, 'onFieldChanged').and.callThrough();

        let field = new FormFieldModel(new FormModel(), {
            id: 'date-field-id',
            name: 'date-name',
            value: '9-9-9999',
            type: 'date',
            readOnly: 'false'
        });

        widget.field = field;

        widget.onDateChanged({ value: moment('12/12/2012') });
        expect(widget.onFieldChanged).toHaveBeenCalledWith(field);
    });

    describe('template check', () => {

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should show visible date widget', async(() => {
            widget.field = new FormFieldModel(new FormModel(), {
                id: 'date-field-id',
                name: 'date-name',
                value: '9-9-9999',
                type: 'date',
                readOnly: 'false'
            });
            widget.field.isVisible = true;
            widget.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.querySelector('#date-field-id')).toBeDefined();
                expect(element.querySelector('#date-field-id')).not.toBeNull();
                let dateElement: any = element.querySelector('#date-field-id');
                expect(dateElement.value).toContain('9-9-9999');
            });
        }));

        xit('should check correctly the min value with different formats', async(() => {
            widget.field = new FormFieldModel(new FormModel(), {
                id: 'date-field-id',
                name: 'date-name',
                value:  '11-30-9999',
                type: 'date',
                readOnly: 'false',
                dateDisplayFormat : 'MM-DD-YYYY',
                minValue : '30-12-9999'
            });
            fixture.detectChanges();
            widget.field.validate();
            fixture.whenStable()
            .then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('#date-field-id')).toBeDefined();
                    expect(element.querySelector('#date-field-id')).not.toBeNull();
                    let dateElement: any = element.querySelector('#date-field-id');
                    expect(dateElement.value).toContain('11-30-9999');
                    expect(element.querySelector('.adf-error-text').textContent).toBe('FORM.FIELD.VALIDATOR.NOT_LESS_THAN');
                });
        }));

        it('should show the correct format type', async(() => {
            widget.field = new FormFieldModel(new FormModel(), {
                id: 'date-field-id',
                name: 'date-name',
                value:  '12-30-9999',
                type: 'date',
                readOnly: 'false'
            });
            widget.field.isVisible = true;
            widget.field.dateDisplayFormat = 'MM-DD-YYYY';
            widget.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable()
                .then(() => {
                    expect(element.querySelector('#date-field-id')).toBeDefined();
                    expect(element.querySelector('#date-field-id')).not.toBeNull();
                    let dateElement: any = element.querySelector('#date-field-id');
                    expect(dateElement.value).toContain('12-30-9999');
                });
        }));

        it('should disable date button when is readonly', async(() => {
            widget.field = new FormFieldModel(new FormModel(), {
                id: 'date-field-id',
                name: 'date-name',
                value: '9-9-9999',
                type: 'date',
                readOnly: 'false'
            });
            widget.field.isVisible = true;
            widget.field.readOnly = false;
            fixture.detectChanges();

            let dateButton = <HTMLButtonElement> element.querySelector('button');
            expect(dateButton.disabled).toBeFalsy();

            widget.field.readOnly = true;
            fixture.detectChanges();

            dateButton = <HTMLButtonElement> element.querySelector('button');
            expect(dateButton.disabled).toBeTruthy();
        }));
    });
});
