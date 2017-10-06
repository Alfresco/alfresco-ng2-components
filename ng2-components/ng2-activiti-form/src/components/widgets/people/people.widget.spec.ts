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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule, LightUserRepresentation } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { ActivitiAlfrescoContentService } from '../../../services/activiti-alfresco.service';
import { FormService } from '../../../services/form.service';
import { MaterialModule } from '../../material.module';
import { FormFieldModel } from '../core/form-field.model';
import { FormModel } from '../core/form.model';
import { ErrorWidgetComponent } from '../error/error.component';
import { EcmModelService } from './../../../services/ecm-model.service';
import { PeopleWidgetComponent } from './people.widget';

fdescribe('PeopleWidgetComponent', () => {

    let widget: PeopleWidgetComponent;
    let fixture: ComponentFixture<PeopleWidgetComponent>;
    let element: HTMLElement;
    let formService: FormService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                MaterialModule
            ],
            declarations: [
                PeopleWidgetComponent,
                ErrorWidgetComponent
            ],
            providers: [
                FormService,
                EcmModelService,
                ActivitiAlfrescoContentService
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
        let model = new LightUserRepresentation({
            firstName: 'John',
            lastName: 'Doe'
        });
        expect(widget.getDisplayName(model)).toBe('John Doe');
    });

    it('should skip first name for display name', () => {
        let model = new LightUserRepresentation({firstName: null, lastName: 'Doe'});
        expect(widget.getDisplayName(model)).toBe('Doe');
    });

    it('should skip last name for display name', () => {
        let model = new LightUserRepresentation({firstName: 'John', lastName: null});
        expect(widget.getDisplayName(model)).toBe('John');
    });

    it('should init value from the field', () => {
        widget.field.value = new LightUserRepresentation({
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
        expect(widget.value).toBe('John Doe');
    });

    it('should require form field to setup values on init', () => {
        widget.field = null;
        widget.ngOnInit();

        expect(widget.value).toBeUndefined();
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
        let users = [{}, {}];
        spyOn(formService, 'getWorkflowUsers').and.returnValue(
            Observable.create(observer => {
                observer.next(users);
                observer.complete();
            })
        );

        let keyboardEvent = new KeyboardEvent('keypress');
        widget.value = 'user1';
        widget.onKeyUp(keyboardEvent);

        expect(formService.getWorkflowUsers).toHaveBeenCalledWith(widget.value, widget.groupId);
        expect(widget.users).toBe(users);
    });

    it('should fetch users by search term and group id', () => {
        let users = [{}, {}];
        spyOn(formService, 'getWorkflowUsers').and.returnValue(
            Observable.create(observer => {
                observer.next(users);
                observer.complete();
            })
        );

        let keyboardEvent = new KeyboardEvent('keypress');
        widget.value = 'user1';
        widget.groupId = '1001';
        widget.onKeyUp(keyboardEvent);

        expect(formService.getWorkflowUsers).toHaveBeenCalledWith(widget.value, widget.groupId);
        expect(widget.users).toBe(users);
    });

    it('should fetch users and show no popup', () => {
        spyOn(formService, 'getWorkflowUsers').and.returnValue(
            Observable.create(observer => {
                observer.next(null);
                observer.complete();
            })
        );

        let keyboardEvent = new KeyboardEvent('keypress');
        widget.value = 'user1';
        widget.onKeyUp(keyboardEvent);

        expect(formService.getWorkflowUsers).toHaveBeenCalledWith(widget.value, widget.groupId);
        expect(widget.users).toEqual([]);
    });

    it('should require search term to fetch users', () => {
        spyOn(formService, 'getWorkflowUsers').and.stub();

        let keyboardEvent = new KeyboardEvent('keypress');
        widget.value = null;
        widget.onKeyUp(keyboardEvent);

        expect(formService.getWorkflowUsers).not.toHaveBeenCalled();
    });

    it('should not fetch users due to constraint violation', () => {
        spyOn(formService, 'getWorkflowUsers').and.stub();

        let keyboardEvent = new KeyboardEvent('keypress');
        widget.value = '123';
        widget.minTermLength = 4;
        widget.onKeyUp(keyboardEvent);

        expect(formService.getWorkflowUsers).not.toHaveBeenCalled();
    });

    it('should reset users when the input field is blank string', () => {
        let fakeUser = new LightUserRepresentation({id: '1', email: 'ffff@fff'});
        widget.users.push(fakeUser);

        let keyboardEvent = new KeyboardEvent('keypress');
        widget.value = '';
        widget.onKeyUp(keyboardEvent);

        expect(widget.users).toEqual([]);
    });

});
