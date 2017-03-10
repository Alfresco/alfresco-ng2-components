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
import { DateWidget } from './date.widget';
import { FormFieldModel } from './../core/form-field.model';
import { FormModel } from './../core/form.model';
import { CoreModule } from 'ng2-alfresco-core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import * as moment from 'moment';

describe('DateWidget', () => {

    let widget: DateWidget;
    let nativeElement: any;
    let elementRef: ElementRef;

    beforeEach(() => {
        nativeElement = {
            querySelector: function () {
                return null;
            }
        };
        elementRef = new ElementRef(nativeElement);
        widget = new DateWidget(elementRef);
        let componentHandler = jasmine.createSpyObj('componentHandler', ['upgradeAllRegistered', 'upgradeElement']);
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
        let el = {};
        spyOn(nativeElement, 'querySelector').and.returnValue(el);
        widget.field = new FormFieldModel(null, {id: 'fake-id'});
        widget.ngOnInit();
        widget.ngAfterViewChecked();
        expect(widget.datePicker.trigger).toBe(el);
    });

    it('should not setup trigger element', () => {
        let w = new DateWidget(null);
        w.ngOnInit();
        expect(w.datePicker.trigger).toBeFalsy();
    });

    it('should eval visibility on date changed', () => {
        spyOn(widget, 'checkVisibility').and.callThrough();

        let field = new FormFieldModel(null);
        widget.field = field;

        widget.onDateChanged();
        expect(widget.checkVisibility).toHaveBeenCalledWith(field);
    });

    it('should update picker value on input date changed', () => {
        widget.field = new FormFieldModel(null, {
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
        widget.field = new FormFieldModel(null, {type: 'date'});
        widget.ngOnInit();

        let date = '13-3-1982';
        widget.datePicker.time = moment(date, widget.field.dateDisplayFormat);
        widget.onDateSelected();
        expect(widget.field.value).toBe(date);
    });

    it('should update material textfield on date selected', () => {
        spyOn(widget, 'setupMaterialTextField').and.callThrough();

        widget.field = new FormFieldModel(null, {type: 'date'});
        widget.ngOnInit();

        widget.datePicker.time = moment();
        widget.onDateSelected();
        expect(widget.setupMaterialTextField).toHaveBeenCalled();
    });

    it('should not update material textfield on date selected', () => {
        let w = new DateWidget(null);
        spyOn(w, 'setupMaterialTextField').and.callThrough();

        w.field = new FormFieldModel(null, {type: 'date'});
        w.ngOnInit();

        w.datePicker.time = moment();
        w.onDateSelected();
        expect(w.setupMaterialTextField).not.toHaveBeenCalled();
    });

    it('should send field change event when a new date is picked from data picker', (done) => {
        let w = new DateWidget(null);
        spyOn(w, 'setupMaterialTextField').and.callThrough();
        w.field = new FormFieldModel(null, {value: '9-9-9999', type: 'date'});
        w.ngOnInit();
        w.datePicker.time = moment('9-9-9999', w.field.dateDisplayFormat);
        w.fieldChanged.subscribe((field) => {
            expect(field).toBeDefined();
            expect(field).not.toBeNull();
            expect(field.value).toEqual('9-9-9999');
            done();
        });
        w.onDateSelected();
    });

    it('should send field change event when date is changed in input text', (done) => {
        let w = new DateWidget(null);
        spyOn(w, 'setupMaterialTextField').and.callThrough();
        w.field = new FormFieldModel(null, {value: '9-9-9999', type: 'date'});
        w.ngOnInit();
        w.datePicker.time = moment('9-9-9999', w.field.dateDisplayFormat);
        w.fieldChanged.subscribe((field) => {
            expect(field).toBeDefined();
            expect(field).not.toBeNull();
            expect(field.value).toEqual('9-9-9999');
            done();
        });

        w.onDateChanged();
    });

    describe('template check', () => {
        let dateWidget: DateWidget;
        let fixture: ComponentFixture<DateWidget>;
        let element: HTMLElement;
        let componentHandler;

        beforeEach(async(() => {
            componentHandler = jasmine.createSpyObj('componentHandler', ['upgradeAllRegistered', 'upgradeElement']);
            window['componentHandler'] = componentHandler;
            TestBed.configureTestingModule({
                imports: [CoreModule],
                declarations: [DateWidget]
            }).compileComponents().then(() => {
                fixture = TestBed.createComponent(DateWidget);
                dateWidget = fixture.componentInstance;
                element = fixture.nativeElement;
            });
        }));

        beforeEach(() => {
            spyOn(dateWidget, 'setupMaterialTextField').and.stub();
            dateWidget.field = new FormFieldModel(new FormModel(), {
                id: 'date-field-id',
                name: 'date-name',
                value: '9-9-9999',
                type: 'date',
                readOnly: 'false'
            });
            dateWidget.field.isVisible = true;
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
            dateWidget.field.isVisible = false;
            fixture.detectChanges();
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('#data-widget')).toBeNull();
                });
        }));

        it('should become visibile if the visibility change to true', async(() => {
            dateWidget.field.isVisible = false;
            fixture.detectChanges();
            dateWidget.fieldChanged.subscribe((field) => {
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
            dateWidget.checkVisibility(dateWidget.field);
        }));

        it('should be hided if the visibility change to false', async(() => {
            dateWidget.fieldChanged.subscribe((field) => {
                field.isVisible = false;
                fixture.detectChanges();
                fixture.whenStable()
                    .then(() => {
                        expect(element.querySelector('#data-widget')).toBeNull();
                    });
            });
            dateWidget.checkVisibility(dateWidget.field);
        }));
    });
});
