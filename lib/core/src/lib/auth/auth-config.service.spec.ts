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

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AUTH_MODULE_CONFIG } from './auth-config';

import { AuthConfigService } from './auth-config.service';

describe('AuthConfigService', () => {
    let service: AuthConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: AUTH_MODULE_CONFIG, useValue: { useHash: true } }
            ]
        });
        service = TestBed.inject(AuthConfigService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
