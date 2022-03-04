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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By, DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService, ContentService, PeopleContentService } from '../../services';
import { InitialUsernamePipe } from '../../pipes';
import { fakeBpmUser } from '../../mock/bpm-user.service.mock';
import { fakeEcmEditedUser, fakeEcmUser, fakeEcmUserNoImage } from '../../mock/ecm-user.service.mock';
import { BpmUserService } from '../../services/bpm-user.service';
import { IdentityUserService } from '../../services/identity-user.service';
import { BpmUserModel } from '../../models/bpm-user.model';
import { EcmUserModel } from '../../models/ecm-user.model';
import { UserInfoComponent } from './user-info.component';
import { of } from 'rxjs';
import { setupTestBed } from '../../testing/setup-test-bed';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';

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

describe('User info component', () => {

    let component: UserInfoComponent;
    let fixture: ComponentFixture<UserInfoComponent>;
    let element: HTMLElement;
    let authService: AuthenticationService;
    let contentService: ContentService;
    let peopleContentService: PeopleContentService;
    let bpmUserService: BpmUserService;
    let identityUserService: IdentityUserService;

    const identityUserMock = { firstName: 'fake-identity-first-name', lastName: 'fake-identity-last-name', email: 'fakeIdentity@email.com' };
    const identityUserWithOutFirstNameMock = { firstName: null, lastName: 'fake-identity-last-name', email: 'fakeIdentity@email.com' };
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
            MatMenuModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserInfoComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        authService = TestBed.inject(AuthenticationService);
        peopleContentService = TestBed.inject(PeopleContentService);
        bpmUserService = TestBed.inject(BpmUserService);
        contentService = TestBed.inject(ContentService);
        identityUserService = TestBed.inject(IdentityUserService);

        spyOn(window, 'requestAnimationFrame').and.returnValue(1);
        spyOn(bpmUserService, 'getCurrentUserProfileImage').and.returnValue('app/rest/admin/profile-picture');
        spyOn(contentService, 'getContentUrl').and.returnValue('alfresco-logo.svg');
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

    describe('when user is logged on ecm', () => {

        let getCurrenEcmtUserInfoStub;
        let isOauthStub;
        let isEcmLoggedInStub;
        let isLoggedInStub;
        let isBpmLoggedInStub;

        beforeEach(() => {
            isOauthStub = spyOn(authService, 'isOauth').and.returnValue(false);
            isEcmLoggedInStub = spyOn(authService, 'isEcmLoggedIn').and.returnValue(true);
            isLoggedInStub = spyOn(authService, 'isLoggedIn').and.returnValue(true);
            isBpmLoggedInStub = spyOn(authService, 'isBpmLoggedIn').and.returnValue(false);
            getCurrenEcmtUserInfoStub = spyOn(peopleContentService, 'getCurrentUserInfo').and.returnValue(of(fakeEcmUser as any));
        });

        describe('ui ', () => {

            it('should able to fetch ecm userInfo', (done) => {
                component.getUserInfo();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    component.ecmUser$.subscribe((response: EcmUserModel) => {
                        expect(response).toBeDefined();
                        expect(response.firstName).toBe('fake-ecm-first-name');
                        expect(response.lastName).toBe('fake-ecm-last-name');
                        expect(response.email).toBe('fakeEcm@ecmUser.com');
                        done();
                    });
                });
            });

            it('should show ecm only last name when user first name is null ', async () => {
                getCurrenEcmtUserInfoStub.and.returnValue(of(fakeEcmEditedUser));
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
                    isOauthStub.and.returnValue(false);
                    isEcmLoggedInStub.and.returnValue(true);
                    isLoggedInStub.and.returnValue(true);
                    getCurrenEcmtUserInfoStub.and.returnValue(of(fakeEcmUser));
                    await whenFixtureReady();
                });

                it('should get the ecm current user image from the service', async () => {
                    openUserInfo();
                    const loggedImage = fixture.debugElement.query(By.css('#logged-user-img'));

                    expect(element.querySelector('#userinfo_container')).not.toBeNull();
                    expect(loggedImage).not.toBeNull();
                    expect(loggedImage.properties.src).toContain('alfresco-logo.svg');
                });

                it('should display the current user image if user has avatarId', (done) => {
                    openUserInfo();
                    const loggedImage = fixture.debugElement.query(By.css('#logged-user-img'));
                    component.ecmUser$.subscribe((response: EcmUserModel) => {
                        expect(response).toBeDefined();
                        expect(response.avatarId).toBe('fake-avatar-id');
                        done();
                    });
                    expect(element.querySelector('#userinfo_container')).not.toBeNull();
                    expect(loggedImage).not.toBeNull();
                    expect(loggedImage.properties.src).toContain('alfresco-logo.svg');
                });

                it('should get the ecm user information from the service', async () => {
                    openUserInfo();
                    const ecmImage = fixture.debugElement.query(By.css('#ecm-user-detail-image'));
                    const ecmFullName = fixture.debugElement.query(By.css('#ecm-full-name'));
                    const ecmJobTitle = fixture.debugElement.query(By.css('#ecm-job-title-label'));

                    expect(element.querySelector('#userinfo_container')).not.toBeNull();
                    expect(fixture.debugElement.query(By.css('#ecm-username'))).not.toBeNull();
                    expect(ecmImage).not.toBeNull();
                    expect(ecmImage.properties.src).toContain('alfresco-logo.svg');
                    expect(ecmFullName.nativeElement.textContent).toContain('fake-ecm-first-name fake-ecm-last-name');
                    expect(ecmJobTitle.nativeElement.textContent).toContain('USER_PROFILE.LABELS.ECM.JOB_TITLE');
                });
            });

            describe('and has no image', () => {

                beforeEach( async () => {
                    isOauthStub.and.returnValue(false);
                    isEcmLoggedInStub.and.returnValue(true);
                    isLoggedInStub.and.returnValue(true);
                    isBpmLoggedInStub.and.returnValue(false);
                    getCurrenEcmtUserInfoStub.and.returnValue(of(fakeEcmUserNoImage));
                    await whenFixtureReady();
                });

                it('should show N/A when the job title is null', () => {
                    const imageButton = element.querySelector<HTMLButtonElement>('#user-initials-image');
                    imageButton.click();
                    fixture.detectChanges();
                    expect(element.querySelector('#userinfo_container')).not.toBeNull();
                    const ecmJobTitle = fixture.debugElement.query(By.css('#ecm-job-title'));
                    expect(ecmJobTitle).not.toBeNull();
                    expect(ecmJobTitle).not.toBeNull();
                    expect(ecmJobTitle.nativeElement.textContent).toContain('N/A');
                });

                it('should not show the tabs', () => {
                    const imageButton = element.querySelector<HTMLButtonElement>('#user-initials-image');
                    imageButton.click();
                    fixture.detectChanges();
                    const tabHeader = fixture.debugElement.query(By.css('#tab-group-env'));
                    expect(tabHeader.classes['adf-hide-tab']).toBeTruthy();
                });

                it('should display the current user Initials if the user dose not have avatarId', (done) => {
                    fixture.detectChanges();
                    const pipe = new InitialUsernamePipe(new FakeSanitizer());
                    const expected = pipe.transform({
                        id: 13,
                        firstName: 'Wilbur',
                        lastName: 'Adams',
                        email: 'wilbur@app.com'
                    });
                    expect(expected).toBe('<div id="user-initials-image" class="">WA</div>');
                    component.ecmUser$.subscribe((response: EcmUserModel) => {
                        expect(response).toBeDefined();
                        expect(response.avatarId).toBeNull();
                        done();
                    });
                });
            });
        });

        describe('when user is logged on bpm', () => {

            let getCurrentUserInfoStub: jasmine.Spy;

            beforeEach(() => {
                isOauthStub.and.returnValue(false);
                isBpmLoggedInStub.and.returnValue(true);
                isLoggedInStub.and.returnValue(true);
                isEcmLoggedInStub.and.returnValue(false);
                getCurrentUserInfoStub = spyOn(bpmUserService, 'getCurrentUserInfo').and.returnValue(of(fakeBpmUser));
            });

            it('should fetch bpm userInfo', (done) => {
                getCurrentUserInfoStub.and.returnValue(of(fakeBpmUser));
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    component.bpmUser$.subscribe((response: BpmUserModel) => {
                        expect(response).toBeDefined();
                        expect(response.firstName).toBe('fake-bpm-first-name');
                        expect(response.lastName).toBe('fake-bpm-last-name');
                        expect(response.email).toBe('fakeBpm@fake.com');
                        done();
                    });
                });
            });

            it('should show full name next the user image', async () => {
                await whenFixtureReady();
                openUserInfo();
                const bpmUserName = fixture.debugElement.query(By.css('#bpm-username'));
                expect(element.querySelector('#userinfo_container')).not.toBeNull();
                expect(bpmUserName).toBeDefined();
                expect(bpmUserName).not.toBeNull();
                expect(bpmUserName.nativeElement.innerHTML).toContain('fake-bpm-first-name fake-bpm-last-name');
            });

            it('should get the bpm current user image from the service', async () => {
                await whenFixtureReady();
                expect(element.querySelector('#userinfo_container')).not.toBeNull();
                expect(element.querySelector('#logged-user-img')).not.toBeNull();
                expect(element.querySelector('#logged-user-img').getAttribute('src'))
                    .toContain('app/rest/admin/profile-picture');
            });

            it('should show last name if first name is null', async () => {
                const wrongBpmUser: BpmUserModel = new BpmUserModel({
                    firstName: null,
                    lastName: 'fake-last-name'
                });
                getCurrentUserInfoStub.and.returnValue(of(wrongBpmUser));
                await whenFixtureReady();
                const fullNameElement = (element.querySelector('#adf-userinfo-bpm-name-display'));
                fixture.detectChanges();
                expect(element.querySelector('#userinfo_container')).toBeDefined();
                expect(element.querySelector('#adf-userinfo-bpm-name-display')).not.toBeNull();
                expect(fullNameElement.textContent).toContain('fake-last-name');
                expect(fullNameElement.textContent).not.toContain('fake-first-name');
            });

            it('should not show the tabs', async () => {
                await whenFixtureReady();
                openUserInfo();
                await fixture.whenStable();
                fixture.detectChanges();
                expect(fixture.debugElement.query(By.css('#tab-group-env')).classes['adf-hide-tab']).toBeTruthy();
            });
        });

        describe('when user is logged on bpm and ecm', () => {

            beforeEach(() => {
                isOauthStub.and.returnValue(false);
                isEcmLoggedInStub.and.returnValue(true);
                isBpmLoggedInStub.and.returnValue(true);
                isLoggedInStub.and.returnValue(true);

                getCurrenEcmtUserInfoStub.and.returnValue(of(fakeEcmUser));
                spyOn(bpmUserService, 'getCurrentUserInfo').and.returnValue(of(fakeBpmUser));
            });

            it('should get the bpm user information from the service', async () => {
                await whenFixtureReady();
                openUserInfo();
                const bpmTab = fixture.debugElement.queryAll(By.css('#tab-group-env .mat-tab-labels .mat-tab-label'))[1];
                bpmTab.triggerEventHandler('click', null);
                fixture.detectChanges();
                await fixture.whenStable();
                const bpmUsername = fixture.debugElement.query(By.css('#bpm-username'));
                const bpmImage = fixture.debugElement.query(By.css('#bpm-user-detail-image'));
                expect(element.querySelector('#userinfo_container')).not.toBeNull();
                expect(bpmUsername).not.toBeNull();
                expect(bpmImage).not.toBeNull();
                expect(bpmImage.properties.src).toContain('app/rest/admin/profile-picture');
                expect(bpmUsername.nativeElement.textContent).toContain('fake-bpm-first-name fake-bpm-last-name');
                expect(fixture.debugElement.query(By.css('#bpm-tenant')).nativeElement.textContent).toContain('fake-tenant-name');
            });

            it('should get the ecm user information from the service', async () => {
                await whenFixtureReady();
                openUserInfo();
                const ecmUsername = fixture.debugElement.query(By.css('#ecm-username'));
                const ecmImage = fixture.debugElement.query(By.css('#ecm-user-detail-image'));

                fixture.detectChanges();
                await fixture.whenStable();
                expect(element.querySelector('#userinfo_container')).toBeDefined();
                expect(ecmUsername).not.toBeNull();
                expect(ecmImage).not.toBeNull();
                expect(ecmImage.properties.src).toContain('alfresco-logo.svg');
                expect(fixture.debugElement.query(By.css('#ecm-full-name')).nativeElement.textContent).toContain('fake-ecm-first-name fake-ecm-last-name');
                expect(fixture.debugElement.query(By.css('#ecm-job-title')).nativeElement.textContent).toContain('job-ecm-test');
            });

            it('should show the ecm image if exists', async () => {
                await whenFixtureReady();
                openUserInfo();
                expect(element.querySelector('#userinfo_container')).toBeDefined();
                expect(element.querySelector('#logged-user-img')).toBeDefined();
                expect(element.querySelector('#logged-user-img').getAttribute('src')).toEqual('alfresco-logo.svg');
            });

            it('should show the ecm initials if the ecm user has no image', async () => {
                getCurrenEcmtUserInfoStub.and.returnValue(of(fakeEcmUserNoImage));
                await whenFixtureReady();

                expect(element.querySelector('#userinfo_container')).toBeDefined();
                expect(element.querySelector('#user-initials-image').textContent).toContain('ff');
            });

            it('should show the tabs for the env', async () => {
                await whenFixtureReady();
                openUserInfo();
                const tabGroup = fixture.debugElement.query(By.css('#tab-group-env'));
                const tabs = fixture.debugElement.queryAll(By.css('#tab-group-env .mat-tab-labels .mat-tab-label'));

                expect(tabGroup).not.toBeNull();
                expect(tabGroup.classes['adf-hide-tab']).toBeFalsy();
                expect(tabs.length).toBe(2);
            });

            it('should not close the menu when a tab is clicked', async () => {
                await whenFixtureReady();
                openUserInfo();
                const tabGroup = fixture.debugElement.query(By.css('#tab-group-env'));
                const tabs = fixture.debugElement.queryAll(By.css('#tab-group-env .mat-tab-labels .mat-tab-label'));

                expect(tabGroup).not.toBeNull();
                tabs[1].triggerEventHandler('click', null);
                fixture.detectChanges();
                expect(fixture.debugElement.query(By.css('#user-profile-lists'))).not.toBeNull();
            });
        });

        describe('when identity user is logged in', () => {

            let getCurrentUserInfoStub: jasmine.Spy;

            beforeEach(() => {
                isOauthStub.and.returnValue(true);
                isLoggedInStub.and.returnValue(true);
                isEcmLoggedInStub.and.returnValue(false);
                getCurrentUserInfoStub = spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue(identityUserMock);
            });

            it('should show the identity user initials if is not ecm user', async () => {
                await whenFixtureReady();
                expect(element.querySelector('#userinfo_container')).toBeDefined();
                expect(element.querySelector('#user-initials-image').textContent).toContain('ff');
            });

            it('should able to fetch identity userInfo', (done) => {
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    component.identityUser$.subscribe(response => {
                        expect(response).toBeDefined();
                        expect(response.firstName).toBe('fake-identity-first-name');
                        expect(response.lastName).toBe('fake-identity-last-name');
                        expect(response.email).toBe('fakeIdentity@email.com');
                        done();
                    });
                });
            });

            it('should show full name next the user image', async () => {
                await whenFixtureReady();

                const imageButton = element.querySelector<HTMLButtonElement>('#identity-user-image');
                imageButton.click();
                fixture.detectChanges();
                expect(element.querySelector('#userinfo_container')).not.toBeNull();
                const bpmUserName = fixture.debugElement.query(By.css('#identity-username'));
                expect(bpmUserName).toBeDefined();
                expect(bpmUserName).not.toBeNull();
                expect(bpmUserName.nativeElement.textContent).toContain('fake-identity-first-name fake-identity-last-name');
            });

            it('should show last name if first name is null', async () => {
                getCurrentUserInfoStub.and.returnValue(identityUserWithOutFirstNameMock);
                await whenFixtureReady();

                const fullNameElement = element.querySelector('#adf-userinfo-identity-name-display');
                expect(element.querySelector('#userinfo_container')).toBeDefined();
                expect(element.querySelector('#adf-userinfo-identity-name-display')).not.toBeNull();
                expect(fullNameElement.textContent).toContain('fake-identity-last-name');
                expect(fullNameElement.textContent).not.toContain('fake-identity-first-name');
            });

            it('should not show first name if it is null string', async () => {
                getCurrentUserInfoStub.and.returnValue(identityUserWithOutFirstNameMock);
                await whenFixtureReady();

                const fullNameElement = element.querySelector('#adf-userinfo-identity-name-display');
                fixture.detectChanges();
                expect(element.querySelector('#userinfo_container')).toBeDefined();
                expect(fullNameElement).toBeDefined();
                expect(fullNameElement.textContent).toContain('fake-identity-last-name');
                expect(fullNameElement.textContent).not.toContain('null');
            });

            it('should not show last name if it is null string', async () => {
                getCurrentUserInfoStub.and.returnValue(identityUserWithOutLastNameMock);
                await whenFixtureReady();

                const fullNameElement = element.querySelector('#adf-userinfo-identity-name-display');
                fixture.detectChanges();
                expect(element.querySelector('#userinfo_container')).toBeDefined();
                expect(fullNameElement).toBeDefined();
                expect(fullNameElement.textContent).toContain('fake-identity-first-name');
                expect(fullNameElement.textContent).not.toContain('null');
            });

            it('should not show initials if the user have avatar', async () => {
                getCurrentUserInfoStub.and.returnValue(identityUserWithOutLastNameMock);
                getCurrenEcmtUserInfoStub.and.returnValue(of(fakeEcmUser));
                isEcmLoggedInStub.and.returnValue(true);
                await whenFixtureReady();

                expect(element.querySelector('.adf-userinfo-pic')).toBeNull();
                expect(element.querySelector('.adf-userinfo-profile-image')).toBeDefined();
                expect(element.querySelector('.adf-userinfo-profile-image')).not.toBeNull();
            });
        });

        describe('kerberos', () => {

            beforeEach(async () => {
                isOauthStub.and.returnValue(false);
                isEcmLoggedInStub.and.returnValue(false);
                isBpmLoggedInStub.and.returnValue(false);
                isLoggedInStub.and.returnValue(false);
                spyOn(authService, 'isKerberosEnabled').and.returnValue(true);
                spyOn(authService, 'isALLProvider').and.returnValue(true);
                spyOn(bpmUserService, 'getCurrentUserInfo').and.returnValue(of(fakeBpmUser));
                getCurrenEcmtUserInfoStub.and.returnValue(of(fakeEcmUser));

                await whenFixtureReady();
            });

            it('should show the bpm user information', async () => {
                openUserInfo();
                const bpmTab = fixture.debugElement.queryAll(By.css('#tab-group-env .mat-tab-labels .mat-tab-label'))[1];
                bpmTab.triggerEventHandler('click', null);
                fixture.detectChanges();
                await fixture.whenStable();
                const bpmUsername = fixture.debugElement.query(By.css('#bpm-username'));
                const bpmImage = fixture.debugElement.query(By.css('#bpm-user-detail-image'));
                expect(bpmImage.properties.src).toContain('app/rest/admin/profile-picture');
                expect(bpmUsername.nativeElement.textContent).toContain('fake-bpm-first-name fake-bpm-last-name');
                expect(fixture.debugElement.query(By.css('#bpm-tenant')).nativeElement.textContent).toContain('fake-tenant-name');
            });

            it('should show the ecm user information', async () => {
                openUserInfo();
                const ecmTab = fixture.debugElement.queryAll(By.css('#tab-group-env .mat-tab-labels .mat-tab-label'))[0];
                ecmTab.triggerEventHandler('click', null);
                fixture.detectChanges();
                await fixture.whenStable();
                expect(fixture.debugElement.query(By.css('#ecm-full-name')).nativeElement.textContent).toContain('fake-ecm-first-name fake-ecm-last-name');
                expect(fixture.debugElement.query(By.css('#ecm-job-title')).nativeElement.textContent).toContain('job-ecm-test');
            });
        });
    });
});
