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
import { Observable, of } from 'rxjs';
import { WidgetVisibilityService, FormFieldOption, FormFieldModel, FormModel, FormFieldTypes, ErrorMessageModel } from '@alfresco/adf-core';
import { DropdownWidgetComponent } from './dropdown.widget';
import { TaskFormService } from '../../services/task-form.service';
import { ProcessDefinitionService } from '../../services/process-definition.service';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';

describe('DropdownWidgetComponent', () => {
    let taskFormService: TaskFormService;
    let processDefinitionService: ProcessDefinitionService;
    let widget: DropdownWidgetComponent;
    let visibilityService: WidgetVisibilityService;
    let fixture: ComponentFixture<DropdownWidgetComponent>;
    let element: HTMLElement;
    let loader: HarnessLoader;

    const fakeOptionList: FormFieldOption[] = [
        { id: 'opt_1', name: 'option_1' },
        { id: 'opt_2', name: 'option_2' },
        { id: 'opt_3', name: 'option_3' }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DropdownWidgetComponent]
        });
        fixture = TestBed.createComponent(DropdownWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
        taskFormService = TestBed.inject(TaskFormService);
        visibilityService = TestBed.inject(WidgetVisibilityService);
        processDefinitionService = TestBed.inject(ProcessDefinitionService);
        widget.field = new FormFieldModel(new FormModel());
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should require field with restUrl', () => {
        spyOn(taskFormService, 'getRestFieldValues').and.stub();

        widget.field = null;
        widget.ngOnInit();
        expect(taskFormService.getRestFieldValues).not.toHaveBeenCalled();

        widget.field = new FormFieldModel(null, { restUrl: null });
        widget.ngOnInit();
        expect(taskFormService.getRestFieldValues).not.toHaveBeenCalled();
    });

    describe('requesting field options', () => {
        let getRestFieldValuesSpy: jasmine.Spy;
        const taskId = '<form-id>';
        const fieldId = '<field-id>';

        beforeEach(() => {
            getRestFieldValuesSpy = spyOn(taskFormService, 'getRestFieldValues').and.returnValue(of([]));

            widget.field = new FormFieldModel(new FormModel({ taskId }), { id: fieldId, restUrl: '<url>', optionType: 'rest' });
        });

        it('should request options from service when form is NOT readonly', () => {
            widget.field.form.readOnly = false;
            widget.ngOnInit();

            expect(getRestFieldValuesSpy).toHaveBeenCalledWith(taskId, fieldId);
        });

        it('should NOT request options from service when form is readonly', () => {
            widget.field.form.readOnly = true;
            widget.ngOnInit();

            expect(getRestFieldValuesSpy).not.toHaveBeenCalled();
        });
    });

    it('should NOT display any error when widget is readonly', () => {
        widget.field = new FormFieldModel(new FormModel({}, undefined, false), { readOnly: true });
        widget.field.validationSummary = { message: 'Some error occurred' } as ErrorMessageModel;

        widget.ngOnInit();
        fixture.detectChanges();

        expect(element.querySelector('.adf-dropdown-required-message')).toBeNull();
    });

    it('should NOT preserve empty option when loading fields', () => {
        const restFieldValue: FormFieldOption = { id: '1', name: 'Option1' } as FormFieldOption;
        spyOn(taskFormService, 'getRestFieldValues').and.callFake(
            () =>
                new Observable((observer) => {
                    observer.next([restFieldValue]);
                    observer.complete();
                })
        );

        const form = new FormModel({ taskId: '<id>' });
        const emptyOption: FormFieldOption = { id: 'empty', name: 'Empty' } as FormFieldOption;
        widget.field = new FormFieldModel(form, {
            id: '<id>',
            restUrl: '/some/url/address',
            optionType: 'rest',
            hasEmptyValue: true,
            options: [emptyOption]
        });
        widget.ngOnInit();

        expect(taskFormService.getRestFieldValues).toHaveBeenCalled();
        expect(widget.field.options.length).toBe(1);
        expect(widget.field.options[0]).toEqual(restFieldValue);
    });

    describe('when is required', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                id: 'dropdown-id',
                type: FormFieldTypes.DROPDOWN,
                required: true
            });

            widget.ngOnInit();
        });

        it('should be able to display label with asterisk', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const asterisk: HTMLElement = element.querySelector('.adf-asterisk');

            expect(asterisk).toBeTruthy();
            expect(asterisk.textContent).toEqual('*');
        });

        it('should be invalid if no default option after interaction', async () => {
            expect(element.querySelector('.adf-invalid')).toBeFalsy();

            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '#dropdown-id' }));
            await dropdown.focus();
            await dropdown.blur();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('.adf-invalid')).toBeTruthy();
        });

        it('should be valid if default option', async () => {
            widget.field.options = fakeOptionList;
            widget.field.value = fakeOptionList[0].id;

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('.adf-invalid')).toBeFalsy();
        });

        it('should be valid when field is hidden with empty value', () => {
            widget.field.isVisible = false;
            fixture.detectChanges();

            expect(widget.field.isValid).toBeTrue();
            expect(widget.dropdownControl.valid).toBeTrue();
            expect(widget.field.validationSummary.message).toBe('');
        });

        it('should be invalid when field is hidden with empty value', () => {
            widget.field.isVisible = true;
            fixture.detectChanges();

            expect(widget.field.isValid).toBeFalse();
            expect(widget.dropdownControl.valid).toBeFalse();
            expect(widget.field.validationSummary.message).toBe('FORM.FIELD.REQUIRED');
        });
    });

    describe('when template is ready', () => {
        describe('and dropdown is populated via taskId', () => {
            beforeEach(() => {
                spyOn(visibilityService, 'refreshVisibility').and.stub();
                spyOn(taskFormService, 'getRestFieldValues').and.callFake(() => of(fakeOptionList));
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'dropdown-id',
                    name: 'date-name',
                    type: 'dropdown',
                    readOnly: false,
                    restUrl: 'fake-rest-url',
                    optionType: 'rest'
                });
                widget.field.emptyOption = { id: 'empty', name: 'Choose one...' };
                widget.field.isVisible = true;
                widget.ngOnInit();

                fixture.detectChanges();
            });

            it('should show visible dropdown widget', async () => {
                const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '#dropdown-id' }));
                await dropdown.open();
                const options = await dropdown.getOptions();

                expect(await options[0].getText()).toBe(widget.field.emptyOption.name);
                expect(await options[1].getText()).toBe(fakeOptionList[0].name);
                expect(await options[2].getText()).toBe(fakeOptionList[1].name);
                expect(await options[3].getText()).toBe(fakeOptionList[2].name);
            });

            it('should select the default value when an option is chosen as default', async () => {
                widget.field.value = 'option_2';
                widget.ngOnInit();

                fixture.detectChanges();
                await fixture.whenStable();

                const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '#dropdown-id' }));
                expect(await dropdown.getValueText()).toBe('option_2');
            });

            it('should select the empty value when no default is chosen', async () => {
                widget.field.value = 'empty';
                widget.ngOnInit();

                await (await loader.getHarness(MatSelectHarness)).open();

                const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '#dropdown-id' }));
                expect(await dropdown.getValueText()).toBe('Choose one...');
                expect(await widget.field.value).toBe('empty');
            });
        });

        describe('and dropdown is populated via processDefinitionId', () => {
            beforeEach(() => {
                spyOn(visibilityService, 'refreshVisibility').and.stub();
                spyOn(processDefinitionService, 'getRestFieldValuesByProcessId').and.callFake(() => of(fakeOptionList));
                widget.field = new FormFieldModel(new FormModel({ processDefinitionId: 'fake-process-id' }), {
                    id: 'dropdown-id',
                    name: 'date-name',
                    type: 'dropdown',
                    readOnly: false,
                    restUrl: 'fake-rest-url',
                    optionType: 'rest'
                });
                widget.field.emptyOption = { id: 'empty', name: 'Choose one...' };
                widget.field.isVisible = true;
                fixture.detectChanges();
            });

            it('should show visible dropdown widget', async () => {
                const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '#dropdown-id' }));
                await dropdown.open();
                const options = await dropdown.getOptions();

                expect(await options[0].getText()).toBe(widget.field.emptyOption.name);
                expect(await options[1].getText()).toBe(fakeOptionList[0].name);
                expect(await options[2].getText()).toBe(fakeOptionList[1].name);
                expect(await options[3].getText()).toBe(fakeOptionList[2].name);
            });

            it('should select the default value when an option is chosen as default', async () => {
                widget.field.value = 'option_2';
                widget.ngOnInit();

                fixture.detectChanges();
                await fixture.whenStable();

                const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '#dropdown-id' }));
                expect(await dropdown.getValueText()).toBe('option_2');
            });

            it('should select the empty value when no default is chosen', async () => {
                widget.field.value = 'empty';
                widget.ngOnInit();
                await (await loader.getHarness(MatSelectHarness)).open();

                const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '#dropdown-id' }));
                expect(await dropdown.getValueText()).toBe('Choose one...');
                expect(await widget.field.value).toBe('empty');
            });

            it('should be disabled when the field is readonly', async () => {
                widget.field = new FormFieldModel(new FormModel({ processDefinitionId: 'fake-process-id' }), {
                    id: 'dropdown-id',
                    name: 'date-name',
                    type: 'dropdown',
                    readOnly: true,
                    restUrl: 'fake-rest-url'
                });
                widget.ngOnInit();

                fixture.detectChanges();
                await fixture.whenStable();

                const dropDownElement = element.querySelector<HTMLSelectElement>('#dropdown-id');
                expect(dropDownElement).not.toBeNull();
                expect(dropDownElement.getAttribute('aria-disabled')).toBe('true');
            });

            it('should show the option value when the field is readonly', async () => {
                widget.field = new FormFieldModel(new FormModel({ processDefinitionId: 'fake-process-id' }), {
                    id: 'dropdown-id',
                    name: 'date-name',
                    type: 'readonly',
                    value: 'FakeValue',
                    readOnly: true,
                    params: { field: { name: 'date-name', type: 'dropdown' } }
                });
                widget.ngOnInit();

                fixture.detectChanges();
                await fixture.whenStable();

                const dropdown = await loader.getHarness(MatSelectHarness);
                expect(await dropdown.getValueText()).toEqual('FakeValue');
            });
        });
    });
});
