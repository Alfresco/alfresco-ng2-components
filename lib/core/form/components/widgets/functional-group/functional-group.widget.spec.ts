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

import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
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
        const group: GroupModel = { name: 'group-1'};
        widget.field.value = group;

        spyOn(formService, 'getWorkflowGroups').and.returnValue(
            new Observable((observer) => {
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

    it('should prevent default behaviour on option item click', () => {
        const event = jasmine.createSpyObj('event', ['preventDefault']);
        widget.onItemClick(null, event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should update values on item click', () => {
        const item: GroupModel = { name: 'group-1' };

        widget.onItemClick(item, null);
        expect(widget.field.value).toBe(item);
        expect(widget.value).toBe(item.name);
    });

    it('should update form on value flush', () => {
        spyOn(widget.field, 'updateForm').and.callThrough();
        widget.flushValue();
        expect(widget.field.updateForm).toHaveBeenCalled();
    });

    it('should flush selected value', () => {
        const groups: GroupModel[] = [
            { id: '1', name: 'group 1' },
            { id: '2', name: 'group 2' }
        ];

        widget.groups = groups;
        widget.value = 'group 2';
        widget.flushValue();

        expect(widget.value).toBe(groups[1].name);
        expect(widget.field.value).toBe(groups[1]);
    });

    it('should be case insensitive when flushing value', () => {
        const groups: GroupModel[] = [
            { id: '1', name: 'group 1' },
            { id: '2', name: 'gRoUp 2' }
        ];

        widget.groups = groups;
        widget.value = 'GROUP 2';
        widget.flushValue();

        expect(widget.value).toBe(groups[1].name);
        expect(widget.field.value).toBe(groups[1]);
    });

    it('should fetch groups and show popup on key up', () => {
        const groups: GroupModel[] = [{}, {}];
        spyOn(formService, 'getWorkflowGroups').and.returnValue(
            new Observable((observer) => {
                observer.next(groups);
                observer.complete();
            })
        );

        const keyboardEvent = new KeyboardEvent('keypress');
        widget.value = 'group';
        widget.onKeyUp(keyboardEvent);

        expect(formService.getWorkflowGroups).toHaveBeenCalledWith('group', undefined);
        expect(widget.groups).toBe(groups);
    });

    it('should fetch groups with a group filter', () => {
        const groups: GroupModel[] = [{}, {}];
        spyOn(formService, 'getWorkflowGroups').and.returnValue(
            new Observable((observer) => {
                observer.next(groups);
                observer.complete();
            })
        );

        const keyboardEvent = new KeyboardEvent('keypress');
        widget.groupId = 'parentGroup';
        widget.value = 'group';
        widget.onKeyUp(keyboardEvent);

        expect(formService.getWorkflowGroups).toHaveBeenCalledWith('group', 'parentGroup');
        expect(widget.groups).toBe(groups);
    });

    it('should hide popup when fetching empty group list', () => {
        spyOn(formService, 'getWorkflowGroups').and.returnValue(
            new Observable((observer) => {
                observer.next(null);
                observer.complete();
            })
        );

        const keyboardEvent = new KeyboardEvent('keypress');
        widget.value = 'group';
        widget.onKeyUp(keyboardEvent);

        expect(formService.getWorkflowGroups).toHaveBeenCalledWith('group', undefined);
        expect(widget.groups.length).toBe(0);
    });

    it('should not fetch groups when value is missing', () => {
        spyOn(formService, 'getWorkflowGroups').and.stub();

        const keyboardEvent = new KeyboardEvent('keypress');
        widget.value = null;
        widget.onKeyUp(keyboardEvent);

        expect(formService.getWorkflowGroups).not.toHaveBeenCalled();
    });

    it('should not fetch groups when value violates constraints', () => {
        spyOn(formService, 'getWorkflowGroups').and.stub();

        const keyboardEvent = new KeyboardEvent('keypress');
        widget.minTermLength = 4;
        widget.value = '123';
        widget.onKeyUp(keyboardEvent);

        expect(formService.getWorkflowGroups).not.toHaveBeenCalled();
    });
});
