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

import { BpmUserService } from '../services/bpm-user.service';
import { AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { TestBed, async, inject } from '@angular/core/testing';
import { BpmUserModel } from '../models/bpm-user.model';

export var fakeBpmUser: BpmUserModel = {
    apps: {},
    capabilities: 'fake-capability',
    company: 'fake-company',
    created: 'fake-create-date',
    email: 'fakeBpm@fake.com',
    externalId: 'fake-external-id',
    firstName: 'fake-first-name',
    lastName: 'fake-last-name',
    fullname: 'fake-full-name',
    groups: {},
    id: 'fake-id',
    lastUpdate: 'fake-update-date',
    latestSyncTimeStamp: 'fake-timestamp',
    password: 'fake-password',
    pictureId: 'fake-picture-id',
    status: 'fake-status',
    tenantId: 'fake-tenant-id',
    tenantName: 'fake-tenant-name',
    tenantPictureId: 'fake-tenant-picture-id',
    type: 'fake-type'
};

class StubAuthentication {
  isEcmConnected: boolean;
  isBpmConnected: boolean;
  setIsEcmLoggedIn(logged: boolean) { this.isEcmConnected = logged; };
  setIsBpmLoggedIn(logged: boolean) { this.isBpmConnected = logged; };
  isEcmLoggedIn() { return this.isEcmConnected; };
  isBpmLoggedIn() { return this.isBpmConnected; };
  callApiGetPersonInfo() { return Promise.resolve(fakeBpmUser); };
};

describe('Bpm User service', () => {

    beforeEach( async(() => {
      TestBed.configureTestingModule({
        providers: [ BpmUserService,
          { provide: AlfrescoAuthenticationService, useClass: StubAuthentication }
        ]
      })
      .compileComponents();
    }));

    it('can instantiate service when inject service',
        inject([BpmUserService], (service: BpmUserService) => {
          expect(service instanceof BpmUserService).toBe(true);
    }));

    it('can instantiate service with authorization', inject([AlfrescoAuthenticationService],
                                                        (auth: AlfrescoAuthenticationService) => {
      expect(auth).not.toBeNull('authorization should be provided');
      let service = new BpmUserService(auth);
      expect(service instanceof BpmUserService).toBe(true, 'new service should be ok');
    }));

    describe('when user is logged in', () => {
        let service: BpmUserService;
        let authServiceForTest: AlfrescoAuthenticationService;

        beforeEach(
            inject(
                [AlfrescoAuthenticationService ],
                ( authService: AlfrescoAuthenticationService ) => {
          authServiceForTest = authService;
          service = new BpmUserService(authService);
          spyOn(authServiceForTest, 'isBpmLoggedIn').and.returnValue(true);
        }));

        it('should be able to retrieve current user info', (done) => {
          spyOn(service, 'callApiGetProfile').and.returnValue(Promise.resolve(fakeBpmUser));
          service.getCurrentUserInfo().subscribe(
                                        (user) => {
                                                   expect(user).toBeDefined();
                                                   expect(user.firstName).toEqual('fake-first-name');
                                                   expect(user.lastName).toEqual('fake-last-name');
                                                   expect(user.email).toEqual('fakeBpm@fake.com');
                                                   done();
                                                 });
        });

        it('should retrieve current logged user information via js api', () => {
          spyOn(service, 'callApiGetProfile');
          service.getCurrentUserInfo();
          expect(service.callApiGetProfile).toHaveBeenCalled();
        });

        it('should retrieve avatar url for current user', (done) => {
          spyOn(service, 'callApiGetProfilePicture').and.returnValue(Promise.resolve('fake/img/path'));
          service.getCurrentUserProfileImage().subscribe(
                                        (path) => {
                                                   expect(path).toBeDefined();
                                                   expect(path).toEqual('fake/img/path');
                                                   done();
                                                 });
        });
    });

    describe('when user is not logged in', () => {
        let service: BpmUserService;
        let authServiceForTest: AlfrescoAuthenticationService;

        beforeEach(
            inject(
                [AlfrescoAuthenticationService],
                (authService: AlfrescoAuthenticationService) => {
          authServiceForTest = authService;
          service = new BpmUserService(authService);
          spyOn(authServiceForTest, 'isBpmLoggedIn').and.returnValue(false);
        }));

        it('should not retrieve the user information', () => {
          spyOn(service, 'callApiGetProfile');
          service.getCurrentUserInfo();
          expect(service.callApiGetProfile).not.toHaveBeenCalled();
        });

        it('should not retrieve the user avatar', () => {
          spyOn(service, 'callApiGetProfilePicture');
          service.getCurrentUserInfo();
          expect(service.callApiGetProfilePicture).not.toHaveBeenCalled();
        });
    });
});
