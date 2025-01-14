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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { GroupCloudComponent } from './group-cloud.component';
import { CoreTestingModule } from '@alfresco/adf-core';
import { DebugElement, SimpleChange } from '@angular/core';
import { IdentityGroupService } from '../services/identity-group.service';
import { mockFoodGroups, mockMeatChicken, mockVegetableAubergine } from '../mock/group-cloud.mock';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatChipHarness } from '@angular/material/chips/testing';
import { MatIconHarness } from '@angular/material/icon/testing';
import { MatInputHarness } from '@angular/material/input/testing';

describe('GroupCloudComponent', () => {
    let loader: HarnessLoader;
    let component: GroupCloudComponent;
    let fixture: ComponentFixture<GroupCloudComponent>;
    let element: HTMLElement;
    let identityGroupService: IdentityGroupService;
    let findGroupsByNameSpy: jasmine.Spy;

    /**
     * search group by value
     *
     * @param value element input value
     */
    async function searchGroup(value: string) {
        const input = await loader.getHarness(MatInputHarness);
        await input.focus();
        await input.setValue(value);
    }

    /**
     * search group and invoke the blur event
     *
     * @param value value
     */
    async function searchGroupsAndBlur(value: string) {
        const input = await loader.getHarness(MatInputHarness);
        await input.focus();
        await input.setValue(value);
        await input.blur();
    }

    /**
     * get the group list UI
     *
     * @returns a list of debug elements
     */
    function getGroupListUI(): DebugElement[] {
        return fixture.debugElement.queryAll(By.css('[data-automation-id="adf-cloud-group-row"]'));
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule, GroupCloudComponent]
        });
        fixture = TestBed.createComponent(GroupCloudComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        identityGroupService = TestBed.inject(IdentityGroupService);
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should populate placeholder when title is present', async () => {
        component.title = 'TITLE_KEY';

        fixture.detectChanges();

        const inputElement = await loader.getHarness(MatInputHarness.with({ selector: '[data-automation-id="adf-cloud-group-search-input"]' }));

        expect(await inputElement.getPlaceholder()).toEqual('TITLE_KEY');
    });

    it('should not populate placeholder when title is not present', async () => {
        fixture.detectChanges();

        const inputElement = await loader.getHarness(MatInputHarness.with({ selector: '[data-automation-id="adf-cloud-group-search-input"]' }));

        expect(await inputElement.getPlaceholder()).toEqual('');
    });

    describe('Search group', () => {
        beforeEach(() => {
            fixture.detectChanges();
            findGroupsByNameSpy = spyOn(identityGroupService, 'search').and.returnValue(of(mockFoodGroups));
        });

        it('should list the groups as dropdown options if the search term has results', async () => {
            await searchGroup('All');

            const groupList = getGroupListUI();
            expect(groupList.length).toEqual(2);
        });

        it('should not be able to search for a group that its name matches one of the preselected groups name', async () => {
            component.preSelectGroups = [{ name: mockVegetableAubergine.name }];
            const changes = new SimpleChange(null, [{ name: mockVegetableAubergine.name }], false);
            component.ngOnChanges({ preSelectGroups: changes });
            fixture.detectChanges();

            await searchGroup('Aubergine');

            const groupList = getGroupListUI();
            expect(groupList.length).toEqual(1);
        });

        it('should hide result list if input is empty', async () => {
            await searchGroup('');

            expect(element.querySelector('[data-automation-id="adf-cloud-group-row"]')).toBeNull();
        });

        it('should update selected groups when a group is selected', async () => {
            const selectEmitSpy = spyOn(component.selectGroup, 'emit');
            const changedGroupsSpy = spyOn(component.changedGroups, 'emit');

            component.onSelect(mockMeatChicken);

            fixture.detectChanges();
            await fixture.whenStable();

            expect(selectEmitSpy).toHaveBeenCalledWith(mockMeatChicken);
            expect(changedGroupsSpy).toHaveBeenCalledWith([mockMeatChicken]);
            expect(component.selectedGroups).toEqual([mockMeatChicken]);
        });

        it('should replace the group in single-selection mode', () => {
            component.mode = 'single';

            component.onSelect(mockVegetableAubergine);
            expect(component.selectedGroups).toEqual([mockVegetableAubergine]);

            component.onSelect(mockMeatChicken);
            expect(component.selectedGroups).toEqual([mockMeatChicken]);
        });

        it('should allow multiple groups in multi-selection mode', () => {
            component.mode = 'multiple';

            component.onSelect(mockVegetableAubergine);
            component.onSelect(mockMeatChicken);

            expect(component.selectedGroups).toEqual([mockVegetableAubergine, mockMeatChicken]);
        });

        it('should allow only unique groups in multi-selection mode', () => {
            component.mode = 'multiple';

            component.onSelect(mockVegetableAubergine);
            component.onSelect(mockMeatChicken);
            component.onSelect(mockMeatChicken);
            component.onSelect(mockVegetableAubergine);

            expect(component.selectedGroups).toEqual([mockVegetableAubergine, mockMeatChicken]);
        });

        it('should show an error message and icon if the search result empty', async () => {
            findGroupsByNameSpy.and.returnValue(of([]));

            await searchGroupsAndBlur('INCORRECTVALUE');

            const errorMessage = element.querySelector('[data-automation-id="invalid-groups-typing-error"]');
            expect(errorMessage).not.toBeNull();
            expect(errorMessage.textContent).toContain('ADF_CLOUD_GROUPS.ERROR.NOT_FOUND');
            const errorIcon = element.querySelector('.adf-error-icon').textContent;
            expect(errorIcon).toEqual('error_outline');
        });
    });

    describe('No preselected groups', () => {
        beforeEach(async () => {
            fixture.detectChanges();
        });

        it('should not pre-select any group when preSelectGroups is empty - single mode', async () => {
            component.mode = 'single';
            fixture.detectChanges();

            const chips = await loader.getAllHarnesses(MatChipHarness);
            expect(chips.length).toEqual(0);
        });

        it('should not pre-select any group when preSelectGroups is empty - multiple mode', async () => {
            component.mode = 'multiple';
            fixture.detectChanges();

            const chips = await loader.getAllHarnesses(MatChipHarness);
            expect(chips.length).toEqual(0);
        });
    });

    describe('Single Mode with pre-selected groups', () => {
        const changes = new SimpleChange(null, mockFoodGroups, false);

        beforeEach(() => {
            component.mode = 'single';
            component.preSelectGroups = mockFoodGroups;
            component.ngOnChanges({ preSelectGroups: changes });
            fixture.detectChanges();
        });

        it('should show only one mat chip with the first preSelectedGroup', async () => {
            const chips = await loader.getAllHarnesses(MatChipHarness);
            expect(chips.length).toEqual(1);
            const testId = await (await chips[0].host()).getAttribute('data-automation-id');
            expect(testId).toEqual(`adf-cloud-group-chip-${mockVegetableAubergine.name}`);
        });
    });

    describe('Multiple Mode with pre-selected groups', () => {
        const change = new SimpleChange(null, mockFoodGroups, false);

        beforeEach(() => {
            component.mode = 'multiple';
            component.preSelectGroups = mockFoodGroups;
            component.ngOnChanges({ preSelectGroups: change });
            fixture.detectChanges();
        });

        it('should render all preselected groups', async () => {
            component.mode = 'multiple';
            fixture.detectChanges();
            component.ngOnChanges({ preSelectGroups: change });
            fixture.detectChanges();

            const chips = await loader.getAllHarnesses(MatChipHarness);
            expect(chips.length).toBe(2);
        });

        it('should removeGroup and changedGroups emit when a selected group is removed', async () => {
            const removeGroupEmitterSpy = spyOn(component.removeGroup, 'emit');
            const changedGroupsEmitterSpy = spyOn(component.changedGroups, 'emit');
            component.mode = 'multiple';

            const chip = await loader.getHarness(MatChipHarness);
            const icon = await chip.getHarness(MatIconHarness);
            await (await icon.host()).click();

            await fixture.whenStable();
            expect(removeGroupEmitterSpy).toHaveBeenCalledWith(mockVegetableAubergine);
            expect(changedGroupsEmitterSpy).toHaveBeenCalledWith([mockMeatChicken]);
            expect(
                component.selectedGroups.indexOf({
                    id: mockMeatChicken.id,
                    name: mockMeatChicken.name
                })
            ).toEqual(-1);
        });
    });

    describe('Multiple Mode with read-only', () => {
        it('Should not show remove icon for pre-selected groups if readonly property set to true', async () => {
            component.mode = 'multiple';
            component.preSelectGroups = [{ id: mockVegetableAubergine.id, name: mockVegetableAubergine.name, readonly: true }, mockMeatChicken];
            const changes = new SimpleChange(null, [{ name: mockVegetableAubergine.name }], false);
            component.ngOnChanges({ preSelectGroups: changes });
            fixture.detectChanges();
            await fixture.whenStable();

            const chips = await loader.getAllHarnesses(MatChipHarness);
            expect(chips.length).toBe(2);

            const removeIconAubergine = element.querySelector(
                `[data-automation-id="adf-cloud-group-chip-remove-icon-${mockVegetableAubergine.name}"]`
            );
            expect(removeIconAubergine).toBeNull();
            const removeIconPepper = element.querySelector(`[data-automation-id="adf-cloud-group-chip-remove-icon-${mockMeatChicken.name}"]`);
            expect(removeIconPepper).not.toBeNull();
        });

        it('Should be able to remove preselected groups if readonly property set to false', async () => {
            component.mode = 'multiple';
            component.preSelectGroups = mockFoodGroups;

            const change = new SimpleChange(null, component.preSelectGroups, false);
            component.ngOnChanges({ preSelectGroups: change });

            const removeGroupSpy = spyOn(component.removeGroup, 'emit');
            fixture.detectChanges();

            let chips = await loader.getAllHarnesses(MatChipHarness);
            expect(chips.length).toBe(2);

            const removeIcon = element.querySelector<HTMLElement>(`[data-automation-id="adf-cloud-group-chip-remove-icon-${mockMeatChicken.name}"]`);
            removeIcon.click();
            fixture.detectChanges();

            expect(removeGroupSpy).toHaveBeenCalled();

            chips = await loader.getAllHarnesses(MatChipHarness);
            expect(chips.length).toBe(1);
        });

        it('should removeDuplicatedGroups return only unique groups', () => {
            const duplicatedGroups = [mockMeatChicken, mockMeatChicken];
            expect(component.removeDuplicatedGroups(duplicatedGroups)).toEqual([mockMeatChicken]);
        });
    });

    describe('Preselected groups and validation enabled', () => {
        beforeEach(() => {
            spyOn(identityGroupService, 'search').and.throwError('Invalid group');
            component.validate = true;
            component.preSelectGroups = mockFoodGroups;
        });

        it('should check validation only for the first group and emit warning when group is invalid - single mode', async () => {
            component.mode = 'single';

            component.ngOnChanges({ preSelectGroups: new SimpleChange(null, [mockVegetableAubergine, mockMeatChicken], false) });
            fixture.detectChanges();
            await fixture.whenStable();
            expect(component.invalidGroups.length).toEqual(1);
        });

        it('should check validation for all the groups and emit warning - multiple mode', async () => {
            component.mode = 'multiple';

            component.ngOnChanges({ preSelectGroups: new SimpleChange(null, [mockVegetableAubergine, mockMeatChicken], false) });
            fixture.detectChanges();
            await fixture.whenStable();
            expect(component.invalidGroups.length).toEqual(2);
        });
    });

    describe('Component readonly mode', () => {
        const change = new SimpleChange(null, mockFoodGroups, false);

        it('should chip list be disabled and show one single chip - single mode', async () => {
            component.mode = 'single';
            component.readOnly = true;
            component.preSelectGroups = mockFoodGroups;
            component.ngOnChanges({ preSelectGroups: change });

            fixture.detectChanges();

            const chips = await loader.getAllHarnesses(MatChipHarness);
            expect(chips.length).toBe(1);
            expect(await chips[0].isDisabled()).toBe(true);
        });

        it('should chip list be disabled and show all the chips - multiple mode', async () => {
            component.mode = 'multiple';
            component.readOnly = true;
            component.preSelectGroups = mockFoodGroups;
            component.ngOnChanges({ preSelectGroups: change });

            fixture.detectChanges();

            const chips = await loader.getAllHarnesses(MatChipHarness);
            expect(chips.length).toBe(2);
            expect(await chips[0].isDisabled()).toBe(true);
            expect(await chips[1].isDisabled()).toBe(true);
        });
    });
});
