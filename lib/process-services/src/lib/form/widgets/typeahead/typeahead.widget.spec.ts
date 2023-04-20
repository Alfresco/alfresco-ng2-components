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
import { Observable, of, throwError } from 'rxjs';

import { By } from '@angular/platform-browser';
import {
    FormService,
    FormFieldOption,
    FormFieldTypes,
    FormFieldModel,
    FormModel,
    setupTestBed,
    CoreTestingModule
} from '@alfresco/adf-core';
import { TypeaheadWidgetComponent } from './typeahead.widget';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { TaskFormService } from '../../services/task-form.service';
import { ProcessDefinitionService } from '../../services/process-definition.service';

describe('TypeaheadWidgetComponent', () => {

    let formService: FormService;
    let widget: TypeaheadWidgetComponent;
    let translationService: TranslateService;
    let taskFormService: TaskFormService;
    let processDefinitionService: ProcessDefinitionService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        translationService = TestBed.inject(TranslateService);
        taskFormService = TestBed.inject(TaskFormService);
        processDefinitionService = TestBed.inject(ProcessDefinitionService);
        spyOn(translationService, 'instant').and.callFake((key) => key);
        spyOn(translationService, 'get').and.callFake((key) => of(key));

        formService = new FormService();
        widget = new TypeaheadWidgetComponent(formService, taskFormService, processDefinitionService, null);
        widget.field = new FormFieldModel(new FormModel({taskId: 'task-id'}));
        widget.field.restUrl = 'whateverURL';
    });

    it('should request field values from service', () => {
        const taskId = '<form-id>';
        const fieldId = '<field-id>';

        const form = new FormModel({
            taskId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId,
            restUrl: 'whateverURL'
        });

        spyOn(taskFormService, 'getRestFieldValues').and.returnValue(new Observable((observer) => {
            observer.next(null);
            observer.complete();
        }));
        widget.ngOnInit();
        expect(taskFormService.getRestFieldValues).toHaveBeenCalledWith(taskId, fieldId);
    });

    it('should not perform any request if restUrl is not present', () => {
        const taskId = '<form-id>';
        const fieldId = '<field-id>';

        const form = new FormModel({
            taskId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId
        });

        spyOn(taskFormService, 'getRestFieldValues');
        widget.ngOnInit();
        expect(taskFormService.getRestFieldValues).not.toHaveBeenCalled();
    });

    it('should handle error when requesting fields with task id', () => {
        const taskId = '<form-id>';
        const fieldId = '<field-id>';

        const form = new FormModel({
            taskId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId,
            restUrl: 'whateverURL'
        });
        const err = 'Error';
        spyOn(taskFormService, 'getRestFieldValues').and.returnValue(throwError(err));
        spyOn(widget, 'handleError').and.stub();

        widget.ngOnInit();

        expect(taskFormService.getRestFieldValues).toHaveBeenCalled();
        expect(widget.handleError).toHaveBeenCalledWith(err);
    });

    it('should handle error when requesting fields with process id', () => {
        const processDefinitionId = '<process-id>';
        const fieldId = '<field-id>';

        const form = new FormModel({
            processDefinitionId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId,
            restUrl: 'whateverURL'
        });
        const err = 'Error';
        spyOn(processDefinitionService, 'getRestFieldValuesByProcessId').and.returnValue(throwError(err));
        spyOn(widget, 'handleError').and.stub();

        widget.ngOnInit();

        expect(processDefinitionService.getRestFieldValuesByProcessId).toHaveBeenCalled();
        expect(widget.handleError).toHaveBeenCalledWith(err);
    });

    it('should setup initial value', () => {
        spyOn(taskFormService, 'getRestFieldValues').and.returnValue(new Observable((observer) => {
            observer.next([
                {id: '1', name: 'One'},
                {id: '2', name: 'Two'}
            ]);
            observer.complete();
        }));
        widget.field.value = '2';
        widget.field.restUrl = 'whateverURL';
        widget.ngOnInit();

        expect(taskFormService.getRestFieldValues).toHaveBeenCalled();
        expect(widget.value).toBe('Two');
    });

    it('should not setup initial value due to missing option', () => {
        spyOn(taskFormService, 'getRestFieldValues').and.returnValue(new Observable((observer) => {
            observer.next([
                {id: '1', name: 'One'},
                {id: '2', name: 'Two'}
            ]);
            observer.complete();
        }));

        widget.field.value = '3';
        widget.field.restUrl = 'whateverURL';
        widget.ngOnInit();

        expect(taskFormService.getRestFieldValues).toHaveBeenCalled();
        expect(widget.value).toBeUndefined();
    });

    it('should setup field options on load', () => {
        const options: FormFieldOption[] = [
            {id: '1', name: 'One'},
            {id: '2', name: 'Two'}
        ];

        spyOn(taskFormService, 'getRestFieldValues').and.returnValue(new Observable((observer) => {
            observer.next(options);
            observer.complete();
        }));

        widget.ngOnInit();
        expect(widget.field.options).toEqual(options);
    });

    it('should update form upon options setup', () => {
        spyOn(taskFormService, 'getRestFieldValues').and.returnValue(new Observable((observer) => {
            observer.next([]);
            observer.complete();
        }));
        widget.field.restUrl = 'whateverURL';

        spyOn(widget.field, 'updateForm').and.callThrough();
        widget.ngOnInit();
        expect(widget.field.updateForm).toHaveBeenCalled();
    });

    it('should get filtered options', () => {
        const options: FormFieldOption[] = [
            {id: '1', name: 'Item one'},
            {id: '2', name: 'Item two'}
        ];
        widget.field.options = options;
        widget.value = 'tw';

        const filtered = widget.getOptions();
        expect(filtered.length).toBe(1);
        expect(filtered[0]).toEqual(options[1]);
    });

    it('should be case insensitive when filtering options', () => {
        const options: FormFieldOption[] = [
            {id: '1', name: 'Item one'},
            {id: '2', name: 'iTEM TWo'}
        ];
        widget.field.options = options;
        widget.value = 'tW';

        const filtered = widget.getOptions();
        expect(filtered.length).toBe(1);
        expect(filtered[0]).toEqual(options[1]);
    });

    describe('when template is ready', () => {
        let typeaheadWidgetComponent: TypeaheadWidgetComponent;
        let fixture: ComponentFixture<TypeaheadWidgetComponent>;
        let element: HTMLElement;
        let stubProcessDefinitionService;
        const fakeOptionList: FormFieldOption[] = [{
            id: '1',
            name: 'Fake Name 1 '
        }, {
            id: '2',
            name: 'Fake Name 2'
        }, {id: '3', name: 'Fake Name 3'}];

        beforeEach(() => {
            fixture = TestBed.createComponent(TypeaheadWidgetComponent);
            typeaheadWidgetComponent = fixture.componentInstance;
            element = fixture.nativeElement;
        });

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        describe('and typeahead is in readonly mode', () => {

            it('should show typeahead value with input disabled', async () => {
                typeaheadWidgetComponent.field = new FormFieldModel(
                    new FormModel({processVariables: [{name: 'typeahead-id_LABEL', value: 'FakeProcessValue'}]}), {
                        id: 'typeahead-id',
                        name: 'typeahead-name',
                        type: 'readonly',
                        params: {field: {id: 'typeahead-id', name: 'typeahead-name', type: 'typeahead'}}
                    });

                fixture.detectChanges();
                await fixture.whenStable();

                const readonlyInput = element.querySelector<HTMLInputElement>('#typeahead-id');
                expect(readonlyInput.disabled).toBeTruthy();
                expect(readonlyInput).not.toBeNull();
                expect(readonlyInput.value).toBe('FakeProcessValue');
            });

            afterEach(() => {
                fixture.destroy();
            });

        });

        describe('and typeahead is populated via taskId', () => {

            beforeEach(() => {
                spyOn(taskFormService, 'getRestFieldValues').and.returnValue(of(fakeOptionList));
                typeaheadWidgetComponent.field = new FormFieldModel(new FormModel({taskId: 'fake-task-id'}), {
                    id: 'typeahead-id',
                    name: 'typeahead-name',
                    type: FormFieldTypes.TYPEAHEAD,
                    readOnly: false,
                    restUrl: 'whateverURL'
                });
                typeaheadWidgetComponent.field.isVisible = true;
                fixture.detectChanges();
            });

            it('should show visible typeahead widget', () => {
                expect(element.querySelector('#typeahead-id')).toBeDefined();
                expect(element.querySelector('#typeahead-id')).not.toBeNull();
            });

            it('should show typeahead options', async () => {
                const typeaheadElement = fixture.debugElement.query(By.css('#typeahead-id'));
                const typeaheadHTMLElement = typeaheadElement.nativeElement as HTMLInputElement;
                typeaheadHTMLElement.focus();
                typeaheadWidgetComponent.value = 'F';
                typeaheadHTMLElement.value = 'F';
                typeaheadHTMLElement.dispatchEvent(new Event('keyup'));
                typeaheadHTMLElement.dispatchEvent(new Event('input'));

                fixture.detectChanges();
                await fixture.whenStable();

                expect(fixture.debugElement.query(By.css('[id="adf-typeahed-widget-user-0"] span'))).not.toBeNull();
                expect(fixture.debugElement.query(By.css('[id="adf-typeahed-widget-user-1"] span'))).not.toBeNull();
                expect(fixture.debugElement.query(By.css('[id="adf-typeahed-widget-user-2"] span'))).not.toBeNull();
            });

            it('should hide the option when the value is empty', async () => {
                const typeaheadElement = fixture.debugElement.query(By.css('#typeahead-id'));
                const typeaheadHTMLElement = typeaheadElement.nativeElement as HTMLInputElement;
                typeaheadHTMLElement.focus();
                typeaheadWidgetComponent.value = 'F';
                typeaheadHTMLElement.value = 'F';
                typeaheadHTMLElement.dispatchEvent(new Event('keyup'));
                typeaheadHTMLElement.dispatchEvent(new Event('input'));

                fixture.detectChanges();
                await fixture.whenStable();

                expect(fixture.debugElement.query(By.css('[id="adf-typeahed-widget-user-0"] span'))).not.toBeNull();
                typeaheadHTMLElement.focus();
                typeaheadWidgetComponent.value = '';
                typeaheadHTMLElement.dispatchEvent(new Event('keyup'));
                typeaheadHTMLElement.dispatchEvent(new Event('input'));

                fixture.detectChanges();
                await fixture.whenStable();

                expect(fixture.debugElement.query(By.css('[id="adf-typeahed-widget-user-0"] span'))).toBeNull();
            });

            it('should show error message when the value is not valid', async () => {
                typeaheadWidgetComponent.value = 'Fake Name';
                typeaheadWidgetComponent.field.value = 'Fake Name';
                typeaheadWidgetComponent.field.options = fakeOptionList;
                expect(element.querySelector('.adf-error-text')).toBeNull();
                const keyboardEvent = new KeyboardEvent('keypress');
                typeaheadWidgetComponent.onKeyUp(keyboardEvent);

                fixture.detectChanges();
                await fixture.whenStable();

                expect(element.querySelector('.adf-error-text')).not.toBeNull();
                expect(element.querySelector('.adf-error-text').textContent).toContain('FORM.FIELD.VALIDATOR.INVALID_VALUE');
            });
        });

        describe('and typeahead is populated via processDefinitionId', () => {

            beforeEach(() => {
                stubProcessDefinitionService = fixture.debugElement.injector.get(ProcessDefinitionService);
                spyOn(stubProcessDefinitionService, 'getRestFieldValuesByProcessId').and.returnValue(of(fakeOptionList));
                typeaheadWidgetComponent.field = new FormFieldModel(new FormModel({processDefinitionId: 'fake-process-id'}), {
                    id: 'typeahead-id',
                    name: 'typeahead-name',
                    type: FormFieldTypes.TYPEAHEAD,
                    readOnly: 'false'
                });
                typeaheadWidgetComponent.field.emptyOption = {id: 'empty', name: 'Choose one...'};
                typeaheadWidgetComponent.field.isVisible = true;
                fixture.detectChanges();
            });

            it('should show visible typeahead widget', () => {
                expect(element.querySelector('#typeahead-id')).toBeDefined();
                expect(element.querySelector('#typeahead-id')).not.toBeNull();
            });

            it('should show typeahead options', async () => {
                const keyboardEvent = new KeyboardEvent('keypress');
                typeaheadWidgetComponent.value = 'F';
                typeaheadWidgetComponent.onKeyUp(keyboardEvent);

                fixture.detectChanges();
                await fixture.whenStable();

                expect(fixture.debugElement.queryAll(By.css('[id="adf-typeahed-widget-user-0"] span'))).toBeDefined();
                expect(fixture.debugElement.queryAll(By.css('[id="adf-typeahed-widget-user-1"] span'))).toBeDefined();
                expect(fixture.debugElement.queryAll(By.css('[id="adf-typeahed-widget-user-2"] span'))).toBeDefined();
            });
        });
    });
});
