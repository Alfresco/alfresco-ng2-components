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

import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { of } from 'rxjs';

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { formDefinitionDropdownField, formDefinitionTwoTextFields,
    formDefinitionRequiredField, FormService, setupTestBed,
    formDefVisibilitiFieldDependsOnNextOne, formDefVisibilitiFieldDependsOnPreviousOne,
    formReadonlyTwoTextFields } from '@alfresco/adf-core';
import { FormComponent } from './form.component';
import { ProcessTestingModule } from '../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';

/** Duration of the select opening animation. */
const SELECT_OPEN_ANIMATION = 200;

/** Duration of the select closing animation and the timeout interval for the backdrop. */
const SELECT_CLOSE_ANIMATION = 500;

describe('FormComponent UI and visibility', () => {
    let component: FormComponent;
    let service: FormService;
    let fixture: ComponentFixture<FormComponent>;

    function openSelect() {
        let trigger: HTMLElement;
        trigger = fixture.debugElement.query(By.css('[class="mat-select-trigger"]')).nativeElement;
        trigger.click();
        fixture.detectChanges();
    }

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
        service = TestBed.inject(FormService);
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    describe('Validation icon', () => {

        it('should display valid icon for valid form', () => {
            spyOn(service, 'getTask').and.returnValue(of({}));
            spyOn(service, 'getTaskForm').and.returnValue(of(formDefinitionTwoTextFields));

            const change = new SimpleChange(null, 1, true);
            component.ngOnChanges({ 'taskId': change });
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('#adf-valid-form-icon'))).toBeDefined();
            expect(fixture.debugElement.query(By.css('#adf-valid-form-icon'))).not.toBeNull();
            expect(fixture.debugElement.query(By.css('#adf-invalid-form-icon'))).toBeNull();
        });

        it('should display invalid icon for valid form', () => {
            spyOn(service, 'getTask').and.returnValue(of({}));
            spyOn(service, 'getTaskForm').and.returnValue(of(formDefinitionRequiredField));

            const change = new SimpleChange(null, 1, true);
            component.ngOnChanges({ 'taskId': change });
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('#adf-valid-form-icon'))).toBeNull();
            expect(fixture.debugElement.query(By.css('#adf-invalid-form-icon'))).toBeDefined();
            expect(fixture.debugElement.query(By.css('#adf-invalid-form-icon'))).not.toBeNull();
        });

        it('should NOT display validation icon when [showValidationIcon] is false', () => {
            spyOn(service, 'getTask').and.returnValue(of({}));
            spyOn(service, 'getTaskForm').and.returnValue(of(formDefinitionTwoTextFields));

            const change = new SimpleChange(null, 1, true);
            component.ngOnChanges({ 'taskId': change });
            component.showValidationIcon = false;
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('#adf-valid-form-icon'))).toBeNull();
            expect(fixture.debugElement.query(By.css('#adf-invalid-form-icon'))).toBeNull();
        });
    });

    describe('form definition', () => {

        it('should display two text fields form definition', () => {
            spyOn(service, 'getTask').and.returnValue(of({}));
            spyOn(service, 'getTaskForm').and.returnValue(of(formDefinitionTwoTextFields));

            const change = new SimpleChange(null, 1, true);
            component.ngOnChanges({ 'taskId': change });
            fixture.detectChanges();

            const firstNameEl = fixture.debugElement.query(By.css('#firstname'));
            expect(firstNameEl).not.toBeNull();
            expect(firstNameEl).toBeDefined();

            const lastNameEl = fixture.debugElement.query(By.css('#lastname'));
            expect(lastNameEl).not.toBeNull();
            expect(lastNameEl).toBeDefined();
        });

        it('should display dropdown field', fakeAsync(() => {
            spyOn(service, 'getTask').and.returnValue(of({}));
            spyOn(service, 'getTaskForm').and.returnValue(of(formDefinitionDropdownField));

            const change = new SimpleChange(null, 1, true);
            component.ngOnChanges({ 'taskId': change });
            fixture.detectChanges();

            openSelect();
            tick(SELECT_OPEN_ANIMATION);

            const dropdown = fixture.debugElement.queryAll(By.css('#country'));
            expect(dropdown).toBeDefined();
            expect(dropdown).not.toBeNull();
            const options = fixture.debugElement.queryAll(By.css('mat-option'));
            const optOne = options[1];
            const optTwo = options[2];
            const optThree = options[3];

            expect(optOne.nativeElement.innerText.trim()).toEqual('united kingdom');
            expect(optTwo.nativeElement.innerText.trim()).toEqual('italy');
            expect(optThree.nativeElement.innerText.trim()).toEqual('france');

            optTwo.nativeElement.click();
            fixture.detectChanges();
            expect(dropdown[0].nativeElement.innerText.trim()).toEqual('italy');
            tick(SELECT_CLOSE_ANIMATION);
        }));

        describe('Visibility conditions', () => {

            it('should hide the field based on the next one', () => {
                spyOn(service, 'getTask').and.returnValue(of({}));
                spyOn(service, 'getTaskForm').and.returnValue(of(formDefVisibilitiFieldDependsOnNextOne));

                const change = new SimpleChange(null, 1, true);
                component.ngOnChanges({ 'taskId': change });
                fixture.detectChanges();

                const firstEl = fixture.debugElement.query(By.css('#field-country-container'));
                expect(firstEl.nativeElement.hidden).toBeTruthy();

                const secondEl = fixture.debugElement.query(By.css('#name'));
                expect(secondEl).not.toBeNull();
                expect(secondEl).toBeDefined();
                expect(fixture.nativeElement.querySelector('#field-name-container').hidden).toBeFalsy();
            });

            it('should hide the field based on the previous one', () => {
                spyOn(service, 'getTask').and.returnValue(of({}));
                spyOn(service, 'getTaskForm').and.returnValue(of(formDefVisibilitiFieldDependsOnPreviousOne));

                const change = new SimpleChange(null, 1, true);
                component.ngOnChanges({ 'taskId': change });
                fixture.detectChanges();

                const firstEl = fixture.debugElement.query(By.css('#name'));
                expect(firstEl).not.toBeNull();
                expect(firstEl).toBeDefined();
                expect(fixture.nativeElement.querySelector('#field-name-container').hidden).toBeFalsy();

                const secondEl = fixture.debugElement.query(By.css('#field-country-container'));
                expect(secondEl.nativeElement.hidden).toBeTruthy();
            });

            it('should show the hidden field when the visibility condition change to true', () => {
                spyOn(service, 'getTask').and.returnValue(of({}));
                spyOn(service, 'getTaskForm').and.returnValue(of(formDefVisibilitiFieldDependsOnNextOne));

                const change = new SimpleChange(null, 1, true);
                component.ngOnChanges({ 'taskId': change });
                fixture.detectChanges();

                let firstEl = fixture.debugElement.query(By.css('#field-country-container'));
                expect(firstEl.nativeElement.hidden).toBeTruthy();

                const secondEl = fixture.debugElement.query(By.css('#field-name-container'));
                expect(secondEl.nativeElement.hidden).toBeFalsy();

                const inputElement = fixture.nativeElement.querySelector('#name');
                inputElement.value = 'italy';
                inputElement.dispatchEvent(new Event('input'));
                fixture.detectChanges();

                firstEl = fixture.debugElement.query(By.css('#field-country-container'));
                expect(firstEl.nativeElement.hidden).toBeFalsy();
            });
        });

        describe('Readonly Form', () => {
            it('should display two text fields readonly', () => {
                spyOn(service, 'getTask').and.returnValue(of({}));
                spyOn(service, 'getTaskForm').and.returnValue(of(formReadonlyTwoTextFields));

                const change = new SimpleChange(null, 1, true);
                component.ngOnChanges({ 'taskId': change });
                fixture.detectChanges();

                const firstNameEl = fixture.debugElement.query(By.css('#firstname'));
                expect(firstNameEl).not.toBeNull();
                expect(firstNameEl).toBeDefined();
                expect(firstNameEl.nativeElement.value).toEqual('fakeFirstName');

                const lastNameEl = fixture.debugElement.query(By.css('#lastname'));
                expect(lastNameEl).not.toBeNull();
                expect(lastNameEl).toBeDefined();
                expect(lastNameEl.nativeElement.value).toEqual('fakeLastName');
            });
        });
    });
});
