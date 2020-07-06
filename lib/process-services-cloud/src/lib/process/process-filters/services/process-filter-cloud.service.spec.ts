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

import { async, TestBed } from '@angular/core/testing';
import { setupTestBed, IdentityUserService } from '@alfresco/adf-core';
import { of } from 'rxjs';
import { ProcessFilterCloudService } from './process-filter-cloud.service';
import {
    fakeProcessCloudFilterEntries,
    fakeProcessCloudFilters,
    fakeEmptyProcessCloudFilterEntries,
    fakeProcessCloudFilterWithDifferentEntries,
    fakeProcessFilter
} from '../mock/process-filters.cloud.mock';
import { PROCESS_FILTERS_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { LocalPreferenceCloudService } from '../../../services/local-preference-cloud.service';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('ProcessFilterCloudService', () => {
    let service: ProcessFilterCloudService;
    let getPreferencesSpy: jasmine.Spy;
    let getPreferenceByKeySpy: jasmine.Spy;
    let updatePreferenceSpy: jasmine.Spy;
    let createPreferenceSpy: jasmine.Spy;
    let getCurrentUserInfoSpy: jasmine.Spy;

    const identityUserMock = { username: 'mock-username', firstName: 'fake-identity-first-name', lastName: 'fake-identity-last-name', email: 'fakeIdentity@email.com' };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ],
        providers: [
            { provide: PROCESS_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }
        ]
    });

    beforeEach(async(() => {
        service = TestBed.inject(ProcessFilterCloudService);

        const preferenceCloudService = service.preferenceService;
        const identityUserService = TestBed.inject(IdentityUserService);

        createPreferenceSpy = spyOn(preferenceCloudService, 'createPreference').and.returnValue(of(fakeProcessCloudFilters));
        updatePreferenceSpy = spyOn(preferenceCloudService, 'updatePreference').and.returnValue(of(fakeProcessCloudFilters));
        getPreferenceByKeySpy = spyOn(preferenceCloudService, 'getPreferenceByKey').and.returnValue(of(fakeProcessCloudFilters));
        getPreferencesSpy = spyOn(preferenceCloudService, 'getPreferences').and.returnValue(of(fakeProcessCloudFilterEntries));
        getCurrentUserInfoSpy = spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue(identityUserMock);
    }));

    it('should create processfilter key by using appName and the username', (done) => {
        service.getProcessFilters('mock-appName').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(getCurrentUserInfoSpy).toHaveBeenCalled();
            done();
        });
    });

    it('should create default process filters', (done) => {
        getPreferencesSpy.and.returnValue(of(fakeEmptyProcessCloudFilterEntries));
        service.getProcessFilters('mock-appName').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);

            expect(res[0].appName).toBe('mock-appName');
            expect(res[0].id).toBe('1');
            expect(res[0].name).toBe('MOCK_PROCESS_NAME_1');
            expect(res[0].status).toBe('MOCK_ALL');

            expect(res[1].appName).toBe('mock-appName');
            expect(res[1].id).toBe('2');
            expect(res[1].name).toBe('MOCK_PROCESS_NAME_2');
            expect(res[1].status).toBe('MOCK-RUNNING');

            expect(res[2].appName).toBe('mock-appName');
            expect(res[2].id).toBe('3');
            expect(res[2].name).toBe('MOCK_PROCESS_NAME_3');
            expect(res[2].status).toBe('MOCK-COMPLETED');
            done();
        });
        expect(createPreferenceSpy).toHaveBeenCalled();
    });

    it('should fetch the process filters if filters are available', (done) => {
        service.getProcessFilters('mock-appName').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);

            expect(res[0].appName).toBe('mock-appName');
            expect(res[0].id).toBe('1');
            expect(res[0].name).toBe('MOCK_PROCESS_NAME_1');
            expect(res[0].status).toBe('MOCK_ALL');

            expect(res[1].appName).toBe('mock-appName');
            expect(res[1].id).toBe('2');
            expect(res[1].name).toBe('MOCK_PROCESS_NAME_2');
            expect(res[1].status).toBe('MOCK-RUNNING');

            expect(res[2].appName).toBe('mock-appName');
            expect(res[2].id).toBe('3');
            expect(res[2].name).toBe('MOCK_PROCESS_NAME_3');
            expect(res[2].status).toBe('MOCK-COMPLETED');
            done();
        });
        expect(getPreferencesSpy).toHaveBeenCalled();
    });

    it('should create the process filters in case the filters are not exist in the user preferences', (done) => {
        getPreferencesSpy.and.returnValue(of(fakeProcessCloudFilterWithDifferentEntries));
        service.getProcessFilters('mock-appName').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);

            expect(res[0].appName).toBe('mock-appName');
            expect(res[0].id).toBe('1');
            expect(res[0].name).toBe('MOCK_PROCESS_NAME_1');
            expect(res[0].status).toBe('MOCK_ALL');

            expect(res[1].appName).toBe('mock-appName');
            expect(res[1].id).toBe('2');
            expect(res[1].name).toBe('MOCK_PROCESS_NAME_2');
            expect(res[1].status).toBe('MOCK-RUNNING');

            expect(res[2].appName).toBe('mock-appName');
            expect(res[2].id).toBe('3');
            expect(res[2].name).toBe('MOCK_PROCESS_NAME_3');
            expect(res[2].status).toBe('MOCK-COMPLETED');
            done();
        });
        expect(getPreferencesSpy).toHaveBeenCalled();
        expect(createPreferenceSpy).toHaveBeenCalled();
    });

    it('should return filter by process filter id', (done) => {
        service.getFilterById('mock-appName', '2').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.appName).toBe('mock-appName');
            expect(res.id).toBe('2');
            expect(res.name).toBe('MOCK_PROCESS_NAME_2');
            expect(res.status).toBe('MOCK-RUNNING');
            done();
        });
        expect(getPreferenceByKeySpy).toHaveBeenCalled();
    });

    it('should add process filter if filter is not exist in the filters', (done) => {
        getPreferenceByKeySpy.and.returnValue(of([]));
        service.getFilterById('mock-appName', '2').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.appName).toBe('mock-appName');
            expect(res.id).toBe('2');
            expect(res.name).toBe('MOCK_PROCESS_NAME_2');
            expect(res.status).toBe('MOCK-RUNNING');
            done();
        });
    });

    it('should update filter', (done) => {
        service.updateFilter(fakeProcessFilter).subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);
            expect(res[0].appName).toBe('mock-appName');
            expect(res[1].appName).toBe('mock-appName');
            expect(res[2].appName).toBe('mock-appName');
            done();
        });
    });

    it('should create process filter when trying to update in case filter is not exist in the filters', (done) => {
        getPreferenceByKeySpy.and.returnValue(of([]));
        service.updateFilter(fakeProcessFilter).subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);
            expect(res[0].appName).toBe('mock-appName');
            expect(res[1].appName).toBe('mock-appName');
            expect(res[2].appName).toBe('mock-appName');
            done();
        });
        expect(createPreferenceSpy).toHaveBeenCalled();
    });

    it('should delete filter', (done) => {
        service.deleteFilter(fakeProcessFilter).subscribe((res: any) => {
            expect(res).toBeDefined();
            done();
        });
        expect(updatePreferenceSpy).toHaveBeenCalled();
    });
});
