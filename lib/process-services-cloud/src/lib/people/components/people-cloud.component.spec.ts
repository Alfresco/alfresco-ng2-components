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

import { PeopleCloudComponent } from './people-cloud.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import {
    setupTestBed,
    IdentityUserModel
} from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { of } from 'rxjs';
import { mockUsers } from '../mock/user-cloud.mock';
import { SimpleChange, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { PeopleCloudServiceInterface } from '../../services/people-cloud-service.interface';
import { CustomMockPeopleCloudService, customServiceMockUsers } from '../mock/custom-people-cloud-mock.service';
import { PEOPLE_CLOUD_SEARCH_SERVICE_TOKEN } from '../../services/cloud-token.service';

describe('PeopleCloudComponent', () => {
    let component: PeopleCloudComponent;
    let fixture: ComponentFixture<PeopleCloudComponent>;
    let element: HTMLElement;
    let peopleCloudService: PeopleCloudServiceInterface;
    let findUsersBasedOnAppSpy: jasmine.Spy;
    let filterUsersBasedOnRolesSpy: jasmine.Spy;
    let findUsersSpy: jasmine.Spy;
    let getClientIdByApplicationNameSpy: jasmine.Spy;
    let validatePreselectedUserSpy: jasmine.Spy;

    const mockPreselectedUsers = [
        { id: mockUsers[1].id, username: mockUsers[1].username },
        { id: mockUsers[2].id, username: mockUsers[2].username }
    ];

    function getElement<T = HTMLElement>(selector: string): T {
        return <T> fixture.nativeElement.querySelector(selector);
    }

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ],
        schemas: [NO_ERRORS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PeopleCloudComponent);
        component = fixture.componentInstance;

        peopleCloudService = component.peopleCloudService;
        findUsersSpy = spyOn(peopleCloudService, 'findUsers').and.returnValue(of(mockUsers));
        findUsersBasedOnAppSpy = spyOn(peopleCloudService, 'findUsersBasedOnApp').and.returnValue(of(mockUsers));
        filterUsersBasedOnRolesSpy = spyOn(peopleCloudService, 'filterUsersBasedOnRoles').and.returnValue(of(mockUsers));
        validatePreselectedUserSpy = spyOn(peopleCloudService, 'validatePreselectedUser').and.returnValue(of(mockUsers[0]));
        getClientIdByApplicationNameSpy = spyOn(peopleCloudService, 'getClientIdByApplicationName').and.returnValue(of('mock-client-id'));
    });

    it('should populate placeholder when title is present', () => {
        component.title = 'TITLE_KEY';
        fixture.detectChanges();
        const matLabel = getElement<HTMLInputElement>('#adf-people-cloud-title-id');

        expect(matLabel.textContent).toEqual('TITLE_KEY');
    });

    it('should not populate placeholder when title is not present', () => {
        fixture.detectChanges();
        const matLabel = getElement<HTMLInputElement>('#adf-people-cloud-title-id');

        expect(matLabel.textContent).toEqual('');
    });

    describe('Search user', () => {
        beforeEach((() => {
            // fixture.detectChanges();
            element = fixture.nativeElement;
            fixture.detectChanges();
        }));

        it('should list the users as dropdown options if the search term has results', async () => {
            const input = getElement<HTMLInputElement>('input');
            input.focus();
            input.value = 'first';
            input.dispatchEvent(new Event('keyup'));
            input.dispatchEvent(new Event('input'));

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(fixture.debugElement.queryAll(By.css('[data-automation-id="adf-people-cloud-row"]')).length).toEqual(3);
            expect(findUsersSpy).toHaveBeenCalled();
        });

        it('should not be able to search for a user that his username matches one of the preselected users username', async () => {
            component.preSelectUsers = [{ username: mockUsers[0].username }];
            const changes = new SimpleChange(null, [{ username: mockUsers[0].username }], false);
            component.ngOnChanges({ 'preSelectUsers': changes });
            fixture.detectChanges();

            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'first-name';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(fixture.debugElement.queryAll(By.css('[data-automation-id="adf-people-cloud-row"]')).length).toEqual(2);
        });

        it('should not be able to search for a user that his id matches one of the preselected users id', async () => {
            component.preSelectUsers = [{ id: mockUsers[0].id }];
            const changes = new SimpleChange(null, [{ id: mockUsers[0].id }], false);
            component.ngOnChanges({ 'preSelectUsers': changes });
            fixture.detectChanges();

            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'first-name';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(fixture.debugElement.queryAll(By.css('mat-option')).length).toEqual(2);
        });

        it('should not be able to search for a user that his email matches one of the preselected users email', async () => {
            component.preSelectUsers = [{ email: mockUsers[0].email }];
            const changes = new SimpleChange(null, [{ email: mockUsers[0].email }], false);
            component.ngOnChanges({ 'preSelectUsers': changes });
            fixture.detectChanges();

            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'first-name';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(fixture.debugElement.queryAll(By.css('mat-option')).length).toEqual(2);
                done();
            });
        });

        it('should not be able to search for a user that his email matches one of the excluded users email', (done) => {
            component.excludedUsers = [{ email: mockUsers[0].email }];
            fixture.detectChanges();

            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'first-name';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(fixture.debugElement.queryAll(By.css('mat-option')).length).toEqual(2);
                done();
            });
        });

        it('should not be able to search for a user that his id matches one of the excluded users id', (done) => {
            component.excludedUsers = [{ email: mockUsers[0].email }];
            fixture.detectChanges();

            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'first-name';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(fixture.debugElement.queryAll(By.css('mat-option')).length).toEqual(2);
                done();
            });
        });

        it('should not be able to search for a user that his username matches one of the excluded users username', (done) => {
            component.excludedUsers = [{ email: mockUsers[0].email }];
            fixture.detectChanges();

            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'first-name';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(fixture.debugElement.queryAll(By.css('mat-option')).length).toEqual(2);
        });

        it('should hide result list if input is empty', async () => {
            fixture.detectChanges();

            const input = getElement<HTMLInputElement>('input');
            input.focus();
            input.value = '';
            input.dispatchEvent(new Event('keyup'));
            input.dispatchEvent(new Event('input'));

            fixture.detectChanges();
            await fixture.whenStable();
            expect(element.querySelector('[data-automation-id="adf-people-cloud-row"]')).toBeNull();
        });

        it('should update selected users when a user is selected', async () => {
            const user = { username: 'username' };
            fixture.detectChanges();
            const selectEmitSpy = spyOn(component.selectUser, 'emit');
            const changedUsersSpy = spyOn(component.changedUsers, 'emit');

            component.onSelect(user);
            fixture.detectChanges();
            await fixture.whenStable();

            expect(selectEmitSpy).toHaveBeenCalledWith(user);
            expect(changedUsersSpy).toHaveBeenCalledWith([user]);
            expect(component.getSelectedUsers()).toEqual([user]);
        });

        it('should replace the user in single-selection mode', () => {
            component.mode = 'single';

            const user1: IdentityUserModel = { id: '1', username: 'user1', email: 'user1@mail.com' };
            const user2: IdentityUserModel = { id: '2', username: 'user2', email: 'user2@mail.com' };

            component.onSelect(user1);
            expect(component.getSelectedUsers()).toEqual([user1]);

            component.onSelect(user2);
            expect(component.getSelectedUsers()).toEqual([user2]);
        });

        it('should allow multiple users in multi-selection mode', () => {
            component.mode = 'multiple';

            const user1: IdentityUserModel = { id: '1', username: 'user1', email: 'user1@mail.com' };
            const user2: IdentityUserModel = { id: '2', username: 'user2', email: 'user2@mail.com' };

            component.onSelect(user1);
            component.onSelect(user2);

            expect(component.getSelectedUsers()).toEqual([user1, user2]);
        });

        it('should allow only unique users in multi-selection mode', () => {
            component.mode = 'multiple';

            const user1: IdentityUserModel = { id: '1', username: 'user1', email: 'user1@mail.com' };
            const user2: IdentityUserModel = { id: '2', username: 'user2', email: 'user2@mail.com' };

            component.onSelect(user1);
            component.onSelect(user2);
            component.onSelect(user1);
            component.onSelect(user2);

            expect(component.getSelectedUsers()).toEqual([user1, user2]);
        });

        it('should show an error message if the search result empty', async () => {
            findUsersSpy.and.returnValue(of([]));
            fixture.detectChanges();

            const input = getElement<HTMLInputElement>('input');
            input.focus();
            input.value = 'ZZZ';
            input.dispatchEvent(new Event('keyup'));
            input.dispatchEvent(new Event('input'));

            fixture.detectChanges();
            await fixture.whenStable();
            input.blur();
            fixture.detectChanges();
            const errorMessage = element.querySelector('[data-automation-id="invalid-users-typing-error"]');

            expect(errorMessage).not.toBeNull();
            expect(errorMessage.textContent).toContain('ADF_CLOUD_USERS.ERROR.NOT_FOUND');
        });
    });

    describe('when application name defined', () => {

        beforeEach(async(() => {
            getClientIdByApplicationNameSpy.and.returnValue(of('mock-client-id'));
            component.preSelectUsers = [];
            component.appName = 'mock-app-name';
            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        it('Should fetch the client ID if appName specified', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            expect(getClientIdByApplicationNameSpy).toHaveBeenCalledWith('mock-app-name');
            expect(component.clientId).toBe('mock-client-id');
        });

        it('should list users who have access to the app when appName is specified', async () => {
            const input = getElement<HTMLInputElement>('input');
            input.focus();
            input.value = 'M';
            input.dispatchEvent(new Event('keyup'));
            input.dispatchEvent(new Event('input'));

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(fixture.debugElement.queryAll(By.css('mat-option')).length).toEqual(3);
        });

        it('should show an error message if the user does not have access', async () => {
            findUsersBasedOnAppSpy.and.returnValue(of([]));
            fixture.detectChanges();

            const input = getElement<HTMLInputElement>('input');
            input.focus();
            input.value = 'ZZZ';
            input.dispatchEvent(new Event('keyup'));
            input.dispatchEvent(new Event('input'));

            fixture.detectChanges();
            await fixture.whenStable();
            input.blur();
            fixture.detectChanges();

            const errorMessage = element.querySelector('[data-automation-id="invalid-users-typing-error"]');
            expect(errorMessage).not.toBeNull();
            expect(errorMessage.textContent).toContain('ADF_CLOUD_USERS.ERROR.NOT_FOUND');
        });
    });

    describe('No preselected users', () => {
        beforeEach(async () => {
            fixture.detectChanges();
        });

        it('should not pre-select any user when preSelectUsers is empty - single mode', () => {
            component.mode = 'single';
            fixture.detectChanges();
            const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
            expect(chips.length).toEqual(0);
        });

        it('should not pre-select any users when preSelectUsers is empty - multiple mode', () => {
            component.mode = 'multiple';
            fixture.detectChanges();
            const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
            expect(chips.length).toEqual(0);
        });
    });

    describe('When roles defined', () => {
        const mockRoles = ['mock-role-1', 'mock-role-2'];
        beforeEach(async(() => {
            component.roles = mockRoles;
            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        it('should filter users if users has any specified role', async () => {
            fixture.detectChanges();

            const input = getElement<HTMLInputElement>('input');
            input.focus();
            input.value = 'Search Term';
            input.dispatchEvent(new Event('input'));

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(fixture.debugElement.queryAll(By.css('[data-automation-id="adf-people-cloud-row"]')).length).toEqual(3);
            expect(filterUsersBasedOnRolesSpy).toHaveBeenCalledWith(mockRoles, 'Search Term');
        });
    });

    describe('Single Mode with Pre-selected PeopleCloudServiceusers', () => {
        const changes = new SimpleChange(null, mockPreselectedUsers, false);

        beforeEach(async(() => {
            component.mode = 'single';
            component.preSelectUsers = <any> mockPreselectedUsers;
            component.ngOnChanges({ 'preSelectUsers': changes });

            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        it('should show only one mat chip with the first preSelectedUser', async () => {
            await fixture.whenStable();
            fixture.detectChanges();
            const chips = fixture.debugElement.queryAll(By.css('mat-chip'));

            expect(chips.length).toEqual(1);
            expect(chips[0].attributes['data-automation-id']).toEqual(`adf-people-cloud-chip-${mockPreselectedUsers[0].username}`);
        });
    });

    describe('Multiple Mode with Pre-selected Users', () => {
        beforeEach(() => {
            component.mode = 'multiple';
        });

        it('should render multiple preselected users', async () => {
            fixture.detectChanges();

            const changes = new SimpleChange(null, mockPreselectedUsers, false);

            component.preSelectUsers = <any> mockPreselectedUsers;
            component.ngOnChanges({ 'preSelectUsers': changes });

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const chips = fixture.debugElement.queryAll(By.css('mat-chip'));

            expect(chips.length).toEqual(2);
            expect(chips[0].attributes['data-automation-id']).toEqual(`adf-people-cloud-chip-${mockPreselectedUsers[0].username}`);
            expect(chips[1].attributes['data-automation-id']).toEqual(`adf-people-cloud-chip-${mockPreselectedUsers[1].username}`);
        });

        it('Should not show remove icon for pre-selected users if readonly property set to true', async () => {
            fixture.detectChanges();

            component.preSelectUsers = [
                { id: mockUsers[0].id, username: mockUsers[0].username, readonly: true },
                { id: mockUsers[1].id, username: mockUsers[1].username, readonly: true }
            ];

            const change = new SimpleChange(null, component.preSelectUsers, false);
            component.ngOnChanges({ 'preSelectUsers': change });

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const chipList = fixture.nativeElement.querySelectorAll('mat-chip-list mat-chip');
            const removeIcon = getElement('[data-automation-id="adf-people-cloud-chip-remove-icon-first-name-1 last-name-1"]');

            expect(chipList.length).toBe(2);
            expect(component.preSelectUsers[0].readonly).toBe(true);
            expect(component.preSelectUsers[1].readonly).toBe(true);
            expect(removeIcon).toBeNull();
        });

        it('Should be able to remove preselected users if readonly property set to false', async () => {
            component.preSelectUsers = [
                { id: mockUsers[0].id, username: mockUsers[0].username, readonly: false },
                { id: mockUsers[1].id, username: mockUsers[1].username, readonly: false }
            ];

            const change = new SimpleChange(null, component.preSelectUsers, false);
            component.ngOnChanges({ 'preSelectUsers': change });

            const removeUserSpy = spyOn(component.removeUser, 'emit');

            fixture.detectChanges();
            await fixture.whenStable();

            const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
            const removeIcon = getElement(`[data-automation-id="adf-people-cloud-chip-remove-icon-${mockPreselectedUsers[0].username}"]`);

            expect(chips.length).toBe(2);
            expect(component.preSelectUsers[0].readonly).toBe(false, 'Removable');
            expect(component.preSelectUsers[1].readonly).toBe(false, 'Removable');

            removeIcon.click();
            fixture.detectChanges();

            expect(removeUserSpy).toHaveBeenCalled();
            expect(fixture.nativeElement.querySelectorAll('mat-chip-list mat-chip').length).toBe(1);
        });

        describe('Component readonly mode', () => {
            const change = new SimpleChange(null, mockPreselectedUsers, false);

            it('should chip list be disabled and show one single chip - single mode', () => {
                component.mode = 'single';
                component.readOnly = true;
                component.preSelectUsers = <any> mockPreselectedUsers;
                component.ngOnChanges({ 'preSelectUsers': change });

                fixture.detectChanges();

                const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
                const chipList = getElement('mat-chip-list');

                expect(chips).toBeDefined();
                expect(chipList).toBeDefined();
                expect(chips.length).toBe(1);
                expect(chipList.attributes['ng-reflect-disabled'].value).toEqual('true');
            });

            it('should chip list be disabled and show mat chips for all the preselected users - multiple mode', () => {
                component.mode = 'multiple';
                component.readOnly = true;
                component.preSelectUsers = <any> mockPreselectedUsers;
                component.ngOnChanges({ 'preSelectUsers': change });

                fixture.detectChanges();

                const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
                const chipList = getElement('mat-chip-list');

                expect(chips).toBeDefined();
                expect(chipList).toBeDefined();
                expect(chips.length).toBe(2);
                expect(chipList.attributes['ng-reflect-disabled'].value).toEqual('true');
            });
        });
    });

    describe('Preselected users and validation enabled', () => {

        it('should check validation only for the first user and emit warning when user is invalid - single mode', (done) => {
            validatePreselectedUserSpy.and.returnValue(of([]));
            const expectedWarning = {
                message: 'INVALID_PRESELECTED_USERS',
                users: [{
                    id: mockPreselectedUsers[0].id,
                    username: mockPreselectedUsers[0].username
                }]
            };
            component.warning.subscribe(warning => {
                expect(warning).toEqual(expectedWarning);
                done();
            });

            component.mode = 'single';
            component.validate = true;
            component.preSelectUsers = <any> [mockPreselectedUsers[0], mockPreselectedUsers[1]];
            component.ngOnChanges({
                'preSelectUsers': new SimpleChange(null, [mockPreselectedUsers[0], mockPreselectedUsers[1]], false)
            });
        });

        it('should skip warnings if validation disabled', () => {
            validatePreselectedUserSpy.and.returnValue(of([]));
            spyOn(component, 'compare').and.returnValue(false);

            let warnings = 0;

            component.warning.subscribe(() => warnings++);
            component.mode = 'single';
            component.validate = false;
            component.preSelectUsers = <any> [mockPreselectedUsers[0], mockPreselectedUsers[1]];
            component.ngOnChanges({
                'preSelectUsers': new SimpleChange(null, [mockPreselectedUsers[0], mockPreselectedUsers[1]], false)
            });

            expect(warnings).toBe(0);
        });

        it('should check validation for all the users and emit warning - multiple mode', (done) => {
            validatePreselectedUserSpy.and.returnValue(of((undefined)));

            const expectedWarning = {
                message: 'INVALID_PRESELECTED_USERS',
                users: [
                    {
                        id: mockPreselectedUsers[0].id,
                        username: mockPreselectedUsers[0].username
                    },
                    {
                        id: mockPreselectedUsers[1].id,
                        username: mockPreselectedUsers[1].username
                    }
                ]
            };

            component.warning.subscribe(warning => {
                expect(warning).toEqual(expectedWarning);
                done();
            });

            component.mode = 'multiple';
            component.validate = true;
            component.preSelectUsers = <any> [mockPreselectedUsers[0], mockPreselectedUsers[1]];
            component.ngOnChanges({
                'preSelectUsers': new SimpleChange(null, [mockPreselectedUsers[0], mockPreselectedUsers[1]], false)
            });
        });
    });

    it('should removeDuplicateUsers return only unique users', () => {
        const duplicatedUsers = [{ id: mockUsers[0].id }, { id: mockUsers[0].id }];
        expect(component.removeDuplicatedUsers(duplicatedUsers)).toEqual([{ id: mockUsers[0].id }]);
    });
});

describe('PeopleCloudComponent with Custom service', () => {
    let component: PeopleCloudComponent;
    let fixture: ComponentFixture<PeopleCloudComponent>;
    let customPeopleCloudService: CustomMockPeopleCloudService;
    let findUsersSpy: jasmine.Spy;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ],
        providers: [
            { provide: PEOPLE_CLOUD_SEARCH_SERVICE_TOKEN, useClass: CustomMockPeopleCloudService }
        ],
        schemas: [NO_ERRORS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PeopleCloudComponent);
        component = fixture.componentInstance;

        customPeopleCloudService = component.peopleCloudService;
        findUsersSpy = spyOn(customPeopleCloudService, 'findUsers').and.returnValue(of(customServiceMockUsers));
    });

    it('Should be able to create/inject custom serivce to the people component', () => {
        fixture.detectChanges();

        expect(component.peopleCloudService instanceof CustomMockPeopleCloudService).toBe(true);
    });

    it('Should be able to search/fetch users from custom serivce', async () => {
        fixture.detectChanges();
        const input = fixture.nativeElement.querySelector('input');
        input.focus();
        input.value = 'custom';
        input.dispatchEvent(new Event('keyup'));
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const searchResult = fixture.debugElement.queryAll(By.css('[data-automation-id="adf-people-cloud-row"]'));

        expect(searchResult.length).toBe(2);
        expect(findUsersSpy).toHaveBeenCalledWith('custom');
    });
});
