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

import { UserInfoComponent } from './user-info.component';
import { EcmUserService } from '../services/ecm-user.service';
import { BpmUserService } from '../services/bpm-user.service';
import { BpmUserModel } from '../models/bpm-user.model';
import { TranslationMock } from '../assets/translation.service.mock';
import {
    CoreModule,
    AuthService,
    ContentService,
    AlfrescoTranslateService
} from 'ng2-alfresco-core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

declare let jasmine: any;

const fakeBpmUser: BpmUserModel = <BpmUserModel>{
    'id': 'fake-id',
    'firstName': 'fake-bpm-first-name',
    'lastName': 'fake-bpm-last-name',
    'created': null,
    'lastUpdate': null,
    'latestSyncTimeStamp': null,
    'email': 'fake-bpm-email',
    'externalId': null,
    'company': null,
    'pictureId': null,
    'fullname': 'fake-full-name',
    'password': null,
    'type': 'enterprise',
    'status': 'active',
    'tenantId': '1',
    'groups': [{
        'id': 1,
        'name': 'analytics-users',
        'externalId': null,
        'status': 'active',
        'tenantId': 1,
        'type': 0,
        'parentGroupId': null,
        'lastSyncTimeStamp': null,
        'userCount': null,
        'users': null,
        'capabilities': null,
        'groups': null,
        'manager': null
    }],
    'capabilities': null,
    'apps': [],
    'primaryGroup': null,
    'tenantPictureId': null,
    'tenantName': 'fake-tenant-name'
};

