/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { UuidService } from './uuid-service';

describe('UuidService', () => {
    let service: UuidService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UuidService);
    });

    it('should call crypto.randomUUID when generate is called', () => {
        const randomUuidSpy = spyOn(crypto, 'randomUUID').and.returnValue('11111111-1111-4111-8111-111111111111');

        service.generate();

        expect(randomUuidSpy).toHaveBeenCalledTimes(1);
    });

    it('should return value from crypto.randomUUID when generate is called', () => {
        spyOn(crypto, 'randomUUID').and.returnValue('22222222-2222-4222-8222-222222222222');

        const result = service.generate();

        expect(result).toBe('22222222-2222-4222-8222-222222222222');
    });
});
