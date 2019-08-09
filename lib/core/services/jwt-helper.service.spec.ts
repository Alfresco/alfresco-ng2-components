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

import { JwtHelperService } from './jwt-helper.service';
import { mockToken } from './../mock/jwt-helper.service.spec';
import { setupTestBed } from '../testing/setupTestBed';
import { TestBed } from '@angular/core/testing';

describe('JwtHelperService', () => {

    let jwtHelperService: JwtHelperService;

    setupTestBed({
        providers: [JwtHelperService]
    });

    beforeEach(() => {
        jwtHelperService = TestBed.get(JwtHelperService);
    });

    it('should be able to create the service', () => {
        expect(jwtHelperService).not.toBeNull();
        expect(jwtHelperService).toBeDefined();
    });

    it('Should decode the Jwt token', () => {
        const result = jwtHelperService.decodeToken(mockToken);
        expect(result).toBeDefined();
        expect(result).not.toBeNull('');
        expect(result['name']).toBe('John Doe');
        expect(result['email']).toBe('johnDoe@gmail.com');
    });
});
