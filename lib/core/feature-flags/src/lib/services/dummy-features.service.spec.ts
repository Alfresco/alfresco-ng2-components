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
import { lastValueFrom } from 'rxjs';
import { DummyFeaturesService } from './dummy-features.service';

describe('DummyFeaturesService', () => {
    let service: DummyFeaturesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DummyFeaturesService]
        });
        service = TestBed.inject(DummyFeaturesService);
    });

    it('should initialize the service', async () => {
        const changeset = await lastValueFrom(service.init(), { defaultValue: undefined });
        expect(changeset).toBeUndefined();
    });

    it('should return false when isOn$ is called', async () => {
        const isOn = await lastValueFrom(service.isOn$(), { defaultValue: false });
        expect(isOn).toBeFalse();
    });

    it('should return true when isOff$ is called with any key', async () => {
        const isOff1 = await lastValueFrom(service.isOff$(''), { defaultValue: true });
        expect(isOff1).toBeTrue();

        const isOff2 = await lastValueFrom(service.isOff$('key'), { defaultValue: true });
        expect(isOff2).toBeTrue();

        const isOff3 = await lastValueFrom(service.isOff$('salkjdaskd'), { defaultValue: true });
        expect(isOff3).toBeTrue();
    });

    it('should return an empty object when getFlags$ is called', async () => {
        const flags = await lastValueFrom(service.getFlags$(), { defaultValue: {} });
        expect(flags).toEqual({});
    });
});
