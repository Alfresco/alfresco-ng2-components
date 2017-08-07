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
import * as moment from 'moment';
import { CoreModule } from 'ng2-alfresco-core';
import { MATERIAL_MODULE } from '../../../../index';
import { ActivitiAlfrescoContentService } from '../../../services/activiti-alfresco.service';
import { ErrorWidgetComponent } from '../error/error.component';
import { EcmModelService } from './../../../services/ecm-model.service';
import { FormService } from './../../../services/form.service';
import { FormFieldModel } from './../core/form-field.model';
import { FormModel } from './../core/form.model';
import { DateWidgetComponent } from './date.widget';

describe('DateWidgetComponent', () => {

    let widget: DateWidgetComponent;
    let fixture: ComponentFixture<DateWidgetComponent>;
    let nativeElement: any;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                ...MATERIAL_MODULE
            ],
            declarations: [
                DateWidgetComponent,
                ErrorWidgetComponent
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

        widget.ngOnInit();

        expect(element.querySelector('#dropdown-id')).toBeDefined();
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
        spyOn(widget, 'checkVisibility').and.callThrough();

        let field = new FormFieldModel(new FormModel(), {
            id: 'date-field-id',
            name: 'date-name',
            value: '9-9-9999',
            type: 'date',
            readOnly: 'false'
        });

        widget.field = field;

        widget.onDateChanged('12/12/2012');
        expect(widget.checkVisibility).toHaveBeenCalledWith(field);
    });

    describe('template check', () => {

        beforeEach(() => {
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

            let dateButton = <HTMLButtonElement> element.querySelector('button');
            expect(dateButton.disabled).toBeFalsy();

            widget.field.readOnly = true;
            fixture.detectChanges();

            dateButton = <HTMLButtonElement> element.querySelector('button');
            expect(dateButton.disabled).toBeTruthy();
        }));
    });
});
