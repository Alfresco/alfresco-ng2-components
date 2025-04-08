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
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { DEFAULT_OPTION, DropdownCloudWidgetComponent } from './dropdown-cloud.widget';
import { FormFieldModel, FormModel, FormService, FormFieldEvent, FormFieldTypes } from '@alfresco/adf-core';
import { FormCloudService } from '../../../services/form-cloud.service';
import { ProcessServiceCloudTestingModule } from '../../../../testing/process-service-cloud.testing.module';
import {
    fakeOptionList,
    filterOptionList,
    mockConditionalEntries,
    mockFormVariableWithJson,
    mockRestDropdownOptions,
    mockSecondRestDropdownOptions,
    mockVariablesWithDefaultJson,
    mockProcessVariablesWithJson
} from '../../../mocks/dropdown.mock';
import { TaskVariableCloud } from '../../../models/task-variable-cloud.model';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { DebugElement } from '@angular/core';
import { FormUtilsService } from '../../../services/form-utils.service';

describe('DropdownCloudWidgetComponent', () => {
    let formService: FormService;
    let widget: DropdownCloudWidgetComponent;
    let formCloudService: FormCloudService;
    let formUtilsService: FormUtilsService;
    let fixture: ComponentFixture<DropdownCloudWidgetComponent>;
    let element: HTMLElement;
    let loader: HarnessLoader;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ProcessServiceCloudTestingModule]
        });
        fixture = TestBed.createComponent(DropdownCloudWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;

        formService = TestBed.inject(FormService);
        formCloudService = TestBed.inject(FormCloudService);
        formUtilsService = TestBed.inject(FormUtilsService);
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    afterEach(() => fixture.destroy());

    describe('Simple Dropdown', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', readOnly: false, id: 'form-id' }), {
                id: 'dropdown-id',
                name: 'date-name',
                type: 'dropdown',
                restUrl: 'https://fake-rest-url',
                options: [{ id: 'empty', name: 'Choose one...' }]
            });
            widget.field.isVisible = true;
            fixture.detectChanges();
        });

        it('should call rest api only when url is present and field type is rest', () => {
            const getFieldConfig = (optionType: string, restUrl: string) => new FormFieldModel(new FormModel(), { optionType, restUrl });
            spyOn(formCloudService, 'getRestWidgetData').and.returnValue(of(fakeOptionList));

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

        it('should call getRestWidgetData with correct body parameters when body is empty', () => {
            spyOn(formCloudService, 'getRestWidgetData').and.returnValue(of(fakeOptionList));
            widget.field.optionType = 'rest';

            widget.ngOnInit();
            expect(formCloudService.getRestWidgetData).toHaveBeenCalledWith('form-id', 'dropdown-id', {});
        });

        it('should call getRestWidgetData with correct body parameters when variables are mapped', () => {
            spyOn(formCloudService, 'getRestWidgetData').and.returnValue(of(fakeOptionList));
            widget.field.optionType = 'rest';
            const body = { var1: 'value1', var2: 'value2' };
            spyOn(formUtilsService, 'getRestUrlVariablesMap').and.returnValue(body);

            widget.ngOnInit();

            expect(formUtilsService.getRestUrlVariablesMap).toHaveBeenCalledWith(widget.field.form, widget.field.restUrl, {});
            expect(formCloudService.getRestWidgetData).toHaveBeenCalledWith('form-id', 'dropdown-id', body);
        });

        it('should select the default value when an option is chosen as default', async () => {
            widget.field.value = 'option_2';

            expect(widget.field.value).toEqual('option_2');
        });

        it('should select the empty value when no default is chosen', async () => {
            widget.field.value = 'empty';
            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.open();

            expect(widget.field.value).toEqual('empty');
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

        it('should NOT load data from restUrl when form is readonly', () => {
            spyOn(formCloudService, 'getRestWidgetData');
            widget.field.readOnly = false;
            widget.field.restUrl = 'https://fake-rest-url';
            widget.field.optionType = 'rest';
            widget.field.form.readOnly = true;

            widget.ngOnInit();

            expect(formCloudService.getRestWidgetData).not.toHaveBeenCalled();
        });

        describe('should load data from restUrl when form is NOT readonly', () => {
            beforeEach(() => {
                spyOn(formCloudService, 'getRestWidgetData').and.returnValue(of([]));

                widget.field.restUrl = 'https://fake-rest-url';
                widget.field.optionType = 'rest';
                widget.field.restIdProperty = 'name';
                widget.field.form.readOnly = false;
            });

            it('when widget is NOT readonly', () => {
                widget.field.readOnly = false;
                widget.ngOnInit();

                expect(formCloudService.getRestWidgetData).toHaveBeenCalled();
            });

            it('when widget is readonly', () => {
                widget.field.readOnly = true;
                widget.ngOnInit();

                expect(formCloudService.getRestWidgetData).toHaveBeenCalled();
            });
        });

        describe('when failed on loading options from restUrl', () => {
            let getRestWidgetDataSpy: jasmine.Spy;
            const getErrorMessageElement = (): DebugElement => fixture.debugElement.query(By.css('.adf-dropdown-failed-message'));
            const errorIcon: string = 'error_outline';

            beforeEach(() => {
                getRestWidgetDataSpy = spyOn(formCloudService, 'getRestWidgetData').and.returnValue(throwError('Failed to fetch options'));
                widget.field.restUrl = 'https://fake-rest-url';
                widget.field.optionType = 'rest';
            });

            it('should show error message when widget is NOT readonly', () => {
                widget.field.readOnly = false;

                widget.ngOnInit();
                fixture.detectChanges();

                const errorMessageElement = getErrorMessageElement();
                expect(getRestWidgetDataSpy).toHaveBeenCalled();
                expect(widget.isRestApiFailed).toBe(true);
                expect(widget.field.options.length).toEqual(0);
                expect(errorMessageElement.nativeElement.textContent.trim()).toBe(errorIcon + 'FORM.FIELD.REST_API_FAILED');
            });

            it('should NOT show error message when widget is readonly', async () => {
                widget.field.readOnly = true;

                widget.ngOnInit();
                fixture.detectChanges();

                const errorMessageElement = getErrorMessageElement();
                expect(getRestWidgetDataSpy).toHaveBeenCalled();
                expect(widget.isRestApiFailed).toBe(true);
                expect(widget.field.options.length).toEqual(0);
                expect(errorMessageElement).toBe(null);
            });
        });

        it('should preselect dropdown widget value when Json (rest call) passed', async () => {
            widget.field.restUrl = 'https://fake-rest-url';
            widget.field.optionType = 'rest';
            widget.field.value = {
                id: 'opt1',
                name: 'default1_value'
            };

            spyOn(formCloudService, 'getRestWidgetData').and.returnValue(
                of([
                    {
                        id: 'opt1',
                        name: 'default1_value'
                    },
                    {
                        id: 2,
                        name: 'default2_value'
                    }
                ] as any)
            );

            widget.ngOnInit();

            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.open();

            expect(await (await dropdown.getOptions())[0].getText()).toEqual('default1_value');
        });

        it('should preselect dropdown widget value when String (defined value) passed ', async () => {
            widget.field.restUrl = 'https://fake-rest-url';
            widget.field.optionType = 'rest';
            widget.field.value = 'opt1';

            spyOn(formCloudService, 'getRestWidgetData').and.returnValue(
                of([
                    {
                        id: 'opt1',
                        name: 'default1_value'
                    },
                    {
                        id: 2,
                        name: 'default2_value'
                    }
                ] as any)
            );

            widget.ngOnInit();
            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.open();

            expect(await (await dropdown.getOptions())[0].getText()).toEqual('default1_value');
            expect(widget.field.form.values['dropdown-id']).toEqual({ id: 'opt1', name: 'default1_value' });
        });

        it('should not display required error for a non required dropdown when selecting the none option', async () => {
            widget.field.options = [{ id: 'empty', name: 'Choose empty' }, ...fakeOptionList];

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
            widget.field.options = [{ id: 'empty', name: 'Choose empty' }, ...fakeOptionList];

            widget.ngOnInit();
            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.open();

            widget.touched = true;
            await dropdown.clickOptions({ selector: '[id="opt_1"]' });

            const requiredErrorElement = fixture.debugElement.query(By.css('.adf-dropdown-required-message .adf-error-text'));
            expect(requiredErrorElement).toBeFalsy();
        });

        it('should not have a value when switching from an available option to the None option', async () => {
            widget.field.options = [{ id: 'empty', name: 'This is a mock none option' }, ...fakeOptionList];

            widget.ngOnInit();
            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.open();

            await dropdown.clickOptions({ selector: '[id="opt_1"]' });

            expect(await dropdown.getValueText()).toEqual('option_1');
            expect(widget.field.value).toEqual('opt_1');

            await dropdown.open();
            await dropdown.clickOptions({ selector: '[id="empty"]' });

            expect(widget.field.value).toEqual(undefined);

            expect(await dropdown.getValueText()).toEqual('This is a mock none option');
        });
    });

    describe('when is required', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.DROPDOWN,
                required: true
            });
        });

        it('should be able to display label with asterisk', () => {
            fixture.detectChanges();

            const asterisk: HTMLElement = element.querySelector('.adf-asterisk');

            expect(asterisk).toBeTruthy();
            expect(asterisk.textContent).toEqual('*');
        });

        it('should display a required error when dropdown is required and has no value after an interaction', () => {
            fixture.detectChanges();

            expect(element.querySelector('.adf-invalid')).toBeFalsy();

            const dropdownSelect = element.querySelector('.adf-select');
            dropdownSelect.dispatchEvent(new Event('blur'));

            fixture.detectChanges();

            expect(element.querySelector('.adf-invalid')).toBeTruthy();

            const requiredErrorElement = fixture.debugElement.query(By.css('.adf-dropdown-required-message .adf-error-text'));
            expect(requiredErrorElement.nativeElement.innerText).toEqual('FORM.FIELD.REQUIRED');
        });

        it('should NOT display a required error when dropdown is readonly', () => {
            widget.field.readOnly = true;
            fixture.detectChanges();

            expect(element.querySelector('.adf-invalid')).toBeFalsy();

            const dropdownSelect = element.querySelector('.adf-select');
            dropdownSelect.dispatchEvent(new Event('blur'));

            fixture.detectChanges();

            expect(element.querySelector('.adf-invalid')).toBeFalsy();
        });

        describe('and visible', () => {
            beforeEach(() => {
                widget.field.isVisible = true;
            });

            it('should be invalid with no option selected', () => {
                fixture.detectChanges();

                expect(widget.field.isValid).toBeFalse();
                expect(widget.dropdownControl.valid).toBeFalse();
                expect(widget.field.validationSummary.message).toBe('FORM.FIELD.REQUIRED');
            });

            it('should be invalid with default option selected', () => {
                widget.field.hasEmptyValue = true;
                widget.field.value = DEFAULT_OPTION;
                fixture.detectChanges();

                expect(widget.field.isValid).toBeFalse();
                expect(widget.dropdownControl.valid).toBeFalse();
                expect(widget.field.validationSummary.message).toBe('FORM.FIELD.REQUIRED');
            });
        });

        describe('and NOT visible', () => {
            beforeEach(() => {
                widget.field.isVisible = false;
            });

            it('should be valid with no option selected', () => {
                fixture.detectChanges();

                expect(widget.field.isValid).toBeTrue();
                expect(widget.dropdownControl.valid).toBeTrue();
                expect(widget.field.validationSummary.message).toBe('');
            });

            it('should be valid with default option selected', () => {
                widget.field.hasEmptyValue = true;
                widget.field.value = DEFAULT_OPTION;
                fixture.detectChanges();

                expect(widget.field.isValid).toBeTrue();
                expect(widget.dropdownControl.valid).toBeTrue();
                expect(widget.field.validationSummary.message).toBe('');
            });
        });
    });

    describe('filter', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', readOnly: false }), {
                id: 'dropdown-id',
                name: 'option list',
                type: 'dropdown',
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
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', readOnly: 'false' }), {
                id: 'dropdown-id',
                name: 'date-name',
                type: 'dropdown',
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
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', readOnly: 'false' }), {
                id: 'dropdown-id',
                name: 'date-name',
                type: 'dropdown',
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
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', readOnly: 'false' }), {
                id: 'dropdown-id',
                name: 'date-name',
                type: 'dropdown',
                restUrl: 'https://fake-rest-url',
                optionType: 'rest',
                selectionType: 'multiple',
                value: [
                    { id: 'opt_3', name: 'option_3' },
                    { id: 'opt_4', name: 'option_4' }
                ]
            });
            spyOn(formCloudService, 'getRestWidgetData').and.returnValue(
                of([
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
                ] as any)
            );

            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));

            expect(await dropdown.getValueText()).toEqual('option_3, option_4');
        });

        it('should support multiple options for rest options', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', readOnly: 'false' }), {
                id: 'dropdown-id',
                name: 'date-name',
                type: 'dropdown',
                restUrl: 'https://fake-rest-url',
                optionType: 'rest',
                selectionType: 'multiple'
            });

            spyOn(formCloudService, 'getRestWidgetData').and.returnValue(
                of([
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
                ] as any)
            );

            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.clickOptions({ selector: '[id="opt_2"]' });
            await dropdown.clickOptions({ selector: '[id="opt_4"]' });

            expect(widget.field.value).toEqual([
                { id: 'opt_2', name: 'option_2' },
                { id: 'opt_4', name: 'option_4' }
            ]);
        });

        it('should fail (display error) for multiple type dropdown with zero selection', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', readOnly: 'false' }), {
                type: FormFieldTypes.DROPDOWN,
                value: [{ id: 'id_cat', name: 'Cat' }],
                required: true,
                selectionType: 'multiple',
                hasEmptyValue: false,
                options: [
                    { id: 'id_cat', name: 'Cat' },
                    { id: 'id_dog', name: 'Dog' }
                ]
            });

            const validateBeforeUnselect = widget.dropdownControl.valid;

            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.clickOptions({ selector: '[id="id_cat"]' });

            const validateAfterUnselect = widget.dropdownControl.valid;

            expect(validateBeforeUnselect).toBe(true);
            expect(validateAfterUnselect).toBe(false);
        });

        it('should fail (display error) for dropdown with null value', () => {
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DROPDOWN,
                value: null,
                required: true,
                options: [{ id: 'one', name: 'one' }],
                selectionType: 'multiple'
            });

            widget.ngOnInit();

            expect(widget.dropdownControl.valid).toBe(false);
        });

        it('should fail (display error) for dropdown with empty object', () => {
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.DROPDOWN,
                value: {},
                required: true,
                options: [{ id: 'one', name: 'one' }],
                selectionType: 'multiple'
            });

            widget.ngOnInit();

            expect(widget.dropdownControl.valid).toBe(false);
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
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', readOnly: 'false' }), {
                    id: 'child-dropdown-id',
                    name: 'child-dropdown',
                    type: 'dropdown',
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

                expect(formCloudService.getRestWidgetData).toHaveBeenCalledWith('fake-form-id', 'child-dropdown-id', {
                    parentDropdown: 'mock-value'
                });
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
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', readOnly: 'false' }), {
                    id: 'child-dropdown-id',
                    name: 'child-dropdown',
                    type: 'dropdown',
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
                    expect(widget.field.value).toEqual('');
                });

                it('should not reset the current value when it is part of the available options', () => {
                    widget.field.options = mockConditionalEntries[1].options;
                    widget.field.value = 'ATH';
                    fixture.detectChanges();

                    parentDropdown.value = 'GR';
                    widget.selectionChangedForField(parentDropdown);
                    fixture.detectChanges();

                    expect(widget.field.options).toEqual(mockConditionalEntries[0].options);
                    expect(widget.field.value).toEqual('ATH');
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
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', readOnly: 'false' }), {
                    id: 'child-dropdown-id',
                    name: 'child-dropdown',
                    type: 'dropdown',
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
                expect(widget.field.form.values).toEqual({ 'child-dropdown-id': { id: 'MI', name: 'MILAN' } });
            });

            it('should load the selection of a rest type linked dropdown', () => {
                const jsonDataSpy = spyOn(formCloudService, 'getRestWidgetData').and.returnValue(of(mockRestDropdownOptions));
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', readOnly: 'false' }), {
                    id: 'child-dropdown-id',
                    name: 'child-dropdown',
                    type: 'dropdown',
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
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', readOnly: false, leftLabels: true }), {
                    id: 'dropdown-id',
                    name: 'option list',
                    type: FormFieldTypes.DROPDOWN,
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
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', readOnly: false, leftLabels: false }), {
                    id: 'dropdown-id',
                    name: 'option list',
                    type: FormFieldTypes.DROPDOWN,
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
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', readOnly: false }), {
                    id: 'dropdown-id',
                    name: 'option list',
                    type: FormFieldTypes.DROPDOWN,
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
        const errorIcon: string = 'error_outline';

        const getVariableDropdownWidget = (
            variableName: string,
            optionsPath: string,
            optionsId: string,
            optionsLabel: string,
            processVariables?: TaskVariableCloud[],
            variables?: TaskVariableCloud[]
        ) =>
            new FormFieldModel(new FormModel({ taskId: 'fake-task-id', readOnly: 'false', processVariables, variables }), {
                id: 'variable-dropdown-id',
                name: 'variable-options-dropdown',
                type: 'dropdown',
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

        it('should display options persisted from process variable', async () => {
            widget.field = getVariableDropdownWidget(
                'variables.json-variable',
                'response.people.players',
                'playerId',
                'playerFullName',
                mockProcessVariablesWithJson
            );
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
            widget.field = getVariableDropdownWidget(
                'variables.json-variable',
                'response.wrongPath.players',
                'playerId',
                'playerFullName',
                mockProcessVariablesWithJson
            );
            fixture.detectChanges();

            checkDropdownVariableOptionsFailed();
        });

        it('should return empty array and display error when id is incorrect', () => {
            widget.field = getVariableDropdownWidget(
                'variables.json-variable',
                'response.people.players',
                'wrongId',
                'playerFullName',
                mockProcessVariablesWithJson
            );
            fixture.detectChanges();

            checkDropdownVariableOptionsFailed();
        });

        it('should return empty array and display error when label is incorrect', () => {
            widget.field = getVariableDropdownWidget(
                'variables.json-variable',
                'response.people.players',
                'playerId',
                'wrongFullName',
                mockProcessVariablesWithJson
            );
            fixture.detectChanges();

            checkDropdownVariableOptionsFailed();
        });

        it('should return empty array and display error when variable is NOT found', () => {
            widget.field = getVariableDropdownWidget(
                'variables.wrong-variable-id',
                'response.people.players',
                'playerId',
                'playerFullName',
                mockProcessVariablesWithJson
            );
            fixture.detectChanges();

            checkDropdownVariableOptionsFailed();
        });

        it('should return empty array and display error if there are NO process and form variables', () => {
            widget.field = getVariableDropdownWidget('variables.json-variable', 'response.people.players', 'playerId', 'playerFullName', [], []);
            fixture.detectChanges();

            checkDropdownVariableOptionsFailed();
        });

        it('should NOT display errors if form is in the preview state', () => {
            widget.field = getVariableDropdownWidget(
                'variables.json-variable',
                'response.wrongPath.players',
                'playerId',
                'playerFullName',
                mockProcessVariablesWithJson
            );
            spyOn(formCloudService, 'getPreviewState').and.returnValue(true);
            fixture.detectChanges();

            const failedErrorMsgElement = fixture.debugElement.query(By.css('.adf-dropdown-failed-message'));
            expect(failedErrorMsgElement).toBeNull();
        });

        it('should NOT display errors if field is readonly', () => {
            widget.field = getVariableDropdownWidget(
                'variables.wrong-variable-id',
                'response.wrongPath.players',
                'wrongId',
                'wrongFullName',
                mockProcessVariablesWithJson
            );
            widget.field.readOnly = true;
            fixture.detectChanges();

            const failedErrorMsgElement = fixture.debugElement.query(By.css('.adf-dropdown-failed-message'));
            expect(failedErrorMsgElement).toBeNull();
        });

        it('should update options when form variable changes', async () => {
            const field = getVariableDropdownWidget('json-form-variable', 'countries', 'id', 'name', undefined, mockFormVariableWithJson);

            widget.field = field;
            fixture.detectChanges();

            field.form.variables[0]['value']['countries'] = [{ id: 'NEW', name: 'New Country' }];

            formService.onFormVariableChanged.next({ field });

            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-select' }));
            await dropdown.open();

            expect(widget.field.options.length).toEqual(1);
            const allOptions = await dropdown.getOptions();
            expect(await allOptions[0].getText()).toEqual('New Country');
            expect(allOptions.length).toEqual(1);
        });
    });
});
