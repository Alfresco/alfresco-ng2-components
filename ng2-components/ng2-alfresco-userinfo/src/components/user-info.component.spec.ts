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
import { FakeEcmUserService } from '../assets/fake-ecm-user.service.mock';
import { fakeEcmEditedUser } from '../assets/fake-ecm-user.service.mock';
import { FakeBpmUserService } from '../assets/fake-bpm-user.service.mock';
import { fakeBpmEditedUser } from '../assets/fake-bpm-user.service.mock';
import { AlfrescoContentService, AlfrescoSettingsService } from 'ng2-alfresco-core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

class StubSetting {
    provider: string;

    setProviders(provider: string) {
        this.provider = provider;
    };

    getProviders() {
        return this.provider;
    };
}

class StubAlfrescoContentService {
    getContentUrl() {
        return 'fake/url/image/for/ecm/user';
    };
}

describe('User info component', () => {

    let userInfoComp: UserInfoComponent;
    let fixture: ComponentFixture<UserInfoComponent>;
    let stubSetting: StubSetting;
    let fakeEcmService: FakeEcmUserService;
    let fakeBpmService: FakeBpmUserService;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserInfoComponent],
            providers: [{provide: EcmUserService, useClass: FakeEcmUserService},
                {provide: BpmUserService, useClass: FakeBpmUserService},
                {provide: AlfrescoSettingsService, useClass: StubSetting},
                {provide: AlfrescoContentService, useClass: StubAlfrescoContentService}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(UserInfoComponent);
            userInfoComp = fixture.componentInstance;
            element = fixture.nativeElement;
        });
    }));

    it('should not show any image if the user is not logged in', () => {
        expect(element.querySelector('#userinfo_container')).toBeDefined();
        expect(element.querySelector('#logged-user-img')).toBeNull();
    });

    it('should NOT have users immediately after ngOnInit', () => {
        fixture.detectChanges();
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

    describe('when user is logged on ecm', () => {

        beforeEach(async(() => {
            stubSetting = fixture.debugElement.injector.get(AlfrescoSettingsService);
            fakeEcmService = fixture.debugElement.injector.get(EcmUserService);

            stubSetting.setProviders('ECM');
            fixture.detectChanges();
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                });
        }));

        it('should get the ecm current user image from the service', () => {
            expect(element.querySelector('#userinfo_container')).toBeDefined();
            expect(element.querySelector('#logged-user-img')).toBeDefined();
            expect(element.querySelector('#logged-user-img').getAttribute('src')).toEqual('src/assets/ecmImg.gif');
        });

        it('should get the ecm user informations from the service', () => {
            expect(element.querySelector('#userinfo_container')).toBeDefined();
            expect(element.querySelector('#ecm_username')).toBeDefined();
            expect(element.querySelector('#ecm_title')).toBeDefined();
            expect(element.querySelector('#ecm-user-detail-image')).toBeDefined();
            expect(element.querySelector('#ecm-user-detail-image').getAttribute('src')).toEqual('src/assets/ecmImg.gif');
            expect(element.querySelector('#ecm-full-name').innerHTML).toContain('fake-first-name fake-last-name');
            expect(element.querySelector('#ecm-job-title').innerHTML).toContain('test job');
        });

        it('should return the anonymous user avatar image url when user does not have avatarId', () => {
            fakeEcmService.respondWithTheUserWithoutImage();
            userInfoComp.ngOnInit();
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                    let res = userInfoComp.getEcmUserAvatar();
                    expect(res).toBeDefined();
                    expect(element.querySelector('#logged-user-img').getAttribute('src'))
                        .toContain('src/img/anonymous.gif');
                });
        });

        it('should show N/A when the job title is null', () => {
            fakeEcmEditedUser.jobTitle = null;
            fakeEcmService.respondWithEditedUser();
            userInfoComp.ngOnInit();
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('#userinfo_container')).toBeDefined();
                    expect(element.querySelector('#ecm-job-title')).toBeDefined();
                    expect(element.querySelector('#ecm-job-title').innerHTML).toContain('N/A');
                });
        });
    });

    describe('when user is logged on bpm', () => {

        beforeEach(async(() => {
            stubSetting = fixture.debugElement.injector.get(AlfrescoSettingsService);
            fakeBpmService = fixture.debugElement.injector.get(BpmUserService);

            stubSetting.setProviders('BPM');
            fixture.detectChanges();
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                });
        }));

        it('should get the bpm current user image from the service', () => {
            expect(element.querySelector('#userinfo_container')).toBeDefined();
            expect(element.querySelector('#logged-user-img')).toBeDefined();
            expect(element.querySelector('#logged-user-img').getAttribute('src')).toEqual('src/assets/bpmImg.gif');
        });

        it('should show last name if first name is null', () => {
            fakeBpmEditedUser.firstName = null;
            fakeBpmService.respondWithEditedUser();
            userInfoComp.ngOnInit();
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('#userinfo_container')).toBeDefined();
                    expect(element.querySelector('#bpm_username')).toBeDefined();
                    expect(element.querySelector('#bpm_username').innerHTML).toContain('fake-last-name');
                });
        });

        it('should show full name if first and last name are null', () => {
            fakeBpmEditedUser.firstName = null;
            fakeBpmEditedUser.lastName = null;
            fakeBpmService.respondWithEditedUser();
            userInfoComp.ngOnInit();
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('#userinfo_container')).toBeDefined();
                    expect(element.querySelector('#bpm_username')).toBeDefined();
                    expect(element.querySelector('#bpm_username').innerHTML).toContain('fake-full-name');
                });
        });

        it('should not show first name if it is null string', () => {
            fakeBpmEditedUser.firstName = 'null';
            fakeBpmEditedUser.lastName = 'fake-last-name';
            fakeBpmService.respondWithEditedUser();
            userInfoComp.ngOnInit();
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('#userinfo_container')).toBeDefined();
                    expect(element.querySelector('#bpm-full-name')).toBeDefined();
                    expect(element.querySelector('#bpm-full-name').innerHTML).not.toContain('fake-first-name');
                    expect(element.querySelector('#bpm-full-name').innerHTML).toContain('fake-last-name');
                });
        });

        it('should not show last name if it is null string', () => {
            fakeBpmEditedUser.lastName = 'null';
            fakeBpmEditedUser.firstName = 'fake-first-name';
            fakeBpmService.respondWithEditedUser();
            userInfoComp.ngOnInit();
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('#userinfo_container')).toBeDefined();
                    expect(element.querySelector('#bpm-full-name')).toBeDefined();
                    expect(element.querySelector('#bpm-full-name').innerHTML).toContain('fake-first-name');
                    expect(element.querySelector('#bpm-full-name').innerHTML).not.toContain('fake-last-name');
                });
        });

        it('should get the bpm user informations from the service', () => {
            expect(element.querySelector('#userinfo_container')).toBeDefined();
            expect(element.querySelector('#bpm_username')).toBeDefined();
            expect(element.querySelector('#bpm_title')).toBeDefined();
            expect(element.querySelector('#bpm-user-detail-image')).toBeDefined();
            expect(element.querySelector('#bpm-user-detail-image').getAttribute('src')).toEqual('src/assets/bpmImg.gif');
            expect(element.querySelector('#bpm-full-name').innerHTML).toContain('fake-first-name fake-last-name');
            expect(element.querySelector('#bpm-tenant').innerHTML).toContain('fake-tenant-name');
        });

        it('should return the anonymous user avatar image url when user does not have avatarId', () => {
            fakeBpmService.respondWithTheUserWithoutImage();
            userInfoComp.ngOnInit();
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                    let res = userInfoComp.getBpmUserAvatar();
                    expect(res).toBeDefined();
                    expect(element.querySelector('#logged-user-img').getAttribute('src'))
                        .toContain('src/img/anonymous.gif');
                });
        });
    });

    describe('when user is logged on bpm and ecm', () => {

        beforeEach(async(() => {
            stubSetting = fixture.debugElement.injector.get(AlfrescoSettingsService);
            fakeBpmService = fixture.debugElement.injector.get(BpmUserService);
            fakeEcmService = fixture.debugElement.injector.get(EcmUserService);

            stubSetting.setProviders('ALL');
            fixture.detectChanges();
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                });
        }));

        it('should get the bpm user informations from the service', () => {
            expect(element.querySelector('#userinfo_container')).toBeDefined();
            expect(element.querySelector('#bpm_username')).toBeDefined();
            expect(element.querySelector('#bpm_title')).toBeDefined();
            expect(element.querySelector('#bpm-user-detail-image')).toBeDefined();
            expect(element.querySelector('#bpm-user-detail-image').getAttribute('src')).toEqual('src/assets/bpmImg.gif');
            expect(element.querySelector('#bpm-full-name').innerHTML).toContain('fake-first-name fake-last-name');
            expect(element.querySelector('#bpm-tenant').innerHTML).toContain('fake-tenant-name');
        });

        it('should get the ecm user informations from the service', () => {
            expect(element.querySelector('#userinfo_container')).toBeDefined();
            expect(element.querySelector('#ecm_username')).toBeDefined();
            expect(element.querySelector('#ecm_title')).toBeDefined();
            expect(element.querySelector('#ecm-user-detail-image')).toBeDefined();
            expect(element.querySelector('#ecm-user-detail-image').getAttribute('src')).toEqual('src/assets/ecmImg.gif');
            expect(element.querySelector('#ecm-full-name').innerHTML).toContain('fake-first-name fake-last-name');
            expect(element.querySelector('#ecm-job-title').innerHTML).toContain('test job');
        });

        it('should return the anonymous avatar when users do not have images', () => {
            fakeBpmService.respondWithTheUserWithoutImage();
            fakeEcmService.respondWithTheUserWithoutImage();
            userInfoComp.ngOnInit();
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                    let res = userInfoComp.getUserAvatar();
                    expect(res).toBeDefined();
                    expect(element.querySelector('#userinfo_container')).toBeDefined();
                    expect(element.querySelector('#logged-user-img')).toBeDefined();
                    expect(element.querySelector('#logged-user-img').getAttribute('src')).toContain('src/img/anonymous.gif');
                });
        });

        it('should show the ecm image if exists', () => {
            fakeBpmService.respondWithTheUserWithImage();
            fakeEcmService.respondWithTheUserWithImage();
            userInfoComp.ngOnInit();
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                    let res = userInfoComp.getUserAvatar();
                    expect(res).toBeDefined();
                    expect(element.querySelector('#userinfo_container')).toBeDefined();
                    expect(element.querySelector('#logged-user-img')).toBeDefined();
                    expect(element.querySelector('#logged-user-img').getAttribute('src')).toEqual('src/assets/ecmImg.gif');
                });
        });

        it('should show the bpm image if ecm does not have it', () => {
            fakeBpmService.respondWithTheUserWithImage();
            fakeEcmService.respondWithTheUserWithoutImage();
            userInfoComp.ngOnInit();
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                    let res = userInfoComp.getUserAvatar();
                    expect(res).toBeDefined();
                    expect(element.querySelector('#userinfo_container')).toBeDefined();
                    expect(element.querySelector('#logged-user-img')).toBeDefined();
                    expect(element.querySelector('#logged-user-img').getAttribute('src')).toEqual('src/assets/bpmImg.gif');
                });
        });
    });
});
