/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { fakeUsers, mockRoles } from '../../mock/user-cloud.mock';
import { of } from 'rxjs';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';

describe('PeopleCloudComponent', () => {
    let component: PeopleCloudComponent;
    let fixture: ComponentFixture<PeopleCloudComponent>;
    let element: HTMLElement;
    let identityService: IdentityUserService;
    let getRolesByUserIdSpy: jasmine.Spy;
    let getUserSpy: jasmine.Spy;

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule, StartTaskCloudTestingModule],
        providers: [IdentityUserService, LogService]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PeopleCloudComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        identityService = TestBed.get(IdentityUserService);
        getRolesByUserIdSpy = spyOn(identityService, 'getUserRoles').and.returnValue(of(mockRoles));
        getUserSpy = spyOn(identityService, 'getUsers').and.returnValue(of(fakeUsers));
    });

    it('should create PeopleCloudComponent', () => {
        expect(component instanceof PeopleCloudComponent).toBeTruthy();
    });

    it('should able to fetch users', () => {
        fixture.detectChanges();
        expect(getUserSpy).toHaveBeenCalled();
    });

    it('should able to fetch roles by user id', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(getRolesByUserIdSpy).toHaveBeenCalled();
        });
    }));

    it('should not list the current logged in user when showCurrentUser is false', async(() => {
        spyOn(identityService, 'getCurrentUserInfo').and.returnValue(of(fakeUsers[1]));
        component.showCurrentUser = false;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const currentUser = component.users.find((user) => {
                return user.username === fakeUsers[1].username;
            });
            expect(currentUser).toBeUndefined();
        });
    }));

    it('should show the users if the typed result match', async(() => {
        component.users$ = of(<IdentityUserModel[]> fakeUsers);
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

    it('should hide result list if input is empty', () => {
        fixture.detectChanges();
        let inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
        inputHTMLElement.focus();
        inputHTMLElement.value = '';
        inputHTMLElement.dispatchEvent(new Event('keyup'));
        inputHTMLElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('mat-option'))).toBeNull();
            expect(fixture.debugElement.query(By.css('#adf-people-cloud-user-0'))).toBeNull();
        });
    });

    it('should emit selectedUser if option is valid', async() => {
        fixture.detectChanges();
        let selectEmitSpy = spyOn(component.selectedUser, 'emit');
        component.onSelect(new IdentityUserModel({ username: 'username'}));
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(selectEmitSpy).toHaveBeenCalled();
        });
    });

    it('should show an error message if the user is invalid', async(() => {
        getUserSpy.and.returnValue(of([]));
        getRolesByUserIdSpy.and.returnValue(of([]));
        component.dataError = true;
        fixture.detectChanges();
        let inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
        inputHTMLElement.focus();
        inputHTMLElement.dispatchEvent(new Event('input'));
        inputHTMLElement.dispatchEvent(new Event('keyup'));
        inputHTMLElement.dispatchEvent(new Event('keydown'));
        inputHTMLElement.value = 'ZZZ';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const errorMessage = element.querySelector('.adf-start-task-cloud-error-message');
            expect(element.querySelector('.adf-start-task-cloud-error')).not.toBeNull();
            expect(errorMessage.textContent).toContain('START_TASK_CLOUD.ERROR.MESSAGE');
        });
    }));

});
