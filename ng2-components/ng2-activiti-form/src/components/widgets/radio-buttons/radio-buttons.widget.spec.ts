/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { CoreModule, LogServiceMock } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';

import { EcmModelService } from '../../../services/ecm-model.service';
import { FormService } from '../../../services/form.service';
import { WidgetVisibilityService } from '../../../services/widget-visibility.service';
import { ContainerModel } from '../core/container.model';
import { FormFieldTypes } from '../core/form-field-types';
import { FormFieldOption } from './../core/form-field-option';
import { FormFieldModel } from './../core/form-field.model';
import { FormModel } from './../core/form.model';
import { RadioButtonsWidgetComponent } from './radio-buttons.widget';

describe('RadioButtonsWidgetComponent', () => {

    let formService: FormService;
    let widget: RadioButtonsWidgetComponent;
    let visibilityService: WidgetVisibilityService;
    let logService: LogServiceMock;

    beforeEach(() => {
        logService = new LogServiceMock();
        formService = new FormService(null, null, logService);
        visibilityService = new WidgetVisibilityService(null, logService);
        widget = new RadioButtonsWidgetComponent(formService, visibilityService, logService);
        widget.field = new FormFieldModel(new FormModel(), { restUrl: '<url>' });
    });

    it('should request field values from service', () => {
        const taskId = '<form-id>';
        const fieldId = '<field-id>';

        let form = new FormModel({
            taskId: taskId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId,
            restUrl: '<url>'
        });

        spyOn(formService, 'getRestFieldValues').and.returnValue(Observable.create(observer => {
            observer.next(null);
            observer.complete();
        }));
        widget.ngOnInit();
        expect(formService.getRestFieldValues).toHaveBeenCalledWith(taskId, fieldId);
    });

    it('should update form on values fetched', () => {
        const taskId = '<form-id>';
        const fieldId = '<field-id>';

        let form = new FormModel({
            taskId: taskId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId,
            restUrl: '<url>'
        });
        let field = widget.field;
        spyOn(field, 'updateForm').and.stub();

        spyOn(formService, 'getRestFieldValues').and.returnValue(Observable.create(observer => {
            observer.next(null);
            observer.complete();
        }));
        widget.ngOnInit();
        expect(field.updateForm).toHaveBeenCalled();
    });

    it('should require field with rest URL to fetch data', () => {
        const taskId = '<form-id>';
        const fieldId = '<field-id>';

        let form = new FormModel({
            taskId: taskId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId,
            restUrl: '<url>'
        });
        spyOn(formService, 'getRestFieldValues').and.returnValue(Observable.create(observer => {
            observer.next(null);
            observer.complete();
        }));

        let field = widget.field;
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

    it('should log error to console by default', () => {
        spyOn(logService, 'error').and.stub();
        widget.handleError('Err');
        expect(logService.error).toHaveBeenCalledWith('Err');
    });

    xit('should update the field value when an option is selected', () => {
        spyOn(widget, 'checkVisibility').and.stub();
        widget.onOptionClick('fake-opt');

        expect(widget.field.value).toEqual('fake-opt');
    });

    describe('when template is ready', () => {
        let radioButtonWidget: RadioButtonsWidgetComponent;
        let fixture: ComponentFixture<RadioButtonsWidgetComponent>;
        let element: HTMLElement;
        let componentHandler;
        let stubFormService: FormService;
        let stubVisibilityService: WidgetVisibilityService;
        let restOption: FormFieldOption[] = [{ id: 'opt-1', name: 'opt-name-1' }, {
            id: 'opt-2',
            name: 'opt-name-2'
        }];

        beforeEach(async(() => {
            componentHandler = jasmine.createSpyObj('componentHandler', ['upgradeAllRegistered', 'upgradeElement']);
            window['componentHandler'] = componentHandler;
            TestBed.configureTestingModule({
                imports: [CoreModule],
                declarations: [RadioButtonsWidgetComponent],
                providers: [FormService, EcmModelService, WidgetVisibilityService]
            }).compileComponents().then(() => {
                fixture = TestBed.createComponent(RadioButtonsWidgetComponent);
                radioButtonWidget = fixture.componentInstance;
                element = fixture.nativeElement;
            });
        }));

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        describe('and radioButton is populated via taskId', () => {

            beforeEach(async(() => {
                stubFormService = fixture.debugElement.injector.get(FormService);
                stubVisibilityService = fixture.debugElement.injector.get(WidgetVisibilityService);
                spyOn(stubFormService, 'getRestFieldValues').and.returnValue(Observable.of(restOption));
                radioButtonWidget.field = new FormFieldModel(new FormModel({ taskId: 'task-id' }), {
                    id: 'radio-id',
                    name: 'radio-name',
                    type: FormFieldTypes.RADIO_BUTTONS,
                    restUrl: 'rest-url'
                });
                radioButtonWidget.field.isVisible = true;
                let fakeContainer = new ContainerModel(radioButtonWidget.field);
                radioButtonWidget.field.form.fields.push(fakeContainer);
                fixture.detectChanges();
            }));

            it('should show visible radio buttons', async(() => {
                expect(element.querySelector('#radio-id')).toBeDefined();
                expect(element.querySelector('#opt-1')).not.toBeNull();
                expect(element.querySelector('#radio-id-opt-1')).not.toBeNull();
                expect(element.querySelector('#opt-2')).not.toBeNull();
                expect(element.querySelector('#radio-id-opt-2')).not.toBeNull();
            }));

            it('should not show invisible radio buttons', async(() => {
                radioButtonWidget.field.isVisible = false;
                fixture.detectChanges();
                fixture.whenStable()
                    .then(() => {
                        expect(element.querySelector('#radio-id')).toBeNull();
                        expect(element.querySelector('#opt-1')).toBeNull();
                        expect(element.querySelector('#opt-2')).toBeNull();
                    });
            }));

            it('should evaluate visibility on option click', async(() => {
                spyOn(stubVisibilityService, 'evaluateVisibility').and.returnValue(false);
                let option: HTMLElement = <HTMLElement> element.querySelector('#opt-1');
                expect(element.querySelector('#radio-id')).not.toBeNull();
                expect(option).not.toBeNull();
                option.click();
                fixture.detectChanges();
                fixture.whenStable()
                    .then(() => {
                        expect(element.querySelector('#radio-id')).toBeNull();
                        expect(element.querySelector('#opt-1')).toBeNull();
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
                spyOn(stubFormService, 'getRestFieldValuesByProcessId').and.returnValue(Observable.of(restOption));
                radioButtonWidget.field.isVisible = true;
                fixture.detectChanges();
            }));

            it('should show visible radio buttons', async(() => {
                expect(element.querySelector('#radio-id')).toBeDefined();
                expect(element.querySelector('#opt-1')).not.toBeNull();
                expect(element.querySelector('#radio-id-opt-1')).not.toBeNull();
                expect(element.querySelector('#opt-2')).not.toBeNull();
                expect(element.querySelector('#radio-id-opt-2')).not.toBeNull();
            }));
        });
    });
});
