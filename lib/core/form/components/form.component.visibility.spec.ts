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

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SimpleChange } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FormModule } from '../../index';
import { formDefinitionDropdownField, formDefinitionTwoTextFields } from '../../mock';
import { formReadonlyTwoTextFields } from '../../mock';
import { formDefVisibilitiFieldDependsOnNextOne, formDefVisibilitiFieldDependsOnPreviousOne } from '../../mock';
import { FormService } from './../services/form.service';
import { FormComponent } from './form.component';

/** Duration of the select opening animation. */
const SELECT_OPEN_ANIMATION = 200;

/** Duration of the select closing animation and the timeout interval for the backdrop. */
const SELECT_CLOSE_ANIMATION = 500;

describe('FormComponent UI and visibiltiy', () => {
    let component: FormComponent;
    let service: FormService;
    let fixture: ComponentFixture<FormComponent>;

    function openSelect() {
        let trigger: HTMLElement;
        trigger = fixture.debugElement.query(By.css('[class="mat-select-trigger"]')).nativeElement;
        trigger.click();
        fixture.detectChanges();
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormModule
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormComponent);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(FormService);
    });

    it('should create instance of FormComponent', () => {
        expect(fixture.componentInstance instanceof FormComponent).toBe(true, 'should create FormComponent');
    });

    describe('form definition', () => {

        it('should display two text fields form definition', () => {
            spyOn(service, 'getTask').and.returnValue(Observable.of({}));
            spyOn(service, 'getTaskForm').and.returnValue(Observable.of(formDefinitionTwoTextFields));

            let change = new SimpleChange(null, 1, true);
            component.ngOnChanges({ 'taskId': change });
            fixture.detectChanges();

            let firstNameEl = fixture.debugElement.query(By.css('#firstname'));
            expect(firstNameEl).not.toBeNull();
            expect(firstNameEl).toBeDefined();

            let lastNameEl = fixture.debugElement.query(By.css('#lastname'));
            expect(lastNameEl).not.toBeNull();
            expect(lastNameEl).toBeDefined();
        });

        it('should display dropdown field', fakeAsync(() => {
            spyOn(service, 'getTask').and.returnValue(Observable.of({}));
            spyOn(service, 'getTaskForm').and.returnValue(Observable.of(formDefinitionDropdownField));

            let change = new SimpleChange(null, 1, true);
            component.ngOnChanges({ 'taskId': change });
            fixture.detectChanges();

            openSelect();
            tick(SELECT_OPEN_ANIMATION);

            const dropdown = fixture.debugElement.queryAll(By.css('#country'));
            expect(dropdown).toBeDefined();
            expect(dropdown).not.toBeNull();

            const optOne = fixture.debugElement.queryAll(By.css('[id="mat-option-1"]'));
            const optTwo = fixture.debugElement.queryAll(By.css('[id="mat-option-2"]'));
            const optThree = fixture.debugElement.queryAll(By.css('[id="mat-option-3"]'));

            expect(optOne[0].nativeElement.innerText.trim()).toEqual('united kingdom');
            expect(optTwo[0].nativeElement.innerText.trim()).toEqual('italy');
            expect(optThree[0].nativeElement.innerText.trim()).toEqual('france');

            optTwo[0].nativeElement.click();
            fixture.detectChanges();
            expect(dropdown[0].nativeElement.innerText.trim()).toEqual('italy');
            tick(SELECT_CLOSE_ANIMATION);
        }));

        describe('Visibility conditions', () => {

            it('should hide the field based on the next one', () => {
                spyOn(service, 'getTask').and.returnValue(Observable.of({}));
                spyOn(service, 'getTaskForm').and.returnValue(Observable.of(formDefVisibilitiFieldDependsOnNextOne));

                let change = new SimpleChange(null, 1, true);
                component.ngOnChanges({ 'taskId': change });
                fixture.detectChanges();

                let firstEl = fixture.debugElement.query(By.css('#country'));
                expect(firstEl).toBeNull();

                let secondEl = fixture.debugElement.query(By.css('#name'));
                expect(secondEl).not.toBeNull();
                expect(secondEl).toBeDefined();
            });

            it('should hide the field based on the previous one', () => {
                spyOn(service, 'getTask').and.returnValue(Observable.of({}));
                spyOn(service, 'getTaskForm').and.returnValue(Observable.of(formDefVisibilitiFieldDependsOnPreviousOne));

                let change = new SimpleChange(null, 1, true);
                component.ngOnChanges({ 'taskId': change });
                fixture.detectChanges();

                let firstEl = fixture.debugElement.query(By.css('#name'));
                expect(firstEl).not.toBeNull();
                expect(firstEl).toBeDefined();

                let secondEl = fixture.debugElement.query(By.css('#country'));
                expect(secondEl).toBeNull();
            });

            it('should show the hidden field when the visibility condition change to true', () => {
                spyOn(service, 'getTask').and.returnValue(Observable.of({}));
                spyOn(service, 'getTaskForm').and.returnValue(Observable.of(formDefVisibilitiFieldDependsOnNextOne));

                let change = new SimpleChange(null, 1, true);
                component.ngOnChanges({ 'taskId': change });
                fixture.detectChanges();

                let firstEl = fixture.debugElement.query(By.css('#country'));
                expect(firstEl).toBeNull();

                const secondEl = fixture.debugElement.query(By.css('#name'));
                expect(secondEl).not.toBeNull();

                let el = secondEl.nativeElement;

                el.value = 'italy';
                el.dispatchEvent(new Event('input'));
                fixture.detectChanges();

                firstEl = fixture.debugElement.query(By.css('#country'));
                expect(firstEl).not.toBeNull();
            });
        });

        describe('Readonly Form', () => {
            it('should display two text fields readonly', () => {
                spyOn(service, 'getTask').and.returnValue(Observable.of({}));
                spyOn(service, 'getTaskForm').and.returnValue(Observable.of(formReadonlyTwoTextFields));

                let change = new SimpleChange(null, 1, true);
                component.ngOnChanges({ 'taskId': change });
                fixture.detectChanges();

                let firstNameEl = fixture.debugElement.query(By.css('#firstname'));
                expect(firstNameEl).not.toBeNull();
                expect(firstNameEl).toBeDefined();
                expect(firstNameEl.nativeElement.value).toEqual('fakeFirstName');

                let lastNameEl = fixture.debugElement.query(By.css('#lastname'));
                expect(lastNameEl).not.toBeNull();
                expect(lastNameEl).toBeDefined();
                expect(lastNameEl.nativeElement.value).toEqual('fakeLastName');
            });
        });
    });
});
