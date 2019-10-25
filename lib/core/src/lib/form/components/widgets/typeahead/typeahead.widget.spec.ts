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
import { Observable, of, throwError } from 'rxjs';

import { By } from '@angular/platform-browser';
import { FormService } from '../../../services/form.service';
import { FormFieldOption } from '../core/form-field-option';
import { FormFieldTypes } from '../core/form-field-types';
import { FormFieldModel } from '../core/form-field.model';
import { FormModel } from '../core/form.model';
import { TypeaheadWidgetComponent } from './typeahead.widget';
import { setupTestBed } from '../../../../testing/setupTestBed';
import { CoreModule } from '../../../../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';

describe('TypeaheadWidgetComponent', () => {

    let formService: FormService;
    let widget: TypeaheadWidgetComponent;
    let translationService: TranslateService;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ]
    });

    beforeEach(() => {
        translationService = TestBed.get(TranslateService);
        spyOn(translationService, 'instant').and.callFake((key) => { return key; });
        spyOn(translationService, 'get').and.callFake((key) => { return of(key); });

        formService = new FormService(null, null, null);
        widget = new TypeaheadWidgetComponent(formService, null);
        widget.field = new FormFieldModel(new FormModel({ taskId: 'task-id' }));
        widget.field.restUrl = 'whateverURL';
    });

    it('should request field values from service', () => {
        const taskId = '<form-id>';
        const fieldId = '<field-id>';

        const form = new FormModel({
            taskId: taskId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId,
            restUrl: 'whateverURL'
        });

        spyOn(formService, 'getRestFieldValues').and.returnValue(new Observable((observer) => {
            observer.next(null);
            observer.complete();
        }));
        widget.ngOnInit();
        expect(formService.getRestFieldValues).toHaveBeenCalledWith(taskId, fieldId);
    });

    it('should not perform any request if restUrl is not present', () => {
        const taskId = '<form-id>';
        const fieldId = '<field-id>';

        const form = new FormModel({
            taskId: taskId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId
        });

        spyOn(formService, 'getRestFieldValues');
        widget.ngOnInit();
        expect(formService.getRestFieldValues).not.toHaveBeenCalled();
    });

    it('should handle error when requesting fields with task id', () => {
        const taskId = '<form-id>';
        const fieldId = '<field-id>';

        const form = new FormModel({
            taskId: taskId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId,
            restUrl: 'whateverURL'
        });
        const err = 'Error';
        spyOn(formService, 'getRestFieldValues').and.returnValue(throwError(err));
        spyOn(widget, 'handleError').and.stub();

        widget.ngOnInit();

        expect(formService.getRestFieldValues).toHaveBeenCalled();
        expect(widget.handleError).toHaveBeenCalledWith(err);
    });

    it('should handle error when requesting fields with process id', () => {
        const processDefinitionId = '<process-id>';
        const fieldId = '<field-id>';

        const form = new FormModel({
            processDefinitionId: processDefinitionId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId,
            restUrl: 'whateverURL'
        });
        const err = 'Error';
        spyOn(formService, 'getRestFieldValuesByProcessId').and.returnValue(throwError(err));
        spyOn(widget, 'handleError').and.stub();

        widget.ngOnInit();

        expect(formService.getRestFieldValuesByProcessId).toHaveBeenCalled();
        expect(widget.handleError).toHaveBeenCalledWith(err);
    });

    it('should setup initial value', () => {
        spyOn(formService, 'getRestFieldValues').and.returnValue(new Observable((observer) => {
            observer.next([
                { id: '1', name: 'One' },
                { id: '2', name: 'Two' }
            ]);
            observer.complete();
        }));
        widget.field.value = '2';
        widget.field.restUrl = 'whateverURL';
        widget.ngOnInit();

        expect(formService.getRestFieldValues).toHaveBeenCalled();
        expect(widget.value).toBe('Two');
    });

    it('should not setup initial value due to missing option', () => {
        spyOn(formService, 'getRestFieldValues').and.returnValue(new Observable((observer) => {
            observer.next([
                { id: '1', name: 'One' },
                { id: '2', name: 'Two' }
            ]);
            observer.complete();
        }));

        widget.field.value = '3';
        widget.field.restUrl = 'whateverURL';
        widget.ngOnInit();

        expect(formService.getRestFieldValues).toHaveBeenCalled();
        expect(widget.value).toBeUndefined();
    });

    it('should setup field options on load', () => {
        const options: FormFieldOption[] = [
            { id: '1', name: 'One' },
            { id: '2', name: 'Two' }
        ];

        spyOn(formService, 'getRestFieldValues').and.returnValue(new Observable((observer) => {
            observer.next(options);
            observer.complete();
        }));

        widget.ngOnInit();
        expect(widget.field.options).toEqual(options);
    });

    it('should update form upon options setup', () => {
        spyOn(formService, 'getRestFieldValues').and.returnValue(new Observable((observer) => {
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
            { id: '1', name: 'Item one' },
            { id: '2', name: 'Item two' }
        ];
        widget.field.options = options;
        widget.value = 'tw';

        const filtered = widget.getOptions();
        expect(filtered.length).toBe(1);
        expect(filtered[0]).toEqual(options[1]);
    });

    it('should be case insensitive when filtering options', () => {
        const options: FormFieldOption[] = [
            { id: '1', name: 'Item one' },
            { id: '2', name: 'iTEM TWo' }
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
        let stubFormService;
        const fakeOptionList: FormFieldOption[] = [{
            id: '1',
            name: 'Fake Name 1 '
        }, {
            id: '2',
            name: 'Fake Name 2'
        }, { id: '3', name: 'Fake Name 3' }];

        beforeEach(async(() => {
            fixture = TestBed.createComponent(TypeaheadWidgetComponent);
            typeaheadWidgetComponent = fixture.componentInstance;
            element = fixture.nativeElement;
        }));

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        describe ('and typeahead is in readonly mode', () => {

            it('should show typeahead value with input disabled', async(() => {
                typeaheadWidgetComponent.field = new FormFieldModel(
                    new FormModel({ processVariables: [{ name: 'typeahead-id_LABEL', value: 'FakeProcessValue' }] }), {
                    id: 'typeahead-id',
                    name: 'typeahead-name',
                    type: 'readonly',
                    params: { field: { id: 'typeahead-id', name: 'typeahead-name', type: 'typeahead' } }
                });
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    const readonlyInput: HTMLInputElement = <HTMLInputElement> element.querySelector('#typeahead-id');
                    expect(readonlyInput.disabled).toBeTruthy();
                    expect(readonlyInput).not.toBeNull();
                    expect(readonlyInput.value).toBe('FakeProcessValue');
                });
            }));

            afterEach(() => {
                fixture.destroy();
            });

        });

        describe('and typeahead is populated via taskId', () => {

            beforeEach(async(() => {
                stubFormService = fixture.debugElement.injector.get(FormService);
                spyOn(stubFormService, 'getRestFieldValues').and.returnValue(of(fakeOptionList));
                typeaheadWidgetComponent.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'typeahead-id',
                    name: 'typeahead-name',
                    type: FormFieldTypes.TYPEAHEAD,
                    readOnly: false,
                    restUrl: 'whateverURL'
                });
                typeaheadWidgetComponent.field.isVisible = true;
                fixture.detectChanges();
            }));

            it('should show visible typeahead widget', async(() => {
                expect(element.querySelector('#typeahead-id')).toBeDefined();
                expect(element.querySelector('#typeahead-id')).not.toBeNull();
            }));

            it('should show typeahead options', async(() => {
                const typeaheadElement = fixture.debugElement.query(By.css('#typeahead-id'));
                const typeaheadHTMLElement: HTMLInputElement = <HTMLInputElement> typeaheadElement.nativeElement;
                typeaheadHTMLElement.focus();
                typeaheadWidgetComponent.value = 'F';
                typeaheadHTMLElement.value = 'F';
                typeaheadHTMLElement.dispatchEvent(new Event('keyup'));
                typeaheadHTMLElement.dispatchEvent(new Event('input'));
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(fixture.debugElement.query(By.css('[id="typeahead-name_option_1"]'))).not.toBeNull();
                    expect(fixture.debugElement.query(By.css('[id="typeahead-name_option_2"]'))).not.toBeNull();
                    expect(fixture.debugElement.query(By.css('[id="typeahead-name_option_3"]'))).not.toBeNull();
                });
            }));

            it('should hide the option when the value is empty', async(() => {
                const typeaheadElement = fixture.debugElement.query(By.css('#typeahead-id'));
                const typeaheadHTMLElement: HTMLInputElement = <HTMLInputElement> typeaheadElement.nativeElement;
                typeaheadHTMLElement.focus();
                typeaheadWidgetComponent.value = 'F';
                typeaheadHTMLElement.value = 'F';
                typeaheadHTMLElement.dispatchEvent(new Event('keyup'));
                typeaheadHTMLElement.dispatchEvent(new Event('input'));
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(fixture.debugElement.query(By.css('[id="typeahead-name_option_1"]'))).not.toBeNull();
                    typeaheadHTMLElement.focus();
                    typeaheadWidgetComponent.value = '';
                    typeaheadHTMLElement.dispatchEvent(new Event('keyup'));
                    typeaheadHTMLElement.dispatchEvent(new Event('input'));
                    fixture.detectChanges();
                    fixture.whenStable().then(() => {
                        fixture.detectChanges();
                        expect(fixture.debugElement.query(By.css('[id="typeahead-name_option_1"]'))).toBeNull();
                    });
                });
            }));

            it('should show error message when the value is not valid', async(() => {
                typeaheadWidgetComponent.value = 'Fake Name';
                typeaheadWidgetComponent.field.value = 'Fake Name';
                typeaheadWidgetComponent.field.options = fakeOptionList;
                expect(element.querySelector('.adf-error-text')).toBeNull();
                const keyboardEvent = new KeyboardEvent('keypress');
                typeaheadWidgetComponent.onKeyUp(keyboardEvent);
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('.adf-error-text')).not.toBeNull();
                    expect(element.querySelector('.adf-error-text').textContent).toContain('FORM.FIELD.VALIDATOR.INVALID_VALUE');
                });
            }));
        });

        describe('and typeahead is populated via processDefinitionId', () => {

            beforeEach(async(() => {
                stubFormService = fixture.debugElement.injector.get(FormService);
                spyOn(stubFormService, 'getRestFieldValuesByProcessId').and.returnValue(of(fakeOptionList));
                typeaheadWidgetComponent.field = new FormFieldModel(new FormModel({ processDefinitionId: 'fake-process-id' }), {
                    id: 'typeahead-id',
                    name: 'typeahead-name',
                    type: FormFieldTypes.TYPEAHEAD,
                    readOnly: 'false'
                });
                typeaheadWidgetComponent.field.emptyOption = { id: 'empty', name: 'Choose one...' };
                typeaheadWidgetComponent.field.isVisible = true;
                fixture.detectChanges();
            }));

            it('should show visible typeahead widget', async(() => {
                expect(element.querySelector('#typeahead-id')).toBeDefined();
                expect(element.querySelector('#typeahead-id')).not.toBeNull();
            }));

            it('should show typeahead options', async(() => {
                const keyboardEvent = new KeyboardEvent('keypress');
                typeaheadWidgetComponent.value = 'F';
                typeaheadWidgetComponent.onKeyUp(keyboardEvent);
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(fixture.debugElement.queryAll(By.css('[id="mat-option-1"]'))).toBeDefined();
                    expect(fixture.debugElement.queryAll(By.css('[id="mat-option-2"]'))).toBeDefined();
                    expect(fixture.debugElement.queryAll(By.css('[id="mat-option-3"]'))).toBeDefined();
                });
            }));
        });
    });
});
