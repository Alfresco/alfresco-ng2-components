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
import { of } from 'rxjs';
import { ProcessServiceCloudTestingModule } from './../../testing/process-service-cloud.testing.module';

import { GroupCloudModule } from '../group-cloud.module';
import { GroupCloudComponent } from './group-cloud.component';
import {
    setupTestBed,
    CoreTestingModule
} from '@alfresco/adf-core';
import { SimpleChange } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IdentityGroupService } from '../services/identity-group.service';
import { mockFoodGroups, mockMeatChicken, mockVegetableAubergine } from '../mock/group-cloud.mock';

describe('GroupCloudComponent', () => {
    let component: GroupCloudComponent;
    let fixture: ComponentFixture<GroupCloudComponent>;
    let element: HTMLElement;
    let identityGroupService: IdentityGroupService;
    let findGroupsByNameSpy: jasmine.Spy;

    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    function getElement<T = HTMLElement>(selector: string): T {
        return fixture.nativeElement.querySelector(selector);
    }

    async function searchGroup(value: string) {
        const input = getElement<HTMLInputElement>('input');
        input.focus();
        input.value = value;
        input.dispatchEvent(new Event('keyup'));
        input.dispatchEvent(new Event('input'));

        await fixture.whenStable();
        fixture.detectChanges();
    }

    async function searchGroupsAndBlur(value: string) {
        const input = getElement<HTMLInputElement>('input');
        input.focus();
        input.value = value;
        input.dispatchEvent(new Event('keyup'));
        input.dispatchEvent(new Event('input'));

        await fixture.whenStable();
        fixture.detectChanges();

        input.blur();
        fixture.detectChanges();
    }

    function getGroupListUI() {
        return fixture.debugElement.queryAll(By.css('[data-automation-id="adf-cloud-group-row"]'));
    }

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule,
            ProcessServiceCloudTestingModule,
            GroupCloudModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GroupCloudComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        identityGroupService = TestBed.inject(IdentityGroupService);
    });

    it('should populate placeholder when title is present', () => {
        component.title = 'TITLE_KEY';

        fixture.detectChanges();

        const matLabel = element.querySelector<HTMLInputElement>('#adf-group-cloud-title-id');
        expect(matLabel.textContent).toEqual('TITLE_KEY');
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

        it('should not pre-select any group when preSelectGroups is empty - single mode', () => {
            component.mode = 'single';
            fixture.detectChanges();

            const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
            expect(chips.length).toEqual(0);
        });

        it('should not pre-select any group when preSelectGroups is empty - multiple mode', () => {
            component.mode = 'multiple';
            fixture.detectChanges();

            const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
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

        it('should show only one mat chip with the first preSelectedGroup', () => {
            const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
            expect(chips.length).toEqual(1);
            expect(chips[0].attributes['data-automation-id']).toEqual(`adf-cloud-group-chip-${mockVegetableAubergine.name}`);
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

        it('should render all preselected groups', () => {
            component.mode = 'multiple';
            fixture.detectChanges();
            component.ngOnChanges({ preSelectGroups: change });
            fixture.detectChanges();
            const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
            expect(chips.length).toBe(2);
        });

        it('should removeGroup and changedGroups emit when a selected group is removed', async () => {
            const removeGroupEmitterSpy = spyOn(component.removeGroup, 'emit');
            const changedGroupsEmitterSpy = spyOn(component.changedGroups, 'emit');
            component.mode = 'multiple';

            const removeIcon = fixture.debugElement.query(By.css('mat-chip mat-icon'));
            removeIcon.nativeElement.click();
            fixture.detectChanges();

            await fixture.whenStable();
            expect(removeGroupEmitterSpy).toHaveBeenCalledWith(mockVegetableAubergine);
            expect(changedGroupsEmitterSpy).toHaveBeenCalledWith([mockMeatChicken]);
            expect(component.selectedGroups.indexOf({
                id: mockMeatChicken.id,
                name: mockMeatChicken.name
            })).toEqual(-1);
        });
    });

    describe('Multiple Mode with read-only', () => {

        it('Should not show remove icon for pre-selected groups if readonly property set to true', async () => {
            component.mode = 'multiple';
            component.preSelectGroups = [
                { id: mockVegetableAubergine.id, name: mockVegetableAubergine.name, readonly: true },
                mockMeatChicken
            ];
            const changes = new SimpleChange(null, [{ name: mockVegetableAubergine.name }], false);
            component.ngOnChanges({ preSelectGroups: changes });
            fixture.detectChanges();

            await fixture.whenStable();

            const chipList = fixture.nativeElement.querySelectorAll('mat-chip-list mat-chip');

            expect(chipList.length).toBe(2);
            const removeIconAubergine = getElement(`[data-automation-id="adf-cloud-group-chip-remove-icon-${mockVegetableAubergine.name}"]`);
            expect(removeIconAubergine).toBeNull();
            const removeIconPepper = getElement(`[data-automation-id="adf-cloud-group-chip-remove-icon-${mockMeatChicken.name}"]`);
            expect(removeIconPepper).not.toBeNull();

        });

        it('Should be able to remove preselected groups if readonly property set to false', async () => {
            component.mode = 'multiple';
            component.preSelectGroups = mockFoodGroups;

            const change = new SimpleChange(null, component.preSelectGroups, false);
            component.ngOnChanges({ preSelectGroups: change });

            const removeGroupSpy = spyOn(component.removeGroup, 'emit');
            fixture.detectChanges();

            fixture.whenStable();
            fixture.detectChanges();

            const chipList = fixture.nativeElement.querySelectorAll('mat-chip-list mat-chip');
            expect(chipList.length).toBe(2);

            const removeIcon = getElement(`[data-automation-id="adf-cloud-group-chip-remove-icon-${mockMeatChicken.name}"]`);
            removeIcon.click();
            fixture.detectChanges();

            expect(removeGroupSpy).toHaveBeenCalled();
            expect(fixture.nativeElement.querySelectorAll('mat-chip-list mat-chip').length).toBe(1);
        });

        it('should removeDuplicatedGroups return only unique groups', () => {
            const duplicatedGroups = [ mockMeatChicken, mockMeatChicken];
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

        it('should chip list be disabled and show one single chip - single mode', () => {
            component.mode = 'single';
            component.readOnly = true;
            component.preSelectGroups = mockFoodGroups;
            component.ngOnChanges({ preSelectGroups: change });

            fixture.detectChanges();

            const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
            const chipList = getElement('mat-chip-list');

            expect(chips).toBeDefined();
            expect(chipList).toBeDefined();
            expect(chips.length).toBe(1);
            expect(chipList.attributes['ng-reflect-disabled']?.value).toEqual('true');
        });

        it('should chip list be disabled and show all the chips - multiple mode', () => {
            component.mode = 'multiple';
            component.readOnly = true;
            component.preSelectGroups = mockFoodGroups;
            component.ngOnChanges({ preSelectGroups: change });

            fixture.detectChanges();

            const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
            const chipList = getElement('mat-chip-list');

            expect(chips).toBeDefined();
            expect(chipList).toBeDefined();
            expect(chips.length).toBe(2);
            expect(chipList.attributes['ng-reflect-disabled']?.value).toEqual('true');
        });
    });

});
