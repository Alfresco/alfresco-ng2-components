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

import { EcmUserService } from '../services/ecm-user.service';
import { AlfrescoAuthenticationService, AlfrescoContentService } from 'ng2-alfresco-core';
import { TestBed, async, inject } from '@angular/core/testing';
import { EcmUserModel } from '../models/ecm-user.model';
import { EcmCompanyModel } from '../models/ecm-company.model';

export var fakeEcmCompany: EcmCompanyModel = {
  organization: 'company-fake-name',
  address1: 'fake-address-1',
  address2: 'fake-address-2',
  address3: 'fake-address-3',
  postcode: 'fAk1',
  telephone: '00000000',
  fax: '=1111111',
  email: 'fakeCompany@fake.com'
};

export var fakeEcmUser: EcmUserModel = {
    id:  'fake-id',
    firstName:  'fake-first-name',
    lastName:  'fake-last-name',
    description:  'i am a fake user for test',
    avatarId:  'fake-avatar-id',
    email:  'fakeEcm@ecmUser.com',
    skypeId:  'fake-skype-id',
    googleId:  'fake-googleId-id',
    instantMessageId:  'fake-instantMessageId-id',
    company: fakeEcmCompany,
    jobTitle:  'test job',
    location:  'fake location',
    mobile:  '000000000',
    telephone:  '11111111',
    statusUpdatedAt:  'fake-date',
    userStatus:  'active',
    enabled: true,
    emailNotificationsEnabled: true
};

class StubAuthentication {
  isEcmConnected: boolean;
  isBpmConnected: boolean;
  setIsEcmLoggedIn(logged: boolean) { this.isEcmConnected = logged; };
  setIsBpmLoggedIn(logged: boolean) { this.isBpmConnected = logged; };
  isEcmLoggedIn() { return this.isEcmConnected; };
  isBpmLoggedIn() { return this.isBpmConnected; };
  callApiGetPersonInfo() { return Promise.resolve(fakeEcmUser); };
};

class StubAlfrescoContentService {
    getContentUrl() { return 'fake/url/image/for/ecm/user'; } ;
}

describe('Ecm User service', () => {

    beforeEach( async(() => {
      TestBed.configureTestingModule({
        providers: [ EcmUserService,
          { provide: AlfrescoAuthenticationService, useClass: StubAuthentication },
          { provide: AlfrescoContentService, useClass: StubAlfrescoContentService }
        ]
      })
      .compileComponents();
    }));

    it('can instantiate service when inject service',
        inject([EcmUserService], (service: EcmUserService) => {
          expect(service instanceof EcmUserService).toBe(true);
    }));

    it('can instantiate service with authorization', inject([AlfrescoAuthenticationService],
                                                        (auth: AlfrescoAuthenticationService) => {
      expect(auth).not.toBeNull('authorization should be provided');
      let service = new EcmUserService(auth, null);
      expect(service instanceof EcmUserService).toBe(true, 'new service should be ok');
    }));

    it('can instantiate service with content service', inject([AlfrescoContentService],
                                                        (content: AlfrescoContentService) => {
      expect(content).not.toBeNull('contentService should be provided');
      let service = new EcmUserService(null, content);
      expect(service instanceof EcmUserService).toBe(true, 'new service should be ok');
    }));

    describe('when user is logged in', () => {
        let service: EcmUserService;
        let authServiceForTest: AlfrescoAuthenticationService;
        let contentServiceForTest: AlfrescoContentService;

        beforeEach(
            inject(
                [AlfrescoAuthenticationService, AlfrescoContentService],
                (authService: AlfrescoAuthenticationService, content: AlfrescoContentService) => {
          authServiceForTest = authService;
          contentServiceForTest = content;
          service = new EcmUserService(authService, content);
          spyOn(authServiceForTest, 'isEcmLoggedIn').and.returnValue(true);
        }));

        it('should be able to retrieve current user info', (done) => {
          let userJsApiResponse = {entry: fakeEcmUser};
          spyOn(service, 'callApiGetPersonInfo').and.returnValue(Promise.resolve(userJsApiResponse));
          service.getCurrentUserInfo().subscribe(
                                        (user) => {
                                                   expect(user).toBeDefined();
                                                   expect(user.firstName).toEqual('fake-first-name');
                                                   expect(user.lastName).toEqual('fake-last-name');
                                                   expect(user.email).toEqual('fakeEcm@ecmUser.com');
                                                   done();
                                                 });
        });

        it('should retrieve current logged user information', () => {
          spyOn(service, 'getUserInfo');
          spyOn(service, 'callApiGetPersonInfo').and.callThrough();
          service.getCurrentUserInfo();
          expect(service.getUserInfo).toHaveBeenCalledWith('-me-');
        });

        it('should retrieve avatar url for current user', () => {
          spyOn(contentServiceForTest, 'getContentUrl').and.returnValue('fake/url/image/for/ecm/user');
          let urlRs = service.getCurrentUserProfileImageUrl('fake-avatar-id');

          expect(urlRs).toEqual('fake/url/image/for/ecm/user');
        });

        it('should not call content service without avatar id', () => {
          spyOn(contentServiceForTest, 'getContentUrl').and.callThrough();
          let urlRs = service.getCurrentUserProfileImageUrl(undefined);
          expect(urlRs).toBeUndefined();
          expect(contentServiceForTest.getContentUrl).not.toHaveBeenCalled();
        });

        it('should build the body for the content service', () => {
          spyOn(contentServiceForTest, 'getContentUrl').and.callThrough();
          let urlRs = service.getCurrentUserProfileImageUrl('fake-avatar-id');
          expect(urlRs).toBeDefined();
          expect(contentServiceForTest.getContentUrl).toHaveBeenCalledWith( {entry: {id: 'fake-avatar-id'} });
        });
    });

    describe('when user is not logged in', () => {
        let service: EcmUserService;
        let authServiceForTest: AlfrescoAuthenticationService;
        let contentServiceForTest: AlfrescoContentService;

        beforeEach(
            inject(
                [AlfrescoAuthenticationService, AlfrescoContentService],
                (authService: AlfrescoAuthenticationService, content: AlfrescoContentService) => {
          authServiceForTest = authService;
          contentServiceForTest = content;
          service = new EcmUserService(authService, content);
          spyOn(authServiceForTest, 'isEcmLoggedIn').and.returnValue(false);
        }));

        it('should not retrieve the user information', () => {
          spyOn(service, 'callApiGetPersonInfo');
          service.getCurrentUserInfo();
          expect(service.callApiGetPersonInfo).not.toHaveBeenCalled();
        });
    });
});