describe('User info component', () => {

    let userInfoComp: UserInfoComponent;
    let fixture: ComponentFixture<UserInfoComponent>;
    let element: HTMLElement;
    let stubAuthService: AuthService;
    let stubContent: ContentService;
    let componentHandler;

    beforeEach(async(() => {
        componentHandler = jasmine.createSpyObj('componentHandler', ['upgradeAllRegistered', 'upgradeElement']);
        window['componentHandler'] = componentHandler;
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                UserInfoComponent
            ],
            providers: [
                EcmUserService,
                BpmUserService,
                {provide: AlfrescoTranslateService, useClass: TranslationMock}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(UserInfoComponent);
            userInfoComp = fixture.componentInstance;
            element = fixture.nativeElement;

            stubAuthService = TestBed.get(AuthService);
            stubContent = TestBed.get(ContentService);
        });
    }));

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
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

    it('should format null string values in null value', () => {
        let res = userInfoComp.formatValue('null');
        expect(res).toBeDefined();
        expect(res).toBeNull();
    });

    it('should return the value when it is not null string', () => {
        let res = userInfoComp.formatValue('fake-value');
        expect(res).toBeDefined();
        expect(res).not.toBeNull();
        expect(res).toEqual('fake-value');
    });

    it('should return the anonymous avatar when users do not have images', () => {
        let event = <any> {
            target: {
                src: ''
            }
        };
        userInfoComp.onImageLoadingError(event);
        expect(event.target.src).toContain('assets/images/anonymous.gif');
    });

    describe('when user is logged on ecm', () => {

        beforeEach(() => {
            spyOn(stubAuthService, 'isEcmLoggedIn').and.returnValue(true);
            spyOn(stubAuthService, 'isLoggedIn').and.returnValue(true);
        });

        beforeEach(() => {
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        describe('and has image', () => {

            beforeEach(async(() => {
                spyOn(stubContent, 'getContentUrl').and.returnValue('assets/images/ecmImg.gif');
                fixture.detectChanges();
                jasmine.Ajax.requests.mostRecent().respondWith({
                    status: 200,
                    contentType: 'json',
                    responseText: {
                        'entry': {
                            'id': 'fake-id',
                            'firstName': 'fake-ecm-first-name',
                            'lastName': 'fake-ecm-last-name',
                            'description': 'i am a fake user for test',
                            'avatarId': 'fake-avatar-id',
                            'email': 'fakeEcm@ecmUser.com'
                        }
                    }
                });
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                });
            }));

            it('should show ecm only last name when user first name is null ', async(() => {
                userInfoComp.ecmUser.firstName = null;
                fixture.detectChanges();
                expect(element.querySelector('#userinfo_container')).toBeDefined();
                expect(element.querySelector('#ecm-username')).toBeDefined();
                expect(element.querySelector('#ecm-username').textContent).not.toContain('fake-ecm-first-name');
            }));

            xit('should get the ecm current user image from the service', async(() => {
                expect(element.querySelector('#userinfo_container')).toBeDefined();
                expect(element.querySelector('#logged-user-img')).toBeDefined();
                expect(element.querySelector('#logged-user-img').getAttribute('src')).toContain('assets/images/ecmImg.gif');
            }));

            xit('should get the ecm user informations from the service', async(() => {
                expect(element.querySelector('#userinfo_container')).toBeDefined();
                expect(element.querySelector('#ecm_username')).toBeDefined();
                expect(element.querySelector('#ecm_title')).toBeDefined();
                expect(element.querySelector('#ecm-user-detail-image')).toBeDefined();
                expect(element.querySelector('#ecm-user-detail-image').getAttribute('src')).toContain('assets/images/ecmImg.gif');
                expect(element.querySelector('#ecm-full-name').textContent).toContain('fake-ecm-first-name fake-ecm-last-name');
                expect(element.querySelector('#ecm-job-title').textContent).toContain('USER_PROFILE.LABELS.ECM.JOB_TITLE');
            }));
        });

        describe('and has no image', () => {

            beforeEach(async(() => {
                userInfoComp.anonymousImageUrl = userInfoComp.anonymousImageUrl.replace('/base/dist', '');
                spyOn(stubContent, 'getContentUrl').and.returnValue('wrongImage.gif');
                fixture.detectChanges();
                jasmine.Ajax.requests.mostRecent().respondWith({
                    status: 200,
                    contentType: 'json',
                    responseText: {
                        'entry': {
                            'id': 'fake-id',
                            'firstName': 'fake-first-name',
                            'lastName': 'fake-last-name',
                            'description': 'i am a fake user for test',
                            'email': 'fakeEcm@ecmUser.com'
                        }
                    }
                });
            }));

            it('should show N/A when the job title is null', async(() => {
                fixture.detectChanges();
                expect(element.querySelector('#userinfo_container')).toBeDefined();
                expect(element.querySelector('#ecm-job-title')).toBeDefined();
                expect(element.querySelector('#ecm-job-title').textContent).toContain('N/A');
            }));

            it('should not show the tabs', () => {
                fixture.detectChanges();
                expect(element.querySelector('#tab-bar-env').getAttribute('hidden')).not.toBeNull();
            });
        });

    });

    describe('when user is logged on bpm', () => {

        let fakeBpmUserForTest;

        beforeEach(() => {
            spyOn(stubAuthService, 'isBpmLoggedIn').and.returnValue(true);
            spyOn(stubAuthService, 'isLoggedIn').and.returnValue(true);
            jasmine.Ajax.install();
            fakeBpmUserForTest = fakeBpmUser;
        });

        beforeEach(async(() => {
            userInfoComp.anonymousImageUrl = userInfoComp.anonymousImageUrl.replace('/base/dist', '');
            fixture.detectChanges();
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: fakeBpmUserForTest
            });
        }));

        beforeEach(() => {
            fixture.detectChanges();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('should get the bpm current user image from the service', async(() => {
            expect(element.querySelector('#userinfo_container')).toBeDefined();
            expect(element.querySelector('#logged-user-img')).toBeDefined();
            expect(element.querySelector('#logged-user-img').getAttribute('src'))
                .toContain('activiti-app/app/rest/admin/profile-picture');

        }));

        it('should show last name if first name is null', async(() => {
            userInfoComp.bpmUser.firstName = null;
            fixture.detectChanges();
            expect(element.querySelector('#userinfo_container')).toBeDefined();
            expect(element.querySelector('#bpm-username')).not.toBeNull();
            expect(element.querySelector('#bpm-username').textContent).toContain('fake-bpm-last-name');

        }));

        it('should show full name if first and last name are null', async(() => {
            userInfoComp.bpmUser.firstName = null;
            userInfoComp.bpmUser.lastName = null;
            fixture.detectChanges();
            expect(element.querySelector('#userinfo_container')).toBeDefined();
            expect(element.querySelector('#bpm-username')).toBeDefined();
            expect(element.querySelector('#bpm-username').innerHTML).toContain('fake-full-name');

        }));

        it('should not show first name if it is null string', async(() => {
            userInfoComp.bpmUser.firstName = 'null';
            userInfoComp.bpmUser.lastName = 'fake-last-name';
            fixture.detectChanges();
            expect(element.querySelector('#userinfo_container')).toBeDefined();
            expect(element.querySelector('#bpm-full-name')).toBeDefined();
            expect(element.querySelector('#bpm-full-name').textContent).toContain('fake-last-name');
            expect(element.querySelector('#bpm-full-name').textContent).not.toContain('null');
        }));

        it('should not show last name if it is null string', async(() => {
            userInfoComp.bpmUser.firstName = 'fake-first-name';
            userInfoComp.bpmUser.lastName = 'null';
            fixture.detectChanges();
            expect(element.querySelector('#userinfo_container')).toBeDefined();
            expect(element.querySelector('#bpm-full-name')).toBeDefined();
            expect(element.querySelector('#bpm-full-name').textContent).toContain('fake-first-name');
            expect(element.querySelector('#bpm-full-name').textContent).not.toContain('null');
        }));

        it('should not show the tabs', () => {
            fixture.detectChanges();
            expect(element.querySelector('#tab-bar-env').getAttribute('hidden')).not.toBeNull();
        });
    });

    describe('when user is logged on bpm and ecm', () => {

        beforeEach(async(() => {
            spyOn(stubAuthService, 'isEcmLoggedIn').and.returnValue(true);
            spyOn(stubAuthService, 'isBpmLoggedIn').and.returnValue(true);
            spyOn(stubAuthService, 'isLoggedIn').and.returnValue(true);
            spyOn(stubContent, 'getContentUrl').and.returnValue('src/assets/images/ecmImg.gif');
            userInfoComp.anonymousImageUrl = userInfoComp.anonymousImageUrl.replace('/base/dist', '');
            jasmine.Ajax.install();
            fakeBpmUser.firstName = 'fake-bpm-first-name';
            fakeBpmUser.lastName = 'fake-bpm-last-name';
        }));

        beforeEach(async(() => {
            fixture.detectChanges();
            jasmine.Ajax.requests.first().respondWith({
                status: 200,
                contentType: 'json',
                responseText: {
                    'entry': {
                        'id': 'fake-id',
                        'firstName': 'fake-ecm-first-name',
                        'lastName': 'fake-ecm-last-name',
                        'description': 'i am a fake user for test',
                        'avatarId': 'fake-ecm-avatar-id',
                        'email': 'fakeEcm@ecmUser.com',
                        'jobTitle': 'job-ecm-test'
                    }
                }
            });
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: fakeBpmUser
            });
        }));

        beforeEach(() => {
            fixture.detectChanges();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('should get the bpm user informations from the service', () => {
            expect(element.querySelector('#userinfo_container')).toBeDefined();
            expect(element.querySelector('#bpm_username')).toBeDefined();
            expect(element.querySelector('#bpm_title')).toBeDefined();
            expect(element.querySelector('#bpm-user-detail-image')).toBeDefined();
            expect(element.querySelector('#bpm-user-detail-image').getAttribute('src'))
                .toContain('app/rest/admin/profile-picture');
            expect(element.querySelector('#bpm-full-name').textContent).toContain('fake-bpm-first-name fake-bpm-last-name');
            expect(element.querySelector('#bpm-tenant').textContent).toContain('fake-tenant-name');
        });

        it('should get the ecm user informations from the service', () => {
            expect(element.querySelector('#userinfo_container')).toBeDefined();
            expect(element.querySelector('#ecm_username')).toBeDefined();
            expect(element.querySelector('#ecm_title')).toBeDefined();
            expect(element.querySelector('#ecm-user-detail-image')).toBeDefined();
            expect(element.querySelector('#ecm-user-detail-image').getAttribute('src')).toContain('assets/images/ecmImg.gif');
            expect(element.querySelector('#ecm-full-name').textContent).toContain('fake-ecm-first-name fake-ecm-last-name');
            expect(element.querySelector('#ecm-job-title').textContent).toContain('job-ecm-test');
        });

        it('should show the ecm image if exists', () => {
            expect(element.querySelector('#userinfo_container')).toBeDefined();
            expect(element.querySelector('#logged-user-img')).toBeDefined();
            expect(element.querySelector('#logged-user-img').getAttribute('src')).toEqual('src/assets/images/ecmImg.gif');
        });

        it('should show the bpm image if ecm does not have it', () => {
            userInfoComp.ecmUserImage = null;
            fixture.detectChanges();
            expect(element.querySelector('#userinfo_container')).toBeDefined();
            expect(element.querySelector('#logged-user-img')).toBeDefined();
            expect(element.querySelector('#logged-user-img').getAttribute('src')).toContain('rest/admin/profile-picture');
        });

        it('should show the tabs for the env', () => {
            expect(element.querySelector('#tab-bar-env')).toBeDefined();
            expect(element.querySelector('#tab-bar-env')).not.toBeNull();
            expect(element.querySelector('#tab-bar-env').getAttribute('hidden')).toBeNull();
            expect(element.querySelector('#ecm-tab')).not.toBeNull();
            expect(element.querySelector('#bpm-tab')).not.toBeNull();
        });

        it('should not close the menu when a tab is clicked', () => {
            expect(element.querySelector('#tab-bar-env')).toBeDefined();
            expect(element.querySelector('#tab-bar-env')).not.toBeNull();
            expect(element.querySelector('#tab-bar-env').getAttribute('hidden')).toBeNull();
            let bpmTab = <HTMLElement>element.querySelector('#bpm-tab');
            bpmTab.click();
            expect(element.querySelector('#user-profile-lists')).not.toBeNull();
        });
    });
});
