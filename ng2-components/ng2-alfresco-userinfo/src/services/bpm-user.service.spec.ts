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

import { ReflectiveInjector } from '@angular/core';
import { BpmUserService } from '../services/bpm-user.service';
// import { BpmUserModel } from '../models/bpm-user.model';
import { AlfrescoAuthenticationService, AlfrescoApiService, AlfrescoSettingsService, StorageService } from 'ng2-alfresco-core';
import { fakeBpmUser } from '../assets/fake-bpm-user.service.mock';

declare let jasmine: any;

describe('BpmUserService', () => {

    let service, injector, authService, apiService;

    beforeEach(() => {
        injector = ReflectiveInjector.resolveAndCreate([
            AlfrescoSettingsService,
            AlfrescoApiService,
            AlfrescoAuthenticationService,
            BpmUserService,
            StorageService
        ]);
    });

    beforeEach(() => {
        service = injector.get(BpmUserService);
        authService = injector.get(AlfrescoAuthenticationService);
        apiService = injector.get(AlfrescoApiService);
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('can instantiate service with authorization', () => {
        let serviceTest = new BpmUserService(authService, apiService);

        expect(serviceTest instanceof BpmUserService).toBe(true, 'new service should be ok');
    });

    describe('when user is logged in', () => {

        it('should be able to retrieve current user info', (done) => {
            service.getCurrentUserInfo().subscribe(
                (user) => {
                    expect(user.fakeBpmUser).toBeDefined();
                    expect(user.fakeBpmUser.firstName).toEqual('fake-first-name');
                    expect(user.fakeBpmUser.lastName).toEqual('fake-last-name');
                    expect(user.fakeBpmUser.email).toEqual('fakeBpm@fake.com');
                    done();
                });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: {fakeBpmUser}
            });
        });

        it('should retrieve avatar url for current user', () => {
            let path = service.getCurrentUserProfileImage();
            expect(path).toBeDefined();
            expect(path).toContain('/app/rest/admin/profile-picture');
        });

        it('should catch errors on call for profile', (done) => {
            service.getCurrentUserInfo().subscribe(() => {
            }, () => {
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
            });
        });
    });
});
