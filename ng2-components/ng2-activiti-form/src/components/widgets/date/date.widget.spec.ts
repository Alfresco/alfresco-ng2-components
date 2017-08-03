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

import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as moment from 'moment';
import { CoreModule } from 'ng2-alfresco-core';
import { ActivitiAlfrescoContentService } from '../../../services/activiti-alfresco.service';
import { EcmModelService } from './../../../services/ecm-model.service';
import { FormService } from './../../../services/form.service';
import { FormFieldModel } from './../core/form-field.model';
import { FormModel } from './../core/form.model';
import { DateWidgetComponent } from './date.widget';

describe('DateWidgetComponent', () => {

    let widget: DateWidgetComponent;
    let fixture: ComponentFixture<DateWidgetComponent>;
    let componentHandler;
    let nativeElement: any;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                DateWidgetComponent
            ],
            providers: [
                FormService,
                ActivitiAlfrescoContentService,
                EcmModelService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        nativeElement = {
            querySelector: function () {
                return null;
            }
        };

        fixture = TestBed.createComponent(DateWidgetComponent);

        element = fixture.nativeElement;
        widget = fixture.componentInstance;
        componentHandler = jasmine.createSpyObj('componentHandler', ['upgradeAllRegistered', 'upgradeElement']);
        window['componentHandler'] = componentHandler;
    });

    it('should setup basic date picker settings on init ', () => {
        expect(widget.datePicker).toBeUndefined();
        widget.ngOnInit();
        expect(widget.datePicker).toBeDefined();
    });

    it('should setup min value for date picker', () => {
        let minValue = '13-03-1982';
        widget.field = new FormFieldModel(null, {
            minValue: minValue
        });
        widget.ngOnInit();

        let expected = moment(minValue, widget.field.dateDisplayFormat);
        expect(widget.datePicker._past.isSame(expected)).toBeTruthy();
    });

    it('should setup max value for date picker', () => {
        let maxValue = '31-03-1982';
        widget.field = new FormFieldModel(null, {
            maxValue: maxValue
        });
        widget.ngOnInit();

        let expected = moment(maxValue, widget.field.dateDisplayFormat);
        expect(widget.datePicker._future.isSame(expected)).toBeTruthy();
    });

    it('should setup default time value for date picker', () => {
        let dateValue = '13-03-1982';
        widget.field = new FormFieldModel(null, {
            type: 'date',
            value: '1982-03-13'
        });
        widget.ngOnInit();

        let expected = moment(dateValue, widget.field.dateDisplayFormat);
        expect(widget.datePicker.time.isSame(expected)).toBeTruthy();
    });

    it('should setup trigger element', () => {
        widget.elementRef = new ElementRef(nativeElement);
        let el = {};
        spyOn(nativeElement, 'querySelector').and.returnValue(el);
        widget.field = new FormFieldModel(null, {id: 'fake-id'});
        widget.ngOnInit();
        widget.ngAfterViewChecked();
        expect(widget.datePicker.trigger).toBe(el);
    });

    it('should not setup trigger element', () => {
        widget.ngOnInit();
        expect(widget.datePicker.trigger).toBeFalsy();
    });

    it('should eval visibility on date changed', () => {
        spyOn(widget, 'checkVisibility').and.callThrough();

        let field = new FormFieldModel(null);
        widget.field = field;

        widget.onDateChanged();
        expect(widget.checkVisibility).toHaveBeenCalledWith(field);
    });

    it('should update picker value on input date changed', () => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: 'date',
            value: '13-03-1982'
        });
        widget.ngOnInit();
        widget.field.value = '31-03-1982';
        widget.onDateChanged();

        let expected = moment('31-03-1982', widget.field.dateDisplayFormat);
        expect(widget.datePicker.time.isSame(expected)).toBeTruthy();
    });

    it('should update field value on date selected', () => {
        widget.elementRef = new ElementRef(nativeElement);
        widget.field = new FormFieldModel(new FormModel(), {type: 'date'});
        widget.ngOnInit();

        let date = '13-3-1982';
        widget.datePicker.time = moment(date, widget.field.dateDisplayFormat);
        widget.onDateSelected();
        expect(widget.field.value).toBe(date);
    });

    it('should update material textfield on date selected', () => {
        spyOn(widget, 'setupMaterialTextField').and.callThrough();

        widget.field = new FormFieldModel(new FormModel(), {type: 'date'});
        widget.ngOnInit();

        widget.datePicker.time = moment();
        widget.onDateSelected();
        expect(widget.setupMaterialTextField).toHaveBeenCalled();
    });

    it('should not update material textfield on date selected', () => {
        widget.elementRef = undefined;
        spyOn(widget, 'setupMaterialTextField').and.callThrough();

        widget.field = new FormFieldModel(new FormModel(), {type: 'date'});
        widget.ngOnInit();

        widget.datePicker.time = moment();
        widget.onDateSelected();
        expect(widget.setupMaterialTextField).not.toHaveBeenCalled();
    });

    it('should send field change event when a new date is picked from data picker', (done) => {
        spyOn(widget, 'setupMaterialTextField').and.callThrough();
        widget.field = new FormFieldModel(new FormModel(), {value: '9-9-9999', type: 'date'});
        widget.ngOnInit();
        widget.datePicker.time = moment('9-9-9999', widget.field.dateDisplayFormat);
        widget.fieldChanged.subscribe((field) => {
            expect(field).toBeDefined();
            expect(field).not.toBeNull();
            expect(field.value).toEqual('9-9-9999');
            done();
        });
        widget.onDateSelected();
    });

    it('should send field change event when date is changed in input text', (done) => {
        spyOn(widget, 'setupMaterialTextField').and.callThrough();
        widget.field = new FormFieldModel(null, {value: '9-9-9999', type: 'date'});
        widget.ngOnInit();
        widget.datePicker.time = moment('9-9-9999', widget.field.dateDisplayFormat);
        widget.fieldChanged.subscribe((field) => {
            expect(field).toBeDefined();
            expect(field).not.toBeNull();
            expect(field.value).toEqual('9-9-9999');
            done();
        });

        widget.onDateChanged();
    });

    describe('template check', () => {

        beforeEach(() => {
            spyOn(widget, 'setupMaterialTextField').and.stub();
            widget.field = new FormFieldModel(new FormModel(), {
                id: 'date-field-id',
                name: 'date-name',
                value: '9-9-9999',
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
                    expect(dateElement.value).toEqual('9-9-9999');
                });
        }));

        it('should hide not visible date widget', async(() => {
            widget.field.isVisible = false;
            fixture.detectChanges();
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('#data-widget')).toBeNull();
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
                        expect(element.querySelector('#date-field-id')).toBeDefined();
                        expect(element.querySelector('#date-field-id')).not.toBeNull();
                        let dateElement: any = element.querySelector('#date-field-id');
                        expect(dateElement.value).toEqual('9-9-9999');
                    });
            });
            widget.checkVisibility(widget.field);
        }));

        it('should be hided if the visibility change to false', async(() => {
            widget.fieldChanged.subscribe((field) => {
                field.isVisible = false;
                fixture.detectChanges();
                fixture.whenStable()
                    .then(() => {
                        expect(element.querySelector('#data-widget')).toBeNull();
                    });
            });
            widget.checkVisibility(widget.field);
        }));

        it('should disable date button when is readonly', async(() => {
            widget.field.readOnly = false;
            fixture.detectChanges();

            let dateButton = <HTMLButtonElement> element.querySelector('#date-field-id-button');
            expect(dateButton.disabled).toBeFalsy();

            widget.field.readOnly = true;
            fixture.detectChanges();

            dateButton = <HTMLButtonElement> element.querySelector('#date-field-id-button');
            expect(dateButton.disabled).toBeTruthy();
        }));
    });
});
