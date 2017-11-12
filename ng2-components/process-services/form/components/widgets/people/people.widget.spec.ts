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

import { OverlayContainer } from '@angular/cdk/overlay';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UserProcessModel } from '@alfresco/core';
import { Observable } from 'rxjs/Rx';
import { ActivitiContentService } from '../../../services/activiti-alfresco.service';
import { FormService } from '../../../services/form.service';
import { MaterialModule } from '../../../../material.module';
import { FormFieldTypes } from '../core/form-field-types';
import { FormFieldModel } from '../core/form-field.model';
import { FormModel } from '../core/form.model';
import { ErrorWidgetComponent } from '../error/error.component';
import { EcmModelService } from './../../../services/ecm-model.service';
import { PeopleWidgetComponent } from './people.widget';

describe('PeopleWidgetComponent', () => {

    let widget: PeopleWidgetComponent;
    let fixture: ComponentFixture<PeopleWidgetComponent>;
    let element: HTMLElement;
    let formService: FormService;
    let overlayContainerElement: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [

                MaterialModule
            ],
            declarations: [
                PeopleWidgetComponent,
                ErrorWidgetComponent
            ],
            providers: [
                FormService,
                EcmModelService,
                ActivitiContentService,
                {
                    provide: OverlayContainer, useFactory: () => {
                    overlayContainerElement = document.createElement('div');
                    overlayContainerElement.classList.add('cdk-overlay-container');

                    document.body.appendChild(overlayContainerElement);

                    // remove body padding to keep consistent cross-browser
                    document.body.style.padding = '0';
                    document.body.style.margin = '0';

                    return {getContainerElement: () => overlayContainerElement};
                }
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PeopleWidgetComponent);
        formService = TestBed.get(FormService);

        element = fixture.nativeElement;
        widget = fixture.componentInstance;
        widget.field = new FormFieldModel(new FormModel());
        fixture.detectChanges();
    });

    it('should return empty display name for missing model', () => {
        expect(widget.getDisplayName(null)).toBe('');
    });

    it('should return full name for a given model', () => {
        let model = new UserProcessModel({
            firstName: 'John',
            lastName: 'Doe'
        });
        expect(widget.getDisplayName(model)).toBe('John Doe');
    });

    it('should skip first name for display name', () => {
        let model = new UserProcessModel({firstName: null, lastName: 'Doe'});
        expect(widget.getDisplayName(model)).toBe('Doe');
    });

    it('should skip last name for display name', () => {
        let model = new UserProcessModel({firstName: 'John', lastName: null});
        expect(widget.getDisplayName(model)).toBe('John');
    });

    it('should init value from the field', () => {
        widget.field.value = new UserProcessModel({
            id: 'people-id',
            firstName: 'John',
            lastName: 'Doe'
        });

        spyOn(formService, 'getWorkflowUsers').and.returnValue(
            Observable.create(observer => {
                observer.next(null);
                observer.complete();
            })
        );

        widget.ngOnInit();
        fixture.detectChanges();

        expect((element.querySelector('input') as HTMLInputElement).value).toBe('John Doe');
    });

    it('should require form field to setup values on init', () => {
        widget.field.value = null;
        widget.ngOnInit();
        fixture.detectChanges();
        let input = widget.input;
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

    it('should fetch users by search term', () => {
        let users = [{
            id: 'people-id',
            firstName: 'John',
            lastName: 'Doe'
        }, {
            id: 'people-id2',
            firstName: 'John',
            lastName: 'Ping'
        }];

        spyOn(formService, 'getWorkflowUsers').and.returnValue(
            Observable.create(observer => {
                observer.next(users);
                observer.complete();
            })
        );
        fixture.detectChanges();

        let keyboardEvent = new KeyboardEvent('keypress');
        let input = widget.input;
        input.nativeElement.value = 'John';
        widget.onKeyUp(keyboardEvent);

        expect(formService.getWorkflowUsers).toHaveBeenCalledWith('John', widget.groupId);
        expect(widget.users).toBe(users);
    });

    it('should fetch users by search term and group id', () => {
        let users = [{
            id: 'people-id',
            firstName: 'John',
            lastName: 'Doe'
        }, {
            id: 'people-id2',
            firstName: 'John',
            lastName: 'Ping'
        }];

        spyOn(formService, 'getWorkflowUsers').and.returnValue(
            Observable.create(observer => {
                observer.next(users);
                observer.complete();
            })
        );
        fixture.detectChanges();

        let keyboardEvent = new KeyboardEvent('keypress');
        let input = widget.input;
        input.nativeElement.value = 'John';
        widget.groupId = '1001';
        widget.onKeyUp(keyboardEvent);

        expect(formService.getWorkflowUsers).toHaveBeenCalledWith('John', widget.groupId);
        expect(widget.users).toBe(users);
    });

    it('should fetch users and show no popup', () => {
        spyOn(formService, 'getWorkflowUsers').and.returnValue(
            Observable.create(observer => {
                observer.next(null);
                observer.complete();
            })
        );
        fixture.detectChanges();

        let keyboardEvent = new KeyboardEvent('keypress');
        let input = widget.input;
        input.nativeElement.value = 'user1';
        widget.onKeyUp(keyboardEvent);

        expect(formService.getWorkflowUsers).toHaveBeenCalledWith('user1', widget.groupId);
        expect(widget.users).toEqual([]);
    });

    it('should require search term to fetch users', () => {
        spyOn(formService, 'getWorkflowUsers').and.stub();

        let keyboardEvent = new KeyboardEvent('keypress');
        let input = widget.input;
        input.nativeElement.value = null;
        widget.onKeyUp(keyboardEvent);

        expect(formService.getWorkflowUsers).not.toHaveBeenCalled();
    });

    it('should not fetch users due to constraint violation', () => {
        spyOn(formService, 'getWorkflowUsers').and.stub();

        let keyboardEvent = new KeyboardEvent('keypress');
        (element.querySelector('input') as HTMLInputElement).value = '123';
        widget.minTermLength = 4;
        widget.onKeyUp(keyboardEvent);

        expect(formService.getWorkflowUsers).not.toHaveBeenCalled();
    });

    it('should reset users when the input field is blank string', () => {
        let fakeUser = new UserProcessModel({id: '1', email: 'ffff@fff'});
        widget.users.push(fakeUser);
        fixture.detectChanges();

        let keyboardEvent = new KeyboardEvent('keypress');
        (element.querySelector('input') as HTMLInputElement).value = '';
        widget.onKeyUp(keyboardEvent);

        expect(widget.users).toEqual([]);
    });

    describe('when template is ready', () => {

        let fakeUserResult = [
            {id: 1001, firstName: 'Test01', lastName: 'Test01', email: 'test'},
            {id: 1002, firstName: 'Test02', lastName: 'Test02', email: 'test2'}];

        beforeEach(async(() => {
            spyOn(formService, 'getWorkflowUsers').and.returnValue(Observable.create(observer => {
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
        }));

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should render the people component', () => {
            expect(element.querySelector('#people-widget-content')).not.toBeNull();
        });

        it('should show an error message if the user is invalid', async(() => {
            let peopleHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
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
            let peopleHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
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

    });

});
