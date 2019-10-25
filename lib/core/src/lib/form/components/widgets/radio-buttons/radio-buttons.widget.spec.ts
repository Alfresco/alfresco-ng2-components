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
import { Observable, of } from 'rxjs';
import { FormService } from '../../../services/form.service';
import { ContainerModel } from '../core/container.model';
import { FormFieldTypes } from '../core/form-field-types';
import { FormFieldOption } from './../core/form-field-option';
import { FormFieldModel } from './../core/form-field.model';
import { FormModel } from './../core/form.model';
import { RadioButtonsWidgetComponent } from './radio-buttons.widget';
import { setupTestBed } from '../../../../testing/setupTestBed';
import { CoreModule } from '../../../../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('RadioButtonsWidgetComponent', () => {

    let formService: FormService;
    let widget: RadioButtonsWidgetComponent;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ]
    });

    beforeEach(() => {
        formService = new FormService(null, null, null);
        widget = new RadioButtonsWidgetComponent(formService, null);
        widget.field = new FormFieldModel(new FormModel(), { restUrl: '<url>' });
    });

    it('should request field values from service', () => {
        const taskId = '<form-id>';
        const fieldId = '<field-id>';

        const form = new FormModel({
            taskId: taskId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId,
            restUrl: '<url>'
        });

        spyOn(formService, 'getRestFieldValues').and.returnValue(new Observable((observer) => {
            observer.next(null);
            observer.complete();
        }));
        widget.ngOnInit();
        expect(formService.getRestFieldValues).toHaveBeenCalledWith(taskId, fieldId);
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

        spyOn(formService, 'getRestFieldValues').and.returnValue(new Observable((observer) => {
            observer.next(null);
            observer.complete();
        }));
        widget.ngOnInit();
        expect(field.updateForm).toHaveBeenCalled();
    });

    it('should require field with rest URL to fetch data', () => {
        const taskId = '<form-id>';
        const fieldId = '<field-id>';

        const form = new FormModel({
            taskId: taskId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId,
            restUrl: '<url>'
        });
        spyOn(formService, 'getRestFieldValues').and.returnValue(new Observable((observer) => {
            observer.next(null);
            observer.complete();
        }));

        const field = widget.field;
        widget.field = null;
        widget.ngOnInit();
        expect(formService.getRestFieldValues).not.toHaveBeenCalled();
        widget.field = field;

        widget.field.restUrl = null;
        widget.ngOnInit();
        expect(formService.getRestFieldValues).not.toHaveBeenCalled();

        widget.field.restUrl = '<url>';
        widget.ngOnInit();
        expect(formService.getRestFieldValues).toHaveBeenCalled();
    });

    it('should update the field value when an option is selected', () => {
        spyOn(widget, 'onFieldChanged').and.returnValue(of({}));
        widget.onOptionClick('fake-opt');

        expect(widget.field.value).toEqual('fake-opt');
    });

    describe('when template is ready', () => {
        let radioButtonWidget: RadioButtonsWidgetComponent;
        let fixture: ComponentFixture<RadioButtonsWidgetComponent>;
        let element: HTMLElement;
        let stubFormService: FormService;
        const restOption: FormFieldOption[] = [
            {
                id: 'opt-1',
                name: 'opt-name-1'
            },
            {
                id: 'opt-2',
                name: 'opt-name-2'
            }];

        beforeEach(async(() => {
            fixture = TestBed.createComponent(RadioButtonsWidgetComponent);
            radioButtonWidget = fixture.componentInstance;
            element = fixture.nativeElement;
        }));

        afterEach(() => {
            fixture.destroy();
        });

        describe('and radioButton is readonly', () => {

            beforeEach(async(() => {
                stubFormService = fixture.debugElement.injector.get(FormService);
                radioButtonWidget.field = new FormFieldModel(new FormModel({ taskId: 'task-id' }), {
                    id: 'radio-id',
                    name: 'radio-name',
                    type: FormFieldTypes.RADIO_BUTTONS,
                    readOnly: true
                });
                radioButtonWidget.field.isVisible = true;
                const fakeContainer = new ContainerModel(radioButtonWidget.field);
                radioButtonWidget.field.form.fields.push(fakeContainer);
                fixture.detectChanges();
            }));

            it('should show radio buttons as text when is readonly', async(() => {
                expect(element.querySelector('display-text-widget')).toBeDefined();
            }));

        });

        describe('and radioButton is populated via taskId', () => {

            beforeEach(async(() => {
                stubFormService = fixture.debugElement.injector.get(FormService);
                spyOn(stubFormService, 'getRestFieldValues').and.returnValue(of(restOption));
                radioButtonWidget.field = new FormFieldModel(new FormModel({ taskId: 'task-id' }), {
                    id: 'radio-id',
                    name: 'radio-name',
                    type: FormFieldTypes.RADIO_BUTTONS,
                    restUrl: 'rest-url'
                });
                radioButtonWidget.field.isVisible = true;
                const fakeContainer = new ContainerModel(radioButtonWidget.field);
                radioButtonWidget.field.form.fields.push(fakeContainer);
                fixture.detectChanges();
            }));

            it('should show radio buttons', async(() => {
                expect(element.querySelector('#radio-id')).toBeDefined();
                expect(element.querySelector('#radio-id-opt-1-input')).not.toBeNull();
                expect(element.querySelector('#radio-id-opt-1')).not.toBeNull();
                expect(element.querySelector('#radio-id-opt-2-input')).not.toBeNull();
                expect(element.querySelector('#radio-id-opt-2')).not.toBeNull();
            }));

            it('should trigger field changed event on click', async(() => {
                const option: HTMLElement = <HTMLElement> element.querySelector('#radio-id-opt-1-input');
                expect(element.querySelector('#radio-id')).not.toBeNull();
                expect(option).not.toBeNull();
                option.click();
                widget.fieldChanged.subscribe(() => {
                    expect(element.querySelector('#radio-id')).toBeNull();
                    expect(element.querySelector('#radio-id-opt-1-input')).toBeNull();
                });
            }));
        });

        describe('and radioButton is populated via processDefinitionId', () => {

            beforeEach(async(() => {
                radioButtonWidget.field = new FormFieldModel(new FormModel({ processDefinitionId: 'proc-id' }), {
                    id: 'radio-id',
                    name: 'radio-name',
                    type: FormFieldTypes.RADIO_BUTTONS,
                    restUrl: 'rest-url'
                });
                stubFormService = fixture.debugElement.injector.get(FormService);
                spyOn(stubFormService, 'getRestFieldValuesByProcessId').and.returnValue(of(restOption));
                radioButtonWidget.field.isVisible = true;
                fixture.detectChanges();
            }));

            it('should show visible radio buttons', async(() => {
                expect(element.querySelector('#radio-id')).toBeDefined();
                expect(element.querySelector('#radio-id-opt-1-input')).not.toBeNull();
                expect(element.querySelector('#radio-id-opt-1')).not.toBeNull();
                expect(element.querySelector('#radio-id-opt-2-input')).not.toBeNull();
                expect(element.querySelector('#radio-id-opt-2')).not.toBeNull();
            }));
        });
    });
});
