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

import { setupTestBed } from '../../testing/setup-test-bed';
import { TestBed } from '@angular/core/testing';
import { mockToken } from '../../mock/jwt-token.mock';
import { BaseJwtHelperService } from './base-jwt-helper.service';

describe('BaseJwtHelperService', () => {
    let baseJwtHelperService: BaseJwtHelperService;

    setupTestBed({
        providers: [BaseJwtHelperService]
    });

    beforeEach(() => {
        baseJwtHelperService = TestBed.inject(BaseJwtHelperService);
        localStorage.clear();
    });

    afterEach(() => {
       localStorage.clear();
    });

    it('Should decode the Jwt token', () => {
        const result = baseJwtHelperService.decodeToken(mockToken);

        expect(result['name']).toBe('John Doe');
        expect(result['email']).toBe('johnDoe@gmail.com');
    });

    it('should get value from access token', () => {
        localStorage.setItem('access_token', mockToken);
        expect(baseJwtHelperService.getValueFromLocalToken('name')).toEqual('John Doe');
    });

    it('should get value from id token when there is no access token property in local storage', () => {
        localStorage.setItem('id_token', mockToken);

        expect(localStorage.getItem('access_token')).toEqual(null);
        expect(baseJwtHelperService.getValueFromLocalToken('name')).toEqual('John Doe');
    });
});
