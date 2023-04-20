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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
    FormFieldTypes,
    FormFieldModel,
    FormModel,
    setupTestBed,
    CoreTestingModule
} from '@alfresco/adf-core';
import { Observable, of } from 'rxjs';
import { PeopleWidgetComponent } from './people.widget';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { PeopleProcessService } from '../../../common/services/people-process.service';
import { UserProcessModel } from '../../../common/models/user-process.model';

describe('PeopleWidgetComponent', () => {

    let widget: PeopleWidgetComponent;
    let fixture: ComponentFixture<PeopleWidgetComponent>;
    let element: HTMLElement;
    let translationService: TranslateService;
    let peopleProcessService: PeopleProcessService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PeopleWidgetComponent);
        peopleProcessService = TestBed.inject(PeopleProcessService);

        translationService = TestBed.inject(TranslateService);
        spyOn(translationService, 'instant').and.callFake((key) => key);
        spyOn(translationService, 'get').and.callFake((key) => of(key));

        element = fixture.nativeElement;
        widget = fixture.componentInstance;
        widget.field = new FormFieldModel(new FormModel());
        fixture.detectChanges();
    });

    it('should return empty display name for missing model', () => {
        expect(widget.getDisplayName(null)).toBe('');
    });

    it('should return full name for a given model', () => {
        const model = new UserProcessModel({
            firstName: 'John',
            lastName: 'Doe'
        });
        expect(widget.getDisplayName(model)).toBe('John Doe');
    });

    it('should skip first name for display name', () => {
        const model = new UserProcessModel({firstName: null, lastName: 'Doe'});
        expect(widget.getDisplayName(model)).toBe('Doe');
    });

    it('should skip last name for display name', () => {
        const model = new UserProcessModel({firstName: 'John', lastName: null});
        expect(widget.getDisplayName(model)).toBe('John');
    });

    it('should init value from the field', async () => {
        widget.field.value = new UserProcessModel({
            id: 'people-id',
            firstName: 'John',
            lastName: 'Doe'
        });

        spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(of(null));

        widget.ngOnInit();
        fixture.detectChanges();
        await fixture.whenStable();

        expect((element.querySelector('input') as HTMLInputElement).value).toBe('John Doe');
    });

    it('should show the readonly value when the form is readonly', async () => {
        widget.field.value = new UserProcessModel({
            id: 'people-id',
            firstName: 'John',
            lastName: 'Doe'
        });
        widget.field.readOnly = true;
        widget.field.form.readOnly = true;

        spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(of(null));

        widget.ngOnInit();
        fixture.detectChanges();
        await fixture.whenStable();

        expect((element.querySelector('input') as HTMLInputElement).value).toBe('John Doe');
        expect((element.querySelector('input') as HTMLInputElement).disabled).toBeTruthy();
    });

    it('should require form field to setup values on init', () => {
        widget.field.value = null;
        widget.ngOnInit();
        fixture.detectChanges();
        const input = widget.input;
        expect(input.nativeElement.value).toBe('');
        expect(widget.groupId).toBeUndefined();
    });

    it('should setup group restriction', () => {
        widget.ngOnInit();
        expect(widget.groupId).toBeUndefined();

        widget.field.params = {restrictWithGroup: {id: '<id>'}};
        widget.ngOnInit();
        expect(widget.groupId).toBe('<id>');
    });

    it('should display involved user in task form', async () => {
        spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(
            new Observable((observer) => {
                observer.next(null);
                observer.complete();
            })
        );

        widget.field.value = new UserProcessModel({
            id: 'people-id',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@test.com'
        });
        widget.ngOnInit();

        const involvedUser = fixture.debugElement.nativeElement.querySelector('input[data-automation-id="adf-people-search-input"]');

        fixture.detectChanges();
        await fixture.whenStable();

        expect(involvedUser.value).toBe('John Doe');
    });

    describe('when is required', () => {

        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({taskId: '<id>'}), {
                type: FormFieldTypes.PEOPLE,
                required: true
            });
        });

        it('should be marked as invalid after interaction', async () => {
            const peopleInput = fixture.nativeElement.querySelector('input');
            expect(fixture.nativeElement.querySelector('.adf-invalid')).toBeFalsy();

            peopleInput.dispatchEvent(new Event('blur'));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(fixture.nativeElement.querySelector('.adf-invalid')).toBeTruthy();
        });

        it('should be able to display label with asterisk', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const asterisk: HTMLElement = element.querySelector('.adf-asterisk');

            expect(asterisk).toBeTruthy();
            expect(asterisk.textContent).toEqual('*');
        });
    });

    describe('when template is ready', () => {

        const fakeUserResult = [
            {id: 1001, firstName: 'Test01', lastName: 'Test01', email: 'test'},
            {id: 1002, firstName: 'Test02', lastName: 'Test02', email: 'test2'}];

        beforeEach(() => {
            spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(new Observable((observer) => {
                observer.next(fakeUserResult);
                observer.complete();
            }));
            widget.field = new FormFieldModel(new FormModel({taskId: 'fake-task-id'}), {
                id: 'people-id',
                name: 'people-name',
                type: FormFieldTypes.PEOPLE,
                readOnly: false
            });
            fixture.detectChanges();
            element = fixture.nativeElement;
        });

        afterEach(() => {
            fixture.destroy();
        });

        afterAll(() => {
            TestBed.resetTestingModule();
        });

        it('should render the people component', () => {
            expect(element.querySelector('#people-widget-content')).not.toBeNull();
        });

        it('should show an error message if the user is invalid', async () => {
            const peopleHTMLElement = element.querySelector<HTMLInputElement>('input');
            peopleHTMLElement.focus();
            peopleHTMLElement.value = 'K';
            peopleHTMLElement.dispatchEvent(new Event('keyup'));
            peopleHTMLElement.dispatchEvent(new Event('input'));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('.adf-error-text')).not.toBeNull();
            expect(element.querySelector('.adf-error-text').textContent).toContain('FORM.FIELD.VALIDATOR.INVALID_VALUE');
        });

        it('should show the people if the typed result match', async () => {
            const peopleHTMLElement = element.querySelector<HTMLInputElement>('input');
            peopleHTMLElement.focus();
            peopleHTMLElement.value = 'T';
            peopleHTMLElement.dispatchEvent(new Event('keyup'));
            peopleHTMLElement.dispatchEvent(new Event('input'));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(fixture.debugElement.query(By.css('#adf-people-widget-user-0'))).not.toBeNull();
            expect(fixture.debugElement.query(By.css('#adf-people-widget-user-1'))).not.toBeNull();
        });

        it('should hide result list if input is empty', async () => {
            const peopleHTMLElement = element.querySelector<HTMLInputElement>('input');
            peopleHTMLElement.focus();
            peopleHTMLElement.value = '';
            peopleHTMLElement.dispatchEvent(new Event('keyup'));
            peopleHTMLElement.dispatchEvent(new Event('focusin'));
            peopleHTMLElement.dispatchEvent(new Event('input'));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(fixture.debugElement.query(By.css('#adf-people-widget-user-0'))).toBeNull();
        });

        it('should display two options if we tap one letter', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const peopleHTMLElement = element.querySelector<HTMLInputElement>('input');
            peopleHTMLElement.focus();
            peopleHTMLElement.value = 'T';
            peopleHTMLElement.dispatchEvent(new Event('keyup'));
            peopleHTMLElement.dispatchEvent(new Event('input'));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(fixture.debugElement.query(By.css('#adf-people-widget-user-0'))).not.toBeNull();
            expect(fixture.debugElement.query(By.css('#adf-people-widget-user-1'))).not.toBeNull();
        });

        it('should emit peopleSelected if option is valid', async () => {
            const selectEmitSpy = spyOn(widget.peopleSelected, 'emit');
            const peopleHTMLElement = element.querySelector<HTMLInputElement>('input');
            peopleHTMLElement.focus();
            peopleHTMLElement.value = 'Test01 Test01';
            peopleHTMLElement.dispatchEvent(new Event('keyup'));
            peopleHTMLElement.dispatchEvent(new Event('input'));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(selectEmitSpy).toHaveBeenCalledWith(1001);
        });

        it('should display tooltip when tooltip is set', async () => {
            widget.field.tooltip = 'people widget';

            fixture.detectChanges();
            await fixture.whenStable();

            const radioButtonsElement: any = element.querySelector('#people-id');
            const tooltip = radioButtonsElement.getAttribute('ng-reflect-message');

            expect(tooltip).toEqual(widget.field.tooltip);
        });
    });
});
