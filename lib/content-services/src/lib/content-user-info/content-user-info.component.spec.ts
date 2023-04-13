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

import {
    CoreTestingModule,
    IdentityUserModel,
    InitialUsernamePipe,
    setupTestBed,
    UserInfoMode
} from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { By, DomSanitizer } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { fakeEcmEditedUser, fakeEcmUser, fakeEcmUserNoImage } from '../common/mocks/ecm-user.service.mock';
import { ContentTestingModule } from '../testing/content.testing.module';

import { ContentUserInfoComponent } from './content-user-info.component';

class FakeSanitizer extends DomSanitizer {

    constructor() {
        super();
    }

    sanitize(html) {
        return html;
    }

    bypassSecurityTrustHtml(value: string): any {
        return value;
    }

    bypassSecurityTrustStyle(): any {
        return null;
    }

    bypassSecurityTrustScript(): any {
        return null;
    }

    bypassSecurityTrustUrl(): any {
        return null;
    }

    bypassSecurityTrustResourceUrl(): any {
        return null;
    }
}

describe('ContentUserInfoComponent', () => {
    const profilePictureUrl = 'alfresco-logo.svg';

    let component: ContentUserInfoComponent;
    let fixture: ComponentFixture<ContentUserInfoComponent>;
    let element: HTMLElement;

    const identityUserMock = { firstName: 'fake-identity-first-name', lastName: 'fake-identity-last-name', email: 'fakeIdentity@email.com' };
    const identityUserWithOutLastNameMock = { firstName: 'fake-identity-first-name', lastName: null, email: 'fakeIdentity@email.com' };

    const openUserInfo = () => {
        fixture.detectChanges();
        const imageButton = element.querySelector<HTMLButtonElement>('#logged-user-img');
        imageButton.click();
        fixture.detectChanges();
    };

    const whenFixtureReady = async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule,
            ContentTestingModule,
            MatMenuModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ContentUserInfoComponent);
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
        expect(element.querySelector('#user-profile-lists')).toBeNull();
    });

    describe('when user is logged on ecm', () => {

        beforeEach(() => {
            component.ecmUser = fakeEcmUser as any;
            component.isLoggedIn = true;
        });

        describe('ui', () => {

            it('should show ecm only last name when user first name is null ', async () => {
                component.ecmUser = fakeEcmEditedUser as any;
                await whenFixtureReady();

                openUserInfo();
                expect(element.querySelector('#userinfo_container')).toBeDefined();
                const ecmUsername = fixture.debugElement.query(By.css('#ecm-username'));
                expect(ecmUsername).toBeDefined();
                expect(ecmUsername).not.toBeNull();
                expect(ecmUsername.nativeElement.textContent).not.toContain('fake-ecm-first-name');
                expect(ecmUsername.nativeElement.textContent).not.toContain('null');
            });

            it('should show the username when showName attribute is true', async () => {
                await whenFixtureReady();
                expect(component.showName).toBeTruthy();
                expect(element.querySelector('#adf-userinfo-ecm-name-display')).not.toBeNull();
            });

            it('should hide the username when showName attribute is false', async () => {
                component.showName = false;
                await whenFixtureReady();
                expect(element.querySelector('#adf-userinfo-ecm-name-display')).toBeNull();
            });

            it('should have the defined class to show the name on the right side', async () => {
                await whenFixtureReady();
                expect(element.querySelector('#userinfo_container').classList).toContain('adf-userinfo-name-right');
            });

            it('should not have the defined class to show the name on the left side', async () => {
                component.namePosition = 'left';
                await whenFixtureReady();
                expect(element.querySelector('#userinfo_container').classList).not.toContain('adf-userinfo-name-right');
            });

            describe('and has image', () => {

                beforeEach(async () => {
                    component.ecmUser = fakeEcmUser as any;
                    component.isLoggedIn = true;
                    spyOn(component, 'getEcmAvatar').and.returnValue(profilePictureUrl);
                    await whenFixtureReady();
                });

                it('should get the ecm current user image', async () => {
                    openUserInfo();
                    const loggedImage = fixture.debugElement.query(By.css('#logged-user-img'));

                    expect(element.querySelector('#userinfo_container')).not.toBeNull();
                    expect(loggedImage).not.toBeNull();
                    expect(loggedImage.properties.src).toContain(profilePictureUrl);
                });

                it('should display the current user image if user has avatarId', () => {
                    openUserInfo();
                    const loggedImage = fixture.debugElement.query(By.css('#logged-user-img'));
                    expect(component.ecmUser).toBeDefined();
                    expect(component.ecmUser.avatarId).toBe('fake-avatar-id');
                    expect(element.querySelector('#userinfo_container')).not.toBeNull();
                    expect(loggedImage).not.toBeNull();
                    expect(loggedImage.properties.src).toContain(profilePictureUrl);
                });

                it('should get the ecm user information', async () => {
                    openUserInfo();
                    const ecmImage = fixture.debugElement.query(By.css('#ecm-user-detail-image'));
                    const ecmFullName = fixture.debugElement.query(By.css('#ecm-full-name'));
                    const ecmJobTitle = fixture.debugElement.query(By.css('#ecm-job-title-label'));

                    expect(element.querySelector('#userinfo_container')).not.toBeNull();
                    expect(fixture.debugElement.query(By.css('#ecm-username'))).not.toBeNull();
                    expect(ecmImage).not.toBeNull();
                    expect(ecmImage.properties.src).toContain(profilePictureUrl);
                    expect(ecmFullName.nativeElement.textContent).toContain('fake-ecm-first-name fake-ecm-last-name');
                    expect(ecmJobTitle.nativeElement.textContent).toContain('USER_PROFILE.LABELS.ECM.JOB_TITLE');
                });
            });

            describe('and has no image', () => {

                beforeEach( async () => {
                    component.ecmUser = fakeEcmUserNoImage as any;
                    component.isLoggedIn = true;
                    await whenFixtureReady();
                });

                it('should show N/A when the job title is null', () => {
                    const imageButton = element.querySelector<HTMLButtonElement>('[data-automation-id="user-initials-image"]');
                    imageButton.click();
                    fixture.detectChanges();
                    expect(element.querySelector('#userinfo_container')).not.toBeNull();
                    const ecmJobTitle = fixture.debugElement.query(By.css('#ecm-job-title'));
                    expect(ecmJobTitle).not.toBeNull();
                    expect(ecmJobTitle).not.toBeNull();
                    expect(ecmJobTitle.nativeElement.textContent).toContain('N/A');
                });

                it('should not show the tabs', () => {
                    const imageButton = element.querySelector<HTMLButtonElement>('[data-automation-id="user-initials-image"]');
                    imageButton.click();
                    fixture.detectChanges();
                    const tabHeader = fixture.debugElement.query(By.css('#tab-group-env'));
                    expect(tabHeader.classes['adf-hide-tab']).toBeTruthy();
                });

                it('should display the current user Initials if the user dose not have avatarId', () => {
                    fixture.detectChanges();
                    const pipe = new InitialUsernamePipe(new FakeSanitizer());
                    const expected = pipe.transform({
                        firstName: 'Wilbur',
                        lastName: 'Adams',
                        email: 'wilbur@app.com'
                    });
                    expect(expected).toBe('<div data-automation-id="user-initials-image" class="">WA</div>');
                    expect(component.ecmUser).toBeDefined();
                    expect(component.ecmUser.avatarId).toBeNull();
                });
            });
        });

        describe('when identity user is logged in', () => {

            beforeEach(() => {
                component.ecmUser = fakeEcmUser as any;
                component.identityUser = identityUserMock as unknown as IdentityUserModel;
                component.isLoggedIn = true;
                component.mode = UserInfoMode.CONTENT_SSO;
            });

            it('should not show initials if the user have avatar and provider is ECM', async () => {
                component.identityUser = identityUserWithOutLastNameMock as unknown as IdentityUserModel;
                await whenFixtureReady();

                expect(element.querySelector('.adf-userinfo-pic')).toBeNull();
                expect(element.querySelector('.adf-userinfo-profile-image')).toBeDefined();
                expect(element.querySelector('.adf-userinfo-profile-image')).not.toBeNull();
            });
        });
    });
});
