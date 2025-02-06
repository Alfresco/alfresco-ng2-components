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
import { DummyFeaturesService } from './dummy-features.service';

describe('DummyFeaturesService', () => {
    let service: DummyFeaturesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DummyFeaturesService]
        });
        service = TestBed.inject(DummyFeaturesService);
    });

    it('should initialize the service', () => {
        service.init().subscribe((changeset) => {
            expect(changeset).toBeUndefined();
        });
    });

    it('should return false when isOn$ is called', () => {
        service.isOn$().subscribe((isOn) => {
            expect(isOn).toBeFalse();
        });
    });

    it('should return true when isOff$ is called with any key', () => {
        service.isOff$('').subscribe((isOff) => {
            expect(isOff).toBeTrue();
        });
        service.isOff$('key').subscribe((isOff) => {
            expect(isOff).toBeTrue();
        });
        service.isOff$('salkjdaskd').subscribe((isOff) => {
            expect(isOff).toBeTrue();
        });
    });

    it('should return an empty object when getFlags$ is called', () => {
        service.getFlags$().subscribe((flags) => {
            expect(flags).toEqual({});
        });
    });
});
