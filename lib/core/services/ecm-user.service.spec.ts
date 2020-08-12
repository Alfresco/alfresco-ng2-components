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
import { fakeEcmUser } from '../mock/ecm-user.service.mock';
import { EcmUserService } from '../services/ecm-user.service';
import { CoreTestingModule } from '../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from './authentication.service';
import { ContentService } from './content.service';

describe('EcmUserService', () => {

    let service: EcmUserService;
    let authService: AuthenticationService;
    let contentService: ContentService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule
            ]
        });

        service = TestBed.inject(EcmUserService);
        authService = TestBed.inject(AuthenticationService);
        contentService = TestBed.inject(ContentService);
    });

    describe('when user is logged in', () => {

        beforeEach(() => {
            spyOn(authService, 'isEcmLoggedIn').and.returnValue(true);
        });

        it('should be able to retrieve current user info', (done) => {
            spyOn(service.peopleApi, 'getPerson').and.returnValue(Promise.resolve({ entry: fakeEcmUser }));
            service.getCurrentUserInfo().subscribe(
                (user) => {
                    expect(user).toBeDefined();
                    expect(user.firstName).toEqual('fake-ecm-first-name');
                    expect(user.lastName).toEqual('fake-ecm-last-name');
                    expect(user.email).toEqual('fakeEcm@ecmUser.com');
                    done();
                }
            );
        });

        it('should retrieve avatar url for current user', () => {
            spyOn(contentService, 'getContentUrl').and.returnValue('fake/url/image/for/ecm/user');
            const urlRs = service.getUserProfileImage('fake-avatar-id');

            expect(urlRs).toEqual('fake/url/image/for/ecm/user');
        });
    });
});
