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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
    AlfrescoAuthenticationService,
    AlfrescoContentService,
    AlfrescoTranslationService,
    CoreModule
} from 'ng2-alfresco-core';
import { fakeBpmUser } from '../assets/fake-bpm-user.service.mock';
import { fakeEcmEditedUser, fakeEcmUser, fakeEcmUserNoImage } from '../assets/fake-ecm-user.service.mock';
import { TranslationMock } from '../assets/translation.service.mock';
import { MaterialModule } from '../material.module';
import { BpmUserService } from '../services/bpm-user.service';
import { EcmUserService } from '../services/ecm-user.service';
import { BpmUserModel } from './../models/bpm-user.model';
import { UserInfoComponent } from './user-info.component';

declare let jasmine: any;

describe('User info component', () => {

    let userInfoComp: UserInfoComponent;
    let fixture: ComponentFixture<UserInfoComponent>;
    let element: HTMLElement;
    let stubAuthService: AlfrescoAuthenticationService;
    let stubContent: AlfrescoContentService;
    let componentHandler;

    beforeEach(async(() => {
        componentHandler = jasmine.createSpyObj('componentHandler', ['upgradeAllRegistered', 'upgradeElement']);
        window['componentHandler'] = componentHandler;
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                MaterialModule
            ],
            declarations: [
                UserInfoComponent
            ],
            providers: [
                EcmUserService,
                BpmUserService,
                {provide: AlfrescoTranslationService, useClass: TranslationMock}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(UserInfoComponent);
            userInfoComp = fixture.componentInstance;
            element = fixture.nativeElement;

            stubAuthService = TestBed.get(AlfrescoAuthenticationService);
            stubContent = TestBed.get(AlfrescoContentService);
        });
    }));

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

    it('should return the anonymous avatar when users do not have images', () => {
        let event = <any> {
            target: {
                src: ''
            }
        };
        userInfoComp.onImageLoadingError(event);
        expect(event.target.src).toContain('assets/images/anonymous');
        expect(event.target.src).toContain('.gif');
    });

    describe('when user is logged on ecm', () => {

        beforeEach(() => {
            spyOn(stubAuthService, 'isEcmLoggedIn').and.returnValue(true);
            spyOn(stubAuthService, 'isLoggedIn').and.returnValue(true);
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('should show ecm only last name when user first name is null ', async(() => {
            fixture.detectChanges();
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify({entry: fakeEcmEditedUser})
            });

            fixture.whenStable().then(() => {
                let imageButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#logged-user-img');
                imageButton.click();
                fixture.detectChanges();
                expect(element.querySelector('#userinfo_container')).toBeDefined();
                let ecmUsername = fixture.debugElement.query(By.css('#ecm-username'));
                expect(ecmUsername).toBeDefined();
                expect(ecmUsername).not.toBeNull();
                expect(ecmUsername.nativeElement.textContent).not.toContain('fake-ecm-first-name');
                expect(ecmUsername.nativeElement.textContent).not.toContain('null');
            });
        }));

        describe('and has image', () => {

            beforeEach(async(() => {
                spyOn(stubContent, 'getContentUrl').and.returnValue('assets/images/ecmImg.gif');
                fixture.detectChanges();
                jasmine.Ajax.requests.mostRecent().respondWith({
                    status: 200,
                    contentType: 'application/json',
                    responseText: JSON.stringify({entry: fakeEcmUser})
                });
            }));

            it('should get the ecm current user image from the service', async(() => {
                fixture.whenStable().then(() => {
                    let imageButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#logged-user-img');
                    imageButton.click();
                    fixture.detectChanges();
                    let loggedImage = fixture.debugElement.query(By.css('#logged-user-img'));

                    expect(element.querySelector('#userinfo_container')).not.toBeNull();
                    expect(loggedImage).not.toBeNull();
                    expect(loggedImage.properties.src).toContain('assets/images/ecmImg.gif');
                });
            }));

            it('should get the ecm user informations from the service', () => {
                fixture.whenStable().then(() => {
                    let imageButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#logged-user-img');
                    imageButton.click();
                    fixture.detectChanges();
                    let ecmImage = fixture.debugElement.query(By.css('#ecm-user-detail-image'));
                    let ecmFullName = fixture.debugElement.query(By.css('#ecm-full-name'));
                    let ecmJobTitle = fixture.debugElement.query(By.css('#ecm-job-title-label'));

                    expect(element.querySelector('#userinfo_container')).not.toBeNull();
                    expect(fixture.debugElement.query(By.css('#ecm-username'))).not.toBeNull();
                    expect(ecmImage).not.toBeNull();
                    expect(ecmImage.properties.src).toContain('assets/images/ecmImg.gif');
                    expect(ecmFullName.nativeElement.textContent).toContain('fake-ecm-first-name fake-ecm-last-name');
                    expect(ecmJobTitle.nativeElement.textContent).toContain('USER_PROFILE.LABELS.ECM.JOB_TITLE');
                });
            });
        });

        describe('and has no image', () => {

            beforeEach(async(() => {
                userInfoComp.anonymousImageUrl = userInfoComp.anonymousImageUrl.replace('/base/dist', '');
                fixture.detectChanges();
                jasmine.Ajax.requests.mostRecent().respondWith({
                    status: 200,
                    contentType: 'application/json',
                    responseText: JSON.stringify({entry: fakeEcmUserNoImage})
                });
            }));

            it('should show N/A when the job title is null', async(() => {
                let imageButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#logged-user-img');
                imageButton.click();
                fixture.detectChanges();
                expect(element.querySelector('#userinfo_container')).not.toBeNull();
                let ecmJobTitle = fixture.debugElement.query(By.css('#ecm-job-title'));
                expect(ecmJobTitle).not.toBeNull();
                expect(ecmJobTitle).not.toBeNull();
                expect(ecmJobTitle.nativeElement.textContent).toContain('N/A');
            }));

            it('should not show the tabs', () => {
                let imageButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#logged-user-img');
                imageButton.click();
                fixture.detectChanges();
                let tabHeader = fixture.debugElement.query(By.css('#tab-group-env'));
                expect(tabHeader.classes['adf-hide-tab']).toBeTruthy();
            });
        });

    });

    describe('when user is logged on bpm', () => {

        beforeEach(async(() => {
            spyOn(stubAuthService, 'isBpmLoggedIn').and.returnValue(true);
            spyOn(stubAuthService, 'isLoggedIn').and.returnValue(true);
            jasmine.Ajax.install();

            userInfoComp.anonymousImageUrl = userInfoComp.anonymousImageUrl.replace('/base/dist', '');
        }));

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('should show full name next the user image', () => {
            fixture.detectChanges();
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeBpmUser)
            });

            fixture.whenStable().then(() => {
                let imageButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#logged-user-img');
                imageButton.click();
                fixture.detectChanges();
                let bpmUserName = fixture.debugElement.query(By.css('#bpm-username'));
                expect(element.querySelector('#userinfo_container')).not.toBeNull();
                expect(bpmUserName).toBeDefined();
                expect(bpmUserName).not.toBeNull();
                expect(bpmUserName.nativeElement.innerHTML).toContain('fake-bpm-first-name fake-bpm-last-name');
            });
        });

        it('should get the bpm current user image from the service', () => {
            fixture.detectChanges();
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeBpmUser)
            });

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#userinfo_container')).not.toBeNull();
                expect(element.querySelector('#logged-user-img')).not.toBeNull();
                expect(element.querySelector('#logged-user-img').getAttribute('src'))
                    .toContain('activiti-app/app/rest/admin/profile-picture');
            });
        });

        it('should show last name if first name is null', () => {
            fixture.detectChanges();
            let wrongBpmUser: BpmUserModel = new BpmUserModel({
                firstName: null,
                lastName: 'fake-last-name'
            });
            userInfoComp.bpmUser = wrongBpmUser;

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#userinfo_container')).toBeDefined();
                expect(element.querySelector('#bpm-username')).not.toBeNull();
                expect(element.querySelector('#bpm-username').textContent).toContain('fake-last-name');
                expect(element.querySelector('#bpm-username').textContent).not.toContain('fake-bpm-first-name');

            });
        });

        it('should not show first name if it is null string', () => {
            fixture.detectChanges();
            let wrongFirstNameBpmUser: BpmUserModel = new BpmUserModel({
                firstName: 'null',
                lastName: 'fake-last-name'
            });
            userInfoComp.bpmUser = wrongFirstNameBpmUser;

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#userinfo_container')).toBeDefined();
                expect(element.querySelector('#bpm-full-name')).toBeDefined();
                expect(element.querySelector('#bpm-full-name').textContent).toContain('fake-last-name');
                expect(element.querySelector('#bpm-full-name').textContent).not.toContain('null');
            });
        });

        it('should not show last name if it is null string', () => {
            fixture.detectChanges();
            let wrongLastNameBpmUser: BpmUserModel = new BpmUserModel({
                firstName: 'fake-first-name',
                lastName: 'null'
            });
            userInfoComp.bpmUser = wrongLastNameBpmUser;

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#userinfo_container')).toBeDefined();
                expect(element.querySelector('#bpm-full-name')).toBeDefined();
                expect(element.querySelector('#bpm-full-name').textContent).toContain('fake-first-name');
                expect(element.querySelector('#bpm-full-name').textContent).not.toContain('null');
            });
        });

        it('should not show the tabs', () => {
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#tab-bar-env').getAttribute('hidden')).not.toBeNull();
            });
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
        }));

        beforeEach(async(() => {
            fixture.detectChanges();
            jasmine.Ajax.requests.first().respondWith({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify({entry: fakeEcmUser})
            });
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: fakeBpmUser
            });
        }));

        beforeEach(() => {
            let imageButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#logged-user-img');
            imageButton.click();
            fixture.detectChanges();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('should get the bpm user informations from the service', () => {
            let bpmTab = fixture.debugElement.queryAll(By.css('#tab-group-env .mat-tab-labels .mat-tab-label'))[1];
            bpmTab.triggerEventHandler('click', null);
            fixture.detectChanges();
            let bpmUsername = fixture.debugElement.query(By.css('#bpm-username'));
            let bpmImage = fixture.debugElement.query(By.css('#bpm-user-detail-image'));

            expect(element.querySelector('#userinfo_container')).not.toBeNull();
            expect(bpmUsername).not.toBeNull();
            expect(bpmImage).not.toBeNull();
            expect(bpmImage.properties.src).toContain('app/rest/admin/profile-picture');
            expect(bpmUsername.nativeElement.textContent).toContain('fake-bpm-first-name fake-bpm-last-name');
            expect(fixture.debugElement.query(By.css('#bpm-tenant')).nativeElement.textContent).toContain('fake-tenant-name');
        });

        it('should get the ecm user informations from the service', () => {
            let ecmUsername = fixture.debugElement.query(By.css('#ecm-username'));
            let ecmImage = fixture.debugElement.query(By.css('#ecm-user-detail-image'));

            expect(element.querySelector('#userinfo_container')).toBeDefined();
            expect(ecmUsername).not.toBeNull();
            expect(ecmImage).not.toBeNull();
            expect(ecmImage.properties.src).toContain('assets/images/ecmImg.gif');
            expect(fixture.debugElement.query(By.css('#ecm-full-name')).nativeElement.textContent).toContain('fake-ecm-first-name fake-ecm-last-name');
            expect(fixture.debugElement.query(By.css('#ecm-job-title')).nativeElement.textContent).toContain('job-ecm-test');
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
            let tabGroup = fixture.debugElement.query(By.css('#tab-group-env'));
            let tabs = fixture.debugElement.queryAll(By.css('#tab-group-env .mat-tab-labels .mat-tab-label'));

            expect(tabGroup).not.toBeNull();
            expect(tabGroup.classes['adf-hide-tab']).toBeFalsy();
            expect(tabs.length).toBe(2);
        });

        it('should not close the menu when a tab is clicked', () => {
            let tabGroup = fixture.debugElement.query(By.css('#tab-group-env'));
            let tabs = fixture.debugElement.queryAll(By.css('#tab-group-env .mat-tab-labels .mat-tab-label'));

            expect(tabGroup).not.toBeNull();
            tabs[1].triggerEventHandler('click', null);
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('#user-profile-lists'))).not.toBeNull();
        });
    });
});
