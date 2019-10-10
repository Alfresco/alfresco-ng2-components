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

import { TestBed } from '@angular/core/testing';
import { AuthenticationService, ContentService, AlfrescoApiService  } from '.';
import { fakeEcmUser } from '../mock/ecm-user.service.mock';
import { EcmUserService } from '../services/ecm-user.service';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreModule } from '../core.module';
import { AlfrescoApiServiceMock } from '../mock/alfresco-api.service.mock';

declare let jasmine: any;

describe('EcmUserService', () => {

    let service: EcmUserService;
    let authService: AuthenticationService;
    let contentService: ContentService;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
        ]
    });

    beforeEach(() => {
        service = TestBed.get(EcmUserService);
        authService = TestBed.get(AuthenticationService);
        contentService = TestBed.get(ContentService);
    });

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    describe('when user is logged in', () => {

        beforeEach(() => {
            spyOn(authService, 'isEcmLoggedIn').and.returnValue(true);
        });

        it('should be able to retrieve current user info', (done) => {
            service.getCurrentUserInfo().subscribe(
                (user) => {
                    expect(user).toBeDefined();
                    expect(user.firstName).toEqual('fake-ecm-first-name');
                    expect(user.lastName).toEqual('fake-ecm-last-name');
                    expect(user.email).toEqual('fakeEcm@ecmUser.com');
                    done();
                });
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify({entry: fakeEcmUser})
            });
        });

        it('should be able to log errors on call', (done) => {
            service.getCurrentUserInfo().subscribe(() => {
            }, () => {
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
            });
        });

        it('should retrieve avatar url for current user', () => {
            spyOn(contentService, 'getContentUrl').and.returnValue('fake/url/image/for/ecm/user');
            const urlRs = service.getUserProfileImage('fake-avatar-id');

            expect(urlRs).toEqual('fake/url/image/for/ecm/user');
        });

        it('should not call content service without avatar id', () => {
            spyOn(contentService, 'getContentUrl').and.callThrough();
            const urlRs = service.getUserProfileImage(undefined);

            expect(urlRs).toBeNull();
            expect(contentService.getContentUrl).not.toHaveBeenCalled();
        });
    });
});
