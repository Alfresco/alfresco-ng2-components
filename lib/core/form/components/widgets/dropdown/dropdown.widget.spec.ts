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
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { FormService } from '../../../services/form.service';
import { WidgetVisibilityService } from '../../../services/widget-visibility.service';
import { FormFieldOption } from './../core/form-field-option';
import { FormFieldModel } from './../core/form-field.model';
import { FormModel } from './../core/form.model';
import { DropdownWidgetComponent } from './dropdown.widget';
import { setupTestBed } from '../../../../testing/setupTestBed';
import { CoreModule } from '../../../../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DropdownWidgetComponent', () => {

    let formService: FormService;
    let widget: DropdownWidgetComponent;
    let visibilityService: WidgetVisibilityService;
    let fixture: ComponentFixture<DropdownWidgetComponent>;
    let element: HTMLElement;

    function openSelect() {
        const dropdown = fixture.debugElement.query(By.css('[class="mat-select-trigger"]'));
        dropdown.triggerEventHandler('click', null);
        fixture.detectChanges();
    }

    const fakeOptionList: FormFieldOption[] = [
        { id: 'opt_1', name: 'option_1' },
        { id: 'opt_2', name: 'option_2' },
        { id: 'opt_3', name: 'option_3' }];

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ]
    });

    beforeEach(async(() => {
        fixture = TestBed.createComponent(DropdownWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
        formService = TestBed.get(FormService);
        visibilityService = TestBed.get(WidgetVisibilityService);
        widget.field = new FormFieldModel(new FormModel());
    }));

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

        const form = new FormModel({
            taskId: taskId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId,
            restUrl: '<url>'
        });

        spyOn(formService, 'getRestFieldValues').and.returnValue(
            new Observable((observer) => {
                observer.next(null);
                observer.complete();
            })
        );
        widget.ngOnInit();
        expect(formService.getRestFieldValues).toHaveBeenCalledWith(taskId, fieldId);
    });

    it('should preserve empty option when loading fields', () => {
        const restFieldValue: FormFieldOption = <FormFieldOption> { id: '1', name: 'Option1' };
        spyOn(formService, 'getRestFieldValues').and.callFake(() => {
            return new Observable((observer) => {
                observer.next([restFieldValue]);
                observer.complete();
            });
        });

        const form = new FormModel({ taskId: '<id>' });
        const emptyOption: FormFieldOption = <FormFieldOption> { id: 'empty', name: 'Empty' };
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

        describe('and dropdown is populated via taskId', () => {

            beforeEach(async(() => {
                spyOn(visibilityService, 'refreshVisibility').and.stub();
                spyOn(formService, 'getRestFieldValues').and.callFake(() => {
                    return of(fakeOptionList);
                });
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'dropdown-id',
                    name: 'date-name',
                    type: 'dropdown',
                    readOnly: 'false',
                    restUrl: 'fake-rest-url'
                });
                widget.field.emptyOption = { id: 'empty', name: 'Choose one...' };
                widget.field.isVisible = true;
                fixture.detectChanges();
            }));

            it('should show visible dropdown widget', async(() => {
                expect(element.querySelector('#dropdown-id')).toBeDefined();
                expect(element.querySelector('#dropdown-id')).not.toBeNull();

                openSelect();

                const optOne = fixture.debugElement.queryAll(By.css('[id="mat-option-1"]'));
                const optTwo = fixture.debugElement.queryAll(By.css('[id="mat-option-2"]'));
                const optThree = fixture.debugElement.queryAll(By.css('[id="mat-option-3"]'));

                expect(optOne).not.toBeNull();
                expect(optTwo).not.toBeNull();
                expect(optThree).not.toBeNull();
            }));

            it('should select the default value when an option is chosen as default', async(() => {
                widget.field.value = 'option_2';
                widget.ngOnInit();
                fixture.detectChanges();
                fixture.whenStable()
                    .then(() => {
                        const dropDownElement: any = element.querySelector('#dropdown-id');
                        expect(dropDownElement.attributes['ng-reflect-model'].value).toBe('option_2');
                        expect(dropDownElement.attributes['ng-reflect-model'].textContent).toBe('option_2');
                    });
            }));

            it('should select the empty value when no default is chosen', async(() => {
                widget.field.value = 'empty';
                widget.ngOnInit();
                fixture.detectChanges();

                openSelect();

                fixture.detectChanges();

                fixture.whenStable()
                    .then(() => {
                        const dropDownElement: any = element.querySelector('#dropdown-id');
                        expect(dropDownElement.attributes['ng-reflect-model'].value).toBe('empty');
                    });
            }));

        });

        describe('and dropdown is populated via processDefinitionId', () => {

            beforeEach(async(() => {
                spyOn(visibilityService, 'refreshVisibility').and.stub();
                spyOn(formService, 'getRestFieldValuesByProcessId').and.callFake(() => {
                    return of(fakeOptionList);
                });
                widget.field = new FormFieldModel(new FormModel({ processDefinitionId: 'fake-process-id' }), {
                    id: 'dropdown-id',
                    name: 'date-name',
                    type: 'dropdown',
                    readOnly: 'false',
                    restUrl: 'fake-rest-url'
                });
                widget.field.emptyOption = { id: 'empty', name: 'Choose one...' };
                widget.field.isVisible = true;
                fixture.detectChanges();
            }));

            it('should show visible dropdown widget', async(() => {
                expect(element.querySelector('#dropdown-id')).toBeDefined();
                expect(element.querySelector('#dropdown-id')).not.toBeNull();

                openSelect();

                const optOne = fixture.debugElement.queryAll(By.css('[id="mat-option-1"]'));
                const optTwo = fixture.debugElement.queryAll(By.css('[id="mat-option-2"]'));
                const optThree = fixture.debugElement.queryAll(By.css('[id="mat-option-3"]'));

                expect(optOne).not.toBeNull();
                expect(optTwo).not.toBeNull();
                expect(optThree).not.toBeNull();
            }));

            it('should select the default value when an option is chosen as default', async(() => {
                widget.field.value = 'option_2';
                widget.ngOnInit();
                fixture.detectChanges();
                fixture.whenStable()
                    .then(() => {
                        const dropDownElement: any = element.querySelector('#dropdown-id');
                        expect(dropDownElement.attributes['ng-reflect-model'].value).toBe('option_2');
                        expect(dropDownElement.attributes['ng-reflect-model'].textContent).toBe('option_2');
                    });
            }));

            it('should select the empty value when no default is chosen', async(() => {
                widget.field.value = 'empty';
                widget.ngOnInit();
                fixture.detectChanges();

                openSelect();

                fixture.detectChanges();

                fixture.whenStable()
                    .then(() => {
                        const dropDownElement: any = element.querySelector('#dropdown-id');
                        expect(dropDownElement.attributes['ng-reflect-model'].value).toBe('empty');
                    });
            }));

            it('should be disabled when the field is readonly', async(() => {
                widget.field = new FormFieldModel(new FormModel({ processDefinitionId: 'fake-process-id' }), {
                    id: 'dropdown-id',
                    name: 'date-name',
                    type: 'dropdown',
                    readOnly: 'true',
                    restUrl: 'fake-rest-url'
                });

                fixture.detectChanges();
                fixture.whenStable()
                    .then(() => {
                        const dropDownElement: HTMLSelectElement = <HTMLSelectElement> element.querySelector('#dropdown-id');
                        expect(dropDownElement).not.toBeNull();
                        expect(dropDownElement.getAttribute('aria-disabled')).toBe('true');
                    });
            }));

            it('should show the option value when the field is readonly', async(() => {
                widget.field = new FormFieldModel(new FormModel({ processDefinitionId: 'fake-process-id' }), {
                    id: 'dropdown-id',
                    name: 'date-name',
                    type: 'readonly',
                    value: 'FakeValue',
                    readOnly: true,
                    params: { field: { name: 'date-name', type: 'dropdown' } }
                });

                openSelect();

                fixture.whenStable()
                    .then(() => {
                        fixture.detectChanges();
                        expect(element.querySelector('#dropdown-id')).not.toBeNull();
                        const option = fixture.debugElement.query(By.css('.mat-option')).nativeElement;
                        expect(option.innerText.trim()).toEqual('FakeValue');
                    });
            }));
        });
    });
});
