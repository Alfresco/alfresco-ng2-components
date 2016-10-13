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
import { FakeBpmUserService } from '../assets/fake-bpm-user.service.mock';
import { AlfrescoAuthenticationService, AlfrescoContentService } from 'ng2-alfresco-core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

class StubAuthentication {
  isEcmConnected: boolean;
  isBpmConnected: boolean;
  setIsEcmLoggedIn(logged: boolean) { this.isEcmConnected = logged; };
  setIsBpmLoggedIn(logged: boolean) { this.isBpmConnected = logged; };
  isEcmLoggedIn() { return this.isEcmConnected; };
  isBpmLoggedIn() { return this.isBpmConnected; };
}

class StubAlfrescoContentService {
    getContentUrl() { return 'fake/url/image/for/ecm/user'; } ;
}

describe('User info component', () => {

    let userInfoComp: UserInfoComponent;
    let fixture: ComponentFixture<UserInfoComponent>;
    let authStub: StubAuthentication;
    let fakeEcmService: FakeEcmUserService;
    let fakeBpmService: FakeBpmUserService;

    beforeEach(async(() => {
       TestBed.configureTestingModule({
          declarations: [ UserInfoComponent ],
          providers: [{ provide: EcmUserService, useClass: FakeEcmUserService},
                      { provide: BpmUserService, useClass: FakeBpmUserService},
                      { provide: AlfrescoAuthenticationService, useClass: StubAuthentication },
                      { provide: AlfrescoContentService, useClass: StubAlfrescoContentService }
                     ]
       }).compileComponents().then(() => {
           fixture = TestBed.createComponent(UserInfoComponent);
           userInfoComp = fixture.componentInstance;
         });
    }));

    it('should NOT have users before ngOnInit only anonymous image', () => {
        expect(userInfoComp.ecmUser).toBeUndefined();
        expect(userInfoComp.ecmUserImage).toBeUndefined();
        expect(userInfoComp.bpmUser).toBeUndefined();
        expect(userInfoComp.bpmUserImage).toBeUndefined();
        expect(userInfoComp.anonymouseImageUrl).toBeDefined();
    });

    it('should NOT have users immediately after ngOnInit', () => {
        fixture.detectChanges();
        expect(userInfoComp.ecmUser).toBeUndefined();
        expect(userInfoComp.ecmUserImage).toBeUndefined();
        expect(userInfoComp.bpmUser).toBeUndefined();
        expect(userInfoComp.bpmUserImage).toBeUndefined();
        expect(userInfoComp.anonymouseImageUrl).toBeDefined();
    });

    describe('when user is logged on ecm', () => {

        beforeEach( async(() => {
            authStub = fixture.debugElement.injector.get(AlfrescoAuthenticationService);
            fakeEcmService = fixture.debugElement.injector.get(EcmUserService);

            authStub.setIsEcmLoggedIn(true);
            fixture.detectChanges(); // runs ngOnInit -> getUsers
            fixture.whenStable()
              .then( () => {
                               fixture.detectChanges();
                            } );
        }));

        it('should get the ecm current user image from the service', () => {
            expect(userInfoComp.ecmUser).toBeDefined();
            expect(userInfoComp.ecmUserImage).toBeDefined();
            expect(userInfoComp.ecmUserImage).toEqual('fake/url/image/for/ecm/user');
        });

        it('should get the ecm user informations from the service', () => {
            expect(userInfoComp.ecmUser).toBeDefined();
            expect(userInfoComp.ecmUser.firstName).toEqual('fake-first-name');
            expect(userInfoComp.ecmUser.lastName).toEqual('fake-last-name');
        });

        it('should return the anonynous user avatar image url when user does not have avatarId', async(() => {
            fakeEcmService.respondWithTheUserWithoutImage();
            userInfoComp.ngOnInit();
            fixture.whenStable()
                      .then( () => {
                                     fixture.detectChanges();
                                     let res = userInfoComp.getEcmUserAvatar();
                                     expect(userInfoComp.ecmUserImage).toBeUndefined();
                                     expect(res).toEqual(userInfoComp.anonymouseImageUrl);
                                   });
        }));
    });

    describe('when user is logged on bpm', () => {

        beforeEach( async(() => {
            authStub = fixture.debugElement.injector.get(AlfrescoAuthenticationService);
            fakeBpmService = fixture.debugElement.injector.get(BpmUserService);

            authStub.setIsBpmLoggedIn(true);
            fixture.detectChanges(); // runs ngOnInit -> getUsers
            fixture.whenStable()
              .then( () => {
                             fixture.detectChanges();
                           } );
        }));

        it('should get the bpm current user image from the service', () => {
            expect(userInfoComp.bpmUser).toBeDefined();
            expect(userInfoComp.bpmUserImage).toBeDefined();
            expect(userInfoComp.bpmUserImage).toEqual('fake-picture-id');
        });

        it('should get the bpm user informations from the service', () => {
            expect(userInfoComp.bpmUser).toBeDefined();
            expect(userInfoComp.bpmUser.firstName).toEqual('fake-first-name');
            expect(userInfoComp.bpmUser.lastName).toEqual('fake-last-name');
        });

        it('should return the anonynous user avatar image url when user does not have avatarId', async(() => {
            fakeBpmService.respondWithTheUserWithoutImage();
            userInfoComp.ngOnInit();
            fixture.whenStable()
                      .then( () => {
                                     fixture.detectChanges();
                                     let res = userInfoComp.getBpmUserAvatar();
                                     expect(userInfoComp.bpmUserImage).toBeUndefined();
                                     expect(res).toEqual(userInfoComp.anonymouseImageUrl);
                                   });
        }));
    });

    describe('when user is logged on bpm and ecm', () => {

        beforeEach( async(() => {
            authStub = fixture.debugElement.injector.get(AlfrescoAuthenticationService);
            fakeBpmService = fixture.debugElement.injector.get(BpmUserService);
            fakeEcmService = fixture.debugElement.injector.get(EcmUserService);

            authStub.setIsBpmLoggedIn(true);
            authStub.setIsEcmLoggedIn(true);
            fixture.detectChanges(); // runs ngOnInit -> getUsers
            fixture.whenStable()
              .then( () => {
                             fixture.detectChanges();
                           } );
        }));

        it('should get the bpm current user image from the service', () => {
            expect(userInfoComp.bpmUser).toBeDefined();
            expect(userInfoComp.bpmUserImage).toBeDefined();
            expect(userInfoComp.bpmUserImage).toEqual('fake-picture-id');
            expect(userInfoComp.ecmUser).toBeDefined();
            expect(userInfoComp.ecmUserImage).toBeDefined();
            expect(userInfoComp.ecmUserImage).toEqual('fake/url/image/for/ecm/user');
        });

        it('should get the bpm user informations from the service', () => {
            expect(userInfoComp.bpmUser).toBeDefined();
            expect(userInfoComp.bpmUser.firstName).toEqual('fake-first-name');
            expect(userInfoComp.bpmUser.lastName).toEqual('fake-last-name');
            expect(userInfoComp.ecmUser).toBeDefined();
            expect(userInfoComp.ecmUser.firstName).toEqual('fake-first-name');
            expect(userInfoComp.ecmUser.lastName).toEqual('fake-last-name');
        });

        it('should return the anonynous user avatar image url when user does not have avatarId', async(() => {
            fakeBpmService.respondWithTheUserWithoutImage();
            fakeEcmService.respondWithTheUserWithoutImage();
            userInfoComp.ngOnInit();
            fixture.whenStable()
                      .then( () => {
                                     fixture.detectChanges();
                                     let resBpm = userInfoComp.getBpmUserAvatar();
                                     expect(userInfoComp.bpmUserImage).toBeUndefined();
                                     expect(resBpm).toEqual(userInfoComp.anonymouseImageUrl);
                                     let resEcm = userInfoComp.getEcmUserAvatar();
                                     expect(userInfoComp.ecmUserImage).toBeUndefined();
                                     expect(resEcm).toEqual(userInfoComp.anonymouseImageUrl);
                                   });
        }));

        it('should return the ecm image if exists', async(() => {
            fakeBpmService.respondWithTheUserWithImage();
            fakeEcmService.respondWithTheUserWithImage();
            userInfoComp.ngOnInit();
            fixture.whenStable()
                      .then( () => {
                                     fixture.detectChanges();
                                     let res = userInfoComp.getUserAvatar();
                                     expect(userInfoComp.bpmUserImage).toBeDefined();
                                     expect(userInfoComp.ecmUserImage).toBeDefined();
                                     expect(res).toEqual(userInfoComp.ecmUserImage);
                                   });
        }));

        it('should return the bpm image if ecm does not have it', async(() => {
            fakeBpmService.respondWithTheUserWithImage();
            fakeEcmService.respondWithTheUserWithoutImage();
            userInfoComp.ngOnInit();
            fixture.whenStable()
                      .then( () => {
                                     fixture.detectChanges();
                                     let res = userInfoComp.getUserAvatar();
                                     expect(userInfoComp.bpmUserImage).toBeDefined();
                                     expect(userInfoComp.ecmUserImage).toBeUndefined();
                                     expect(res).toEqual(userInfoComp.bpmUserImage);
                                   });
        }));

        it('should return the anonynous avatar if no user has it', async(() => {
            fakeBpmService.respondWithTheUserWithoutImage();
            fakeEcmService.respondWithTheUserWithoutImage();
            userInfoComp.ngOnInit();
            fixture.whenStable()
                      .then( () => {
                                     fixture.detectChanges();
                                     let res = userInfoComp.getUserAvatar();
                                     expect(userInfoComp.bpmUserImage).toBeUndefined();
                                     expect(userInfoComp.ecmUserImage).toBeUndefined();
                                     expect(res).toEqual(userInfoComp.anonymouseImageUrl);
                                   });
        }));
    });
});
