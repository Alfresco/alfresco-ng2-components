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
import { IdentityUserService } from '../services/identity-user.service';
import { setupTestBed } from '../../testing/setupTestBed';
import { CoreModule } from '../../core.module';
import { of } from 'rxjs';

describe('IdentityUserService', () => {

    let service: IdentityUserService;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ]
    });

    beforeEach(() => {
        service = TestBed.get(IdentityUserService);
    });

    it('should able to fetch identity user info from Jwt token', (done) => {
        spyOn(service, 'getCurrentUserInfo').and.returnValue(of({firstName: 'fake-first-name', lastName: 'fake-last-name', email: 'fake@gmail.com'}));
        service.getCurrentUserInfo().subscribe(
            (user) => {
                expect(user).toBeDefined();
                expect(user.firstName).toEqual('fake-first-name');
                expect(user.lastName).toEqual('fake-last-name');
                expect(user.email).toEqual('fake@gmail.com');
                done();
            });
    });
});
