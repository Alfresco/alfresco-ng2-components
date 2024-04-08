/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { DropdownCloudWidgetComponent } from './dropdown-cloud.widget';
import {
    FormFieldModel,
    FormModel,
    FormService,
    FormFieldEvent,
    FormFieldTypes,
    LogService
} from '@alfresco/adf-core';
import { FormCloudService } from '../../../services/form-cloud.service';
import { ProcessServiceCloudTestingModule } from '../../../../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import {
    fakeOptionList,
    filterOptionList,
    mockConditionalEntries,
    mockFormVariableWithJson,
    mockPlayersResponse,
    mockRestDropdownOptions,
    mockSecondRestDropdownOptions,
    mockVariablesWithDefaultJson,
    mockProcessVariablesWithJson
} from '../../../mocks/dropdown.mock';
import { TaskVariableCloud } from '../../../models/task-variable-cloud.model';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';

describe('DropdownCloudWidgetComponent', () => {

    let formService: FormService;
    let widget: DropdownCloudWidgetComponent;
    let formCloudService: FormCloudService;
    let logService: LogService;
    let fixture: ComponentFixture<DropdownCloudWidgetComponent>;
    let element: HTMLElement;
    let loader: HarnessLoader;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                ProcessServiceCloudTestingModule
            ]
        });
        fixture = TestBed.createComponent(DropdownCloudWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;

        formService = TestBed.inject(FormService);
        formCloudService = TestBed.inject(FormCloudService);
        logService = TestBed.inject(LogService);
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    afterEach(() => fixture.destroy());

    describe('Simple Dropdown', () => {

        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                id: 'dropdown-id',
                name: 'date-name',
                type: 'dropdown',
                readOnly: false,
                restUrl: 'https://fake-rest-url',
                options: [{ id: 'empty', name: 'Choose one...' }]
            });
            widget.field.isVisible = true;
            fixture.detectChanges();
        });

        it('should require field with restUrl', () => {
            spyOn(formCloudService, 'getRestWidgetData');
            widget.field = new FormFieldModel(new FormModel());
            widget.ngOnInit();
            expect(formCloudService.getRestWidgetData).not.toHaveBeenCalled();

            widget.field = new FormFieldModel(null, { restUrl: null });
            widget.ngOnInit();
            expect(formCloudService.getRestWidgetData).not.toHaveBeenCalled();
        });

        it('should select the default value when an option is chosen as default', async () => {
            widget.field.value = 'option_2';

            expect(widget.fieldValue).toEqual('option_2');
        });

        it('should select the empty value when no default is chosen', async () => {
            widget.field.value = 'empty';
            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.open();

            expect(widget.fieldValue).toEqual('empty');
        });

        it('should load data from restUrl and populate options', async () => {
            const jsonDataSpy = spyOn(formCloudService, 'getRestWidgetData').and.returnValue(of(fakeOptionList));
            widget.field.restUrl = 'https://fake-rest-url';
            widget.field.optionType = 'rest';
            widget.field.restIdProperty = 'name';

            widget.ngOnInit();
    
            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.open();

            const allOptions = await dropdown.getOptions();
            expect(jsonDataSpy).toHaveBeenCalled();
            expect(allOptions.length).toEqual(3);
            expect(await allOptions[0].getText()).toEqual('option_1');
            expect(await allOptions[1].getText()).toEqual('option_2');
            expect(await allOptions[2].getText()).toEqual('option_3');
        });

        it('should show error message if the restUrl failed to fetch options', async () => {
            const jsonDataSpy = spyOn(formCloudService, 'getRestWidgetData').and.returnValue(throwError('Failed to fetch options'));
            const errorIcon: string = 'error_outline';
            widget.field.restUrl = 'https://fake-rest-url';
            widget.field.optionType = 'rest';
            widget.field.restIdProperty = 'name';

            widget.ngOnInit();

            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.open();

            const failedErrorMsgElement = fixture.debugElement.query(By.css('.adf-dropdown-failed-message'));
            expect(jsonDataSpy).toHaveBeenCalled();
            expect(widget.isRestApiFailed).toBe(true);
            expect(widget.field.options.length).toEqual(0);
            expect(failedErrorMsgElement.nativeElement.textContent.trim()).toBe(errorIcon + 'FORM.FIELD.REST_API_FAILED');
        });

        it('should preselect dropdown widget value when Json (rest call) passed', async () => {
            widget.field.restUrl = 'https://fake-rest-url';
            widget.field.optionType = 'rest';
            widget.field.value = {
                id: 'opt1',
                name: 'default1_value'
            };

            spyOn(formCloudService, 'getRestWidgetData').and.returnValue(of([
                {
                    id: 'opt1',
                    name: 'default1_value'
                },
                {
                    id: 2,
                    name: 'default2_value'
                }
            ] as any));

            widget.ngOnInit();

            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.open();

            expect((await (await dropdown.getOptions())[0].getText())).toEqual('default1_value');
        });

        it('should preselect dropdown widget value when String (defined value) passed ', async () => {
            widget.field.restUrl = 'https://fake-rest-url';
            widget.field.optionType = 'rest';
            widget.field.value = 'opt1';

            spyOn(formCloudService, 'getRestWidgetData').and.returnValue(of([
                {
                    id: 'opt1',
                    name: 'default1_value'
                },
                {
                    id: 2,
                    name: 'default2_value'
                }
            ] as any));

            widget.ngOnInit();
            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.open();

            expect((await (await dropdown.getOptions())[0].getText())).toEqual('default1_value');
            expect(widget.field.form.values['dropdown-id']).toEqual({ id: 'opt1', name: 'default1_value' });
        });

        it('should not display required error for a non required dropdown when selecting the none option', async () => {
            widget.field.options = [
                { id: 'empty', name: 'Choose empty' },
                ...fakeOptionList
            ];

            widget.ngOnInit();
            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.open();
            await dropdown.clickOptions({ selector: '[id="empty"]' });

            widget.touched = true;
            fixture.detectChanges();

            const requiredErrorElement = fixture.debugElement.query(By.css('.adf-dropdown-required-message .adf-error-text'));
            expect(requiredErrorElement).toBeFalsy();
        });

        it('should not display required error when selecting a valid option for a required dropdown', async () => {
            widget.field.required = true;
            widget.field.options = [
                { id: 'empty', name: 'Choose empty' },
                ...fakeOptionList
            ];

            widget.ngOnInit();
            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.open();

            widget.touched = true;
            await dropdown.clickOptions({ selector: '[id="opt_1"]' });

            const requiredErrorElement = fixture.debugElement.query(By.css('.adf-dropdown-required-message .adf-error-text'));
            expect(requiredErrorElement).toBeFalsy();
        });

        it('should not have a value when switching from an available option to the None option', async () => {
            widget.field.options = [
                { id: 'empty', name: 'This is a mock none option' },
                ...fakeOptionList
            ];

            widget.ngOnInit();
            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.open();

            await dropdown.clickOptions({ selector: '[id="opt_1"]' });

            expect(await dropdown.getValueText()).toEqual('option_1');
            expect(widget.fieldValue).toEqual('opt_1');

            await dropdown.open();
            await dropdown.clickOptions({ selector: '[id="empty"]' });

            const formField = await loader.getHarness(MatFormFieldHarness);
            const dropdownLabel = await formField.getLabel();
            
            expect(dropdownLabel).toEqual('This is a mock none option');
            expect(widget.fieldValue).toEqual(undefined);
            expect(await dropdown.getValueText()).toEqual('');
        });
    });

    describe('when tooltip is set', () => {

        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.DROPDOWN,
                tooltip: 'my custom tooltip'
            });
            fixture.detectChanges();
        });

        it('should show tooltip', async () => {
            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            const dropdownInput = await dropdown.host();
            dropdownInput.dispatchEvent('mouseenter');

            const tooltipElement = await loader.getHarness(MatTooltipHarness);
            expect(tooltipElement).toBeTruthy();
            expect(await tooltipElement.getTooltipText()).toBe('my custom tooltip');
            expect(await tooltipElement.isOpen()).toBeTruthy();
          });

        it('should hide tooltip', async () => {
            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            const dropdownInput = await dropdown.host();
            await dropdownInput.dispatchEvent('mouseenter');

            await dropdownInput.dispatchEvent('mouseleave');

            const tooltipElement = await loader.getHarness(MatTooltipHarness);
            expect(await tooltipElement.isOpen()).toBeFalsy();
        });
    });

    describe('when is required', () => {

        beforeEach(() => {
            widget.field = new FormFieldModel( new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.DROPDOWN,
                required: true
            });
        });

        it('should be able to display label with asterisk', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const asterisk: HTMLElement = element.querySelector('.adf-asterisk');

            expect(asterisk).toBeTruthy();
            expect(asterisk.textContent).toEqual('*');
        });

        it('should display a required error when dropdown is required and has no value after an interaction', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('.adf-invalid')).toBeFalsy();

            const dropdownSelect = element.querySelector('.adf-select');
            dropdownSelect.dispatchEvent(new Event('blur'));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('.adf-invalid')).toBeTruthy();

            const requiredErrorElement = fixture.debugElement.query(By.css('.adf-dropdown-required-message .adf-error-text'));
            expect(requiredErrorElement.nativeElement.innerText).toEqual('FORM.FIELD.REQUIRED');
        });
    });

    describe('filter', () => {

        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                id: 'dropdown-id',
                name: 'option list',
                type: 'dropdown',
                readOnly: false,
                options: filterOptionList
            });
            widget.ngOnInit();
            fixture.detectChanges();
        });

        it('should show filter if more than 5 options found', async () => {
            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.open();

            const filter = fixture.debugElement.query(By.css('.adf-select-filter-input input'));
            expect(filter.nativeElement).toBeDefined('Filter is not visible');
        });

        it('should be able to filter the options by search', async () => {
            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.open();

            let options = await dropdown.getOptions();
            expect(options.length).toBe(6);

            const filter = fixture.debugElement.query(By.css('.adf-select-filter-input input'));
            filter.nativeElement.value = '1';
            filter.nativeElement.dispatchEvent(new Event('input'));

            fixture.detectChanges();
            options = await dropdown.getOptions();
            expect(options.length).toBe(1);
            expect(await options[0].getText()).toEqual('option_1');
        });

        it('should be able to select the options if filter present', async () => {
            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.open();

            const options = await dropdown.getOptions();
            expect(options.length).toBe(6);

            await options[0].click();
            expect(widget.field.value).toEqual('opt_1');
            expect(widget.field.form.values['dropdown-id']).toEqual(filterOptionList[0]);
        });
    });

    describe('multiple selection', () => {

        it('should show preselected option', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                id: 'dropdown-id',
                name: 'date-name',
                type: 'dropdown',
                readOnly: 'false',
                options: fakeOptionList,
                selectionType: 'multiple',
                value: [
                    { id: 'opt_1', name: 'option_1' },
                    { id: 'opt_2', name: 'option_2' }
                ]
            });

            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));

            expect(await dropdown.getValueText()).toEqual('option_1, option_2');
        });

        it('should support multiple options', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                id: 'dropdown-id',
                name: 'date-name',
                type: 'dropdown',
                readOnly: 'false',
                selectionType: 'multiple',
                options: fakeOptionList
            });
            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.clickOptions({ selector: '[id="opt_1"]' });
            await dropdown.clickOptions({ selector: '[id="opt_2"]' });

            expect(widget.field.value).toEqual([
                { id: 'opt_1', name: 'option_1' },
                { id: 'opt_2', name: 'option_2' }
            ]);
        });

        it('should show preselected option for rest options', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                id: 'dropdown-id',
                name: 'date-name',
                type: 'dropdown',
                readOnly: 'false',
                restUrl: 'https://fake-rest-url',
                optionType : 'rest',
                selectionType: 'multiple',
                value: [
                    { id: 'opt_3', name: 'option_3' },
                    { id: 'opt_4', name: 'option_4' }
                ]
            });
            spyOn(formCloudService, 'getRestWidgetData').and.returnValue(of([
                {
                    id: 'opt_1',
                    name: 'option_1'
                },
                {
                    id: 'opt_2',
                    name: 'option_2'
                },
                {
                    id: 'opt_3',
                    name: 'option_3'
                },
                {
                    id: 'opt_4',
                    name: 'option_4'
                }
            ] as any));

            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));

            expect(await dropdown.getValueText()).toEqual('option_3, option_4');
        });

        it('should support multiple options for rest options', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                id: 'dropdown-id',
                name: 'date-name',
                type: 'dropdown',
                readOnly: 'false',
                restUrl: 'https://fake-rest-url',
                optionType : 'rest',
                selectionType: 'multiple'
            });

            spyOn(formCloudService, 'getRestWidgetData').and.returnValue(of([
                {
                    id: 'opt_1',
                    name: 'option_1'
                },
                {
                    id: 'opt_2',
                    name: 'option_2'
                },
                {
                    id: 'opt_3',
                    name: 'option_3'
                },
                {
                    id: 'opt_4',
                    name: 'option_4'
                }
            ] as any));

            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.clickOptions({ selector: '[id="opt_2"]' });
            await dropdown.clickOptions({ selector: '[id="opt_4"]' });

            expect(widget.field.value).toEqual([
                { id: 'opt_2', name: 'option_2' },
                { id: 'opt_4', name: 'option_4' }
            ]);
        });
    });

    describe('Linked Dropdown', () => {

        describe('Rest URL options', () => {

            const parentDropdown = new FormFieldModel(new FormModel(), {
                id: 'parentDropdown',
                type: 'dropdown',
                validate: () => true
            });
            beforeEach(() => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'child-dropdown-id',
                    name: 'child-dropdown',
                    type: 'dropdown',
                    readOnly: 'false',
                    optionType: 'rest',
                    restUrl: 'myFakeDomain.com/cities?country=${parentDropdown}',
                    rule: {
                        ruleOn: 'parentDropdown',
                        entries: null
                    }
                });
                widget.field.form.id = 'fake-form-id';
                fixture.detectChanges();
            });

            it('should reset the options for a linked dropdown with restUrl when the parent dropdown selection changes to empty', () => {
                widget.field.options = mockConditionalEntries[1].options;
                parentDropdown.value = undefined;
                widget.selectionChangedForField(parentDropdown);

                fixture.detectChanges();

                expect(widget.field.options).toEqual([]);
            });

            it('should fetch the options from a rest url for a linked dropdown', async () => {
                const jsonDataSpy = spyOn(formCloudService, 'getRestWidgetData').and.returnValue(of(mockRestDropdownOptions));
                const mockParentDropdown = { id: 'parentDropdown', value: 'mock-value', validate: () => true };
                spyOn(widget.field.form, 'getFormFields').and.returnValue([mockParentDropdown]);
                parentDropdown.value = 'UK';
                widget.selectionChangedForField(parentDropdown);

                fixture.detectChanges();
                const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
                await dropdown.open();
                const allOptions = await dropdown.getOptions();

                expect(jsonDataSpy).toHaveBeenCalledWith('fake-form-id', 'child-dropdown-id', { parentDropdown: 'mock-value' });
                expect(await (await allOptions[0].host()).getAttribute('id')).toEqual('LO');
                expect(await allOptions[0].getText()).toEqual('LONDON');
                expect(await (await allOptions[1].host()).getAttribute('id')).toEqual('MA');
                expect(await allOptions[1].getText()).toEqual('MANCHESTER');
            });

            it('should reset previous child options if the rest url failed for a linked dropdown', async () => {
                const jsonDataSpy = spyOn(formCloudService, 'getRestWidgetData').and.returnValue(of(mockRestDropdownOptions));
                const errorIcon: string = 'error_outline';
                const mockParentDropdown = { id: 'parentDropdown', value: 'mock-value', validate: () => true };
                spyOn(widget.field.form, 'getFormFields').and.returnValue([mockParentDropdown]);

                const selectParentOption = (parentOptionName: string) => {
                    parentDropdown.value = parentOptionName;
                    widget.selectionChangedForField(parentDropdown);
                    fixture.detectChanges();
                };

                selectParentOption('UK');
                const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
                await dropdown.open();
                const failedErrorMsgElement1 = fixture.debugElement.query(By.css('.adf-dropdown-failed-message'));

                expect(widget.isRestApiFailed).toBe(false);
                expect(widget.field.options.length).toBe(2);
                expect(failedErrorMsgElement1).toBeNull();

                jsonDataSpy.and.returnValue(throwError('Failed to fetch options'));
                selectParentOption('GR');
                const failedErrorMsgElement2 = fixture.debugElement.query(By.css('.adf-dropdown-failed-message'));

                expect(widget.isRestApiFailed).toBe(true);
                expect(widget.field.options.length).toBe(0);
                expect(failedErrorMsgElement2.nativeElement.textContent.trim()).toBe(errorIcon + 'FORM.FIELD.REST_API_FAILED');

                jsonDataSpy.and.returnValue(of(mockSecondRestDropdownOptions));
                selectParentOption('IT');
                const failedErrorMsgElement3 = fixture.debugElement.query(By.css('.adf-dropdown-failed-message'));

                expect(widget.isRestApiFailed).toBe(false);
                expect(widget.field.options.length).toBe(2);
                expect(failedErrorMsgElement3).toBeNull();
            });

            describe('Rest - On parent value changes (chain)', () => {
                it('should fire a form field value changed event when the value gets reset (notify children on the chain to reset)', () => {
                    spyOn(formCloudService, 'getRestWidgetData').and.returnValue(throwError('Failed to fetch options'));
                    widget.field.options = mockConditionalEntries[1].options;
                    widget.field.value = 'MI';
                    fixture.detectChanges();

                    const formFieldValueChangedSpy = spyOn(formService.formFieldValueChanged, 'next').and.callThrough();
                    const formFieldValueChangedEvent = new FormFieldEvent(widget.field.form, widget.field);

                    parentDropdown.value = 'GR';
                    widget.selectionChangedForField(parentDropdown);
                    fixture.detectChanges();

                    expect(formFieldValueChangedSpy).toHaveBeenCalledWith(formFieldValueChangedEvent);
                    expect(widget.field.options).toEqual([]);
                });
            });
        });

        describe('Manual options', () => {
            const parentDropdown = new FormFieldModel(new FormModel(), { id: 'parentDropdown', type: 'dropdown' });

            beforeEach(() => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'child-dropdown-id',
                    name: 'child-dropdown',
                    type: 'dropdown',
                    readOnly: 'false',
                    optionType: 'manual',
                    rule: {
                        ruleOn: 'parentDropdown',
                        entries: mockConditionalEntries
                    }
                });
                fixture.detectChanges();
            });

            it('Should display the options for a linked dropdown based on the parent dropdown selection', async () => {
                parentDropdown.value = 'GR';
                widget.selectionChangedForField(parentDropdown);
                fixture.detectChanges();

                const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
                await dropdown.open();
                const allOptions = await dropdown.getOptions();

                expect(widget.field.options).toEqual(mockConditionalEntries[0].options);

                expect(await (await allOptions[0].host()).getAttribute('id')).toEqual('empty');
                expect(await allOptions[0].getText()).toEqual('Choose one...');
                expect(await (await allOptions[1].host()).getAttribute('id')).toEqual('ATH');
                expect(await allOptions[1].getText()).toEqual('Athens');
                expect(await (await allOptions[2].host()).getAttribute('id')).toEqual('SKG');
                expect(await allOptions[2].getText()).toEqual('Thessaloniki');
            });

            it('should reset the options for a linked dropdown when the parent dropdown selection changes to empty', () => {
                widget.field.options = mockConditionalEntries[1].options;
                parentDropdown.value = undefined;
                widget.selectionChangedForField(parentDropdown);

                fixture.detectChanges();

                expect(widget.field.options).toEqual([]);
            });

            describe('Manual - On parent value changes (chain)', () => {
                it('should reset the current value when it not part of the available options', () => {
                    widget.field.options = mockConditionalEntries[1].options;
                    widget.field.value = 'non-existent-value';
                    fixture.detectChanges();

                    parentDropdown.value = 'GR';
                    widget.selectionChangedForField(parentDropdown);
                    fixture.detectChanges();

                    expect(widget.field.options).toEqual(mockConditionalEntries[0].options);
                    expect(widget.fieldValue).toEqual('');
                });

                it('should not reset the current value when it is part of the available options', () => {
                    widget.field.options = mockConditionalEntries[1].options;
                    widget.field.value = 'ATH';
                    fixture.detectChanges();

                    parentDropdown.value = 'GR';
                    widget.selectionChangedForField(parentDropdown);
                    fixture.detectChanges();

                    expect(widget.field.options).toEqual(mockConditionalEntries[0].options);
                    expect(widget.fieldValue).toEqual('ATH');
                });

                it('should fire a form field value changed event when the value gets reset (notify children on the chain to reset)', () => {
                    widget.field.options = mockConditionalEntries[1].options;
                    widget.field.value = 'non-existent-value';
                    fixture.detectChanges();

                    const formFieldValueChangedSpy = spyOn(formService.formFieldValueChanged, 'next').and.callThrough();
                    const formFieldValueChangedEvent = new FormFieldEvent(widget.field.form, widget.field);

                    parentDropdown.value = 'GR';
                    widget.selectionChangedForField(parentDropdown);
                    fixture.detectChanges();

                    expect(formFieldValueChangedSpy).toHaveBeenCalledWith(formFieldValueChangedEvent);
                });
            });
        });

        describe('Load selection for linked dropdown (i.e. saved, completed forms)', () => {

            it('should load the selection of a manual type linked dropdown', () => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'child-dropdown-id',
                    name: 'child-dropdown',
                    type: 'dropdown',
                    readOnly: 'false',
                    optionType: 'manual',
                    rule: {
                        ruleOn: 'parentDropdown',
                        entries: mockConditionalEntries
                    }
                });
                const updateFormSpy = spyOn(widget.field, 'updateForm').and.callThrough();
                const mockParentDropdown = { id: 'parentDropdown', value: 'IT', validate: (): boolean => true };
                spyOn(widget.field.form, 'getFormFields').and.returnValue([mockParentDropdown]);
                widget.field.value = 'MI';
                fixture.detectChanges();

                expect(updateFormSpy).toHaveBeenCalled();
                expect(widget.field.options).toEqual(mockConditionalEntries[1].options);
                expect(widget.field.form.values).toEqual({ 'child-dropdown-id': { id: 'MI', name: 'MILAN' }});
            });

            it('should load the selection of a rest type linked dropdown', () => {
                const jsonDataSpy = spyOn(formCloudService, 'getRestWidgetData').and.returnValue(of(mockRestDropdownOptions));
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'child-dropdown-id',
                    name: 'child-dropdown',
                    type: 'dropdown',
                    readOnly: 'false',
                    restUrl: 'mock-url.com/country=${country}',
                    optionType: 'rest',
                    rule: {
                        ruleOn: 'country',
                        entries: null
                    }
                });
                widget.field.form.id = 'fake-form-id';
                const updateFormSpy = spyOn(widget.field, 'updateForm');
                const mockParentDropdown = { id: 'country', value: 'UK' };
                spyOn(widget.field.form, 'getFormFields').and.returnValue([mockParentDropdown]);
                fixture.detectChanges();

                expect(updateFormSpy).toHaveBeenCalled();
                expect(jsonDataSpy).toHaveBeenCalledWith('fake-form-id', 'child-dropdown-id', { country: 'UK' });
                expect(widget.field.options).toEqual(mockRestDropdownOptions);
            });
        });

        describe('when form model has left labels', () => {

            it('should have left labels classes on leftLabels true', async () => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: true }), {
                    id: 'dropdown-id',
                    name: 'option list',
                    type: FormFieldTypes.DROPDOWN,
                    readOnly: false,
                    options: filterOptionList
                });

                fixture.detectChanges();
                await fixture.whenStable();

                const widgetContainer = element.querySelector('.adf-left-label-input-container');
                expect(widgetContainer).not.toBeNull();

                const adfLeftLabel = element.querySelector('.adf-left-label');
                expect(adfLeftLabel).not.toBeNull();
            });

            it('should not have left labels classes on leftLabels false', async () => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: false }), {
                    id: 'dropdown-id',
                    name: 'option list',
                    type: FormFieldTypes.DROPDOWN,
                    readOnly: false,
                    options: filterOptionList
                });

                fixture.detectChanges();
                await fixture.whenStable();

                const widgetContainer = element.querySelector('.adf-left-label-input-container');
                expect(widgetContainer).toBeNull();

                const adfLeftLabel = element.querySelector('.adf-left-label');
                expect(adfLeftLabel).toBeNull();
            });

            it('should not have left labels classes on leftLabels not present', async () => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'dropdown-id',
                    name: 'option list',
                    type: FormFieldTypes.DROPDOWN,
                    readOnly: false,
                    options: filterOptionList
                });

                fixture.detectChanges();
                await fixture.whenStable();

                const widgetContainer = element.querySelector('.adf-left-label-input-container');
                expect(widgetContainer).toBeNull();

                const adfLeftLabel = element.querySelector('.adf-left-label');
                expect(adfLeftLabel).toBeNull();
            });
        });
    });

    describe('variable options', () => {
        let logServiceSpy: jasmine.Spy;
        const errorIcon: string = 'error_outline';

        const getVariableDropdownWidget = (
                variableName: string,
                optionsPath: string,
                optionsId: string,
                optionsLabel: string,
                processVariables?: TaskVariableCloud[],
                variables?: TaskVariableCloud[]
            ) => new FormFieldModel(
            new FormModel({ taskId: 'fake-task-id', processVariables, variables }), {
                id: 'variable-dropdown-id',
                name: 'variable-options-dropdown',
                type: 'dropdown',
                readOnly: 'false',
                optionType: 'variable',
                variableConfig: {
                    variableName,
                    optionsPath,
                    optionsId,
                    optionsLabel
                }
            });

        const checkDropdownVariableOptionsFailed = () => {
            const failedErrorMsgElement = fixture.debugElement.query(By.css('.adf-dropdown-failed-message'));
            expect(failedErrorMsgElement.nativeElement.textContent.trim()).toBe(errorIcon.concat('FORM.FIELD.VARIABLE_DROPDOWN_OPTIONS_FAILED'));

            expect(widget.field.options.length).toEqual(0);
        };

        beforeEach(() => {
            logServiceSpy = spyOn(logService, 'error');
        });

        it('should display options persisted from process variable', async () => {
            widget.field = getVariableDropdownWidget('variables.json-variable', 'response.people.players', 'playerId', 'playerFullName', mockProcessVariablesWithJson);
            fixture.detectChanges();
            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.open();
            const allOptions = await dropdown.getOptions();
            
            expect(widget.field.options.length).toEqual(3);
            expect(await (await allOptions[0].host()).getAttribute('id')).toEqual('player-1');
            expect(await allOptions[0].getText()).toEqual('Lionel Messi');
            expect(await (await allOptions[1].host()).getAttribute('id')).toEqual('player-2');
            expect(await allOptions[1].getText()).toEqual('Cristiano Ronaldo');
            expect(await (await allOptions[2].host()).getAttribute('id')).toEqual('player-3');
            expect(await allOptions[2].getText()).toEqual('Robert Lewandowski');
        });

        it('should display options persisted from form variable if there are NO process variables', async () => {
            widget.field = getVariableDropdownWidget('json-form-variable', 'countries', 'id', 'name', [], mockFormVariableWithJson);
            fixture.detectChanges();
            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.open();
            const allOptions = await dropdown.getOptions();
            
            expect(widget.field.options.length).toEqual(3);
            expect(await (await allOptions[0].host()).getAttribute('id')).toEqual('PL');
            expect(await allOptions[0].getText()).toEqual('Poland');
            expect(await (await allOptions[1].host()).getAttribute('id')).toEqual('UK');
            expect(await allOptions[1].getText()).toEqual('United Kingdom');
            expect(await (await allOptions[2].host()).getAttribute('id')).toEqual('GR');
            expect(await allOptions[2].getText()).toEqual('Greece');
        });

        it('should display default options if config options are NOT provided', async () => {
            widget.field = getVariableDropdownWidget('variables.json-default-variable', null, null, null, mockVariablesWithDefaultJson);
            fixture.detectChanges();
            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.open();
            const allOptions = await dropdown.getOptions();
            
            expect(widget.field.options.length).toEqual(3);
            expect(await (await allOptions[0].host()).getAttribute('id')).toEqual('default-pet-1');
            expect(await allOptions[0].getText()).toEqual('Dog');
            expect(await (await allOptions[1].host()).getAttribute('id')).toEqual('default-pet-2');
            expect(await allOptions[1].getText()).toEqual('Cat');
            expect(await (await allOptions[2].host()).getAttribute('id')).toEqual('default-pet-3');
            expect(await allOptions[2].getText()).toEqual('Parrot');
        });

        it('should return empty array and display error when path is incorrect', () => {
            widget.field = getVariableDropdownWidget('variables.json-variable', 'response.wrongPath.players', 'playerId', 'playerFullName', mockProcessVariablesWithJson);
            fixture.detectChanges();

            checkDropdownVariableOptionsFailed();
            expect(logServiceSpy).toHaveBeenCalledWith(`wrongPath not found in ${JSON.stringify(mockPlayersResponse.response)}`);
        });

        it('should return empty array and display error when id is incorrect', () => {
            widget.field = getVariableDropdownWidget('variables.json-variable', 'response.people.players', 'wrongId', 'playerFullName', mockProcessVariablesWithJson);
            fixture.detectChanges();

            checkDropdownVariableOptionsFailed();
            expect(logServiceSpy).toHaveBeenCalledWith(`'id' or 'label' is not properly defined`);
        });

        it('should return empty array and display error when label is incorrect', () => {
            widget.field = getVariableDropdownWidget('variables.json-variable', 'response.people.players', 'playerId', 'wrongFullName', mockProcessVariablesWithJson);
            fixture.detectChanges();

            checkDropdownVariableOptionsFailed();
            expect(logServiceSpy).toHaveBeenCalledWith(`'id' or 'label' is not properly defined`);
        });

        it('should return empty array and display error when variable is NOT found', () => {
            widget.field = getVariableDropdownWidget('variables.wrong-variable-id', 'response.people.players', 'playerId', 'playerFullName', mockProcessVariablesWithJson);
            fixture.detectChanges();

            checkDropdownVariableOptionsFailed();
            expect(logServiceSpy).toHaveBeenCalledWith(`variables.wrong-variable-id not found`);
        });

        it('should return empty array and display error if there are NO process and form variables', () => {
            widget.field = getVariableDropdownWidget('variables.json-variable', 'response.people.players', 'playerId', 'playerFullName', [], []);
            fixture.detectChanges();

            checkDropdownVariableOptionsFailed();
            expect(logServiceSpy).toHaveBeenCalledWith('variables.json-variable not found');
        });

        it('should NOT display errors if form is in the preview state', () => {
            widget.field = getVariableDropdownWidget('variables.json-variable', 'response.wrongPath.players', 'playerId', 'playerFullName', mockProcessVariablesWithJson);
            spyOn(formCloudService, 'getPreviewState').and.returnValue(true);
            fixture.detectChanges();

            const failedErrorMsgElement = fixture.debugElement.query(By.css('.adf-dropdown-failed-message'));
            expect(failedErrorMsgElement).toBeNull();
        });
    });
});
