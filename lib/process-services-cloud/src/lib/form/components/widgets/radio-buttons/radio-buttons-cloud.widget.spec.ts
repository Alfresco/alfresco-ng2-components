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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { AlfrescoApiService, CoreTestingModule, FormFieldModel, FormFieldOption, FormFieldTypes, FormModel, FormService, setupTestBed } from 'core';
import { FormCloudService } from 'process-services-cloud';
import { Observable } from 'rxjs';
import { RadioButtonsCloudWidgetComponent } from './radio-buttons-cloud.widget';

describe('RadioButtonsCloudWidgetComponent', () => {

    let formService: FormService;
    let formCloudService: FormCloudService;
    let widget: RadioButtonsCloudWidgetComponent;
    let alfrescoApiService: AlfrescoApiService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule,
            MatRadioModule,
            FormsModule,
            MatIconModule
        ]
    });

    beforeEach(() => {
        alfrescoApiService = TestBed.inject(AlfrescoApiService);

        formService = new FormService(null, alfrescoApiService, null);
        formCloudService = new FormCloudService(alfrescoApiService, null);
        widget = new RadioButtonsCloudWidgetComponent(formService, formCloudService, null);
        widget.field = new FormFieldModel(new FormModel(), { restUrl: '<url>' });
    });

    it('should update form on values fetched', () => {
        const taskId = '<form-id>';
        const fieldId = '<field-id>';

        const form = new FormModel({
            taskId: taskId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId,
            restUrl: '<url>'
        });
        const field = widget.field;
        spyOn(field, 'updateForm').and.stub();

        spyOn(formCloudService, 'getRestWidgetData').and.returnValue(new Observable((observer) => {
            observer.next(null);
            observer.complete();
        }));
        widget.ngOnInit();
        expect(field.updateForm).toHaveBeenCalled();
    });

    it('should update the field value when an option is selected', () => {
        spyOn(widget, 'onFieldChanged').and.stub();
        widget.onOptionClick('fake-opt');

        expect(widget.field.value).toEqual('fake-opt');
    });

    describe('when template is ready', () => {
        let radioButtonWidget: RadioButtonsCloudWidgetComponent;
        let fixture: ComponentFixture<RadioButtonsCloudWidgetComponent>;
        let element: HTMLElement;
        const restOption: FormFieldOption[] = [
            {
                id: 'opt-1',
                name: 'opt-name-1'
            },
            {
                id: 'opt-2',
                name: 'opt-name-2'
            }];

        beforeEach(() => {
            fixture = TestBed.createComponent(RadioButtonsCloudWidgetComponent);
            radioButtonWidget = fixture.componentInstance;
            element = fixture.nativeElement;
        });

        it('should show radio buttons as text when is readonly', async () => {
            radioButtonWidget.field = new FormFieldModel(new FormModel({}), {
                id: 'radio-id',
                name: 'radio-name',
                type: FormFieldTypes.RADIO_BUTTONS,
                readOnly: true
            });
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();
            expect(element.querySelector('display-text-widget')).toBeDefined();
        });

        it('should be able to set label property for Radio Button widget', () => {
            radioButtonWidget.field = new FormFieldModel(new FormModel({}), {
                id: 'radio-id',
                name: 'radio-name-label',
                type: FormFieldTypes.RADIO_BUTTONS,
                readOnly: true
            });
            fixture.detectChanges();
            expect(element.querySelector('label').innerText).toBe('radio-name-label');
        });

        it('should be able to set a Radio Button widget as required', async () => {
            radioButtonWidget.field = new FormFieldModel(new FormModel({}), {
                id: 'radio-id',
                name: 'radio-name-label',
                type: FormFieldTypes.RADIO_BUTTONS,
                readOnly: false,
                required: true,
                optionType: 'manual',
                options: restOption,
                restUrl: null
            });

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();
            const widgetLabel = element.querySelector('label');
            expect(widgetLabel.innerText).toBe('radio-name-label*');
            expect(radioButtonWidget.field.isValid).toBe(false);

            const option: HTMLElement = <HTMLElement> element.querySelector('#radio-id-opt-1 label');
            option.click();

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();
            const selectedOption: HTMLElement = <HTMLElement> element.querySelector('[class*="mat-radio-checked"]');
            expect(selectedOption.innerText).toBe('opt-name-1');
            expect(radioButtonWidget.field.isValid).toBe(true);
        });

        it('should be able to set a Radio Button widget as required', () => {
            radioButtonWidget.field = new FormFieldModel(new FormModel({}), {
                id: 'radio-id',
                name: 'radio-name-label',
                type: FormFieldTypes.RADIO_BUTTONS,
                readOnly: false,
                required: true,
                optionType: 'manual',
                options: restOption,
                restUrl: null,
                value: 'opt-name-2'
            });

            fixture.detectChanges();
            const selectedOption: HTMLElement = <HTMLElement> element.querySelector('[class*="mat-radio-checked"]');
            expect(selectedOption.innerText).toBe('opt-name-2');
            expect(radioButtonWidget.field.isValid).toBe(true);
        });
    });
});
