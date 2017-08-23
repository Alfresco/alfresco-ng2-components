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

import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { FormService } from '../../../services/form.service';
import { FormFieldModel } from '../core/form-field.model';
import { FormModel } from '../core/form.model';
import { GroupModel } from '../core/group.model';
import { FunctionalGroupWidgetComponent } from './functional-group.widget';

describe('FunctionalGroupWidgetComponent', () => {
    let formService: FormService;
    let elementRef: ElementRef;
    let widget: FunctionalGroupWidgetComponent;

    beforeEach(() => {
        formService = new FormService(null, null, null);
        elementRef = new ElementRef(null);
        widget = new FunctionalGroupWidgetComponent(formService, elementRef);
        widget.field = new FormFieldModel(new FormModel());
    });

    it('should setup text from underlying field on init', () => {
        let group = new GroupModel({ name: 'group-1'});
        widget.field.value = group;

        spyOn(formService, 'getWorkflowGroups').and.returnValue(
            Observable.create(observer => {
                observer.next(null);
                observer.complete();
            })
        );

        widget.ngOnInit();
        expect(formService.getWorkflowGroups).toHaveBeenCalled();
        expect(widget.value).toBe(group.name);
    });

    it('should not setup text on init', () => {
        widget.field.value = null;
        widget.ngOnInit();
        expect(widget.value).toBeUndefined();
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

        widget.field.params = { restrictWithGroup: { id: '<id>' } };
        widget.ngOnInit();
        expect(widget.groupId).toBe('<id>');
    });

    it('should flush value on blur', (done) => {
        spyOn(widget, 'flushValue').and.stub();
        widget.onBlur();

        setTimeout(() => {
            expect(widget.flushValue).toHaveBeenCalled();
            done();
        }, 200);
    });

    it('should prevent default behaviour on option item click', () => {
        let event = jasmine.createSpyObj('event', ['preventDefault']);
        widget.onItemClick(null, event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should update values on item click', () => {
        let item = new GroupModel({ name: 'group-1' });

        widget.onItemClick(item, null);
        expect(widget.field.value).toBe(item);
        expect(widget.value).toBe(item.name);
    });

    it('should hide popup on flush', () => {
        widget.popupVisible = true;
        widget.flushValue();
        expect(widget.popupVisible).toBeFalsy();
    });

    it('should update form on value flush', () => {
        spyOn(widget.field, 'updateForm').and.callThrough();
        widget.flushValue();
        expect(widget.field.updateForm).toHaveBeenCalled();
    });

    it('should flush selected value', () => {
        let groups: GroupModel[] = [
            new GroupModel({ id: '1', name: 'group 1' }),
            new GroupModel({ id: '2', name: 'group 2' })
        ];

        widget.groups = groups;
        widget.value = 'group 2';
        widget.flushValue();

        expect(widget.value).toBe(groups[1].name);
        expect(widget.field.value).toBe(groups[1]);
    });

    it('should be case insensitive when flushing value', () => {
        let groups: GroupModel[] = [
            new GroupModel({ id: '1', name: 'group 1' }),
            new GroupModel({ id: '2', name: 'gRoUp 2' })
        ];

        widget.groups = groups;
        widget.value = 'GROUP 2';
        widget.flushValue();

        expect(widget.value).toBe(groups[1].name);
        expect(widget.field.value).toBe(groups[1]);
    });

    it('should hide popup on key up', () => {
        widget.popupVisible = true;
        widget.onKeyUp(null);
        expect(widget.popupVisible).toBeFalsy();
    });

    it('should fetch groups and show popup on key up', () => {
        let groups: GroupModel[] = [
            new GroupModel(),
            new GroupModel()
        ];
        spyOn(formService, 'getWorkflowGroups').and.returnValue(
            Observable.create(observer => {
                observer.next(groups);
                observer.complete();
            })
        );

        widget.value = 'group';
        widget.onKeyUp(null);

        expect(formService.getWorkflowGroups).toHaveBeenCalledWith('group', undefined);
        expect(widget.groups).toBe(groups);
        expect(widget.popupVisible).toBeTruthy();
    });

    it('should fetch groups with a group filter', () => {
        let groups: GroupModel[] = [
            new GroupModel(),
            new GroupModel()
        ];
        spyOn(formService, 'getWorkflowGroups').and.returnValue(
            Observable.create(observer => {
                observer.next(groups);
                observer.complete();
            })
        );

        widget.groupId = 'parentGroup';
        widget.value = 'group';
        widget.onKeyUp(null);

        expect(formService.getWorkflowGroups).toHaveBeenCalledWith('group', 'parentGroup');
        expect(widget.groups).toBe(groups);
        expect(widget.popupVisible).toBeTruthy();
    });

    it('should hide popup when fetching empty group list', () => {
        spyOn(formService, 'getWorkflowGroups').and.returnValue(
            Observable.create(observer => {
                observer.next(null);
                observer.complete();
            })
        );

        widget.value = 'group';
        widget.onKeyUp(null);

        expect(formService.getWorkflowGroups).toHaveBeenCalledWith('group', undefined);
        expect(widget.groups.length).toBe(0);
        expect(widget.popupVisible).toBeFalsy();
    });

    it('should not fetch groups when value is missing', () => {
        spyOn(formService, 'getWorkflowGroups').and.stub();

        widget.value = null;
        widget.onKeyUp(null);

        expect(formService.getWorkflowGroups).not.toHaveBeenCalled();
        expect(widget.popupVisible).toBeFalsy();
    });

    it('should not fetch groups when value violates constraints', () => {
        spyOn(formService, 'getWorkflowGroups').and.stub();

        widget.minTermLength = 4;
        widget.value = '123';
        widget.onKeyUp(null);

        expect(formService.getWorkflowGroups).not.toHaveBeenCalled();
        expect(widget.popupVisible).toBeFalsy();
    });
});
