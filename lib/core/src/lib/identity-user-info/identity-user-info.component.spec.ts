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

import { IdentityUserInfoComponent } from './identity-user-info.component';
import { setupTestBed } from '../testing/setup-test-bed';
import { TranslateModule } from '@ngx-translate/core';
import { CoreTestingModule } from '../testing/core.testing.module';
import { MatMenuModule } from '@angular/material/menu';
import { By } from '@angular/platform-browser';
import { IdentityUserModel } from '../auth/models/identity-user.model';

describe('IdentityUserInfoComponent', () => {
    let component: IdentityUserInfoComponent;
    let fixture: ComponentFixture<IdentityUserInfoComponent>;
    let element: HTMLElement;

    const identityUserMock = { firstName: 'fake-identity-first-name', lastName: 'fake-identity-last-name', email: 'fakeIdentity@email.com' } as unknown as IdentityUserModel;
    const identityUserWithOutFirstNameMock = { firstName: null, lastName: 'fake-identity-last-name', email: 'fakeIdentity@email.com' } as unknown as IdentityUserModel;
    const identityUserWithOutLastNameMock = { firstName: 'fake-identity-first-name', lastName: null, email: 'fakeIdentity@email.com' } as unknown as IdentityUserModel;

    const whenFixtureReady = async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule,
            MatMenuModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IdentityUserInfoComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        spyOn(window, 'requestAnimationFrame').and.returnValue(1);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should not show any image if the user is not logged in', () => {
        expect(element.querySelector('#userinfo_container')).toBeDefined();
        expect(element.querySelector('#logged-user-img')).toBeNull();
    });

    it('should NOT have users immediately after ngOnInit', () => {
        expect(element.querySelector('#userinfo_container')).toBeDefined();
        expect(element.querySelector('#ecm_username')).toBeNull();
        expect(element.querySelector('#bpm_username')).toBeNull();
        expect(element.querySelector('#user-profile-lists')).toBeNull();
    });

    describe('when identity user is logged in', () => {

        beforeEach(() => {
            component.identityUser = identityUserMock;
            component.isLoggedIn = true;
        });

        it('should show the identity user initials', async () => {
            await whenFixtureReady();
            expect(element.querySelector('#userinfo_container')).toBeDefined();
            expect(element.querySelector('[data-automation-id="user-initials-image"]')?.textContent).toContain('ff');
        });

        it('should show full name next to the user image', async () => {
            await whenFixtureReady();

            const imageButton = element.querySelector<HTMLButtonElement>('#identity-user-image');
            imageButton?.click();

            fixture.detectChanges();

            expect(element.querySelector('#userinfo_container')).not.toBeNull();

            const identityUserName = fixture.debugElement.query(By.css('#identity-username'));
            expect(identityUserName).toBeDefined();
            expect(identityUserName).not.toBeNull();
            expect(identityUserName.nativeElement.textContent).toContain('fake-identity-first-name fake-identity-last-name');
        });

        it('should show last name if first name is null', async () => {
            component.identityUser = identityUserWithOutFirstNameMock;
            await whenFixtureReady();

            const fullNameElement = element.querySelector('#adf-userinfo-identity-name-display');
            expect(element.querySelector('#userinfo_container')).toBeDefined();
            expect(element.querySelector('#adf-userinfo-identity-name-display')).not.toBeNull();
            expect(fullNameElement?.textContent).toContain('fake-identity-last-name');
            expect(fullNameElement?.textContent).not.toContain('fake-identity-first-name');
        });

        it('should not show first name if it is null string', async () => {
            component.identityUser = identityUserWithOutFirstNameMock;
            await whenFixtureReady();

            const fullNameElement = element.querySelector('#adf-userinfo-identity-name-display');
            fixture.detectChanges();
            expect(element.querySelector('#userinfo_container')).toBeDefined();
            expect(fullNameElement).toBeDefined();
            expect(fullNameElement?.textContent).toContain('fake-identity-last-name');
            expect(fullNameElement?.textContent).not.toContain('null');
        });

        it('should not show last name if it is null string', async () => {
            component.identityUser = identityUserWithOutLastNameMock;
            await whenFixtureReady();

            const fullNameElement = element.querySelector('#adf-userinfo-identity-name-display');
            fixture.detectChanges();
            expect(element.querySelector('#userinfo_container')).toBeDefined();
            expect(fullNameElement).toBeDefined();
            expect(fullNameElement?.textContent).toContain('fake-identity-first-name');
            expect(fullNameElement?.textContent).not.toContain('null');
        });
    });
});
