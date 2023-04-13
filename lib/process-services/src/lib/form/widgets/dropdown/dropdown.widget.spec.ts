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
import { Observable, of } from 'rxjs';
import {
    WidgetVisibilityService,
    FormFieldOption,
    FormFieldModel,
    FormModel,
    FormFieldTypes,
    CoreTestingModule,
    setupTestBed
} from '@alfresco/adf-core';
import { DropdownWidgetComponent } from './dropdown.widget';
import { TranslateModule } from '@ngx-translate/core';
import { TaskFormService } from '../../services/task-form.service';
import { ProcessDefinitionService } from '../../services/process-definition.service';

describe('DropdownWidgetComponent', () => {

    let taskFormService: TaskFormService;
    let processDefinitionService: ProcessDefinitionService;
    let widget: DropdownWidgetComponent;
    let visibilityService: WidgetVisibilityService;
    let fixture: ComponentFixture<DropdownWidgetComponent>;
    let element: HTMLElement;

    const openSelect = () => {
        const dropdown = fixture.debugElement.nativeElement.querySelector('.mat-select-trigger');
        dropdown.click();
    };

    const fakeOptionList: FormFieldOption[] = [
        {id: 'opt_1', name: 'option_1'},
        {id: 'opt_2', name: 'option_2'},
        {id: 'opt_3', name: 'option_3'}];

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DropdownWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
        taskFormService = TestBed.inject(TaskFormService);
        visibilityService = TestBed.inject(WidgetVisibilityService);
        processDefinitionService = TestBed.inject(ProcessDefinitionService);
        widget.field = new FormFieldModel(new FormModel());
    });

    it('should require field with restUrl', () => {
        spyOn(taskFormService, 'getRestFieldValues').and.stub();

        widget.field = null;
        widget.ngOnInit();
        expect(taskFormService.getRestFieldValues).not.toHaveBeenCalled();

        widget.field = new FormFieldModel(null, {restUrl: null});
        widget.ngOnInit();
        expect(taskFormService.getRestFieldValues).not.toHaveBeenCalled();
    });

    it('should request field values from service', () => {
        const taskId = '<form-id>';
        const fieldId = '<field-id>';

        const form = new FormModel({
            taskId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId,
            restUrl: '<url>'
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

    it('should preserve empty option when loading fields', () => {
        const restFieldValue: FormFieldOption = {id: '1', name: 'Option1'} as FormFieldOption;
        spyOn(taskFormService, 'getRestFieldValues').and.callFake(() => new Observable((observer) => {
            observer.next([restFieldValue]);
            observer.complete();
        }));

        const form = new FormModel({taskId: '<id>'});
        const emptyOption: FormFieldOption = {id: 'empty', name: 'Empty'} as FormFieldOption;
        widget.field = new FormFieldModel(form, {
            id: '<id>',
            restUrl: '/some/url/address',
            hasEmptyValue: true,
            options: [emptyOption]
        });
        widget.ngOnInit();

        expect(taskFormService.getRestFieldValues).toHaveBeenCalled();
        expect(widget.field.options.length).toBe(2);
        expect(widget.field.options[0]).toBe(emptyOption);
        expect(widget.field.options[1]).toBe(restFieldValue);
    });

    describe('when is required', () => {

        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({taskId: '<id>'}), {
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

        it('should be invalid if no default option after interaction', async () => {
            expect(element.querySelector('.adf-invalid')).toBeFalsy();

            const dropdownSelect = element.querySelector('.adf-select');
            dropdownSelect.dispatchEvent(new Event('blur'));

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
    });

    describe('when template is ready', () => {

        describe('and dropdown is populated via taskId', () => {

            beforeEach(() => {
                spyOn(visibilityService, 'refreshVisibility').and.stub();
                spyOn(taskFormService, 'getRestFieldValues').and.callFake(() => of(fakeOptionList));
                widget.field = new FormFieldModel(new FormModel({taskId: 'fake-task-id'}), {
                    id: 'dropdown-id',
                    name: 'date-name',
                    type: 'dropdown',
                    readOnly: 'false',
                    restUrl: 'fake-rest-url'
                });
                widget.field.emptyOption = {id: 'empty', name: 'Choose one...'};
                widget.field.isVisible = true;
                fixture.detectChanges();
            });

            it('should show visible dropdown widget', async () => {
                expect(element.querySelector('#dropdown-id')).toBeDefined();
                expect(element.querySelector('#dropdown-id')).not.toBeNull();

                openSelect();

                const optOne = fixture.debugElement.queryAll(By.css('[id="mat-option-1"]'));
                const optTwo = fixture.debugElement.queryAll(By.css('[id="mat-option-2"]'));
                const optThree = fixture.debugElement.queryAll(By.css('[id="mat-option-3"]'));

                expect(optOne).not.toBeNull();
                expect(optTwo).not.toBeNull();
                expect(optThree).not.toBeNull();
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
                await fixture.whenStable();

                openSelect();

                fixture.detectChanges();
                await fixture.whenStable();

                const dropDownElement: any = element.querySelector('#dropdown-id');
                expect(dropDownElement.attributes['ng-reflect-model'].value).toBe('empty');
            });
        });

        describe('and dropdown is populated via processDefinitionId', () => {

            beforeEach(() => {
                spyOn(visibilityService, 'refreshVisibility').and.stub();
                spyOn(processDefinitionService, 'getRestFieldValuesByProcessId').and.callFake(() => of(fakeOptionList));
                widget.field = new FormFieldModel(new FormModel({processDefinitionId: 'fake-process-id'}), {
                    id: 'dropdown-id',
                    name: 'date-name',
                    type: 'dropdown',
                    readOnly: 'false',
                    restUrl: 'fake-rest-url'
                });
                widget.field.emptyOption = {id: 'empty', name: 'Choose one...'};
                widget.field.isVisible = true;
                fixture.detectChanges();
            });

            it('should show visible dropdown widget', () => {
                expect(element.querySelector('#dropdown-id')).toBeDefined();
                expect(element.querySelector('#dropdown-id')).not.toBeNull();

                openSelect();

                const optOne = fixture.debugElement.queryAll(By.css('[id="mat-option-1"]'));
                const optTwo = fixture.debugElement.queryAll(By.css('[id="mat-option-2"]'));
                const optThree = fixture.debugElement.queryAll(By.css('[id="mat-option-3"]'));

                expect(optOne).not.toBeNull();
                expect(optTwo).not.toBeNull();
                expect(optThree).not.toBeNull();
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
                await fixture.whenStable();

                openSelect();

                fixture.detectChanges();
                await fixture.whenStable();

                const dropDownElement: any = element.querySelector('#dropdown-id');
                expect(dropDownElement.attributes['ng-reflect-model'].value).toBe('empty');
            });

            it('should be disabled when the field is readonly', async () => {
                widget.field = new FormFieldModel(new FormModel({processDefinitionId: 'fake-process-id'}), {
                    id: 'dropdown-id',
                    name: 'date-name',
                    type: 'dropdown',
                    readOnly: 'true',
                    restUrl: 'fake-rest-url'
                });

                fixture.detectChanges();
                await fixture.whenStable();

                const dropDownElement = element.querySelector<HTMLSelectElement>('#dropdown-id');
                expect(dropDownElement).not.toBeNull();
                expect(dropDownElement.getAttribute('aria-disabled')).toBe('true');
            });

            it('should show the option value when the field is readonly', async () => {
                widget.field = new FormFieldModel(new FormModel({processDefinitionId: 'fake-process-id'}), {
                    id: 'dropdown-id',
                    name: 'date-name',
                    type: 'readonly',
                    value: 'FakeValue',
                    readOnly: true,
                    params: {field: {name: 'date-name', type: 'dropdown'}}
                });

                openSelect();

                fixture.detectChanges();
                await fixture.whenStable();

                const options = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(options.length).toBe(1);

                const option = options[0].nativeElement;
                expect(option.innerText).toEqual('FakeValue');
            });
        });
    });
});
