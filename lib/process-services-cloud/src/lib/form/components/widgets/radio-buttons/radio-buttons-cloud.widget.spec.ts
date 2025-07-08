/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { FormFieldModel, FormFieldOption, FormFieldTypes, FormModel } from '@alfresco/adf-core';
import { FormCloudService } from '../../../services/form-cloud.service';
import { RadioButtonsCloudWidgetComponent } from './radio-buttons-cloud.widget';
import { of, throwError } from 'rxjs';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatRadioButtonHarness, MatRadioGroupHarness } from '@angular/material/radio/testing';
import { FormUtilsService } from '../../../services/form-utils.service';

describe('RadioButtonsCloudWidgetComponent', () => {
    let fixture: ComponentFixture<RadioButtonsCloudWidgetComponent>;
    let widget: RadioButtonsCloudWidgetComponent;
    let formCloudService: FormCloudService;
    let formUtilsService: FormUtilsService;
    let element: HTMLElement;
    let loader: HarnessLoader;
    const restOption: FormFieldOption[] = [
        {
            id: 'opt-1',
            name: 'opt-name-1'
        },
        {
            id: 'opt-2',
            name: 'opt-name-2'
        }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RadioButtonsCloudWidgetComponent]
        });
        formCloudService = TestBed.inject(FormCloudService);
        formUtilsService = TestBed.inject(FormUtilsService);
        fixture = TestBed.createComponent(RadioButtonsCloudWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
        loader = TestbedHarnessEnvironment.loader(fixture);
        widget.field = new FormFieldModel(new FormModel(), { restUrl: '<url>' });
    });

    it('should update form on values fetched', () => {
        spyOn(formCloudService, 'getRestWidgetData').and.returnValue(of(restOption));
        const taskId = '<form-id>';
        const fieldId = '<field-id>';

        const form = new FormModel({
            taskId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId,
            optionType: 'rest',
            restUrl: '<url>'
        });
        const field = widget.field;
        spyOn(field, 'updateForm').and.stub();

        fixture.detectChanges();
        expect(field.updateForm).toHaveBeenCalled();
    });

    it('should call rest api only when url is present and field type is rest', () => {
        const getFieldConfig = (optionType: string, restUrl: string) => new FormFieldModel(new FormModel(), { optionType, restUrl });
        spyOn(formCloudService, 'getRestWidgetData').and.returnValue(of([]));

        widget.field = getFieldConfig('manual', 'fake-rest-url');
        widget.ngOnInit();
        expect(formCloudService.getRestWidgetData).not.toHaveBeenCalled();

        widget.field = getFieldConfig('rest', null);
        widget.ngOnInit();
        expect(formCloudService.getRestWidgetData).not.toHaveBeenCalled();

        widget.field = getFieldConfig('rest', 'fake-rest-url');
        widget.ngOnInit();
        expect(formCloudService.getRestWidgetData).toHaveBeenCalled();
    });

    it('should update the field value when an option is selected', () => {
        spyOn(widget, 'onFieldChanged').and.stub();
        widget.onOptionClick('fake-opt');

        expect(widget.field.value).toEqual('fake-opt');
    });

    describe('when widget is readonly', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({}), {
                id: 'radio-id',
                name: 'radio-name',
                type: FormFieldTypes.RADIO_BUTTONS,
                readOnly: true
            });

            fixture.detectChanges();
        });

        it('should show radio buttons as text', () => {
            expect(element.querySelector('display-text-widget')).toBeDefined();
        });

        it('should set label property', () => {
            expect(element.querySelector('label').innerText).toBe('radio-name');
        });
    });

    describe('fetching options from rest api', () => {
        const getRadioButtonsWidgetConfig = (readOnly: boolean) => ({
            id: 'rest-radio-id',
            name: 'Rest Radio Buttons',
            type: FormFieldTypes.RADIO_BUTTONS,
            readOnly,
            optionType: 'rest',
            restUrl: '<url>'
        });

        beforeEach(() => {
            spyOn(formCloudService, 'getRestWidgetData').and.returnValue(of(restOption));
        });

        it('should call getRestWidgetData with correct parameters and update field options on success', () => {
            const formId = 'form-id';
            const fieldId = 'field-id';
            widget.field = new FormFieldModel(new FormModel({ id: formId }), { id: fieldId, restUrl: '<url>' });
            const body = { var1: 'value1', var2: 'value2' };
            spyOn(formUtilsService, 'getRestUrlVariablesMap').and.returnValue(body);
            spyOn(widget.field, 'updateForm');

            widget.getValuesFromRestApi();

            expect(formCloudService.getRestWidgetData).toHaveBeenCalledWith(formId, fieldId, body);
            expect(widget.field.options).toEqual(restOption);
            expect(widget.field.updateForm).toHaveBeenCalled();
        });

        describe('when widget is readonly', () => {
            it('should call rest api when form is NOT readonly', () => {
                widget.field = new FormFieldModel(new FormModel({}, undefined, false), getRadioButtonsWidgetConfig(true));
                fixture.detectChanges();

                expect(formCloudService.getRestWidgetData).toHaveBeenCalled();
            });
            it('should NOT call rest api when form is readonly', () => {
                widget.field = new FormFieldModel(new FormModel({}, undefined, true), getRadioButtonsWidgetConfig(true));
                fixture.detectChanges();

                expect(formCloudService.getRestWidgetData).not.toHaveBeenCalled();
            });
        });

        describe('when widget is NOT readonly', () => {
            it('should call rest api when form is NOT readonly', () => {
                widget.field = new FormFieldModel(new FormModel({}, undefined, false), getRadioButtonsWidgetConfig(false));
                fixture.detectChanges();

                expect(formCloudService.getRestWidgetData).toHaveBeenCalled();
            });
            it('should NOT call rest api when form is readonly', () => {
                widget.field = new FormFieldModel(new FormModel({}, undefined, true), getRadioButtonsWidgetConfig(false));
                fixture.detectChanges();

                expect(formCloudService.getRestWidgetData).not.toHaveBeenCalled();
            });
        });
    });

    it('should be able to set a Radio Buttons widget as required', async () => {
        widget.field = new FormFieldModel(new FormModel({}), {
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
        expect(widget.field.isValid).toBe(false);

        const option = await loader.getHarness(MatRadioButtonHarness.with({ label: 'opt-name-1' }));
        await option.check();

        await loader.getHarness(MatRadioButtonHarness.with({ checked: true, label: 'opt-name-1' }));
        expect(widget.field.isValid).toBe(true);
    });

    it('should set Radio Buttons widget as valid when required and not empty', async () => {
        widget.field = new FormFieldModel(new FormModel({}), {
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
        await loader.getHarness(MatRadioButtonHarness.with({ checked: true, label: 'opt-name-2' }));
        expect(widget.field.isValid).toBe(true);
    });

    it('should be able to set a Radio Buttons widget when rest option enabled', () => {
        spyOn(formCloudService, 'getRestWidgetData').and.returnValue(of(restOption));
        widget.field = new FormFieldModel(new FormModel({}), {
            id: 'radio-id',
            name: 'radio-name-label',
            type: FormFieldTypes.RADIO_BUTTONS,
            readOnly: false,
            required: false,
            optionType: 'rest',
            options: [],
            restUrl: 'http://mocky.com/mocky-12344',
            value: { id: 'opt-1' }
        });
        fixture.detectChanges();

        expect(widget.isChecked(widget.field.options[0])).toBeTrue();
        expect(widget.field.isValid).toBe(true);
    });

    it('should show error message if the restUrl failed to fetch options', async () => {
        spyOn(formCloudService, 'getRestWidgetData').and.returnValue(throwError('Failed to fetch options'));
        widget.field.restUrl = 'https://fake-rest-url';
        widget.field.optionType = 'rest';
        widget.field.restIdProperty = 'name';
        fixture.detectChanges();

        const radioButtons = await loader.getHarness(MatRadioGroupHarness);
        await (await radioButtons.host()).click();

        fixture.detectChanges();

        const errorMessage = element.querySelector('.adf-radio-group-error-message .adf-error-text');
        const errorIcon = element.querySelector('.adf-radio-group-error-message .adf-error-icon');

        expect(errorIcon.textContent).toBe('error_outline');
        expect(errorMessage.textContent).toBe('FORM.FIELD.REST_API_FAILED');
    });

    it('should change the value of the form when an option is clicked', async () => {
        const form = new FormModel({});
        widget.field = new FormFieldModel(form, {
            id: 'radio-id',
            name: 'radio-name-label',
            type: FormFieldTypes.RADIO_BUTTONS,
            options: restOption
        });
        fixture.detectChanges();
        const formValueSpy = spyOn(widget.formService.formRulesEvent, 'next');
        const radioButton = await loader.getHarness(MatRadioButtonHarness.with({ label: 'opt-name-1' }));
        await radioButton.check();

        expect(widget.field.value).toEqual('opt-1');
        expect(formValueSpy).toHaveBeenCalled();
    });

    describe('when tooltip is set', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.RADIO_BUTTONS,
                tooltip: 'my custom tooltip',
                optionType: 'manual',
                options: restOption
            });
            fixture.detectChanges();
        });

        it('should show tooltip', async () => {
            const radioButton = await loader.getHarness(MatRadioButtonHarness);
            await (await radioButton.host()).hover();
            const tooltip = await (await radioButton.host()).getAttribute('title');
            expect(tooltip).toBe('my custom tooltip');
        });
    });
});
