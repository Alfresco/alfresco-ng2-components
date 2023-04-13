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

import { of, timer } from 'rxjs';
import {
    FormFieldModel,
    FormModel,
    GroupModel,
    CoreTestingModule,
    setupTestBed,
    FormFieldTypes
} from '@alfresco/adf-core';
import { FunctionalGroupWidgetComponent } from './functional-group.widget';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PeopleProcessService } from '../../../common/services/people-process.service';

describe('FunctionalGroupWidgetComponent', () => {
    let fixture: ComponentFixture<FunctionalGroupWidgetComponent>;
    let component: FunctionalGroupWidgetComponent;
    let peopleProcessService: PeopleProcessService;
    let getWorkflowGroupsSpy: jasmine.Spy;
    let element: HTMLElement;
    const groups: GroupModel[] = [
        {id: '1', name: 'group 1'},
        {id: '2', name: 'group 2'}
    ];

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        peopleProcessService = TestBed.inject(PeopleProcessService);
        getWorkflowGroupsSpy = spyOn(peopleProcessService, 'getWorkflowGroups').and.returnValue(of([]));

        fixture = TestBed.createComponent(FunctionalGroupWidgetComponent);
        component = fixture.componentInstance;
        component.field = new FormFieldModel(new FormModel());
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    afterEach(() => {
        getWorkflowGroupsSpy.calls.reset();
        fixture.destroy();
    });

    const typeIntoInput = async (text: string) => {
        component.searchTerm.setValue(text);
        fixture.detectChanges();

        await timer(300).toPromise();
        await fixture.whenStable();
        fixture.detectChanges();

        const input = fixture.nativeElement.querySelector('input');
        input.focus();
        input.dispatchEvent(new Event('focusin'));
        input.dispatchEvent(new Event('input'));

        await fixture.whenStable();
        fixture.detectChanges();
    };

    it('should setup text from underlying field on init', async () => {
        const group: GroupModel = {name: 'group-1'};
        component.field.value = group;
        component.ngOnInit();

        expect(component.searchTerm.value).toEqual(group.name);
    });

    it('should not setup text on init', () => {
        component.field.value = null;
        component.ngOnInit();
        expect(component.searchTerm.value).toBeNull();
    });

    it('should setup group restriction', () => {
        component.ngOnInit();
        expect(component.groupId).toBeUndefined();

        component.field.params = {restrictWithGroup: {id: '<id>'}};
        component.ngOnInit();
        expect(component.groupId).toBe('<id>');
    });

    it('should update form on value flush', () => {
        spyOn(component.field, 'updateForm').and.callThrough();
        component.updateOption();
        expect(component.field.updateForm).toHaveBeenCalled();
    });

    it('should flush selected value', () => {
        getWorkflowGroupsSpy.and.returnValue(of(groups));

        component.updateOption(groups[1]);

        expect(component.field.value).toBe(groups[1]);
    });

    it('should fetch groups and show popup on key up', async () => {
        component.groupId = 'parentGroup';
        getWorkflowGroupsSpy.and.returnValue(of(groups));

        await typeIntoInput('group');

        const options: HTMLElement[] = Array.from(document.querySelectorAll('[id="adf-group-label-name"]'));
        expect(options.map(option => option.innerText)).toEqual(['group 1', 'group 2']);
        expect(getWorkflowGroupsSpy).toHaveBeenCalledWith('group', 'parentGroup');
    });

    it('should hide popup when fetching empty group list', async () => {
        component.groupId = 'parentGroup';
        getWorkflowGroupsSpy.and.returnValues(of(groups), of([]));

        await typeIntoInput('group');

        let options: HTMLElement[] = Array.from(document.querySelectorAll('[id="adf-group-label-name"]'));
        expect(options.map(option => option.innerText)).toEqual(['group 1', 'group 2']);

        await typeIntoInput('unknown-group');

        options = Array.from(document.querySelectorAll('[id="adf-group-label-name"]'));
        expect(options).toEqual([]);
        expect(getWorkflowGroupsSpy).toHaveBeenCalledTimes(2);
    });

    it('should not fetch groups when value is missing', async () => {
        await typeIntoInput('');
        expect(getWorkflowGroupsSpy).not.toHaveBeenCalled();
    });

    it('should not fetch groups when value violates constraints', async () => {
        component.minTermLength = 4;
        await typeIntoInput('123');
        expect(getWorkflowGroupsSpy).not.toHaveBeenCalled();
    });

    describe('when is required', () => {

        beforeEach(() => {
            component.field = new FormFieldModel(new FormModel({taskId: '<id>'}), {
                type: FormFieldTypes.FUNCTIONAL_GROUP,
                required: true
            });
        });

        it('should be marked as invalid after interaction', async () => {
            const functionalGroupInput = fixture.nativeElement.querySelector('input');
            expect(fixture.nativeElement.querySelector('.adf-invalid')).toBeFalsy();

            functionalGroupInput.dispatchEvent(new Event('blur'));

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
});
