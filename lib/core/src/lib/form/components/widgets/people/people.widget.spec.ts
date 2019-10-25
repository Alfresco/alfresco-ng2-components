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
import { UserProcessModel } from '../../../../models';
import { Observable, of } from 'rxjs';
import { FormService } from '../../../services/form.service';
import { FormFieldTypes } from '../core/form-field-types';
import { FormFieldModel } from '../core/form-field.model';
import { FormModel } from '../core/form.model';
import { PeopleWidgetComponent } from './people.widget';
import { setupTestBed } from '../../../../testing/setupTestBed';
import { CoreModule } from '../../../../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';

describe('PeopleWidgetComponent', () => {

    let widget: PeopleWidgetComponent;
    let fixture: ComponentFixture<PeopleWidgetComponent>;
    let element: HTMLElement;
    let formService: FormService;
    let translationService: TranslateService;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PeopleWidgetComponent);
        formService = TestBed.get(FormService);

        translationService = TestBed.get(TranslateService);
        spyOn(translationService, 'instant').and.callFake((key) => {
            return key;
        });
        spyOn(translationService, 'get').and.callFake((key) => {
            return of(key);
        });

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
        const model = new UserProcessModel({ firstName: null, lastName: 'Doe' });
        expect(widget.getDisplayName(model)).toBe('Doe');
    });

    it('should skip last name for display name', () => {
        const model = new UserProcessModel({ firstName: 'John', lastName: null });
        expect(widget.getDisplayName(model)).toBe('John');
    });

    it('should init value from the field', async(() => {
        widget.field.value = new UserProcessModel({
            id: 'people-id',
            firstName: 'John',
            lastName: 'Doe'
        });

        spyOn(formService, 'getWorkflowUsers').and.returnValue(
            new Observable((observer) => {
                observer.next(null);
                observer.complete();
            })
        );

        widget.ngOnInit();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect((element.querySelector('input') as HTMLInputElement).value).toBe('John Doe');
        });
    }));

    it('should show the readonly value when the form is readonly', async(() => {
        widget.field.value = new UserProcessModel({
            id: 'people-id',
            firstName: 'John',
            lastName: 'Doe'
        });
        widget.field.readOnly = true;
        widget.field.form.readOnly = true;

        spyOn(formService, 'getWorkflowUsers').and.returnValue(
            new Observable((observer) => {
                observer.next(null);
                observer.complete();
            })
        );

        widget.ngOnInit();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect((element.querySelector('input') as HTMLInputElement).value).toBe('John Doe');
            expect((element.querySelector('input') as HTMLInputElement).disabled).toBeTruthy();
        });
    }));

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

        widget.field.params = { restrictWithGroup: { id: '<id>' } };
        widget.ngOnInit();
        expect(widget.groupId).toBe('<id>');
    });

    it('should display involved user in task form', async () => {
        spyOn(formService, 'getWorkflowUsers').and.returnValue(
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
        fixture.whenStable().then(() => {
            expect(involvedUser.value).toBe('John Doe');
        });
    });

    describe('when template is ready', () => {

        const fakeUserResult = [
            { id: 1001, firstName: 'Test01', lastName: 'Test01', email: 'test' },
            { id: 1002, firstName: 'Test02', lastName: 'Test02', email: 'test2' }];

        beforeEach(async(() => {
            spyOn(formService, 'getWorkflowUsers').and.returnValue(new Observable((observer) => {
                observer.next(fakeUserResult);
                observer.complete();
            }));
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                id: 'people-id',
                name: 'people-name',
                type: FormFieldTypes.PEOPLE,
                readOnly: false
            });
            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        afterAll(() => {
            if (fixture) {
                fixture.destroy();
            }
            TestBed.resetTestingModule();
        });

        it('should render the people component', () => {
            expect(element.querySelector('#people-widget-content')).not.toBeNull();
        });

        it('should show an error message if the user is invalid', async(() => {
            const peopleHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            peopleHTMLElement.focus();
            peopleHTMLElement.value = 'K';
            peopleHTMLElement.dispatchEvent(new Event('keyup'));
            peopleHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.querySelector('.adf-error-text')).not.toBeNull();
                expect(element.querySelector('.adf-error-text').textContent).toContain('FORM.FIELD.VALIDATOR.INVALID_VALUE');
            });
        }));

        it('should show the people if the typed result match', async(() => {
            const peopleHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            peopleHTMLElement.focus();
            peopleHTMLElement.value = 'T';
            peopleHTMLElement.dispatchEvent(new Event('keyup'));
            peopleHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(fixture.debugElement.query(By.css('#adf-people-widget-user-0'))).not.toBeNull();
                expect(fixture.debugElement.query(By.css('#adf-people-widget-user-1'))).not.toBeNull();
            });
        }));

        it('should hide result list if input is empty', () => {
            const peopleHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            peopleHTMLElement.focus();
            peopleHTMLElement.value = '';
            peopleHTMLElement.dispatchEvent(new Event('keyup'));
            peopleHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(fixture.debugElement.query(By.css('#adf-people-widget-user-0'))).toBeNull();
            });
        });

        it('should display two options if we tap one letter', async(() => {
            const peopleHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            peopleHTMLElement.focus();
            peopleHTMLElement.value = 'T';
            peopleHTMLElement.dispatchEvent(new Event('keyup'));
            peopleHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(fixture.debugElement.query(By.css('#adf-people-widget-user-0'))).not.toBeNull();
                expect(fixture.debugElement.query(By.css('#adf-people-widget-user-1'))).not.toBeNull();
            });
        }));

        it('should emit peopleSelected if option is valid', async () => {
            const selectEmitSpy = spyOn(widget.peopleSelected, 'emit');
            const peopleHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            peopleHTMLElement.focus();
            peopleHTMLElement.value = 'Test01 Test01';
            peopleHTMLElement.dispatchEvent(new Event('keyup'));
            peopleHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(selectEmitSpy).toHaveBeenCalledWith(1001);
            });
        });
    });

});
