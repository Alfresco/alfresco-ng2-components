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
    IdentityUserService,
    AlfrescoApiService,
    CoreModule,
    setupTestBed
} from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { of } from 'rxjs';
import { mockUsers } from '../mock/user-cloud.mock';
import { PeopleCloudModule } from '../people-cloud.module';
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PeopleCloudComponent', () => {
    let component: PeopleCloudComponent;
    let fixture: ComponentFixture<PeopleCloudComponent>;
    let element: HTMLElement;
    let identityService: IdentityUserService;
    let alfrescoApiService: AlfrescoApiService;
    let findUsersByNameSpy: jasmine.Spy;

    const mock = {
        oauth2Auth: {
            callCustomApi: () => Promise.resolve(mockUsers)
        }
    };

    const mockPreselectedUsers = [
        { id: mockUsers[1].id, username: mockUsers[1].username },
        { id: mockUsers[2].id, username: mockUsers[2].username }
    ];

    setupTestBed({
        imports: [
            CoreModule.forRoot(),
            ProcessServiceCloudTestingModule,
            PeopleCloudModule
        ],
        providers: [
            IdentityUserService
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PeopleCloudComponent);
        component = fixture.componentInstance;
        identityService = TestBed.get(IdentityUserService);
        alfrescoApiService = TestBed.get(AlfrescoApiService);
        spyOn(alfrescoApiService, 'getInstance').and.returnValue(mock);
    });

    it('should create PeopleCloudComponent', () => {
        expect(component instanceof PeopleCloudComponent).toBe(true, 'should create PeopleCloudComponent');
    });

    it('should populate placeholder when title is present', async(() => {
        component.title = 'TITLE_KEY';
        fixture.detectChanges();
        const matLabel: HTMLInputElement = <HTMLInputElement> fixture.nativeElement.querySelector('#adf-people-cloud-title-id');
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(matLabel.textContent).toEqual('TITLE_KEY');
        });
    }));

    it('should not populate placeholder when title is not present', async(() => {
        fixture.detectChanges();
        const matLabel: HTMLInputElement = <HTMLInputElement> fixture.nativeElement.querySelector('#adf-people-cloud-title-id');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(matLabel.textContent).toEqual('');
        });
    }));

    describe('Search user', () => {

        beforeEach(async(() => {
            fixture.detectChanges();
            element = fixture.nativeElement;
            findUsersByNameSpy = spyOn(identityService, 'findUsersByName').and.returnValue(of(mockUsers));
        }));

        it('should list the users as dropdown options if the search term has results', (done) => {
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'first';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(fixture.debugElement.queryAll(By.css('mat-option')).length).toEqual(3);
                expect(findUsersByNameSpy).toHaveBeenCalled();
                done();
            });
        });

        it('should hide result list if input is empty', (done) => {
            fixture.detectChanges();
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = '';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.querySelector('mat-option')).toBeNull();
                done();
            });
        });

        it('should selectedUser and changedUsers emit, update selected users when a user is selected', (done) => {
            const user = { username: 'username' };
            fixture.detectChanges();
            spyOn(component, 'hasUserDetails').and.returnValue(true);
            const selectEmitSpy = spyOn(component.selectUser, 'emit');
            const changedUsersSpy = spyOn(component.changedUsers, 'emit');
            component.onSelect(user);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(selectEmitSpy).toHaveBeenCalledWith(user);
                expect(changedUsersSpy).toHaveBeenCalledWith([user]);
                expect(component.getSelectedUsers()).toEqual([user]);
                done();
            });
        });

        it('should show an error message if the search result empty', (done) => {
            findUsersByNameSpy.and.returnValue(of([]));
            fixture.detectChanges();
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'ZZZ';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                inputHTMLElement.blur();
                fixture.detectChanges();
                const errorMessage = element.querySelector('[data-automation-id="invalid-users-typing-error"]');
                expect(errorMessage).not.toBeNull();
                expect(errorMessage.textContent).toContain('ADF_CLOUD_USERS.ERROR.NOT_FOUND');
                done();
            });
        });
    });

    describe('when application name defined', () => {

        let checkUserHasAccessSpy: jasmine.Spy;
        let checkUserHasAnyClientAppRoleSpy: jasmine.Spy;

        beforeEach(async(() => {
            findUsersByNameSpy = spyOn(identityService, 'findUsersByName').and.returnValue(of(mockUsers));
            checkUserHasAccessSpy = spyOn(identityService, 'checkUserHasClientApp').and.returnValue(of(true));
            checkUserHasAnyClientAppRoleSpy = spyOn(identityService, 'checkUserHasAnyClientAppRole').and.returnValue(of(true));
            component.preSelectUsers = [];
            component.appName = 'mock-app-name';
            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        it('should fetch the client ID if appName specified', async (() => {
            const getClientIdByApplicationNameSpy = spyOn(identityService, 'getClientIdByApplicationName').and.callThrough();
            component.appName = 'mock-app-name';
            const change = new SimpleChange(null, 'mock-app-name', false);
            component.ngOnChanges({ 'appName': change });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(getClientIdByApplicationNameSpy).toHaveBeenCalled();
            });
        }));

        it('should list users who have access to the app when appName is specified', (done) => {
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(fixture.debugElement.queryAll(By.css('mat-option')).length).toEqual(3);
                done();
            });
        });

        it('should not list users who do not have access to the app when appName is specified', (done) => {
            checkUserHasAccessSpy.and.returnValue(of(false));
            fixture.detectChanges();
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelectorAll('mat-option').length).toEqual(0);
                done();
            });
        });

        it('should list users if given roles mapped with client roles', (done) => {
            component.roles = ['MOCK_ROLE_1', 'MOCK_ROLE_1'];
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(fixture.debugElement.queryAll(By.css('mat-option')).length).toEqual(3);
                expect(checkUserHasAnyClientAppRoleSpy).toHaveBeenCalled();
                done();
            });
        });

        it('should not list users if roles are not mapping with client roles', (done) => {
            checkUserHasAnyClientAppRoleSpy.and.returnValue(of(false));
            component.roles = ['MOCK_ROLE_1', 'MOCK_ROLE_1'];
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(fixture.debugElement.queryAll(By.css('mat-option')).length).toEqual(0);
                expect(checkUserHasAnyClientAppRoleSpy).toHaveBeenCalled();
                done();
            });
        });

        it('should not call client role mapping sevice if roles not specified', (done) => {
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(checkUserHasAnyClientAppRoleSpy).not.toHaveBeenCalled();
                done();
            });
        });

        it('should validate access to the app when appName is specified', (done) => {
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(checkUserHasAccessSpy).toHaveBeenCalledTimes(3);
                done();
            });
        });

        it('should not validate access to the app when appName is not specified', (done) => {
            component.appName = '';
            fixture.detectChanges();
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(checkUserHasAccessSpy).not.toHaveBeenCalled();
                done();
            });
        });

        it('should show an error message if the user does not have access', (done) => {
            checkUserHasAccessSpy.and.returnValue(of(false));
            findUsersByNameSpy.and.returnValue(of([]));
            fixture.detectChanges();
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'ZZZ';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                inputHTMLElement.blur();
                fixture.detectChanges();
                const errorMessage = element.querySelector('[data-automation-id="invalid-users-typing-error"]');
                expect(errorMessage).not.toBeNull();
                expect(errorMessage.textContent).toContain('ADF_CLOUD_USERS.ERROR.NOT_FOUND');
                done();
            });
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

        let checkUserHasRoleSpy: jasmine.Spy;

        beforeEach(async(() => {
            component.roles = ['mock-role-1', 'mock-role-2'];
            spyOn(identityService, 'findUsersByName').and.returnValue(of(mockUsers));
            checkUserHasRoleSpy = spyOn(identityService, 'checkUserHasRole').and.returnValue(of(true));
            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        it('should filter users if users has any specified role', (done) => {
            fixture.detectChanges();
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(fixture.debugElement.queryAll(By.css('mat-option')).length).toEqual(3);
                expect(checkUserHasRoleSpy).toHaveBeenCalledTimes(3);
                done();
            });
        });

        it('should not filter users if user does not have any specified role', (done) => {
            fixture.detectChanges();
            checkUserHasRoleSpy.and.returnValue(of(false));
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelectorAll('mat-option').length).toEqual(0);
                expect(checkUserHasRoleSpy).toHaveBeenCalled();
                done();
            });
        });

        it('should not call checkUserHasRole service when roles are not specified', (done) => {
            component.roles = [];
            fixture.detectChanges();
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(checkUserHasRoleSpy).not.toHaveBeenCalled();
                done();
            });
        });
    });

    describe('Single Mode with Pre-selected users', () => {

        const changes = new SimpleChange(null, mockPreselectedUsers, false);

        beforeEach(async(() => {
            component.mode = 'single';
            component.preSelectUsers = <any> mockPreselectedUsers;
            component.ngOnChanges({ 'preSelectUsers': changes });
            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        it('should show only one mat chip with the first preSelectedUser', (done) => {
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
                expect(chips.length).toEqual(1);
                expect(chips[0].attributes['data-automation-id']).toEqual(`adf-people-cloud-chip-${mockPreselectedUsers[0].username}`);
                done();
            });
        });
    });

    describe('Multiple Mode with Pre-selected Users', () => {

        it('Should not show remove icon for pre-selected users if readonly property set to true', (done) => {
            fixture.detectChanges();
            component.preSelectUsers = [
                { id: mockUsers[0].id, username: mockUsers[0].username, readonly: true },
                { id: mockUsers[1].id, username: mockUsers[1].username, readonly: true }
            ];
            const change = new SimpleChange(null, component.preSelectUsers, false);
            component.mode = 'multiple';
            component.ngOnChanges({ 'preSelectUsers': change });
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const chipList = fixture.nativeElement.querySelectorAll('mat-chip-list mat-chip');
                const removeIcon = <HTMLElement> fixture.nativeElement.querySelector('[data-automation-id="adf-people-cloud-chip-remove-icon-first-name-1 last-name-1"]');
                expect(chipList.length).toBe(2);
                expect(component.preSelectUsers[0].readonly).toBeTruthy();
                expect(component.preSelectUsers[1].readonly).toBeTruthy();
                expect(removeIcon).toBeNull();
                done();
            });
        });

        it('Should be able to remove preselected users if readonly property set to false', (done) => {
            fixture.detectChanges();
            component.preSelectUsers = [
                { id: mockUsers[0].id, username: mockUsers[0].username, readonly: false },
                { id: mockUsers[1].id, username: mockUsers[1].username, readonly: false }
            ];
            const change = new SimpleChange(null, component.preSelectUsers, false);
            component.mode = 'multiple';
            component.ngOnChanges({ 'preSelectUsers': change });
            const removeUserSpy = spyOn(component.removeUser, 'emit');
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
                const removeIcon = <HTMLElement> fixture.nativeElement.querySelector(`[data-automation-id="adf-people-cloud-chip-remove-icon-${mockPreselectedUsers[0].username}"]`);
                expect(chips.length).toBe(2);
                expect(component.preSelectUsers[0].readonly).toBe(false, 'Removable');
                expect(component.preSelectUsers[1].readonly).toBe(false, 'Removable');
                removeIcon.click();
                fixture.detectChanges();
                expect(removeUserSpy).toHaveBeenCalled();
                expect(fixture.nativeElement.querySelectorAll('mat-chip-list mat-chip').length).toBe(1);
                done();
            });
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
                const chipList = fixture.nativeElement.querySelector('mat-chip-list');
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
                const chipList = fixture.nativeElement.querySelector('mat-chip-list');
                expect(chips).toBeDefined();
                expect(chipList).toBeDefined();
                expect(chips.length).toBe(2);
                expect(chipList.attributes['ng-reflect-disabled'].value).toEqual('true');
            });
        });
    });

    describe('Preselected users and validation enabled', () => {

        it('should check validation only for the first user and emit warning when user is invalid - single mode', (done) => {
            spyOn(identityService, 'findUserById').and.returnValue(Promise.resolve([]));
            spyOn(component, 'hasUserDetails').and.returnValue(false);

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
            component.ngOnChanges({ 'preSelectUsers': new SimpleChange(null, [mockPreselectedUsers[0], mockPreselectedUsers[1]], false) });
        });

        it('should check validation for all the users and emit warning - multiple mode', (done) => {
            spyOn(identityService, 'findUserById').and.returnValue(Promise.resolve(undefined));

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
                    }]
            };

            component.warning.subscribe(warning => {
                expect(warning).toEqual(expectedWarning);
                done();
            });

            component.mode = 'multiple';
            component.validate = true;
            component.preSelectUsers = <any> [mockPreselectedUsers[0], mockPreselectedUsers[1]];
            component.ngOnChanges({ 'preSelectUsers': new SimpleChange(null, [mockPreselectedUsers[0], mockPreselectedUsers[1]], false) });
        });
    });

    it('should removeDuplicateUsers return only unique users', () => {
        const duplicatedUsers = [{ id: mockUsers[0].id }, { id: mockUsers[0].id }];
        expect(component.removeDuplicatedUsers(duplicatedUsers)).toEqual([{ id: mockUsers[0].id }]);
    });

});
