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

import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
    formDefinitionDropdownField, formDefinitionTwoTextFields,
    formDefinitionRequiredField, setupTestBed,
    formDefVisibilitiFieldDependsOnNextOne, formDefVisibilitiFieldDependsOnPreviousOne,
    formReadonlyTwoTextFields
} from '@alfresco/adf-core';
import { FormComponent } from './form.component';
import { ProcessTestingModule } from '../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { TaskService } from './services/task.service';
import { TaskFormService } from './services/task-form.service';
import { TaskRepresentation } from '@alfresco/js-api';

describe('FormComponent UI and visibility', () => {
    let component: FormComponent;
    let taskService: TaskService;
    let taskFormService: TaskFormService;
    let fixture: ComponentFixture<FormComponent>;

    const openSelect = () => {
        const dropdown = fixture.debugElement.nativeElement.querySelector('.mat-select-trigger');
        dropdown.click();
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormComponent);
        component = fixture.componentInstance;
        taskService = TestBed.inject(TaskService);
        taskFormService = TestBed.inject(TaskFormService);
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Validation icon', () => {

        it('should display valid icon for valid form', () => {
            spyOn(taskService, 'getTask').and.returnValue(of(<TaskRepresentation>{}));
            spyOn(taskFormService, 'getTaskForm').and.returnValue(of(formDefinitionTwoTextFields));

            const change = new SimpleChange(null, 1, true);
            component.ngOnChanges({taskId: change});
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('#adf-valid-form-icon'))).toBeDefined();
            expect(fixture.debugElement.query(By.css('#adf-valid-form-icon'))).not.toBeNull();
            expect(fixture.debugElement.query(By.css('#adf-invalid-form-icon'))).toBeNull();
        });

        it('should display invalid icon for valid form', () => {
            spyOn(taskService, 'getTask').and.returnValue(of(<TaskRepresentation>{}));
            spyOn(taskFormService, 'getTaskForm').and.returnValue(of(formDefinitionRequiredField));

            const change = new SimpleChange(null, 1, true);
            component.ngOnChanges({taskId: change});
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('#adf-valid-form-icon'))).toBeNull();
            expect(fixture.debugElement.query(By.css('#adf-invalid-form-icon'))).toBeDefined();
            expect(fixture.debugElement.query(By.css('#adf-invalid-form-icon'))).not.toBeNull();
        });

        it('should NOT display validation icon when [showValidationIcon] is false', () => {
            spyOn(taskService, 'getTask').and.returnValue(of(<TaskRepresentation>{}));
            spyOn(taskFormService, 'getTaskForm').and.returnValue(of(formDefinitionTwoTextFields));

            const change = new SimpleChange(null, 1, true);
            component.ngOnChanges({taskId: change});
            component.showValidationIcon = false;
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('#adf-valid-form-icon'))).toBeNull();
            expect(fixture.debugElement.query(By.css('#adf-invalid-form-icon'))).toBeNull();
        });
    });

    describe('form definition', () => {

        it('should display two text fields form definition', () => {
            spyOn(taskService, 'getTask').and.returnValue(of(<TaskRepresentation>{}));
            spyOn(taskFormService, 'getTaskForm').and.returnValue(of(formDefinitionTwoTextFields));

            const change = new SimpleChange(null, 1, true);
            component.ngOnChanges({taskId: change});
            fixture.detectChanges();

            const firstNameEl = fixture.debugElement.query(By.css('#firstname'));
            expect(firstNameEl).not.toBeNull();
            expect(firstNameEl).toBeDefined();

            const lastNameEl = fixture.debugElement.query(By.css('#lastname'));
            expect(lastNameEl).not.toBeNull();
            expect(lastNameEl).toBeDefined();
        });

        it('should display dropdown field', async () => {
            spyOn(taskService, 'getTask').and.returnValue(of(<TaskRepresentation>{}));
            spyOn(taskFormService, 'getTaskForm').and.returnValue(of(formDefinitionDropdownField));

            const change = new SimpleChange(null, 1, true);
            component.ngOnChanges({taskId: change});
            fixture.detectChanges();
            await fixture.whenStable();

            openSelect();
            fixture.detectChanges();
            await fixture.whenStable();

            const options = fixture.debugElement.queryAll(By.css('.mat-option-text'));

            const optOne = options[1];
            const optTwo = options[2];
            const optThree = options[3];

            expect(optOne.nativeElement.innerText.trim()).toEqual('united kingdom');
            expect(optTwo.nativeElement.innerText.trim()).toEqual('italy');
            expect(optThree.nativeElement.innerText.trim()).toEqual('france');

            optTwo.nativeElement.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const dropdown = fixture.debugElement.queryAll(By.css('#country'));
            expect(dropdown[0].nativeElement.innerText.trim()).toEqual('italy');
        });

        describe('Visibility conditions', () => {

            it('should hide the field based on the next one', () => {
                spyOn(taskService, 'getTask').and.returnValue(of(<TaskRepresentation>{}));
                spyOn(taskFormService, 'getTaskForm').and.returnValue(of(formDefVisibilitiFieldDependsOnNextOne));

                const change = new SimpleChange(null, 1, true);
                component.ngOnChanges({taskId: change});
                fixture.detectChanges();

                const firstEl = fixture.debugElement.query(By.css('#field-country-container'));
                expect(firstEl.nativeElement.style.visibility).toBe('hidden');

                const secondEl = fixture.debugElement.query(By.css('#name'));
                expect(secondEl).not.toBeNull();
                expect(secondEl).toBeDefined();
                expect(fixture.nativeElement.querySelector('#field-name-container').style.visibility).not.toBe('hidden');
            });

            it('should hide the field based on the previous one', () => {
                spyOn(taskService, 'getTask').and.returnValue(of(<TaskRepresentation>{}));
                spyOn(taskFormService, 'getTaskForm').and.returnValue(of(formDefVisibilitiFieldDependsOnPreviousOne));

                const change = new SimpleChange(null, 1, true);
                component.ngOnChanges({taskId: change});
                fixture.detectChanges();

                const firstEl = fixture.debugElement.query(By.css('#name'));
                expect(firstEl).not.toBeNull();
                expect(firstEl).toBeDefined();
                expect(fixture.nativeElement.querySelector('#field-name-container').style.visibility).not.toBe('hidden');

                const secondEl = fixture.debugElement.query(By.css('#field-country-container'));
                expect(secondEl.nativeElement.style.visibility).toBe('hidden');
            });

            it('should show the hidden field when the visibility condition change to true', () => {
                spyOn(taskService, 'getTask').and.returnValue(of(<TaskRepresentation>{}));
                spyOn(taskFormService, 'getTaskForm').and.returnValue(of(formDefVisibilitiFieldDependsOnNextOne));

                const change = new SimpleChange(null, 1, true);
                component.ngOnChanges({taskId: change});
                fixture.detectChanges();

                let firstEl = fixture.debugElement.query(By.css('#field-country-container'));
                expect(firstEl.nativeElement.style.visibility).toBe('hidden');

                const secondEl = fixture.debugElement.query(By.css('#field-name-container'));
                expect(secondEl.nativeElement.style.visibility).not.toBe('hidden');

                const inputElement = fixture.nativeElement.querySelector('#name');
                inputElement.value = 'italy';
                inputElement.dispatchEvent(new Event('input'));
                fixture.detectChanges();

                firstEl = fixture.debugElement.query(By.css('#field-country-container'));
                expect(firstEl.nativeElement.style.visibility).not.toBe('hidden');
            });
        });

        describe('Readonly Form', () => {
            it('should display two text fields readonly', async () => {
                spyOn(taskService, 'getTask').and.returnValue(of(<TaskRepresentation>{}));
                spyOn(taskFormService, 'getTaskForm').and.returnValue(of(formReadonlyTwoTextFields));

                const change = new SimpleChange(null, 1, true);
                component.ngOnChanges({taskId: change});

                fixture.detectChanges();
                await fixture.whenStable();

                const firstNameEl = fixture.debugElement.query(By.css('#firstname'));
                expect(firstNameEl.nativeElement.value).toEqual('fakeFirstName');

                const lastNameEl = fixture.debugElement.query(By.css('#lastname'));
                expect(lastNameEl.nativeElement.value).toEqual('fakeLastName');
            });
        });
    });
});
