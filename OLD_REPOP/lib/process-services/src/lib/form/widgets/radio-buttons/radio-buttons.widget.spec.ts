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

import { ComponentFixture, fakeAsync, getTestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import {
    FormService,
    ContainerModel,
    FormFieldTypes,
    FormFieldOption,
    FormFieldModel,
    FormModel,
    AppConfigServiceMock,
    AppConfigService
} from '@alfresco/adf-core';
import { RadioButtonsWidgetComponent } from './radio-buttons.widget';
import { TaskFormService } from '../../services/task-form.service';
import { ProcessDefinitionService } from '../../services/process-definition.service';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatRadioButtonHarness, MatRadioGroupHarness } from '@angular/material/radio/testing';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-content-services';

describe('RadioButtonsWidgetComponent', () => {
    let formService: FormService;
    let widget: RadioButtonsWidgetComponent;
    let taskFormService: TaskFormService;
    let processDefinitionService: ProcessDefinitionService;

    beforeEach(() => {
        getTestBed().configureTestingModule({
            imports: [RadioButtonsWidgetComponent],
            providers: [
                { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
                { provide: AppConfigService, useClass: AppConfigServiceMock }
            ]
        });
        taskFormService = getTestBed().inject(TaskFormService);
        processDefinitionService = getTestBed().inject(ProcessDefinitionService);

        formService = new FormService();
        widget = new RadioButtonsWidgetComponent(formService, taskFormService, processDefinitionService);
        widget.field = new FormFieldModel(new FormModel(), { restUrl: '<url>', optionType: 'rest' });
    });

    it('should request field values from service', () => {
        const taskId = '<form-id>';
        const fieldId = '<field-id>';

        const form = new FormModel({
            taskId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId,
            restUrl: '<url>',
            optionType: 'rest'
        });

        spyOn(taskFormService, 'getRestFieldValues').and.returnValue(
            new Observable((observer) => {
                observer.next(null);
                observer.complete();
            })
        );
        widget.ngOnInit();
        expect(taskFormService.getRestFieldValues).toHaveBeenCalledWith(taskId, fieldId);
    });

    it('should update form on values fetched', () => {
        const taskId = '<form-id>';
        const fieldId = '<field-id>';

        const form = new FormModel({
            taskId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId,
            restUrl: '<url>',
            optionType: 'rest'
        });
        const field = widget.field;
        spyOn(field, 'updateForm').and.stub();

        spyOn(taskFormService, 'getRestFieldValues').and.returnValue(
            new Observable((observer) => {
                observer.next(null);
                observer.complete();
            })
        );
        widget.ngOnInit();
        expect(field.updateForm).toHaveBeenCalled();
    });

    it('should require field with rest URL to fetch data', () => {
        const taskId = '<form-id>';
        const fieldId = '<field-id>';

        const form = new FormModel({
            taskId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId,
            restUrl: '<url>',
            optionType: 'rest'
        });
        spyOn(taskFormService, 'getRestFieldValues').and.returnValue(
            new Observable((observer) => {
                observer.next(null);
                observer.complete();
            })
        );

        const field = widget.field;
        widget.field = null;
        widget.ngOnInit();
        expect(taskFormService.getRestFieldValues).not.toHaveBeenCalled();
        widget.field = field;

        widget.field.restUrl = null;
        widget.ngOnInit();
        expect(taskFormService.getRestFieldValues).not.toHaveBeenCalled();

        widget.field.restUrl = '<url>';
        widget.ngOnInit();
        expect(taskFormService.getRestFieldValues).toHaveBeenCalled();
    });

    it('should update the field value when an option is selected', () => {
        spyOn(widget, 'onFieldChanged').and.stub();
        widget.onOptionClick('fake-opt');

        expect(widget.field.value).toEqual('fake-opt');
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

        describe('when NOT readonly Radio Buttons widget is part of readonly form', () => {
            it('should NOT request field values from service by task id', () => {
                widget.field = new FormFieldModel(new FormModel({ taskId: '<task-id>' }, undefined, true), getRadioButtonsWidgetConfig(false));

                spyOn(taskFormService, 'getRestFieldValues').and.returnValue(of([]));
                widget.ngOnInit();

                expect(taskFormService.getRestFieldValues).not.toHaveBeenCalled();
            });

            it('should NOT request field values from service by process definition id', () => {
                widget.field = new FormFieldModel(
                    new FormModel({ processDefinitionId: '<definition-id>' }, undefined, true),
                    getRadioButtonsWidgetConfig(false)
                );

                spyOn(processDefinitionService, 'getRestFieldValuesByProcessId').and.returnValue(of([]));
                widget.ngOnInit();

                expect(processDefinitionService.getRestFieldValuesByProcessId).not.toHaveBeenCalled();
            });
        });

        describe('when NOT readonly Radio Buttons widget is part of NOT readonly form', () => {
            it('should request field values from service by task id', () => {
                widget.field = new FormFieldModel(new FormModel({ taskId: '<task-id>' }, undefined, false), getRadioButtonsWidgetConfig(false));

                spyOn(taskFormService, 'getRestFieldValues').and.returnValue(of([]));
                widget.ngOnInit();

                expect(taskFormService.getRestFieldValues).toHaveBeenCalled();
            });

            it('should request field values from service by process definition id', () => {
                widget.field = new FormFieldModel(
                    new FormModel({ processDefinitionId: '<definition-id>' }, undefined, false),
                    getRadioButtonsWidgetConfig(false)
                );

                spyOn(processDefinitionService, 'getRestFieldValuesByProcessId').and.returnValue(of([]));
                widget.ngOnInit();

                expect(processDefinitionService.getRestFieldValuesByProcessId).toHaveBeenCalled();
            });
        });

        describe('when readonly Radio Buttons widget is part of NOT readonly form', () => {
            it('should request field values from service by task id', () => {
                widget.field = new FormFieldModel(new FormModel({ taskId: '<task-id>' }, undefined, false), getRadioButtonsWidgetConfig(true));

                spyOn(taskFormService, 'getRestFieldValues').and.returnValue(of([]));
                widget.ngOnInit();

                expect(taskFormService.getRestFieldValues).toHaveBeenCalled();
            });

            it('should request field values from service by process definition id', () => {
                widget.field = new FormFieldModel(
                    new FormModel({ processDefinitionId: '<definition-id>' }, undefined, false),
                    getRadioButtonsWidgetConfig(true)
                );

                spyOn(processDefinitionService, 'getRestFieldValuesByProcessId').and.returnValue(of([]));
                widget.ngOnInit();

                expect(processDefinitionService.getRestFieldValuesByProcessId).toHaveBeenCalled();
            });
        });
    });

    describe('when template is ready', () => {
        let radioButtonWidget: RadioButtonsWidgetComponent;
        let fixture: ComponentFixture<RadioButtonsWidgetComponent>;
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
            fixture = getTestBed().createComponent(RadioButtonsWidgetComponent);
            radioButtonWidget = fixture.componentInstance;
            element = fixture.nativeElement;
            loader = TestbedHarnessEnvironment.loader(fixture);
        });

        it('should show Radio Buttons as text when is readonly', async () => {
            radioButtonWidget.field = new FormFieldModel(new FormModel({}), {
                id: 'radio-id',
                name: 'radio-name',
                type: FormFieldTypes.RADIO_BUTTONS,
                readOnly: true
            });
            fixture.detectChanges();

            expect(element.querySelector('display-text-widget')).toBeDefined();
        });

        it('should be able to set label property for Radio Buttons widget', () => {
            radioButtonWidget.field = new FormFieldModel(new FormModel({}), {
                id: 'radio-id',
                name: 'radio-name-label',
                type: FormFieldTypes.RADIO_BUTTONS,
                readOnly: true
            });
            fixture.detectChanges();
            expect(element.querySelector('label').innerText).toBe('radio-name-label');
        });

        it('should be able to set a Radio Buttons widget as required', async () => {
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

            const widgetLabel = element.querySelector('label');
            expect(widgetLabel.innerText).toBe('radio-name-label*');
            expect(radioButtonWidget.field.isValid).toBe(false);

            const option = await loader.getHarness(MatRadioButtonHarness.with({ selector: '#radio-id-opt-1' }));
            await option.check();

            const selectedOption = await loader.getHarness(MatRadioButtonHarness.with({ checked: true }));
            expect(await selectedOption.getLabelText()).toBe('opt-name-1');
            expect(radioButtonWidget.field.isValid).toBe(true);
        });

        it('should be able to set another Radio Buttons widget as required', async () => {
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

            const selectedOption = await loader.getHarness(MatRadioButtonHarness.with({ checked: true }));
            expect(await selectedOption.getLabelText()).toBe('opt-name-2');
            expect(radioButtonWidget.field.isValid).toBe(true);
        });

        it('should display tooltip when tooltip is set', async () => {
            radioButtonWidget.field = new FormFieldModel(new FormModel(), {
                id: 'radio-id',
                name: 'radio-name-label',
                type: FormFieldTypes.RADIO_BUTTONS,
                readOnly: false,
                required: true,
                optionType: 'manual',
                options: restOption,
                value: 'opt-name-2',
                tooltip: 'radio widget'
            });

            fixture.detectChanges();

            const option = await loader.getHarness(MatRadioButtonHarness.with({ selector: '#radio-id-opt-1' }));
            const tooltip = await (await option.host()).getAttribute('title');
            expect(tooltip).toEqual(radioButtonWidget.field.tooltip);
        });

        describe('and Radio Buttons widget is populated via taskId', () => {
            beforeEach(() => {
                spyOn(taskFormService, 'getRestFieldValues').and.returnValue(of(restOption));
                radioButtonWidget.field = new FormFieldModel(new FormModel({ taskId: 'task-id' }), {
                    id: 'radio-id',
                    name: 'radio-name',
                    type: FormFieldTypes.RADIO_BUTTONS,
                    restUrl: 'rest-url',
                    optionType: 'rest'
                });
                radioButtonWidget.field.isVisible = true;
                const fakeContainer = new ContainerModel(radioButtonWidget.field);
                radioButtonWidget.field.form.fields.push(fakeContainer);
                fixture.detectChanges();
            });

            it('should show radio buttons', () => {
                expect(element.querySelector('#radio-id')).toBeDefined();
                expect(element.querySelector('#radio-id-opt-1-input')).not.toBeNull();
                expect(element.querySelector('#radio-id-opt-1')).not.toBeNull();
                expect(element.querySelector('#radio-id-opt-2-input')).not.toBeNull();
                expect(element.querySelector('#radio-id-opt-2')).not.toBeNull();
            });

            it('should trigger field changed event on click', fakeAsync(() => {
                const option = element.querySelector<HTMLElement>('#radio-id-opt-1-input');
                expect(element.querySelector('#radio-id')).not.toBeNull();
                expect(option).not.toBeNull();
                option.click();
                widget.fieldChanged.subscribe(() => {
                    expect(element.querySelector('#radio-id')).toBeNull();
                    expect(element.querySelector('#radio-id-opt-1-input')).toBeNull();
                });
            }));

            describe('and Radio Buttons widget is readonly', () => {
                beforeEach(() => {
                    radioButtonWidget.field.readOnly = true;
                    fixture.detectChanges();
                });

                it('should show radio buttons disabled', async () => {
                    const radioButtons = await (
                        await loader.getHarness(MatRadioGroupHarness.with({ selector: '.adf-radio-group' }))
                    ).getRadioButtons();
                    expect(await radioButtons[0].isDisabled()).toBe(true);
                    expect(await radioButtons[1].isDisabled()).toBe(true);
                });

                describe('and a value is selected', () => {
                    beforeEach(() => {
                        radioButtonWidget.field.value = restOption[0].id;
                        fixture.detectChanges();
                    });

                    it('should check the selected value', async () => {
                        const checkedRadioButton = await (
                            await loader.getHarness(MatRadioGroupHarness.with({ selector: '.adf-radio-group' }))
                        ).getCheckedRadioButton();
                        expect(await checkedRadioButton.getLabelText()).toBe(restOption[0].name);
                    });
                });
            });
        });

        describe('and Radio Buttons widget is populated via processDefinitionId', () => {
            beforeEach(() => {
                radioButtonWidget.field = new FormFieldModel(new FormModel({ processDefinitionId: 'proc-id' }), {
                    id: 'radio-id',
                    name: 'radio-name',
                    type: FormFieldTypes.RADIO_BUTTONS,
                    restUrl: 'rest-url',
                    optionType: 'rest'
                });
                spyOn(processDefinitionService, 'getRestFieldValuesByProcessId').and.returnValue(of(restOption));
                radioButtonWidget.field.isVisible = true;
                fixture.detectChanges();
            });

            it('should show visible radio buttons', () => {
                expect(element.querySelector('#radio-id')).toBeDefined();
                expect(element.querySelector('#radio-id-opt-1-input')).not.toBeNull();
                expect(element.querySelector('#radio-id-opt-1')).not.toBeNull();
                expect(element.querySelector('#radio-id-opt-2-input')).not.toBeNull();
                expect(element.querySelector('#radio-id-opt-2')).not.toBeNull();
            });
        });
    });
});
