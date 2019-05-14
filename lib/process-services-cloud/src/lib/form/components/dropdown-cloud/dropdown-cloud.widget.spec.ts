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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownCloudWidgetComponent } from './dropdown-cloud.widget';
import { FormService, WidgetVisibilityService, FormFieldOption, setupTestBed, FormFieldModel, FormModel, CoreModule } from '@alfresco/adf-core';
import { FormCloudService } from '../../services/form-cloud.service';

describe('DropdownCloudWidgetComponent', () => {

    let formService: FormService;
    let widget: DropdownCloudWidgetComponent;
    let visibilityService: WidgetVisibilityService;
    let formCloudService: FormCloudService;
    let fixture: ComponentFixture<DropdownCloudWidgetComponent>;
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
        ],
        declarations: [DropdownCloudWidgetComponent],
        providers: [FormCloudService]
    });

    beforeEach(async(() => {
        fixture = TestBed.createComponent(DropdownCloudWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
        formService = TestBed.get(FormService);
        visibilityService = TestBed.get(WidgetVisibilityService);
        formCloudService = TestBed.get(FormCloudService);

        widget.field = new FormFieldModel(new FormModel());
    }));

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

            it('shoud map properties if restResponsePath is set', async(() => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'dropdown-id',
                    name: 'date-name',
                    type: 'dropdown-cloud',
                    readOnly: 'true',
                    restUrl: 'fake-rest-url',
                    optionType: 'rest',
                    restResponsePath: 'path',
                    restIdProperty: 'name'
                });

                spyOn(formCloudService, 'getDropDownJsonData').and.returnValue(of([{
                    id: 1,
                    path: {
                        name: 'test1'
                    }
                }]));
                spyOn(widget, 'mapJsonData').and.returnValue([]);

                widget.ngOnInit();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(widget.mapJsonData).toHaveBeenCalled();
                });
            }));

        });
    });
});
