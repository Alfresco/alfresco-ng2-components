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
import { ActivitiContentService } from '../../../services/activiti-alfresco.service';
import { MaterialModule } from '../../../../material.module';
import { ErrorWidgetComponent } from '../error/error.component';
import { EcmModelService } from './../../../services/ecm-model.service';
import { FormService } from './../../../services/form.service';
import { FormFieldModel } from './../core/form-field.model';
import { FormModel } from './../core/form.model';
import { DateTimeWidgetComponent } from './date-time.widget';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from '@mat-datetimepicker/core';
import { UserPreferencesService } from '../../../../services/user-preferences.service';

describe('DateTimeWidgetComponent', () => {

    let widget: DateTimeWidgetComponent;
    let fixture: ComponentFixture<DateTimeWidgetComponent>;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                MatNativeDatetimeModule,
                MatDatetimepickerModule
            ],
            declarations: [
                DateTimeWidgetComponent,
                ErrorWidgetComponent
            ],
            providers: [
                FormService,
                UserPreferencesService,
                EcmModelService,
                ActivitiContentService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DateTimeWidgetComponent);

        element = fixture.nativeElement;
        widget = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should setup min value for date picker', () => {
        let minValue = '1982-03-13T10:00Z';
        widget.field = new FormFieldModel(null, {
            id: 'date-id',
            name: 'date-name',
            minValue: minValue
        });

        fixture.detectChanges();

        let expected = moment(minValue, 'YYYY-MM-DDTHH:mm:ssZ');
        expect(widget.minDate.isSame(expected)).toBeTruthy();
    });

    it('should date field be present', () => {
        widget.field = new FormFieldModel(null, {
            id: 'date-id',
            name: 'date-name'
        });
        fixture.detectChanges();

        expect(element.querySelector('#data-time-widget')).toBeDefined();
        expect(element.querySelector('#data-time-widget')).not.toBeNull();
    });

    it('should setup max value for date picker', () => {
        let maxValue = '1982-03-13T10:00Z';
        widget.field = new FormFieldModel(null, {
            maxValue: maxValue
        });
        fixture.detectChanges();

        let expected = moment(maxValue, 'YYYY-MM-DDTHH:mm:ssZ');
        expect(widget.maxDate.isSame(expected)).toBeTruthy();
    });

    it('should eval visibility on date changed', () => {
        spyOn(widget, 'checkVisibility').and.callThrough();

        let field = new FormFieldModel(new FormModel(), {
            id: 'date-field-id',
            name: 'date-name',
            value: '9-99-9999 10:00 AM',
            type: 'date',
            readOnly: 'false'
        });

        widget.field = field;

        widget.onDateChanged({ value: moment('13-03-1982 10:00 AM') });
        expect(widget.checkVisibility).toHaveBeenCalledWith(field);
    });

    describe('template check', () => {

        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel(), {
                id: 'date-field-id',
                name: 'date-name',
                value: '9-9-9999 99:99 AM',
                type: 'date',
                readOnly: 'false'
            });
            widget.field.isVisible = true;
            fixture.detectChanges();
        });

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should show visible date widget', async(() => {
            fixture.whenStable()
                .then(() => {
                    expect(element.querySelector('#date-field-id')).toBeDefined();
                    expect(element.querySelector('#date-field-id')).not.toBeNull();
                    let dateElement: any = element.querySelector('#date-field-id');
                    expect(dateElement.value).toContain('9-9-9999');
                });
        }));

        it('should check correctly the min value with different formats', async(() => {
            widget.field.value = '11-30-9999 10:30 AM';
            widget.field.dateDisplayFormat = 'MM-DD-YYYY HH:mm A';
            widget.field.minValue = '9999-11-30T10:30Z';
            fixture.detectChanges();
            widget.field.validate();
            fixture.detectChanges();
            fixture.whenStable()
                .then(() => {
                    expect(element.querySelector('#date-field-id')).toBeDefined();
                    expect(element.querySelector('#date-field-id')).not.toBeNull();
                    let dateElement: any = element.querySelector('#date-field-id');
                    expect(dateElement.value).toContain('11-30-9999 10:30 AM');
                    expect(element.querySelector('.adf-error-text').textContent).toBe('FORM.FIELD.VALIDATOR.NOT_LESS_THAN');
                });
        }));

        it('should show the correct format type', async(() => {
            widget.field.value = '12-30-9999 10:30 AM';
            widget.field.dateDisplayFormat = 'MM-DD-YYYY HH:mm A';
            widget.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable()
                .then(() => {
                    expect(element.querySelector('#date-field-id')).toBeDefined();
                    expect(element.querySelector('#date-field-id')).not.toBeNull();
                    let dateElement: any = element.querySelector('#date-field-id');
                    expect(dateElement.value).toContain('12-30-9999 10:30 AM');
                });
        }));

        it('should hide not visible date widget', async(() => {
            fixture.detectChanges();
            expect(element.querySelector('#data-time-widget')).not.toBeNull();
            widget.field.isVisible = false;
            fixture.detectChanges();
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('#data-time-widget')).toBeNull();
                });
        }));

        it('should become visibile if the visibility change to true', async(() => {
            widget.field.isVisible = false;
            fixture.detectChanges();
            widget.fieldChanged.subscribe((field) => {
                field.isVisible = true;
                fixture.detectChanges();
                fixture.whenStable()
                    .then(() => {
                        expect(element.querySelector('#data-time-widget')).toBeDefined();
                        expect(element.querySelector('#data-time-widget')).not.toBeNull();
                        let dateElement: any = element.querySelector('#data-time-widget');
                        expect(dateElement.value).toContain('9-9-9999');
                    });
            });
            widget.checkVisibility(widget.field);
        }));

        it('should be hided if the visibility change to false', async(() => {
            expect(element.querySelector('#data-time-widget')).not.toBeNull();
            widget.fieldChanged.subscribe((field) => {
                field.isVisible = false;
                fixture.detectChanges();
                fixture.whenStable()
                    .then(() => {
                        expect(element.querySelector('#data-time-widget')).toBeNull();
                    });
            });
            widget.checkVisibility(widget.field);
        }));

        it('should disable date button when is readonly', async(() => {
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
