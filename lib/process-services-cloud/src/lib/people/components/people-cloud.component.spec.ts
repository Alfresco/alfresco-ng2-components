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

/* tslint:disable */
import { PeopleCloudComponent } from './people-cloud.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IdentityUserService, AlfrescoApiService, CoreModule, setupTestBed } from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { of } from 'rxjs';
import { mockUsers } from '../mock/user-cloud.mock';
import { PeopleCloudModule } from '../people-cloud.module';
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';

xdescribe('PeopleCloudComponent', () => {
    let component: PeopleCloudComponent;
    let fixture: ComponentFixture<PeopleCloudComponent>;
    let element: HTMLElement;
    let identityService: IdentityUserService;
    let alfrescoApiService: AlfrescoApiService;
    let findUsersByNameSpy: jasmine.Spy;
    let findUserByUsernameSpy: jasmine.Spy;

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
        findUserByUsernameSpy = spyOn(identityService, 'findUserByUsername').and.returnValue(Promise.resolve([]));
    });

    it('should create PeopleCloudComponent', () => {
        expect(component instanceof PeopleCloudComponent).toBe(true, 'should create PeopleCloudComponent');
    });

    it('should populate placeholder when title is present', async(() => {
        component.title = 'TITLE_KEY';
        fixture.detectChanges();
        const matLabel: HTMLInputElement = <HTMLInputElement> fixture.nativeElement.querySelector('#adf-people-cloud-title-id');
        fixture.whenStable().then( () => {
            fixture.detectChanges();
            expect(matLabel.textContent).toEqual('TITLE_KEY');
        });
    }));

    it('should not populate placeholder when title is not present', async(() => {
        fixture.detectChanges();
        const matLabel: HTMLInputElement = <HTMLInputElement> fixture.nativeElement.querySelector('#adf-people-cloud-title-id');
        fixture.detectChanges();
        fixture.whenStable().then( () => {
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

        it('should list the users if the typed result match', (done) => {
            findUsersByNameSpy.and.returnValue(of(mockUsers));
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

        it('should emit selectedUser if option is valid', (done) => {
            fixture.detectChanges();
            const selectEmitSpy = spyOn(component.selectUser, 'emit');
            component.onSelect({ username: 'username' });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(selectEmitSpy).toHaveBeenCalled();
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
                const errorMessage = element.querySelector('.adf-start-task-cloud-error-message');
                expect(errorMessage).not.toBeNull();
                expect(errorMessage.textContent).toContain('ADF_CLOUD_START_TASK.ERROR.MESSAGE');
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
                const errorMessage = element.querySelector('.adf-start-task-cloud-error-message');
                expect(errorMessage).not.toBeNull();
                expect(errorMessage.textContent).toContain('ADF_CLOUD_START_TASK.ERROR.MESSAGE');
                done();
            });
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

    describe('Single Mode and Pre-selected users with readonly mode', () => {

        beforeEach(async( () => {
            component.preSelectUsers = [
                { id: mockUsers[0].id, username: mockUsers[0].username }
            ];
            component.readOnly = true;
            fixture.detectChanges();
        }));

        it('should people input be disabled', () => {
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const peopleInput = fixture.nativeElement.querySelector('[data-automation-id="adf-people-cloud-search-input"]');
                expect(peopleInput.readOnly).toBeTruthy();
            });
        });
    });

    describe('Single Mode and Pre-selected users with no validate flag', () => {

        beforeEach(async(() => {
            component.mode = 'single';
            component.preSelectUsers = <any> mockPreselectedUsers;
            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        it('should not show chip list when mode=single', (done) => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const chip = element.querySelector('mat-chip-list');
                expect(chip).toBeNull();
                done();
            });
        });

        it('should not pre-select any user when preSelectUsers is empty and mode=single', (done) => {
            component.preSelectUsers = [];
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const selectedUser = component.searchUserCtrl.value;
                expect(selectedUser).toBeNull();
                done();
            });
        });
    });

    describe('Single Mode and Pre-selected users with validate flag', () => {

        beforeEach(async(() => {
            component.mode = 'single';
            component.validate = true;
            component.preSelectUsers = <any> mockPreselectedUsers;
            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        it('should not show chip list when mode=single', (done) => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const chip = element.querySelector('mat-chip-list');
                expect(chip).toBeNull();
                done();
            });
        });
    });

    describe('Multiple Mode and Pre-selected users with no validate flag', () => {

        const change = new SimpleChange(null, mockPreselectedUsers, false);

        beforeEach(async(() => {
            component.mode = 'multiple';
            component.preSelectUsers = <any> mockPreselectedUsers;
            fixture.detectChanges();
            element = fixture.nativeElement;
            alfrescoApiService = TestBed.get(AlfrescoApiService);
        }));

        it('should show chip list when mode=multiple', (done) => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const chip = element.querySelector('mat-chip-list');
                expect(chip).toBeDefined();
                done();
            });
        });

        it('should pre-select all preSelectUsers when mode=multiple validation disabled', (done) => {
            component.mode = 'multiple';
            spyOn(component, 'filterPreselectUsers').and.returnValue(Promise.resolve(mockPreselectedUsers));
            component.ngOnChanges({ 'preSelectUsers': change });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                component.selectedUsers$.subscribe((selectedUsers) => {
                    expect(selectedUsers).toBeDefined();
                    expect(selectedUsers.length).toEqual(2);
                    expect(selectedUsers[0].id).toEqual('fake-id-2');
                    done();
                });
            });
        });
    });

    describe('Multiple Mode with read-only mode', () => {

        it('should people chip-list be disabled', () => {
            component.preSelectUsers = [
                { id: mockUsers[0].id, username: mockUsers[0].username },
                { id: mockUsers[1].id, username: mockUsers[1].username }
            ];
            component.mode = 'multiple';
            component.readOnly = true;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const matChipList = fixture.nativeElement.querySelector('mat-chip-list');
                expect(matChipList.attributes['ng-reflect-disabled'].value).toBeTruthy();
            });
        });

        it('Should not show remove icon for pre-selected users if readonly property set to true', (done) => {
            component.mode = 'multiple';
            const removeUserSpy = spyOn(component.removeUser, 'emit');
            component.preSelectUsers = [
                { id: mockUsers[0].id, username: mockUsers[0].username, readonly: true },
                { id: mockUsers[1].id, username: mockUsers[1].username, readonly: true }
            ];
            fixture.detectChanges();
            const chipList = fixture.nativeElement.querySelectorAll('mat-chip-list mat-chip');
            const removeIcon = <HTMLElement> fixture.nativeElement.querySelector('[data-automation-id="adf-people-cloud-chip-remove-icon-first-name-1 last-name-1"]');
            expect(chipList.length).toBe(2);
            expect(component.preSelectUsers[0].readonly).toBeTruthy();
            expect(component.preSelectUsers[1].readonly).toBeTruthy();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(removeIcon).toBeNull();
                fixture.detectChanges();
                expect(removeUserSpy).not.toHaveBeenCalled();
                expect(component.preSelectUsers.length).toBe(2);
                expect(component.preSelectUsers[0].readonly).toBe(true, 'Not removable');
                expect(component.preSelectUsers[1].readonly).toBe(true, 'not removable');
                done();
            });
        });
    });

    describe('Multiple Mode and Pre-selected users with validate flag', () => {

        const change = new SimpleChange(null, mockPreselectedUsers, false);

        beforeEach(async(() => {
            component.mode = 'multiple';
            component.validate = true;
            component.preSelectUsers = <any> mockPreselectedUsers;
            element = fixture.nativeElement;
            alfrescoApiService = TestBed.get(AlfrescoApiService);
            fixture.detectChanges();
        }));

        it('should show chip list when mode=multiple', (done) => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const chip = element.querySelector('mat-chip-list');
                expect(chip).toBeDefined();
                done();
            });
        });

        it('should pre-select all preSelectUsers when mode=multiple', (done) => {
            spyOn(component, 'searchUser').and.returnValue(Promise.resolve(mockPreselectedUsers));
            component.mode = 'multiple';
            fixture.detectChanges();
            component.ngOnChanges({ 'preSelectUsers': change });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
                expect(chips.length).toBe(2);
                done();
            });
        });

        it('should emit removeUser when a selected user is removed if mode=multiple', (done) => {
            spyOn(component.removeUser, 'emit');
            component.mode = 'multiple';
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const removeIcon = fixture.debugElement.query(By.css('mat-chip mat-icon'));
                removeIcon.nativeElement.click();
                fixture.detectChanges();
                expect(component.removeUser.emit).toHaveBeenCalled();
                done();
            });
        });

        it('should emit warning if are invalid users', (done) => {
            findUserByUsernameSpy.and.returnValue(Promise.resolve([]));
            const warnMessage = { message: 'INVALID_PRESELECTED_USERS', users: [{ username: 'invalidUsername' }] };
            component.validate = true;
            component.preSelectUsers = <any> [{ username: 'invalidUsername' }];
            fixture.detectChanges();
            component.loadSinglePreselectUser();
            component.warning.subscribe((response) => {
                expect(response).toEqual(warnMessage);
                expect(response.message).toEqual(warnMessage.message);
                expect(response.users).toEqual(warnMessage.users);
                expect(response.users[0].username).toEqual('invalidUsername');
                done();
            });
        });

        it('should filter user by id if validate true', async(() => {
            const findByIdSpy = spyOn(identityService, 'findUserById').and.returnValue(of(mockUsers[0]));
            component.mode = 'multiple';
            component.validate = true;
            fixture.detectChanges();
            component.preSelectUsers = <any> [{ id: mockUsers[0].id }, { id: mockUsers[1].id }];
            component.ngOnChanges({ 'preSelectUsers': change });
            fixture.detectChanges();
            component.filterPreselectUsers().then((result: any) => {
                fixture.detectChanges();
                expect(findByIdSpy).toHaveBeenCalled();
                expect(component.userExists(result[0])).toEqual(true);
                expect(result[1].id).toBe(mockUsers[0].id);
            });
        }));

        it('should filter user by username if validate true', (done) => {
            findUserByUsernameSpy.and.returnValue(of(mockUsers));
            component.mode = 'multiple';
            component.validate = true;
            component.preSelectUsers = <any> [{ username: mockUsers[1].username }, { username: mockUsers[2].username }];
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                component.filterPreselectUsers().then((result) => {
                    expect(findUserByUsernameSpy).toHaveBeenCalled();
                    expect(component.userExists(result[0])).toEqual(true);
                    expect(component.userExists(result[1])).toEqual(true);
                    done();
                });
            });
        });

        it('should filter user by email if validate true', (done) => {
            const findUserByEmailSpy = spyOn(identityService, 'findUserByEmail').and.returnValue(of(mockUsers));
            fixture.detectChanges();
            component.mode = 'multiple';
            component.validate = true;
            component.preSelectUsers = <any> [{ email: mockUsers[1].email }, { email: mockUsers[2].email }];
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                component.filterPreselectUsers().then((result) => {
                    expect(findUserByEmailSpy).toHaveBeenCalled();
                    expect(component.userExists(result[0])).toEqual(true);
                    expect(component.userExists(result[1])).toEqual(true);
                    done();
                });
            });
        });

        it('should search user by id on single selection mode', (done) => {
            const findUserByIdSpy = spyOn(identityService, 'findUserById').and.returnValue(of(mockUsers[0]));
            component.mode = 'single';
            component.validate = true;
            fixture.detectChanges();
            component.preSelectUsers = <any> [{ id: mockUsers[0].id }];
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                component.validatePreselectUsers().then((result) => {
                    expect(findUserByIdSpy).toHaveBeenCalled();
                    expect(result.length).toEqual(1);
                    done();
                });
            });
        });

        it('should not preselect any user if email is invalid and validation enable', (done) => {
            const findUserByEmailSpy = spyOn(identityService, 'findUserByEmail').and.returnValue(of([]));
            component.mode = 'single';
            component.validate = true;
            component.preSelectUsers = <any> [{ email: 'invalid email' }];
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                component.validatePreselectUsers().then((result) => {
                    expect(findUserByEmailSpy).toHaveBeenCalled();
                    expect(result.length).toEqual(0);
                    done();
                });
            });
        });

        it('should not preselect any user if id is invalid and validation enable', (done) => {
            const findUserByIdSpy = spyOn(identityService, 'findUserById').and.returnValue(of([]));
            component.mode = 'single';
            component.validate = true;
            component.preSelectUsers = <any> [{ id: 'invalid id' }];
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                component.validatePreselectUsers().then((result) => {
                    expect(findUserByIdSpy).toHaveBeenCalled();
                    expect(result.length).toEqual(0);
                    done();
                });
            });
        });

        it('should not preselect any user if username is invalid and validation enable', (done) => {
            findUserByUsernameSpy.and.returnValue(of([]));
            component.mode = 'single';
            component.validate = true;
            component.preSelectUsers = <any> [{ username: 'invalid user' }];
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                component.validatePreselectUsers().then((result) => {
                    fixture.detectChanges();
                    expect(findUserByUsernameSpy).toHaveBeenCalled();
                    expect(result.length).toEqual(0);
                    done();
                });
            });
        });

        it('should remove duplicated preselcted users when a user is duplicated', () => {
            spyOn(identityService, 'findUserById').and.returnValue(of(mockUsers[0]));
            component.mode = 'multiple';
            component.validate = true;
            component.preSelectUsers = <any> [{ id: mockUsers[0].id }, { id: mockUsers[0].id }];
            component.ngOnChanges({ 'preSelectUsers': change });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                component.validatePreselectUsers().then((result) => {
                    expect(result.length).toEqual(1);
                });
            });
        });
    });
});
