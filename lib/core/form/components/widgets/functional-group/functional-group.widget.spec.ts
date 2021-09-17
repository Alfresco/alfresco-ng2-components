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

import { of, timer } from 'rxjs';
import { FormService } from '../../../services/form.service';
import { FormFieldModel } from '../core/form-field.model';
import { FormModel } from '../core/form.model';
import { GroupModel } from '../core/group.model';
import { FunctionalGroupWidgetComponent } from './functional-group.widget';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreTestingModule, setupTestBed } from '../../../../testing';
import { TranslateModule } from '@ngx-translate/core';

describe('FunctionalGroupWidgetComponent', () => {
    let fixture: ComponentFixture<FunctionalGroupWidgetComponent>;
    let component: FunctionalGroupWidgetComponent;
    let formService: FormService;
    let getWorkflowGroupsSpy: jasmine.Spy;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        formService = TestBed.inject(FormService);
        getWorkflowGroupsSpy = spyOn(formService, 'getWorkflowGroups').and.returnValue(of([]));

        fixture = TestBed.createComponent(FunctionalGroupWidgetComponent);
        component = fixture.componentInstance;
        component.field = new FormFieldModel(new FormModel());
        fixture.detectChanges();
    });

    afterEach(() => getWorkflowGroupsSpy.calls.reset());

    it('should setup text from underlying field on init', async () => {
        const group: GroupModel = { name: 'group-1'};
        component.field.value = group;
        component.ngOnInit();

        await timer(300).toPromise();
        expect(getWorkflowGroupsSpy).toHaveBeenCalled();
        expect(component.field.value).toEqual({ name: group.name });
    });

    it('should not setup text on init', () => {
        component.field.value = null;
        component.ngOnInit();
        expect(component.searchTerm.value).toBeNull();
    });

    it('should setup group restriction', () => {
        component.ngOnInit();
        expect(component.groupId).toBeUndefined();

        component.field.params = { restrictWithGroup: { id: '<id>' } };
        component.ngOnInit();
        expect(component.groupId).toBe('<id>');
    });

    it('should update form on value flush', () => {
        spyOn(component.field, 'updateForm').and.callThrough();
        component.updateOption();
        expect(component.field.updateForm).toHaveBeenCalled();
    });

    it('should flush selected value', () => {
        const groups: GroupModel[] = [
            { id: '1', name: 'group 1' },
            { id: '2', name: 'group 2' }
        ];
        getWorkflowGroupsSpy.and.returnValue(of(groups));

        component.updateOption(groups[1]);

        expect(component.field.value).toBe(groups[1]);
    });

    it('should fetch groups and show popup on key up',  async () => {
        const groups: GroupModel[] = [{}, {}];
        getWorkflowGroupsSpy.and.returnValue(of(groups));

        component.searchTerm.setValue('group');
        fixture.detectChanges();
        await fixture.whenStable();

        await timer(300).toPromise();
        expect(getWorkflowGroupsSpy).toHaveBeenCalledWith('group', undefined);
    });

    it('should fetch groups with a group filter', async () => {
        const groups: GroupModel[] = [{}, {}];
        getWorkflowGroupsSpy.and.returnValue(of(groups));
        component.groupId = 'parentGroup';
        component.searchTerm.setValue('group');
        fixture.detectChanges();
        await fixture.whenStable();

        await timer(300).toPromise();
        expect(getWorkflowGroupsSpy).toHaveBeenCalledWith('group', 'parentGroup');
    });

    it('should hide popup when fetching empty group list', async () => {
        component.searchTerm.setValue('group');
        fixture.detectChanges();
        await fixture.whenStable();

        await timer(300).toPromise();
        expect(getWorkflowGroupsSpy).toHaveBeenCalledWith('group', undefined);
    });

    it('should not fetch groups when value is missing', async  () => {
        component.searchTerm.setValue('');
        fixture.detectChanges();
        await fixture.whenStable();

        await timer(300).toPromise();
        expect(getWorkflowGroupsSpy).not.toHaveBeenCalled();
    });

    it('should not fetch groups when value violates constraints', async () => {
        component.minTermLength = 4;
        component.searchTerm.setValue('123');
        fixture.detectChanges();
        await fixture.whenStable();

        await timer(300).toPromise();
        expect(getWorkflowGroupsSpy).not.toHaveBeenCalled();
    });
});
