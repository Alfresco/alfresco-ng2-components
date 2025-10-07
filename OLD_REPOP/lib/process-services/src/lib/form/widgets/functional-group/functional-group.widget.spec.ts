/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { firstValueFrom, of, timer } from 'rxjs';
import { FormFieldModel, FormModel, GroupModel, FormFieldTypes, UnitTestingUtils } from '@alfresco/adf-core';
import { FunctionalGroupWidgetComponent } from './functional-group.widget';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeopleProcessService } from '../../../services/people-process.service';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatChipRowHarness } from '@angular/material/chips/testing';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';

describe('FunctionalGroupWidgetComponent', () => {
    let fixture: ComponentFixture<FunctionalGroupWidgetComponent>;
    let component: FunctionalGroupWidgetComponent;
    let peopleProcessService: PeopleProcessService;
    let getWorkflowGroupsSpy: jasmine.Spy;
    let element: HTMLElement;
    let loader: HarnessLoader;
    let unitTestingUtils: UnitTestingUtils;

    const groups: GroupModel[] = [
        { id: '1', name: 'group 1' },
        { id: '2', name: 'group 2' }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FunctionalGroupWidgetComponent]
        });
        peopleProcessService = TestBed.inject(PeopleProcessService);
        getWorkflowGroupsSpy = spyOn(peopleProcessService, 'getWorkflowGroups').and.returnValue(of([]));

        fixture = TestBed.createComponent(FunctionalGroupWidgetComponent);
        component = fixture.componentInstance;
        unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
        loader = TestbedHarnessEnvironment.loader(fixture);
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

        await firstValueFrom(timer(300));
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
        const group: GroupModel = { name: 'group-1' };
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
        getWorkflowGroupsSpy.and.returnValue(of(groups));

        component.updateOption(groups[1]);

        expect(component.field.value).toEqual(groups[1]);
    });

    it('should fetch groups and show popup on key up', async () => {
        component.groupId = 'parentGroup';
        getWorkflowGroupsSpy.and.returnValue(of(groups));

        await typeIntoInput('group');

        const options: HTMLElement[] = Array.from(document.querySelectorAll('[id="adf-group-label-name"]'));
        expect(options.map((option) => option.innerText)).toEqual(['group 1', 'group 2']);
        expect(getWorkflowGroupsSpy).toHaveBeenCalledWith('group', 'parentGroup');
    });

    it('should hide popup when fetching empty group list', async () => {
        component.groupId = 'parentGroup';
        getWorkflowGroupsSpy.and.returnValues(of(groups), of([]));

        await typeIntoInput('group');

        let options: HTMLElement[] = Array.from(document.querySelectorAll('[id="adf-group-label-name"]'));
        expect(options.map((option) => option.innerText)).toEqual(['group 1', 'group 2']);

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
            component.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
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

    describe('Groups chips', () => {
        beforeEach(() => {
            component.field.value = groups;
            component.ngOnInit();
        });

        it('should display chip for each selected group', async () => {
            fixture.detectChanges();
            expect(await loader.getAllHarnesses(MatChipRowHarness)).toHaveSize(2);
        });

        it('should disable chips based on field readOnly property', async () => {
            component.field.readOnly = true;

            fixture.detectChanges();
            expect((await loader.getAllHarnesses(MatChipRowHarness)).every((chip) => chip.isDisabled())).toBeTrue();
        });

        it('should display correct group name for each chip', async () => {
            fixture.detectChanges();
            const chips = await loader.getAllHarnesses(MatChipRowHarness);
            expect(await chips[0].getText()).toBe('group 1');
            expect(await chips[1].getText()).toBe('group 2');
        });

        it('should allow to remove chips', async () => {
            fixture.detectChanges();
            const chips = await loader.getAllHarnesses(MatChipRowHarness);

            await chips[0].remove();
            const chipsAfterRemoving = await loader.getAllHarnesses(MatChipRowHarness);
            expect(component.field.value).toEqual([groups[1]]);
            expect(chipsAfterRemoving).toHaveSize(1);
            expect(await chipsAfterRemoving[0].getText()).toBe('group 2');
        });
    });

    describe('Groups input', () => {
        const getInputElement = (): HTMLInputElement => unitTestingUtils.getByDataAutomationId('adf-group-search-input').nativeElement;

        it('should disable input if multiple property of params is false, some group is selected and field is not readOnly', () => {
            component.field.params.multiple = false;
            component.field.value = [groups[0]];
            component.field.readOnly = false;
            component.ngOnInit();

            fixture.detectChanges();
            expect(getInputElement().disabled).toBeTrue();
        });

        it('should enable input if multiple property of params is false, none group is selected and field is not readOnly', () => {
            component.field.params.multiple = false;
            component.field.value = [];
            component.field.readOnly = false;
            component.ngOnInit();

            fixture.detectChanges();
            expect(getInputElement().disabled).toBeFalse();
        });

        it('should enable input if multiple property of params is true, none group is selected and field is not readOnly', () => {
            component.field.params.multiple = true;
            component.field.value = [];
            component.field.readOnly = false;
            component.ngOnInit();

            fixture.detectChanges();
            expect(getInputElement().disabled).toBeFalse();
        });

        it('should enable input if multiple property of params is true, some group is selected and field is not readOnly', () => {
            component.field.params.multiple = true;
            component.field.value = [groups[0]];
            component.field.readOnly = false;
            component.ngOnInit();

            fixture.detectChanges();
            expect(getInputElement().disabled).toBeFalse();
        });

        it('should disable input if multiple property of params is false, some group is selected and field is readOnly', () => {
            component.field.params.multiple = false;
            component.field.value = [groups[0]];
            component.field.readOnly = true;
            component.ngOnInit();

            fixture.detectChanges();
            expect(getInputElement().disabled).toBeTrue();
        });

        it('should disable input if multiple property of params is false, none group is selected and field is readOnly', () => {
            component.field.params.multiple = false;
            component.field.value = [];
            component.field.readOnly = true;
            component.ngOnInit();

            fixture.detectChanges();
            expect(getInputElement().disabled).toBeTrue();
        });

        it('should disable input if multiple property of params is true, none group is selected and field is readOnly', () => {
            component.field.params.multiple = true;
            component.field.value = [];
            component.field.readOnly = true;
            component.ngOnInit();

            fixture.detectChanges();
            expect(getInputElement().disabled).toBeTrue();
        });

        it('should disable input if multiple property of params is true, some group is selected and field is readOnly', () => {
            component.field.params.multiple = true;
            component.field.value = [groups[0]];
            component.field.readOnly = true;
            component.ngOnInit();

            fixture.detectChanges();
            expect(getInputElement().disabled).toBeTrue();
        });
    });

    describe('Autocomplete options', () => {
        it('should have disabled already selected groups', async () => {
            component.field.params.multiple = true;
            component.ngOnInit();
            getWorkflowGroupsSpy.and.returnValue(of(groups));
            await typeIntoInput('group');
            const autocompleteHarness = await loader.getHarness(MatAutocompleteHarness);
            await autocompleteHarness.selectOption({
                text: groups[0].name
            });

            await typeIntoInput('group');
            const options = await autocompleteHarness.getOptions();
            expect(await options[0].isDisabled()).toBeTrue();
            expect(await options[1].isDisabled()).toBeFalse();
        });
    });
});
