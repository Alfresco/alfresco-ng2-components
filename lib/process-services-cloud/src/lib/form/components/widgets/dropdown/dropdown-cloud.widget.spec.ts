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
import { of } from 'rxjs';
import { DropdownCloudWidgetComponent } from './dropdown-cloud.widget';
import {
    FormService,
    WidgetVisibilityService,
    FormFieldOption,
    setupTestBed,
    FormFieldModel,
    FormModel
} from '@alfresco/adf-core';
import { FormCloudService } from '../../../services/form-cloud.service';
import { ProcessServiceCloudTestingModule } from '../../../../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('DropdownCloudWidgetComponent', () => {

    let formService: FormService;
    let widget: DropdownCloudWidgetComponent;
    let visibilityService: WidgetVisibilityService;
    let formCloudService: FormCloudService;
    let fixture: ComponentFixture<DropdownCloudWidgetComponent>;
    let element: HTMLElement;

    function openSelect(_selector?: string) {
        const dropdown: any = element.querySelector('.mat-select-trigger');
        dropdown.click();
        fixture.detectChanges();
    }

    const fakeOptionList: FormFieldOption[] = [
        { id: 'opt_1', name: 'option_1' },
        { id: 'opt_2', name: 'option_2' },
        { id: 'opt_3', name: 'option_3' }];

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ]
    });

    beforeEach(async(() => {
        fixture = TestBed.createComponent(DropdownCloudWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;

        formService = TestBed.inject(FormService);
        visibilityService = TestBed.inject(WidgetVisibilityService);
        formCloudService = TestBed.inject(FormCloudService);

        widget.field = new FormFieldModel(new FormModel());
    }));

    afterEach(() => fixture.destroy());

    it('should require field with restUrl', async(() => {
        spyOn(formService, 'getRestFieldValues').and.stub();

        widget.field = null;
        widget.ngOnInit();
        expect(formService.getRestFieldValues).not.toHaveBeenCalled();

        widget.field = new FormFieldModel(null, { restUrl: null });
        widget.ngOnInit();
        expect(formService.getRestFieldValues).not.toHaveBeenCalled();
    }));

    describe('when template is ready', () => {

        describe('and dropdown is populated', () => {

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

                openSelect('#dropdown-id');

                fixture.detectChanges();

                fixture.whenStable()
                    .then(() => {
                        const dropDownElement: any = element.querySelector('#dropdown-id');
                        expect(dropDownElement.attributes['ng-reflect-model'].value).toBe('empty');
                    });
            }));

            it('should load data from restUrl and populate options', async(() => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'dropdown-id',
                    name: 'date-name',
                    type: 'dropdown-cloud',
                    readOnly: 'true',
                    restUrl: 'fake-rest-url',
                    optionType: 'rest',
                    restIdProperty: 'name'
                });
                const jsonDataSpy = spyOn(formCloudService, 'getDropDownJsonData').and.returnValue(of(fakeOptionList));
                const optOne = fixture.debugElement.queryAll(By.css('[id="mat-option-1"]'));
                widget.ngOnInit();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(jsonDataSpy).toHaveBeenCalled();
                    expect(optOne).not.toBeNull();
                });
            }));

            it('should preselect dropdown widget value when Json (rest call) passed', (done) => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'dropdown-id',
                    name: 'date-name',
                    type: 'dropdown-cloud',
                    readOnly: 'false',
                    restUrl: 'fake-rest-url',
                    optionType: 'rest',
                    value: {
                        id: 'opt1',
                        name: 'defaul_value'
                    }
                });

                spyOn(formCloudService, 'getDropDownJsonData').and.returnValue(of([
                    {
                        id: 'opt1',
                        name: 'default1_value'
                    },
                    {
                        id: 2,
                        name: 'default2_value'
                    }
                ]));

                widget.ngOnInit();
                fixture.detectChanges();

                openSelect();
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    const options = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                    expect(options[0].nativeElement.innerText).toBe('default1_value');
                    done();
                });
            });

            it('should preselect dropdown widget value when String (defined value) passed ', (done) => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'dropdown-id',
                    name: 'date-name',
                    type: 'dropdown-cloud',
                    readOnly: 'false',
                    restUrl: 'fake-rest-url',
                    optionType: 'rest',
                    value: 'opt1'
                });

                spyOn(formCloudService, 'getDropDownJsonData').and.returnValue(of([
                    {
                        id: 'opt1',
                        name: 'default1_value'
                    },
                    {
                        id: 2,
                        name: 'default2_value'
                    }
                ]));

                widget.ngOnInit();
                fixture.detectChanges();

                openSelect();
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    const options = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                    expect(options[0].nativeElement.innerText).toBe('default1_value');
                    done();
                });
            });

            it('should map properties if restResponsePath is set', (done) => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'dropdown-id',
                    name: 'date-name',
                    type: 'dropdown-cloud',
                    readOnly: 'false',
                    restUrl: 'fake-rest-url',
                    optionType: 'rest',
                    restResponsePath: 'path'
                });

                const dropdownSpy = spyOn(formCloudService, 'getDropDownJsonData').and.returnValue(of({
                    id: 1,
                    path: [
                        { id: 'opt_1', name: 'option_1' },
                        { id: 'opt_2', name: 'option_2' },
                        { id: 'opt_3', name: 'option_3' }],
                    name: ''
                }));

                widget.ngOnInit();
                fixture.detectChanges();

                openSelect('#dropdown-id');

                fixture.whenStable().then(() => {
                    expect(dropdownSpy).toHaveBeenCalled();

                    const optOne: any = fixture.debugElement.queryAll(By.css('[id="opt_1"]'));
                    expect(optOne[0].context.value).toBe('opt_1');
                    expect(optOne[0].context.viewValue).toBe('option_1');
                    const optTwo: any = fixture.debugElement.queryAll(By.css('[id="opt_2"]'));
                    expect(optTwo[0].context.value).toBe('opt_2');
                    expect(optTwo[0].context.viewValue).toBe('option_2');
                    const optThree: any = fixture.debugElement.queryAll(By.css('[id="opt_3"]'));
                    expect(optThree[0].context.value).toBe('opt_3');
                    expect(optThree[0].context.viewValue).toBe('option_3');
                    done();
                });
            });

            it('should map correct label if restLabelProperty is set', (done) => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'dropdown-id',
                    name: 'date-name',
                    type: 'dropdown-cloud',
                    readOnly: 'false',
                    restUrl: 'fake-rest-url',
                    optionType: 'rest',
                    restResponsePath: 'path',
                    restLabelProperty: 'first_name'
                });

                const dropdownSpy = spyOn(formCloudService, 'getDropDownJsonData').and.returnValue(of({
                    id: 1,
                    path: [
                        { id: 'opt_1', first_name: 'option_1' },
                        { id: 'opt_2', first_name: 'option_2' },
                        { id: 'opt_3', first_name: 'option_3' }],
                    name: ''
                }));

                widget.ngOnInit();
                fixture.detectChanges();

                openSelect('#dropdown-id');

                fixture.whenStable().then(() => {
                    expect(dropdownSpy).toHaveBeenCalled();

                    const optOne: any = fixture.debugElement.queryAll(By.css('[id="opt_1"]'));
                    expect(optOne[0].context.value).toBe('opt_1');
                    expect(optOne[0].context.viewValue).toBe('option_1');
                    const optTwo: any = fixture.debugElement.queryAll(By.css('[id="opt_2"]'));
                    expect(optTwo[0].context.value).toBe('opt_2');
                    expect(optTwo[0].context.viewValue).toBe('option_2');
                    const optThree: any = fixture.debugElement.queryAll(By.css('[id="opt_3"]'));
                    expect(optThree[0].context.value).toBe('opt_3');
                    expect(optThree[0].context.viewValue).toBe('option_3');
                    done();
                });
            });

            it('should map correct id if restIdProperty is set', (done) => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'dropdown-id',
                    name: 'date-name',
                    type: 'dropdown-cloud',
                    readOnly: 'false',
                    restUrl: 'fake-rest-url',
                    optionType: 'rest',
                    restResponsePath: 'path',
                    restIdProperty: 'my_id'
                });

                const dropdownSpy = spyOn(formCloudService, 'getDropDownJsonData').and.returnValue(of({
                    id: 1,
                    path: [
                        { my_id: 'opt_1', name: 'option_1' },
                        { my_id: 'opt_2', name: 'option_2' },
                        { my_id: 'opt_3', name: 'option_3' }],
                    name: ''
                }));

                widget.ngOnInit();
                fixture.detectChanges();

                openSelect('#dropdown-id');

                fixture.whenStable().then(() => {
                    expect(dropdownSpy).toHaveBeenCalled();

                    const optOne: any = fixture.debugElement.queryAll(By.css('[id="opt_1"]'));
                    expect(optOne[0].context.value).toBe('opt_1');
                    expect(optOne[0].context.viewValue).toBe('option_1');
                    const optTwo: any = fixture.debugElement.queryAll(By.css('[id="opt_2"]'));
                    expect(optTwo[0].context.value).toBe('opt_2');
                    expect(optTwo[0].context.viewValue).toBe('option_2');
                    const optThree: any = fixture.debugElement.queryAll(By.css('[id="opt_3"]'));
                    expect(optThree[0].context.value).toBe('opt_3');
                    expect(optThree[0].context.viewValue).toBe('option_3');
                    done();
                });
            });

        });
    });
});
