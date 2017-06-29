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

import { TestBed, async } from '@angular/core/testing';
import { CoreModule } from 'ng2-alfresco-core';
import { BpmUserService } from '../services/bpm-user.service';
import { BpmUserModel } from '../models/bpm-user.model';

declare let jasmine: any;

describe('Bpm user service', () => {

    let service: BpmUserService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            providers: [
                BpmUserService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        service = TestBed.get(BpmUserService);
    });

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    describe('when user is logged in', () => {

        it('should be able to retrieve the user information', (done) => {
            service.getCurrentUserInfo().subscribe((user: BpmUserModel) => {
                expect(user).toBeDefined();
                expect(user.id).toBe(1);
                expect(user.lastName).toBe('fake-last-name');
                expect(user.fullname).toBe('fake-full-name');
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify({
                    lastName: 'fake-last-name',
                    fullname: 'fake-full-name',
                    groups: [],
                    id: 1
                })
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
