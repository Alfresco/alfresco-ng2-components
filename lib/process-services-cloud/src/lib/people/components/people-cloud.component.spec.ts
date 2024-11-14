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

import { PeopleCloudComponent } from './people-cloud.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreTestingModule } from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { DebugElement, SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { mockFoodUsers, mockKielbasaSausage, mockShepherdsPie, mockYorkshirePudding, mockPreselectedFoodUsers } from '../mock/people-cloud.mock';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatChipHarness } from '@angular/material/chips/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { IdentityUserService } from '@alfresco/adf-process-services-cloud';

describe('PeopleCloudComponent', () => {
    let loader: HarnessLoader;
    let component: PeopleCloudComponent;
    let fixture: ComponentFixture<PeopleCloudComponent>;
    let element: HTMLElement;
    let identityUserService: IdentityUserService;
    let searchSpy: jasmine.Spy;

    /**
     * Search users by value
     * @param value value
     */
    async function searchUsers(value: string) {
        const input = await loader.getHarness(MatInputHarness);
        await input.focus();
        await input.setValue(value);
    }

    /**
     * Search users and blur the input
     * @param value value
     */
    async function searchUsersAndBlur(value: string) {
        const input = await loader.getHarness(MatInputHarness);
        await input.focus();
        await input.setValue(value);
        await input.blur();
    }

    /**
     * Get users list UI
     * @returns list of debug elements
     */
    function getUsersListUI(): DebugElement[] {
        return fixture.debugElement.queryAll(By.css('[data-automation-id="adf-people-cloud-row"]'));
    }

    /**
     * Get the first user from the list
     * @returns native element
     */
    function getFirstUserFromListUI(): Element {
        return element.querySelector('[data-automation-id="adf-people-cloud-row"]');
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule, ProcessServiceCloudTestingModule, PeopleCloudComponent]
        });
        fixture = TestBed.createComponent(PeopleCloudComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        identityUserService = fixture.debugElement.injector.get(IdentityUserService);
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should populate label when title is present', async () => {
        component.title = 'TITLE_KEY';
        fixture.detectChanges();

        const inputField = await loader.getHarness(MatFormFieldHarness.with({ selector: '.adf-people-cloud' }));

        expect(await inputField.getLabel()).toEqual('TITLE_KEY');
    });

    it('should not populate label when title is not present', async () => {
        fixture.detectChanges();

        const inputField = await loader.getHarness(MatFormFieldHarness.with({ selector: '.adf-people-cloud' }));

        expect(await inputField.getLabel()).toBeNull();
    });

    describe('Search user', () => {
        beforeEach(() => {
            fixture.detectChanges();
            element = fixture.nativeElement;
            searchSpy = spyOn(identityUserService, 'search').and.returnValue(of(mockFoodUsers));
            component.preSelectUsers = [];
            component.excludedUsers = [];
        });

        it('should list the users as dropdown options if the search term has results', async () => {
            await searchUsers('first');

            expect(getUsersListUI().length).toEqual(3);
            expect(searchSpy).toHaveBeenCalled();
        });

        it('should not be able to search for a user that his username matches one of the preselected users username', async () => {
            component.preSelectUsers = [mockKielbasaSausage];
            const changes = new SimpleChange(null, [{ username: mockKielbasaSausage.username }], false);
            component.ngOnChanges({ preSelectUsers: changes });
            fixture.detectChanges();

            await searchUsers('first-name');

            expect(getUsersListUI().length).toEqual(2);
        });

        it('should not be able to search for a user that his id matches one of the preselected users id', async () => {
            component.preSelectUsers = [mockKielbasaSausage];
            const changes = new SimpleChange(null, [{ id: mockKielbasaSausage.id }], false);
            component.ngOnChanges({ preSelectUsers: changes });
            fixture.detectChanges();

            await searchUsers('first-name');

            expect(getUsersListUI().length).toEqual(2);
        });

        it('should not be able to search for a user that his email matches one of the preselected users email', async () => {
            component.preSelectUsers = [mockKielbasaSausage];
            const changes = new SimpleChange(null, [{ email: mockKielbasaSausage.email }], false);
            component.ngOnChanges({ preSelectUsers: changes });
            fixture.detectChanges();

            await searchUsers('first-name');

            expect(getUsersListUI().length).toEqual(2);
        });

        it('should not be able to search for a user that his email matches one of the excluded users email', async () => {
            component.excludedUsers = [
                { email: mockKielbasaSausage.email, username: 'new-username', firstName: 'new-first-name', lastName: 'new-last-name' }
            ];
            fixture.detectChanges();

            await searchUsers('first-name');

            expect(getUsersListUI().length).toEqual(2);
        });

        it('should not be able to search for a user that his id matches one of the excluded users id', async () => {
            component.excludedUsers = [
                {
                    id: mockKielbasaSausage.id,
                    username: 'new-username',
                    firstName: 'new-first-name',
                    lastName: 'new-last-name',
                    email: 'new-email@food.com'
                }
            ];
            fixture.detectChanges();

            await searchUsers('first-name');

            expect(getUsersListUI().length).toEqual(2);
        });

        it('should not be able to search for a user that his username matches one of the excluded users username', async () => {
            component.excludedUsers = [
                { username: mockKielbasaSausage.username, firstName: 'new-first-name', lastName: 'new-last-name', email: 'new-email@food.com' }
            ];
            fixture.detectChanges();

            await searchUsers('first-name');

            expect(getUsersListUI().length).toEqual(2);
        });

        it('should hide result list if input is empty', async () => {
            fixture.detectChanges();

            await searchUsers('');
            expect(getFirstUserFromListUI()).toBeNull();
        });

        it('should update selected users when a user is selected', () => {
            fixture.detectChanges();
            const selectEmitSpy = spyOn(component.selectUser, 'emit');
            const changedUsersSpy = spyOn(component.changedUsers, 'emit');

            component.onSelect(mockShepherdsPie);
            fixture.detectChanges();

            expect(selectEmitSpy).toHaveBeenCalledWith(mockShepherdsPie);
            expect(changedUsersSpy).toHaveBeenCalledWith([mockShepherdsPie]);
            expect(component.getSelectedUsers()).toEqual([mockShepherdsPie]);
        });

        it('should replace the user in single-selection mode', () => {
            component.mode = 'single';

            component.onSelect(mockShepherdsPie);
            expect(component.getSelectedUsers()).toEqual([mockShepherdsPie]);

            component.onSelect(mockYorkshirePudding);
            expect(component.getSelectedUsers()).toEqual([mockYorkshirePudding]);
        });

        it('should allow multiple users in multi-selection mode', () => {
            component.mode = 'multiple';

            component.onSelect(mockShepherdsPie);
            component.onSelect(mockYorkshirePudding);

            expect(component.getSelectedUsers()).toEqual([mockShepherdsPie, mockYorkshirePudding]);
        });

        it('should allow only unique users in multi-selection mode', () => {
            component.mode = 'multiple';

            component.onSelect(mockShepherdsPie);
            component.onSelect(mockYorkshirePudding);
            component.onSelect(mockShepherdsPie);
            component.onSelect(mockYorkshirePudding);

            expect(component.getSelectedUsers()).toEqual([mockShepherdsPie, mockYorkshirePudding]);
        });

        it('should show an error message if the search result empty', async () => {
            searchSpy.and.returnValue(of([]));
            fixture.detectChanges();

            await searchUsersAndBlur('INCORRECTVALUE');

            const errorMessage = element.querySelector('[data-automation-id="invalid-users-typing-error"]');
            expect(errorMessage).not.toBeNull();
            expect(errorMessage.textContent).toContain('ADF_CLOUD_USERS.ERROR.NOT_FOUND');
        });

        it('should display proper error icon', async () => {
            searchSpy.and.returnValue(of([]));
            fixture.detectChanges();

            await searchUsersAndBlur('INCORRECTVALUE');

            const errorIcon = element.querySelector('.adf-error-icon').textContent;
            expect(errorIcon).toEqual('error_outline');
        });

        it('should not search user if typed no character', async () => {
            await searchUsers('');

            expect(searchSpy).not.toHaveBeenCalled();
        });
    });

    describe('No preselected users', () => {
        it('should not pre-select any user when preSelectUsers is empty - single mode', async () => {
            component.mode = 'single';
            fixture.detectChanges();

            const chips = await loader.getAllHarnesses(MatChipHarness);
            expect(chips.length).toBe(0);
        });

        it('should not pre-select any users when preSelectUsers is empty - multiple mode', async () => {
            component.mode = 'multiple';
            fixture.detectChanges();

            const chips = await loader.getAllHarnesses(MatChipHarness);
            expect(chips.length).toEqual(0);
        });
    });

    describe('Single Mode with Pre-selected users', () => {
        const changes = new SimpleChange(null, mockPreselectedFoodUsers, false);

        beforeEach(() => {
            component.mode = 'single';
            component.preSelectUsers = mockPreselectedFoodUsers;
            component.ngOnChanges({ preSelectUsers: changes });

            fixture.detectChanges();
            element = fixture.nativeElement;
        });

        it('should show only one mat chip with the first preSelectedUser', async () => {
            const chips = await loader.getAllHarnesses(MatChipHarness);
            expect(chips.length).toEqual(1);

            const testId = await (await chips[0].host()).getAttribute('data-automation-id');
            expect(testId).toEqual(`adf-people-cloud-chip-${mockPreselectedFoodUsers[0].username}`);
        });
    });

    describe('Multiple Mode with Pre-selected Users', () => {
        beforeEach(() => {
            component.mode = 'multiple';
        });

        it('should render multiple preselected users', async () => {
            const changes = new SimpleChange(null, mockPreselectedFoodUsers, false);

            component.preSelectUsers = mockPreselectedFoodUsers;
            component.ngOnChanges({ preSelectUsers: changes });

            await fixture.whenStable();
            fixture.detectChanges();

            const chips = await loader.getAllHarnesses(MatChipHarness);
            expect(chips.length).toEqual(2);

            const testId1 = await (await chips[0].host()).getAttribute('data-automation-id');
            const testId2 = await (await chips[1].host()).getAttribute('data-automation-id');

            expect(testId1).toEqual(`adf-people-cloud-chip-${mockPreselectedFoodUsers[0].username}`);
            expect(testId2).toEqual(`adf-people-cloud-chip-${mockPreselectedFoodUsers[1].username}`);
        });

        it('Should not show remove icon for pre-selected users if readonly property set to true', async () => {
            component.preSelectUsers = [
                { ...mockKielbasaSausage, readonly: true },
                { ...mockYorkshirePudding, readonly: true }
            ];

            const change = new SimpleChange(null, component.preSelectUsers, false);
            component.ngOnChanges({ preSelectUsers: change });

            fixture.detectChanges();
            await fixture.whenStable();

            const removeIcon = element.querySelector(
                `[data-automation-id="adf-people-cloud-chip-remove-icon-${mockPreselectedFoodUsers[0].username}"]`
            );

            const chips = await loader.getAllHarnesses(MatChipHarness);
            expect(chips.length).toBe(2);

            expect(component.preSelectUsers[0].readonly).toBeTruthy();
            expect(component.preSelectUsers[1].readonly).toBeTruthy();
            expect(removeIcon).toBeNull();
        });

        it('Should be able to remove preselected users if readonly property set to false', async () => {
            component.preSelectUsers = mockPreselectedFoodUsers;

            const change = new SimpleChange(null, component.preSelectUsers, false);
            component.ngOnChanges({ preSelectUsers: change });

            const removeUserSpy = spyOn(component.removeUser, 'emit');

            fixture.detectChanges();
            await fixture.whenStable();

            const removeIcon = element.querySelector<HTMLElement>(
                `[data-automation-id="adf-people-cloud-chip-remove-icon-${mockPreselectedFoodUsers[0].username}"]`
            );

            let chips = await loader.getAllHarnesses(MatChipHarness);
            expect(chips.length).toBe(2);

            expect(component.preSelectUsers[0].readonly).toBe(false);
            expect(component.preSelectUsers[1].readonly).toBe(false);

            removeIcon.click();
            fixture.detectChanges();

            expect(removeUserSpy).toHaveBeenCalled();

            chips = await loader.getAllHarnesses(MatChipHarness);
            expect(chips.length).toBe(1);
        });

        describe('Component readonly mode', () => {
            const change = new SimpleChange(null, mockPreselectedFoodUsers, false);

            it('should chip list be disabled and show one single chip - single mode', async () => {
                component.mode = 'single';
                component.readOnly = true;
                component.preSelectUsers = mockPreselectedFoodUsers;
                component.ngOnChanges({ preSelectUsers: change });

                fixture.detectChanges();

                const chips = await loader.getAllHarnesses(MatChipHarness);
                expect(chips.length).toBe(1);
                expect(await chips[0].isDisabled()).toBe(true);
            });

            it('should chip list be disabled and show mat chips for all the preselected users - multiple mode', async () => {
                component.mode = 'multiple';
                component.readOnly = true;
                component.preSelectUsers = mockPreselectedFoodUsers;
                component.ngOnChanges({ preSelectUsers: change });

                fixture.detectChanges();

                const chips = await loader.getAllHarnesses(MatChipHarness);
                expect(chips.length).toBe(2);
                expect(await chips[0].isDisabled()).toBe(true);
                expect(await chips[1].isDisabled()).toBe(true);
            });
        });
    });

    describe('Preselected users and validation enabled', () => {
        beforeEach(() => {
            spyOn(identityUserService, 'search').and.throwError('Invalid user');
            component.validate = true;
            component.preSelectUsers = [mockPreselectedFoodUsers[0], mockPreselectedFoodUsers[1]];
        });

        it('should check validation only for the first user and emit warning when user is invalid - single mode', async () => {
            component.mode = 'single';
            component.ngOnChanges({
                preSelectUsers: new SimpleChange(null, [mockPreselectedFoodUsers[0], mockPreselectedFoodUsers[1]], false)
            });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.invalidUsers.length).toEqual(1);
        });

        it('should check validation for all the users and emit warning - multiple mode', async () => {
            component.mode = 'multiple';
            component.ngOnChanges({
                preSelectUsers: new SimpleChange(null, [mockPreselectedFoodUsers[0], mockPreselectedFoodUsers[1]], false)
            });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.invalidUsers.length).toEqual(2);
        });

        it('should skip warnings if validation disabled', async () => {
            spyOn(component, 'equalsUsers').and.returnValue(false);
            component.mode = 'multiple';
            component.validate = false;
            component.ngOnChanges({
                preSelectUsers: new SimpleChange(null, [mockPreselectedFoodUsers[0], mockPreselectedFoodUsers[1]], false)
            });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.invalidUsers.length).toEqual(0);
        });
    });

    it('should removeDuplicateUsers return only unique users', () => {
        const duplicatedUsers = [mockShepherdsPie, mockShepherdsPie];
        expect(component.removeDuplicatedUsers(duplicatedUsers)).toEqual([mockShepherdsPie]);
    });
});
