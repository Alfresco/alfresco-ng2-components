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

import { TestBed } from '@angular/core/testing';
import { CoreModule, AlfrescoAuthenticationService, AlfrescoContentService } from 'ng2-alfresco-core';
import { EcmUserService } from '../services/ecm-user.service';
import { fakeEcmUser } from '../assets/fake-ecm-user.service.mock';

declare let jasmine: any;

describe('EcmUserService', () => {

    let service: EcmUserService;
    let authService: AlfrescoAuthenticationService;
    let contentService: AlfrescoContentService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            providers: [
                EcmUserService
            ]
        });
        service = TestBed.get(EcmUserService);
        authService = TestBed.get(AlfrescoAuthenticationService);
        contentService = TestBed.get(AlfrescoContentService);
    });

    describe('when user is logged in', () => {

        beforeEach(() => {
            spyOn(authService, 'isEcmLoggedIn').and.returnValue(true);
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('should be able to retrieve current user info', (done) => {
            service.getCurrentUserInfo().subscribe(
                (user) => {
                    expect(user).toBeDefined();
                    expect(user.firstName).toEqual('fake-first-name');
                    expect(user.lastName).toEqual('fake-last-name');
                    expect(user.email).toEqual('fakeEcm@ecmUser.com');
                    done();
                });
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: {entry: fakeEcmUser}
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
            let urlRs = service.getUserProfileImage('fake-avatar-id');

            expect(urlRs).toEqual('fake/url/image/for/ecm/user');
        });

        it('should not call content service without avatar id', () => {
            spyOn(contentService, 'getContentUrl').and.callThrough();
            let urlRs = service.getUserProfileImage(undefined);

            expect(urlRs).toBeUndefined();
            expect(contentService.getContentUrl).not.toHaveBeenCalled();
        });

        it('should build the body for the content service', () => {
            spyOn(contentService, 'getContentUrl').and.callThrough();
            let urlRs = service.getUserProfileImage('fake-avatar-id');

            expect(urlRs).toBeDefined();
            expect(contentService.getContentUrl).toHaveBeenCalledWith({entry: {id: 'fake-avatar-id'}});
        });
    });
});
