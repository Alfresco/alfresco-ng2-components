/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DateCloudWidgetComponent } from './date-cloud.widget';
import { setupTestBed, FormFieldModel, FormModel, CoreModule } from '@alfresco/adf-core';
import { FormCloudService } from '../../services/form-cloud.service';
import moment from 'moment-es6';

describe('DateWidgetComponent', () => {

    let widget: DateCloudWidgetComponent;
    let fixture: ComponentFixture<DateCloudWidgetComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ],
        declarations: [DateCloudWidgetComponent],
        providers: [FormCloudService]
    });

    beforeEach(async(() => {
        fixture = TestBed.createComponent(DateCloudWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
    }));

    it('should setup min value for date picker', () => {
        const minValue = '1982-03-13';
        widget.field = new FormFieldModel(null, {
            id: 'date-id',
            name: 'date-name',
            minValue: minValue
        });

        widget.ngOnInit();

        const expected = moment(minValue, widget.DATE_FORMAT_CLOUD);
        expect(widget.minDate.isSame(expected)).toBeTruthy();
    });

    it('should date field be present', () => {
        const minValue = '1982-03-13';
        widget.field = new FormFieldModel(null, {
            minValue: minValue
        });

        fixture.detectChanges();

        expect(element.querySelector('#data-widget')).toBeDefined();
        expect(element.querySelector('#data-widget')).not.toBeNull();
    });

    it('should setup max value for date picker', () => {
        const maxValue = '1982-03-13';
        widget.field = new FormFieldModel(null, {
            maxValue: maxValue
        });
        widget.ngOnInit();

        const expected = moment(maxValue, widget.DATE_FORMAT_CLOUD);
        expect(widget.maxDate.isSame(expected)).toBeTruthy();
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
                value: '9999-9-9',
                type: 'date',
                readOnly: 'false'
            });
            widget.field.isVisible = true;
            widget.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.querySelector('#date-field-id')).toBeDefined();
                expect(element.querySelector('#date-field-id')).not.toBeNull();
                const dateElement: any = element.querySelector('#date-field-id');
                expect(dateElement.value).toContain('9-9-9999');
            });
        }));

        it('should show the correct format type', async(() => {
            widget.field = new FormFieldModel(new FormModel(), {
                id: 'date-field-id',
                name: 'date-name',
                value: '9999-30-12',
                type: 'date',
                readOnly: 'false'
            });
            widget.field.isVisible = true;
            widget.field.dateDisplayFormat = 'YYYY-DD-MM';
            widget.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable()
                .then(() => {
                    expect(element.querySelector('#date-field-id')).toBeDefined();
                    expect(element.querySelector('#date-field-id')).not.toBeNull();
                    const dateElement: any = element.querySelector('#date-field-id');
                    expect(dateElement.value).toContain('9999-30-12');
                });
        }));

        it('should disable date button when is readonly', async(() => {
            widget.field = new FormFieldModel(new FormModel(), {
                id: 'date-field-id',
                name: 'date-name',
                value: '9999-9-9',
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

        it('should set isValid to false when the value is not a correct date value', async(() => {
            widget.field = new FormFieldModel(new FormModel(), {
                id: 'date-field-id',
                name: 'date-name',
                value: 'aa',
                type: 'date',
                readOnly: 'false'
            });
            widget.field.isVisible = true;
            widget.field.readOnly = false;
            fixture.detectChanges();

            expect(widget.field.isValid).toBeFalsy();
        }));
    });
});
