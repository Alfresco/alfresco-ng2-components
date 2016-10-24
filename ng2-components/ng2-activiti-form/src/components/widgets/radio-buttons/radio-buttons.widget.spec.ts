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

import { Observable } from 'rxjs/Rx';
import { FormService } from '../../../services/form.service';
import { RadioButtonsWidget } from './radio-buttons.widget';
import { FormModel } from './../core/form.model';
import { FormFieldModel } from './../core/form-field.model';
import { CoreModule } from 'ng2-alfresco-core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { EcmModelService } from '../../../services/ecm-model.service';

describe('RadioButtonsWidget', () => {

    let formService: FormService;
    let widget: RadioButtonsWidget;

    beforeEach(() => {
        formService = new FormService(null, null);
        widget = new RadioButtonsWidget(formService);
        widget.field = new FormFieldModel(new FormModel(), {restUrl: '<url>'});
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
        let form = widget.field;
        spyOn(form, 'updateForm').and.stub();

        spyOn(formService, 'getRestFieldValues').and.returnValue(Observable.create(observer => {
            observer.next(null);
            observer.complete();
        }));
        widget.ngOnInit();
        expect(form.updateForm).toHaveBeenCalled();
    });

    it('should require field with rest URL to fetch data', () => {
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
        spyOn(console, 'error').and.stub();
        widget.handleError('Err');
        expect(console.error).toHaveBeenCalledWith('Err');
    });

    it('should update the field value when an option is selected', () => {
        spyOn(widget, 'checkVisibility').and.stub();
        widget.onOptionClick('fake-opt');

        expect(widget.field.value).toEqual('fake-opt');
    });

    it('should emit field change event when option is clicked', (done) => {
        widget.fieldChanged.subscribe((field) => {
            expect(field.value).toEqual('fake-opt');
            done();
        });
        widget.onOptionClick('fake-opt');
    });

    describe('when template is ready', () => {
        let radioButtonWidget: RadioButtonsWidget;
        let fixture: ComponentFixture<RadioButtonsWidget>;
        let element: HTMLElement;
        let componentHandler;

        beforeEach(async(() => {
            componentHandler = jasmine.createSpyObj('componentHandler', ['upgradeAllRegistered', 'upgradeElement']);
            window['componentHandler'] = componentHandler;
            TestBed.configureTestingModule({
                imports: [CoreModule],
                declarations: [RadioButtonsWidget],
                providers: [FormService, EcmModelService]
            }).compileComponents().then(() => {
                fixture = TestBed.createComponent(RadioButtonsWidget);
                radioButtonWidget = fixture.componentInstance;
                element = fixture.nativeElement;
            });
        }));

        beforeEach(() => {
            radioButtonWidget.field = new FormFieldModel(new FormModel(), {
                id: 'radio-id',
                name: 'radio-name',
                type: 'radio-buttons'
            });
            radioButtonWidget.field.options = [{id: 'opt-1', name: 'opt-name-1'}, {id: 'opt-2', name: 'opt-name-2'}];
            radioButtonWidget.field.isVisible = true;
        });

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should show visible radio buttons', () => {
            fixture.detectChanges();
            fixture.whenStable()
                .then(() => {
                    expect(element.querySelector('#radio-id')).toBeDefined();
                    expect(element.querySelector('#opt-1')).toBeDefined();
                    expect(element.querySelector('#radio-id-opt-1')).toBeDefined();
                    expect(element.querySelector('#opt-2')).toBeDefined();
                    expect(element.querySelector('#radio-id-opt-2')).toBeDefined();
                });
        });

        it('should not show invisible radio buttons', () => {
            radioButtonWidget.field.isVisible = false;
            fixture.detectChanges();
            fixture.whenStable()
                .then(() => {
                    expect(element.querySelector('#radio-id')).toBeNull();
                    expect(element.querySelector('#opt-1')).toBeNull();
                    expect(element.querySelector('#opt-2')).toBeNull();
                });
        });

        it('should hide radio button when it becomes not visible', () => {
            radioButtonWidget.checkVisibility(null);
            radioButtonWidget.fieldChanged.subscribe((res) => {
                radioButtonWidget.field.isVisible = false;
                fixture.detectChanges();
                fixture.whenStable()
                    .then(() => {
                        expect(element.querySelector('#radio-id')).toBeNull();
                        expect(element.querySelector('#opt-1')).toBeNull();
                        expect(element.querySelector('#opt-2')).toBeNull();
                    });
            });
        });

        it('should show radio button when it becomes visible', () => {
            radioButtonWidget.field.isVisible = false;
            fixture.detectChanges();
            radioButtonWidget.checkVisibility(null);
            radioButtonWidget.fieldChanged.subscribe((res) => {
                radioButtonWidget.field.isVisible = true;
                fixture.detectChanges();
                fixture.whenStable()
                    .then(() => {
                        expect(element.querySelector('#radio-id')).toBeDefined();
                        expect(element.querySelector('#opt-1')).toBeDefined();
                        expect(element.querySelector('#radio-id-opt-1')).toBeDefined();
                        expect(element.querySelector('#opt-2')).toBeDefined();
                        expect(element.querySelector('#radio-id-opt-2')).toBeDefined();
                    });
            });
        });
    });

});
