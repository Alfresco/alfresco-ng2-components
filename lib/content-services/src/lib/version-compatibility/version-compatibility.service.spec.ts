/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { CoreTestingModule, setupTestBed } from '@alfresco/adf-core';
import { RepositoryInfo } from '@alfresco/js-api';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { DiscoveryApiService } from '../common/services/discovery-api.service';
import { VersionCompatibilityService } from './version-compatibility.service';

describe('VersionCompatibilityService', () => {
    let versionCompatibilityService: VersionCompatibilityService;
    let discoveryApiService: DiscoveryApiService;
    const mockProductInfo = new BehaviorSubject<RepositoryInfo>(null);

    const acsResponceMock = {
        version: {
            display: '7.0.1',
            major: '7',
            minor: '0',
            patch: '1'
        }
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ],
        providers: [
            {
                provide: DiscoveryApiService,
                useValue: {
                    ecmProductInfo$: mockProductInfo
                }
            }
        ]
    });

    beforeEach(async () => {
        discoveryApiService = TestBed.inject(DiscoveryApiService);
        versionCompatibilityService = TestBed.inject(VersionCompatibilityService);
        mockProductInfo.next(acsResponceMock as RepositoryInfo);
        versionCompatibilityService = new VersionCompatibilityService(discoveryApiService);
    });

    it('should get ACS running version', () => {
        const acsVersion = versionCompatibilityService.getAcsVersion();
        expect(acsVersion).toBeDefined();
        expect(acsVersion.display).toBe('7.0.1');
    });

    it('should validate give version', () => {
        expect(versionCompatibilityService.getAcsVersion()).toEqual({ display: '7.0.1', major: '7', minor: '0', patch: '1' } as any);
        expect(versionCompatibilityService.isVersionSupported('8.0.0')).toBe(false);
        expect(versionCompatibilityService.isVersionSupported('7.0.1')).toBe(true);
        expect(versionCompatibilityService.isVersionSupported('7.0.0')).toBe(true);
        expect(versionCompatibilityService.isVersionSupported('6.0.0')).toBe(true);
    });

    it('should emit versionCompatibilityInitialized after retrieving acs version', (done) => {
        versionCompatibilityService.acsVersionInitialized$.subscribe(() => {
            expect(versionCompatibilityService.getAcsVersion()).toEqual({ display: '7.0.1', major: '7', minor: '0', patch: '1' } as any);
            done();
        });
    });
});
