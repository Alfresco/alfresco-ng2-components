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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PeopleCloudComponent } from './people-cloud.component';
import { StartTaskCloudTestingModule } from '../../testing/start-task-cloud.testing.module';
import { LogService, setupTestBed, IdentityUserService, IdentityUserModel } from '@alfresco/adf-core';
import { mockUsers } from '../../mock/user-cloud.mock';
import { of } from 'rxjs';
import { ProcessServiceCloudTestingModule } from '../../../../testing/process-service-cloud.testing.module';

describe('PeopleCloudComponent', () => {
    let component: PeopleCloudComponent;
    let fixture: ComponentFixture<PeopleCloudComponent>;
    let element: HTMLElement;
    let identityService: IdentityUserService;
    let findUsersSpy: jasmine.Spy;
    let checkUserHasAccessSpy: jasmine.Spy;
    let loadClientsByApplicationNameSpy: jasmine.Spy;

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule, StartTaskCloudTestingModule],
        providers: [IdentityUserService, LogService]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PeopleCloudComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        identityService = TestBed.get(IdentityUserService);
        findUsersSpy = spyOn(identityService, 'findUsersByName').and.returnValue(of(mockUsers));
        checkUserHasAccessSpy = spyOn(identityService, 'checkUserHasClientApp').and.returnValue(of(true));
        loadClientsByApplicationNameSpy = spyOn(identityService, 'getClientIdByApplicationName').and.returnValue(of('mock-client-id'));
    });

    it('should create PeopleCloudComponent', () => {
        expect(component instanceof PeopleCloudComponent).toBeTruthy();
    });

    it('should show the users if the typed result match', async(() => {
        component.searchUsers$ = of(<IdentityUserModel[]> mockUsers);
        fixture.detectChanges();
        let inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
        inputHTMLElement.focus();
        inputHTMLElement.dispatchEvent(new Event('input'));
        inputHTMLElement.dispatchEvent(new Event('keyup'));
        inputHTMLElement.dispatchEvent(new Event('keydown'));
        inputHTMLElement.value = 'M';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('mat-option'))).toBeDefined();
        });
    }));

    it('should hide result list if input is empty', async(() => {
        fixture.detectChanges();
        let inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
        inputHTMLElement.focus();
        inputHTMLElement.value = '';
        inputHTMLElement.dispatchEvent(new Event('keyup'));
        inputHTMLElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(fixture.debugElement.query(By.css('mat-option'))).toBeNull();
            expect(fixture.debugElement.query(By.css('#adf-people-cloud-user-0'))).toBeNull();
        });
    }));

    it('should emit selectedUser if option is valid', async(() => {
        fixture.detectChanges();
        let selectEmitSpy = spyOn(component.selectUser, 'emit');
        component.onSelect(new IdentityUserModel({ username: 'username'}));
        fixture.whenStable().then(() => {
            expect(selectEmitSpy).toHaveBeenCalled();
        });
    }));

    it('should show an error message if the user is invalid', async(() => {
        checkUserHasAccessSpy.and.returnValue(of(false));
        findUsersSpy.and.returnValue(of([]));
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

    it('should show chip list when mode=multiple', async(() => {
        component.mode = 'multiple';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const chip = element.querySelector('mat-chip-list');
            expect(chip).toBeDefined();
        });
    }));

    it('should not show chip list when mode=single', async(() => {
        component.mode = 'single';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const chip = element.querySelector('mat-chip-list');
            expect(chip).toBeNull();
        });
    }));

    it('should pre-select all preSelectUsers when mode=multiple', async(() => {
        spyOn(identityService, 'getUsersByRolesWithCurrentUser').and.returnValue(Promise.resolve(mockUsers));
        component.mode = 'multiple';
        component.preSelectUsers = <any> [{id: mockUsers[1].id}, {id: mockUsers[2].id}];
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
            expect(chips.length).toBe(2);
        });
    }));

    it('should not pre-select any user when preSelectUsers is empty and mode=multiple', async(() => {
        spyOn(identityService, 'getUsersByRolesWithCurrentUser').and.returnValue(Promise.resolve(mockUsers));
        component.mode = 'multiple';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const chip = fixture.debugElement.query(By.css('mat-chip'));
            expect(chip).toBeNull();
        });
    }));

    it('should pre-select preSelectUsers[0] when mode=single', async(() => {
        spyOn(identityService, 'getUsersByRolesWithCurrentUser').and.returnValue(Promise.resolve(mockUsers));
        component.mode = 'single';
        component.preSelectUsers = <any> [{id: mockUsers[1].id}, {id: mockUsers[2].id}];
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const selectedUser = component.searchUserCtrl.value;
            expect(selectedUser.id).toBe(mockUsers[1].id);
        });
    }));

    it('should not pre-select any user when preSelectUsers is empty and mode=single', async(() => {
        spyOn(identityService, 'getUsersByRolesWithCurrentUser').and.returnValue(Promise.resolve(mockUsers));
        component.mode = 'single';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const selectedUser = component.searchUserCtrl.value;
            expect(selectedUser).toBeNull();
        });
    }));

    it('should emit removeUser when a selected user is removed if mode=multiple', async(() => {
        spyOn(identityService, 'getUsersByRolesWithCurrentUser').and.returnValue(Promise.resolve(mockUsers));
        let removeUserSpy = spyOn(component.removeUser, 'emit');

        component.mode = 'multiple';
        component.preSelectUsers = <any> [{id: mockUsers[1].id}, {id: mockUsers[2].id}];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const removeIcon = fixture.debugElement.query(By.css('mat-chip mat-icon'));
            removeIcon.nativeElement.click();

            expect(removeUserSpy).toHaveBeenCalledWith({ id: mockUsers[1].id });
        });

    }));

    it('should list users who have access to the app when appName is specified', async(() => {
        component.appName = 'sample-app';
        fixture.detectChanges();
        let inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
        inputHTMLElement.focus();
        inputHTMLElement.value = 'M';
        inputHTMLElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const usersList = fixture.debugElement.queryAll(By.css('mat-option'));
            expect(usersList.length).toBe(mockUsers.length);
        });
    }));

    it('should not list users who do not have access to the app when appName is specified', async(() => {
        checkUserHasAccessSpy.and.returnValue(of(false));
        component.appName = 'sample-app';

        fixture.detectChanges();
        let inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
        inputHTMLElement.focus();
        inputHTMLElement.value = 'M';
        inputHTMLElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const usersList = fixture.debugElement.queryAll(By.css('mat-option'));
            expect(usersList.length).toBe(0);
        });
    }));

    it('should validate access to the app when appName is specified', async(() => {
        component.appName = 'sample-app';

        fixture.detectChanges();
        let inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
        inputHTMLElement.focus();
        inputHTMLElement.value = 'M';
        inputHTMLElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(checkUserHasAccessSpy).toHaveBeenCalledTimes(mockUsers.length);
        });
    }));

    it('should not validate access to the app when appName is not specified', async(() => {
        fixture.detectChanges();
        let inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
        inputHTMLElement.focus();
        inputHTMLElement.value = 'M';
        inputHTMLElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(checkUserHasAccessSpy).not.toHaveBeenCalled();
        });
    }));

    it('should return true if user has any specified role', async(() => {
        const checkUserHasRoleSpy = spyOn(identityService, 'checkUserHasRole').and.returnValue(of(true));
        component.roles = ['mock-role-1'];
        fixture.detectChanges();
        let inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
        inputHTMLElement.focus();
        inputHTMLElement.value = 'M';
        inputHTMLElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(checkUserHasRoleSpy).toHaveBeenCalled();
        });
    }));

    it('should return false if user does not have any specified role', async(() => {
        const checkUserHasRoleSpy = spyOn(identityService, 'checkUserHasRole').and.returnValue(of(false));
        component.appName = '';
        component.roles = ['mock-role-10'];
        fixture.detectChanges();
        let inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
        inputHTMLElement.focus();
        inputHTMLElement.value = 'M';
        inputHTMLElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(checkUserHasRoleSpy).toHaveBeenCalled();
        });
    }));

    it('should not fire checkUserHasRole when roles are not specified', async(() => {
        const checkUserHasRoleSpy = spyOn(identityService, 'checkUserHasRole').and.returnValue(of(false));
        component.appName = '';
        component.roles = [];
        fixture.detectChanges();
        let inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
        inputHTMLElement.focus();
        inputHTMLElement.value = 'M';
        inputHTMLElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(checkUserHasRoleSpy).not.toHaveBeenCalled();
        });
    }));

    it('should load the clients if appName change', async( () => {
        component.appName = 'ADF';
        fixture.detectChanges();
        fixture.whenStable().then( () => {
            fixture.detectChanges();
            expect(loadClientsByApplicationNameSpy).toHaveBeenCalled();
        });
    }));

    it('should filter users if appName change', async(() => {
        component.appName = '';
        fixture.detectChanges();
        component.appName = 'ADF';
        fixture.detectChanges();
        fixture.whenStable().then( () => {
            fixture.detectChanges();
            expect(checkUserHasAccessSpy).toHaveBeenCalled();
    });

    it('should not validate preselect values if preselectValidation flag is set to false', () => {
        component.mode = 'multiple';
        component.validate = false;
        component.preSelectUsers = <any> [{id: mockUsers[1].id}, {id: mockUsers[2].id}];
        fixture.detectChanges();
        fixture.whenStable().then( () => {
            fixture.detectChanges();
            expect(component.validatePreselectUsers).not.toHaveBeenCalled();
        });
    });

    it('should filter users when validation flag is true', async(() => {
        component.mode = 'multiple';
        component.validate = true;
        component.preSelectUsers = <any> [{id: mockUsers[1].id}, {id: mockUsers[2].id}];
        fixture.detectChanges();
        fixture.whenStable().then( () => {
            component.filterPreselectUsers().then( (result) => {
                expect(result[0].valid).toEqual(false);
            });
        });

    }));
});
