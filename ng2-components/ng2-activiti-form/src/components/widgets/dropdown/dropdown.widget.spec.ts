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
import { DropdownWidget } from './dropdown.widget';
import { FormModel } from './../core/form.model';
import { FormFieldModel } from './../core/form-field.model';
import { FormFieldOption } from './../core/form-field-option';
import { CoreModule } from 'ng2-alfresco-core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { EcmModelService } from '../../../services/ecm-model.service';
import { WidgetVisibilityService } from '../../../services/widget-visibility.service';

describe('DropdownWidget', () => {

    let formService: FormService;
    let widget: DropdownWidget;
    let visibilityService: WidgetVisibilityService;

    beforeEach(() => {
        formService = new FormService(null, null);
        visibilityService = new WidgetVisibilityService(null, null, null);
        widget = new DropdownWidget(formService, visibilityService);
        widget.field = new FormFieldModel(new FormModel());
    });

    it('should require field with restUrl', () => {
        spyOn(formService, 'getRestFieldValues').and.stub();

        widget.field = null;
        widget.ngOnInit();
        expect(formService.getRestFieldValues).not.toHaveBeenCalled();

        widget.field = new FormFieldModel(null, { restUrl: null });
        widget.ngOnInit();
        expect(formService.getRestFieldValues).not.toHaveBeenCalled();
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

        spyOn(formService, 'getRestFieldValues').and.returnValue(
            Observable.create(observer => {
                observer.next(null);
                observer.complete();
            })
        );
        widget.ngOnInit();
        expect(formService.getRestFieldValues).toHaveBeenCalledWith(taskId, fieldId);
    });

    it('should log error to console by default', () => {
        spyOn(console, 'error').and.stub();
        widget.handleError('Err');
        expect(console.error).toHaveBeenCalledWith('Err');
    });

    it('should preserve empty option when loading fields', () => {
        let restFieldValue: FormFieldOption = <FormFieldOption> { id: '1', name: 'Option1' };
        spyOn(formService, 'getRestFieldValues').and.returnValue(
            Observable.create(observer => {
                observer.next([restFieldValue]);
                observer.complete();
            })
        );

        let form = new FormModel({ taskId: '<id>' });
        let emptyOption: FormFieldOption = <FormFieldOption> { id: 'empty', name: 'Empty' };
        widget.field = new FormFieldModel(form, {
            id: '<id>',
            restUrl: '/some/url/address',
            hasEmptyValue: true,
            options: [emptyOption]
        });
        widget.ngOnInit();

        expect(formService.getRestFieldValues).toHaveBeenCalled();
        expect(widget.field.options.length).toBe(2);
        expect(widget.field.options[0]).toBe(emptyOption);
        expect(widget.field.options[1]).toBe(restFieldValue);
    });

    describe('when template is ready', () => {
        let dropDownWidget: DropdownWidget;
        let fixture: ComponentFixture<DropdownWidget>;
        let element: HTMLElement;
        let componentHandler;
        let stubFormService;
        let fakeOptionList: FormFieldOption[] = [{ id: 'opt_1', name: 'option_1' }, {
            id: 'opt_2',
            name: 'option_2'
        }, { id: 'opt_3', name: 'option_3' }];

        beforeEach(async(() => {
            componentHandler = jasmine.createSpyObj('componentHandler', ['upgradeAllRegistered', 'upgradeElement']);
            window['componentHandler'] = componentHandler;
            TestBed.configureTestingModule({
                imports: [CoreModule],
                declarations: [DropdownWidget],
                providers: [FormService, EcmModelService, WidgetVisibilityService]
            }).compileComponents().then(() => {
                fixture = TestBed.createComponent(DropdownWidget);
                dropDownWidget = fixture.componentInstance;
                element = fixture.nativeElement;
            });
        }));

        beforeEach(async(() => {
            stubFormService = fixture.debugElement.injector.get(FormService);
            visibilityService = fixture.debugElement.injector.get(WidgetVisibilityService);
            spyOn(visibilityService, 'refreshVisibility').and.stub();
            spyOn(stubFormService, 'getRestFieldValues').and.returnValue(Observable.of(fakeOptionList));
            dropDownWidget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                id: 'dropdown-id',
                name: 'date-name',
                type: 'dropdown',
                readOnly: 'false',
                restUrl: 'fake-rest-url'
            });
            dropDownWidget.field.isVisible = true;
            fixture.detectChanges();
        }));

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should show visible dropdown widget', async(() => {
            expect(element.querySelector('#dropdown-id')).toBeDefined();
            expect(element.querySelector('#dropdown-id')).not.toBeNull();
            expect(element.querySelector('#opt_1')).not.toBeNull();
            expect(element.querySelector('#opt_2')).not.toBeNull();
            expect(element.querySelector('#opt_3')).not.toBeNull();
        }));

        it('should select the default value', async(() => {
            dropDownWidget.field.value = 'option_2';
            fixture.detectChanges();
            fixture.whenStable()
                .then(() => {
                    let dropDownElement: HTMLSelectElement = <HTMLSelectElement> element.querySelector('#dropdown-id');
                    expect(dropDownElement).not.toBeNull();
                    expect(element.querySelector('#opt_2')).not.toBeNull();
                    expect(dropDownElement.value).toBe('option_2');
                });
        }));

        it('should be not visibile when isVisible is false', async(() => {
            dropDownWidget.field.isVisible = false;
            fixture.detectChanges();
            fixture.whenStable()
                .then(() => {
                    let dropDownElement: HTMLSelectElement = <HTMLSelectElement> element.querySelector('#dropdown-id');
                    expect(dropDownElement).toBeNull();
                });
        }));

    });
});
