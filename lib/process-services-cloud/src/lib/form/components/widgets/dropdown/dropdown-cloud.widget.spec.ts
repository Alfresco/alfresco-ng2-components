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
import { FormFieldModel, FormModel, FormService, setupTestBed, FormFieldEvent, FormFieldTypes } from '@alfresco/adf-core';
import { FormCloudService } from '../../../services/form-cloud.service';
import { ProcessServiceCloudTestingModule } from '../../../../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import {
    fakeOptionList,
    filterOptionList,
    mockConditionalEntries,
    mockRestDropdownOptions,
    mockSecondRestDropdownOptions
} from '../../../mocks/dropdown.mock';
import { OverlayContainer } from '@angular/cdk/overlay';

describe('DropdownCloudWidgetComponent', () => {

    let formService: FormService;
    let widget: DropdownCloudWidgetComponent;
    let formCloudService: FormCloudService;
    let overlayContainer: OverlayContainer;
    let fixture: ComponentFixture<DropdownCloudWidgetComponent>;
    let element: HTMLElement;

    const openSelect = async (_selector?: string) => {
        const dropdown: HTMLElement = element.querySelector('.mat-select-trigger');
        dropdown.click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DropdownCloudWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;

        formService = TestBed.inject(FormService);
        formCloudService = TestBed.inject(FormCloudService);
        overlayContainer = TestBed.inject(OverlayContainer);
    });

    afterEach(() => fixture.destroy());

    describe('Simple Dropdown', () => {

        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                id: 'dropdown-id',
                name: 'date-name',
                type: 'dropdown',
                readOnly: false,
                restUrl: 'https://fake-rest-url'
            });
            widget.field.emptyOption = { id: 'empty', name: 'Choose one...' };
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
            widget.ngOnInit();

            fixture.detectChanges();
            await fixture.whenStable();

            const dropDownElement: any = element.querySelector('#dropdown-id');
            expect(dropDownElement.attributes['ng-reflect-model'].value).toBe('option_2');
            expect(dropDownElement.attributes['ng-reflect-model'].textContent).toBe('option_2');
        });

        it('should select the empty value when no default is chosen', async () => {
            widget.field.value = 'empty';
            widget.ngOnInit();
            fixture.detectChanges();

            await openSelect('#dropdown-id');

            const dropDownElement = element.querySelector('#dropdown-id');
            expect(dropDownElement.attributes['ng-reflect-model'].value).toBe('empty');
        });

        it('should load data from restUrl and populate options', async () => {
            const jsonDataSpy = spyOn(formCloudService, 'getRestWidgetData').and.returnValue(of(fakeOptionList));
            widget.field.restUrl = 'https://fake-rest-url';
            widget.field.optionType = 'rest';
            widget.field.restIdProperty = 'name';

            widget.ngOnInit();
            fixture.detectChanges();
            await fixture.whenStable();

            const dropdown = fixture.debugElement.query(By.css('mat-select'));
            dropdown.nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();

            const optOne = fixture.debugElement.query(By.css('[id="opt_1"]'));
            const optTwo = fixture.debugElement.query(By.css('[id="opt_2"]'));
            const optThree = fixture.debugElement.query(By.css('[id="opt_3"]'));
            const allOptions = fixture.debugElement.queryAll(By.css('mat-option'));

            expect(jsonDataSpy).toHaveBeenCalled();
            expect(allOptions.length).toEqual(3);
            expect(optOne.nativeElement.innerText).toEqual('option_1');
            expect(optTwo.nativeElement.innerText).toEqual('option_2');
            expect(optThree.nativeElement.innerText).toEqual('option_3');
        });

        it('should show error message if the restUrl failed to fetch options', async () => {
            const jsonDataSpy = spyOn(formCloudService, 'getRestWidgetData').and.returnValue(throwError('Failed to fetch options'));
            const errorIcon: string = 'error_outline';
            widget.field.restUrl = 'https://fake-rest-url';
            widget.field.optionType = 'rest';
            widget.field.restIdProperty = 'name';

            widget.ngOnInit();
            fixture.detectChanges();
            await fixture.whenStable();

            const dropdown = fixture.debugElement.query(By.css('mat-select'));
            dropdown.nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();
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
            fixture.detectChanges();

            await openSelect();

            const option = fixture.debugElement.query(By.css('.mat-option-text'));
            expect(option.nativeElement.innerText).toBe('default1_value');
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
            fixture.detectChanges();

            await openSelect();
            const options = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            expect(options[0].nativeElement.innerText).toBe('default1_value');
            expect(widget.field.form.values['dropdown-id']).toEqual({ id: 'opt1', name: 'default1_value' });
        });

        it('should not display required error for a non required dropdown when selecting the none option', async () => {
            widget.field.options = [
                { id: 'empty', name: 'Choose empty' },
                ...fakeOptionList
            ];

            widget.ngOnInit();
            fixture.detectChanges();
            await openSelect();

            const defaultOption: any = fixture.debugElement.query(By.css('[id="empty"]'));
            widget.touched = true;
            defaultOption.triggerEventHandler('click', null);
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
            fixture.detectChanges();
            await openSelect();

            const optionOne: any = fixture.debugElement.query(By.css('[id="opt_1"]'));
            widget.touched = true;
            optionOne.triggerEventHandler('click', null);
            fixture.detectChanges();

            const requiredErrorElement = fixture.debugElement.query(By.css('.adf-dropdown-required-message .adf-error-text'));
            expect(requiredErrorElement).toBeFalsy();
        });

        it('should not have a value when switching from an available option to the None option', async () => {
            widget.field.options = [
                { id: 'empty', name: 'This is a mock none option' },
                ...fakeOptionList
            ];

            widget.ngOnInit();
            fixture.detectChanges();
            await openSelect();

            const optionOne = fixture.debugElement.query(By.css('[id="opt_1"]'));
            optionOne.triggerEventHandler('click', null);

            fixture.detectChanges();
            await fixture.whenStable();
            let selectedValueElement = fixture.debugElement.query(By.css('.mat-select-value-text'));

            expect(selectedValueElement.nativeElement.innerText).toEqual('option_1');
            expect(widget.fieldValue).toEqual('opt_1');

            await openSelect();
            const defaultOption: any = fixture.debugElement.query(By.css('[id="empty"]'));
            defaultOption.triggerEventHandler('click', null);

            fixture.detectChanges();
            await fixture.whenStable();

            const dropdownLabel = fixture.debugElement.query(By.css('.adf-dropdown-widget mat-label'));
            selectedValueElement = fixture.debugElement.query(By.css('.mat-select-value-text'));

            expect(dropdownLabel.nativeNode.innerText).toEqual('This is a mock none option');
            expect(widget.fieldValue).toEqual(undefined);
            expect(selectedValueElement).toBeFalsy();
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
            const dropdownInput = fixture.debugElement.query(By.css('mat-select')).nativeElement;
            dropdownInput.dispatchEvent(new Event('mouseenter'));
            await fixture.whenStable();
            fixture.detectChanges();

            const tooltipElement = fixture.debugElement.query(By.css('.mat-tooltip')).nativeElement;
            expect(tooltipElement).toBeTruthy();
            expect(tooltipElement.textContent.trim()).toBe('my custom tooltip');
          });

        it('should hide tooltip', async () => {
            const dropdownInput = fixture.debugElement.query(By.css('mat-select')).nativeElement;
            dropdownInput.dispatchEvent(new Event('mouseenter'));
            await fixture.whenStable();
            fixture.detectChanges();

            dropdownInput.dispatchEvent(new Event('mouseleave'));
            await fixture.whenStable();
            fixture.detectChanges();

            const tooltipElement = fixture.debugElement.query(By.css('.mat-tooltip'));
            expect(tooltipElement).toBeFalsy();
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
            await openSelect();
            const filter = fixture.debugElement.query(By.css('.adf-select-filter-input input'));
            expect(filter.nativeElement).toBeDefined('Filter is not visible');
        });

        it('should be able to filter the options by search', async () => {
            await openSelect();

            let options: HTMLElement[] = Array.from(overlayContainer.getContainerElement().querySelectorAll('mat-option'));
            expect(options.length).toBe(6);

            const filter = fixture.debugElement.query(By.css('.adf-select-filter-input input'));
            filter.nativeElement.value = '1';
            filter.nativeElement.dispatchEvent(new Event('input'));

            fixture.detectChanges();
            options = Array.from(overlayContainer.getContainerElement().querySelectorAll('mat-option'));
            expect(options.length).toBe(1);
            expect(options[0].innerText).toEqual('option_1');
        });

        it('should be able to select the options if filter present', async () => {
            await openSelect();

            const options: HTMLElement[] = Array.from(overlayContainer.getContainerElement().querySelectorAll('mat-option'));
            expect(options.length).toBe(6);
            options[0].click();
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
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const selectedPlaceHolder = fixture.debugElement.query(By.css('.mat-select-value-text span'));
            expect(selectedPlaceHolder.nativeElement.getInnerHTML()).toEqual('option_1, option_2');

            await openSelect('#dropdown-id');

            const options = fixture.debugElement.queryAll(By.css('.mat-selected span'));
            expect(Array.from(options).map(({ nativeElement }) => nativeElement.getInnerHTML().trim()))
                .toEqual(['option_1', 'option_2']);
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
            fixture.detectChanges();
            await openSelect('#dropdown-id');

            const optionOne = fixture.debugElement.query(By.css('[id="opt_1"]'));
            const optionTwo = fixture.debugElement.query(By.css('[id="opt_2"]'));
            optionOne.triggerEventHandler('click', null);
            optionTwo.triggerEventHandler('click', null);
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

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const selectedPlaceHolder = fixture.debugElement.query(By.css('.mat-select-value-text span'));
            expect(selectedPlaceHolder.nativeElement.getInnerHTML()).toEqual('option_3, option_4');

            await openSelect('#dropdown-id');

            const options = fixture.debugElement.queryAll(By.css('.mat-selected span'));
            expect(Array.from(options).map(({ nativeElement }) => nativeElement.getInnerHTML().trim()))
                .toEqual(['option_3', 'option_4']);
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

            fixture.detectChanges();
            await openSelect('#dropdown-id');

            const optionOne = fixture.debugElement.query(By.css('[id="opt_2"]'));
            const optionTwo = fixture.debugElement.query(By.css('[id="opt_4"]'));
            optionOne.triggerEventHandler('click', null);
            optionTwo.triggerEventHandler('click', null);
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

            it('should reset the options for a linked dropdown with restUrl when the parent dropdown selection changes to empty', async () => {
                widget.field.options = mockConditionalEntries[1].options;
                parentDropdown.value = undefined;
                widget.selectionChangedForField(parentDropdown);

                fixture.detectChanges();
                await openSelect('child-dropdown-id');

                expect(widget.field.options).toEqual([]);
            });

            it('should fetch the options from a rest url for a linked dropdown', async () => {
                const jsonDataSpy = spyOn(formCloudService, 'getRestWidgetData').and.returnValue(of(mockRestDropdownOptions));
                const mockParentDropdown = { id: 'parentDropdown', value: 'mock-value', validate: () => true };
                spyOn(widget.field.form, 'getFormFields').and.returnValue([mockParentDropdown]);
                parentDropdown.value = 'UK';
                widget.selectionChangedForField(parentDropdown);

                fixture.detectChanges();
                await openSelect('child-dropdown-id');

                const optOne: any = fixture.debugElement.query(By.css('[id="LO"]'));
                const optTwo: any = fixture.debugElement.query(By.css('[id="MA"]'));

                expect(jsonDataSpy).toHaveBeenCalledWith('fake-form-id', 'child-dropdown-id', { parentDropdown: 'mock-value' });
                expect(optOne.context.value).toBe('LO');
                expect(optOne.context.viewValue).toBe('LONDON');
                expect(optTwo.context.value).toBe('MA');
                expect(optTwo.context.viewValue).toBe('MANCHESTER');
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
                await openSelect('child-dropdown-id');
                const failedErrorMsgElement1 = fixture.debugElement.query(By.css('.adf-dropdown-failed-message'));

                expect(widget.isRestApiFailed).toBe(false);
                expect(widget.field.options.length).toBe(2);
                expect(failedErrorMsgElement1).toBeNull();

                jsonDataSpy.and.returnValue(throwError('Failed to fetch options'));
                selectParentOption('GR');
                await openSelect('child-dropdown-id');
                const failedErrorMsgElement2 = fixture.debugElement.query(By.css('.adf-dropdown-failed-message'));

                expect(widget.isRestApiFailed).toBe(true);
                expect(widget.field.options.length).toBe(0);
                expect(failedErrorMsgElement2.nativeElement.textContent.trim()).toBe(errorIcon + 'FORM.FIELD.REST_API_FAILED');

                jsonDataSpy.and.returnValue(of(mockSecondRestDropdownOptions));
                selectParentOption('IT');
                await openSelect('child-dropdown-id');
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
                await openSelect('child-dropdown-id');

                const optOne: any = fixture.debugElement.query(By.css('[id="empty"]'));
                const optTwo: any = fixture.debugElement.query(By.css('[id="ATH"]'));
                const optThree: any = fixture.debugElement.query(By.css('[id="SKG"]'));

                expect(widget.field.options).toEqual(mockConditionalEntries[0].options);
                expect(optOne.context.value).toBe(undefined);
                expect(optOne.context.viewValue).toBe('Choose one...');
                expect(optTwo.context.value).toBe('ATH');
                expect(optTwo.context.viewValue).toBe('Athens');
                expect(optThree.context.value).toBe('SKG');
                expect(optThree.context.viewValue).toBe('Thessaloniki');
            });

            it('should reset the options for a linked dropdown when the parent dropdown selection changes to empty', async () => {
                widget.field.options = mockConditionalEntries[1].options;
                parentDropdown.value = undefined;
                widget.selectionChangedForField(parentDropdown);

                fixture.detectChanges();
                await openSelect('child-dropdown-id');

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
});
