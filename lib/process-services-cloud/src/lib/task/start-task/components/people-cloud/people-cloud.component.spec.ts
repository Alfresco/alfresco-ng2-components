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
import { ComponentFixture, TestBed, async, tick, fakeAsync } from '@angular/core/testing';
import { IdentityUserService, AlfrescoApiService, AlfrescoApiServiceMock, CoreModule, IdentityUserModel } from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../../../testing/process-service-cloud.testing.module';
import { of } from 'rxjs';
import { mockUsers } from '../../mock/user-cloud.mock';
import { StartTaskCloudModule } from '../../start-task-cloud.module';
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PeopleCloudComponent', () => {
    let component: PeopleCloudComponent;
    let fixture: ComponentFixture<PeopleCloudComponent>;
    let element: HTMLElement;
    let identityService: IdentityUserService;
    let alfrescoApiService: AlfrescoApiService;

    const mock = {
        oauth2Auth: {
            callCustomApi: () => Promise.resolve(mockUsers)
        }
    };

    const mockPreselectedUsers = [
        { id: mockUsers[1].id, username: mockUsers[1].username },
        { id: mockUsers[2].id, username: mockUsers[2].username }
    ];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                ProcessServiceCloudTestingModule,
                StartTaskCloudModule
            ],
            providers: [
                IdentityUserService
            ]
        })
            .overrideComponent(PeopleCloudComponent, {
                set: {
                    providers: [
                        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
                    ]
                }
            }).compileComponents();
    }));

    beforeEach( () => {
        fixture = TestBed.createComponent(PeopleCloudComponent);
        component = fixture.componentInstance;
        identityService = TestBed.get(IdentityUserService);
        alfrescoApiService = TestBed.get(AlfrescoApiService);
    });

    it('should create PeopleCloudComponent', () => {
        expect(component instanceof PeopleCloudComponent).toBe(true, 'should create PeopleCloudComponent');
    });

    describe('Search user', () => {

        let findUsersByNameSpy: jasmine.Spy;

        beforeEach(async(() => {
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(mock);
            findUsersByNameSpy = spyOn(identityService, 'findUsersByName').and.returnValue(of(mockUsers));
            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should list the users if the typed result match', async(() => {
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                component.searchUsers$.subscribe((res) => {
                    expect(res).toBeDefined();
                    expect(res.length).toBe(3);
                });
                expect(findUsersByNameSpy).toHaveBeenCalled();
            });
        }));

        it('should hide result list if input is empty', async(() => {
            fixture.detectChanges();
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = '';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.querySelector('mat-option')).toBeNull();
            });
        }));

        it('should emit selectedUser if option is valid', async(() => {
            fixture.detectChanges();
            const selectEmitSpy = spyOn(component.selectUser, 'emit');
            component.onSelect(new IdentityUserModel({ username: 'username' }));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(selectEmitSpy).toHaveBeenCalled();
            });
        }));

        it('should show an error message if the search result empty', async(() => {
            findUsersByNameSpy.and.returnValue(of([]));
            fixture.detectChanges();
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'ZZZ';
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                inputHTMLElement.blur();
                fixture.detectChanges();
                const errorMessage = element.querySelector('.adf-start-task-cloud-error-message');
                expect(errorMessage).not.toBeNull();
                expect(errorMessage.textContent).toContain('ADF_CLOUD_START_TASK.ERROR.MESSAGE');
            });
        }));
    });

    describe('when application name defined', () => {

        let checkUserHasAccessSpy: jasmine.Spy;
        let checkUserHasAnyClientAppRoleSpy: jasmine.Spy;
        let findUsersByNameSpy: jasmine.Spy;

        beforeEach(async(() => {
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(mock);
            findUsersByNameSpy = spyOn(identityService, 'findUsersByName').and.returnValue(of(mockUsers));
            checkUserHasAccessSpy = spyOn(identityService, 'checkUserHasClientApp').and.returnValue(of(true));
            checkUserHasAnyClientAppRoleSpy = spyOn(identityService, 'checkUserHasAnyClientAppRole').and.returnValue(of(true));
            component.preSelectUsers = [];
            component.appName = 'mock-app-name';
            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should list users who have access to the app when appName is specified', async(() => {
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                component.searchUsers$.subscribe((res) => {
                    expect(res).toBeDefined();
                    expect(res.length).toBe(3);
                });
            });
        }));

        it('should not list users who do not have access to the app when appName is specified', async(() => {
            checkUserHasAccessSpy.and.returnValue(of(false));
            fixture.detectChanges();
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                component.searchUsers$.subscribe((res) => {
                    expect(res).toBeDefined();
                    expect(res.length).toBe(0);
                });
            });
        }));

        it('should list users if given roles mapped with client roles', async(() => {
            component.roles = ['MOCK_ROLE_1', 'MOCK_ROLE_1'];
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                component.searchUsers$.subscribe((res) => {
                    expect(res).toBeDefined();
                    expect(res.length).toBe(3);
                });
                expect(checkUserHasAnyClientAppRoleSpy).toHaveBeenCalled();
            });
        }));

        it('should not list users if roles are not mapping with client roles', async(() => {
            checkUserHasAnyClientAppRoleSpy.and.returnValue(of(false));
            component.roles = ['MOCK_ROLE_1', 'MOCK_ROLE_1'];
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                component.searchUsers$.subscribe((res) => {
                    expect(res).toBeDefined();
                    expect(res.length).toBe(0);
                });
                expect(checkUserHasAnyClientAppRoleSpy).toHaveBeenCalled();
            });
        }));

        it('should not call client role mapping sevice if roles not specified', async(() => {
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(checkUserHasAnyClientAppRoleSpy).not.toHaveBeenCalled();
            });
        }));

        it('should validate access to the app when appName is specified', async(() => {
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(checkUserHasAccessSpy).toHaveBeenCalledTimes(3);
            });
        }));

        it('should not validate access to the app when appName is not specified', async(() => {
            component.appName = '';
            fixture.detectChanges();
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(checkUserHasAccessSpy).not.toHaveBeenCalled();
            });
        }));

        it('should show an error message if the user does not have access', async(() => {
            checkUserHasAccessSpy.and.returnValue(of(false));
            findUsersByNameSpy.and.returnValue(of([]));
            fixture.detectChanges();
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'ZZZ';
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                inputHTMLElement.blur();
                fixture.detectChanges();
                const errorMessage = element.querySelector('.adf-start-task-cloud-error-message');
                expect(errorMessage).not.toBeNull();
                expect(errorMessage.textContent).toContain('ADF_CLOUD_START_TASK.ERROR.MESSAGE');
            });
        }));
    });

    describe('When roles defined', () => {

        let checkUserHasRoleSpy: jasmine.Spy;

        beforeEach(async(() => {
            component.roles = ['mock-role-1', 'mock-role-2'];
            spyOn(alfrescoApiService, 'getInstance').and.returnValue(mock);
            spyOn(identityService, 'findUsersByName').and.returnValue(of(mockUsers));
            checkUserHasRoleSpy = spyOn(identityService, 'checkUserHasRole').and.returnValue(of(true));
            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should filter users if users has any specified role', async(() => {
            fixture.detectChanges();
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                component.searchUsers$.subscribe((res) => {
                    expect(res).toBeDefined();
                    expect(res.length).toEqual(3);
                });
                expect(checkUserHasRoleSpy).toHaveBeenCalledTimes(3);
            });
        }));

        it('should not filter users if user does not have any specified role', async(() => {
            fixture.detectChanges();
            checkUserHasRoleSpy.and.returnValue(of(false));
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                component.searchUsers$.subscribe((res) => {
                    expect(res).toBeDefined();
                    expect(res.length).toEqual(0);
                });
                expect(checkUserHasRoleSpy).toHaveBeenCalled();
            });
        }));

        it('should not call checkUserHasRole service when roles are not specified', async(() => {
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
            });
        }));
    });

    describe('Single Mode and Pre-selected users with no validate flag', () => {

        const change = new SimpleChange(null, mockPreselectedUsers, false);

        beforeEach(async(() => {
            component.mode = 'single';
            component.preSelectUsers = <any> mockPreselectedUsers;
            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should not show chip list when mode=single', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const chip = element.querySelector('mat-chip-list');
                expect(chip).toBeNull();
            });
        }));

        it('should pre-select preSelectUsers[0] when mode=single', async(() => {
            component.ngOnChanges({ 'preSelectUsers': change });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const selectedUser = component.searchUserCtrl.value;
                expect(selectedUser.id).toBe(mockUsers[1].id);
            });
        }));
        it('should not pre-select any user when preSelectUsers is empty and mode=single', async(() => {
            component.preSelectUsers = [];
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const selectedUser = component.searchUserCtrl.value;
                expect(selectedUser).toBeNull();
            });
        }));
    });

    describe('Single Mode and Pre-selected users with validate flag', () => {

        const change = new SimpleChange(null, mockPreselectedUsers, false);

        beforeEach(async(() => {
            component.mode = 'single';
            component.validate = true;
            component.preSelectUsers = <any> mockPreselectedUsers;
            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should not show chip list when mode=single', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const chip = element.querySelector('mat-chip-list');
                expect(chip).toBeNull();
            });
        }));

        it('should pre-select preSelectUsers[0] when mode=single', fakeAsync(() => {
            fixture.detectChanges();
            spyOn(component, 'searchUser').and.returnValue(Promise.resolve(mockPreselectedUsers));
            component.ngOnChanges({ 'preSelectUsers': change });
            fixture.detectChanges();
            tick();
            const selectedUser = component.searchUserCtrl.value;
            expect(selectedUser.id).toBe(mockUsers[1].id);
        }));
    });

    describe('Multiple Mode and Pre-selected users with no validate flag', () => {

        const change = new SimpleChange(null, mockPreselectedUsers, false);

        beforeEach(async(() => {
            component.mode = 'multiple';
            component.preSelectUsers = <any> mockPreselectedUsers;
            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should show chip list when mode=multiple', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const chip = element.querySelector('mat-chip-list');
                expect(chip).toBeDefined();
            });
        }));

        it('should pre-select all preSelectUsers when mode=multiple', async(() => {
            component.mode = 'multiple';
            component.ngOnChanges({ 'preSelectUsers': change });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                component.selectedUsers$.subscribe((selectedUsers) => {
                    expect(selectedUsers).toBeDefined();
                    expect(selectedUsers.length).toEqual(2);
                    expect(selectedUsers[0].id).toEqual('fake-id-2');
                });
            });
        }));
    });

    describe('Multiple Mode and Pre-selected users with validate flag', () => {

        const change = new SimpleChange(null, mockPreselectedUsers, false);

        beforeEach(async(() => {
            component.mode = 'multiple';
            component.validate = true;
            component.preSelectUsers = <any> mockPreselectedUsers;
            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should show chip list when mode=multiple', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const chip = element.querySelector('mat-chip-list');
                expect(chip).toBeDefined();
            });
        }));

        it('should pre-select all preSelectUsers when mode=multiple', async(() => {
            fixture.detectChanges();
            spyOn(component, 'searchUser').and.returnValue(Promise.resolve(mockPreselectedUsers));
            component.mode = 'multiple';
            component.ngOnChanges({ 'preSelectUsers': change });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
                expect(chips.length).toBe(2);
            });
        }));

        it('should emit removeUser when a selected user is removed if mode=multiple', async(() => {
            fixture.detectChanges();
            const removeUserSpy = spyOn(component.removeUser, 'emit');
            component.mode = 'multiple';
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const removeIcon = fixture.debugElement.query(By.css('mat-chip mat-icon'));
                removeIcon.nativeElement.click();
                expect(removeUserSpy).toHaveBeenCalled();
            });
        }));
    });

    it('should emit warning if are invalid users', (done) => {
        spyOn(identityService, 'findUserByUsername').and.returnValue(Promise.resolve([]));
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
        const findByIdSpy = spyOn(identityService, 'findUserById').and.returnValue(Promise.resolve(mockUsers));
        component.mode = 'multiple';
        component.validate = true;
        component.preSelectUsers = <any> [{ id: mockUsers[1].id }, { id: mockUsers[2].id }];
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            component.filterPreselectUsers().then((result) => {
                expect(findByIdSpy).toHaveBeenCalled();
                expect(component.userExists(result)).toEqual(true);
            });
        });
    }));

    it('should filter user by username if validate true', async(() => {
        const findUserByUsernameSpy = spyOn(identityService, 'findUserByUsername').and.returnValue(Promise.resolve(mockUsers));
        component.mode = 'multiple';
        component.validate = true;
        component.preSelectUsers = <any> [{ username: mockUsers[1].username }, { username: mockUsers[2].username }];
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            component.filterPreselectUsers().then((result) => {
                expect(findUserByUsernameSpy).toHaveBeenCalled();
                expect(component.userExists(result)).toEqual(true);
            });
        });
    }));

    it('should filter user by email if validate true', async(() => {
        const findUserByEmailSpy = spyOn(identityService, 'findUserByEmail').and.returnValue(Promise.resolve(mockUsers));
        component.mode = 'multiple';
        component.validate = true;
        component.preSelectUsers = <any> [{ email: mockUsers[1].email }, { email: mockUsers[2].email }];
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            component.filterPreselectUsers().then((result) => {
                expect(findUserByEmailSpy).toHaveBeenCalled();
                expect(component.userExists(result)).toEqual(true);
            });
        });
    }));

    it('should search user by id on single selection mode', async(() => {
        const findUserByIdSpy = spyOn(identityService, 'findUserById').and.returnValue(Promise.resolve(mockUsers[0]));
        component.mode = 'single';
        component.validate = true;
        component.preSelectUsers = <any> [{ id: mockUsers[0].id }];
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            component.filterPreselectUsers().then((result) => {
                expect(findUserByIdSpy).toHaveBeenCalled();
                expect(component.userExists(result)).toEqual(true);
            });
        });
    }));
});
