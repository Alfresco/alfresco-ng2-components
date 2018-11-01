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
import { StartTaskCloudService } from '../../services/start-task-cloud.service';
import { LogService, setupTestBed } from '@alfresco/adf-core';
import { fakeUsers, mockRoles } from '../../mock/user-cloud.mock';
import { of } from 'rxjs';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { UserCloudModel } from '../../models/user-cloud.model';

describe('PeopleCloudComponent', () => {
    let component: PeopleCloudComponent;
    let fixture: ComponentFixture<PeopleCloudComponent>;
    let element: HTMLElement;
    let service: StartTaskCloudService;
    let getRolesByUserIdSpy: jasmine.Spy;
    let getUserSpy: jasmine.Spy;

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule, StartTaskCloudTestingModule],
        providers: [StartTaskCloudService, LogService]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PeopleCloudComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        service = TestBed.get(StartTaskCloudService);
        getRolesByUserIdSpy = spyOn(service, 'getRolesByUserId').and.returnValue(of(mockRoles));
        getUserSpy = spyOn(service, 'getUsers').and.returnValue(of(fakeUsers));
        fixture.detectChanges();
    });

    it('should create PeopleCloudComponent', () => {
        expect(component instanceof PeopleCloudComponent).toBeTruthy();
    });

    it('should able to fetch users', () => {
        fixture.detectChanges();
        expect(getUserSpy).toHaveBeenCalled();
    });

    it('should able to fetch roles by user id', () => {
        fixture.detectChanges();
        expect(getRolesByUserIdSpy).toHaveBeenCalled();
    });

    it('should return empty display name for missing model', () => {
        expect(component.getDisplayName(null)).toBe('');
    });

    it('should return full name for a given model', () => {
        let model = <UserCloudModel> { firstName: 'John', lastName: 'Doe'};
        expect(component.getDisplayName(model)).toBe('John Doe');
    });

    it('should skip first name for display name', () => {
        let model = <UserCloudModel> { firstName: null, lastName: 'Doe'};
        expect(component.getDisplayName(model)).toBe('Doe');
    });

    it('should skip last name for display name', () => {
        let model = <UserCloudModel> { firstName: 'John', lastName: null};
        expect(component.getDisplayName(model)).toBe('John');
    });

    it('should show the users if the typed result match', async(() => {
        component.users$ = of(fakeUsers);
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
        component.onSelect({ username: 'username'});
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
            expect(errorMessage.textContent).toContain('START-TASK-CLOUD.ERROR.MESSAGE');
        });
    }));

});
