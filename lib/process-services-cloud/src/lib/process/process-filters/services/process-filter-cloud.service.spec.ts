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

import { TestBed } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { of } from 'rxjs';
import { ProcessFilterCloudService } from './process-filter-cloud.service';
import { PROCESS_FILTERS_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { LocalPreferenceCloudService } from '../../../services/local-preference-cloud.service';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { fakeEmptyProcessCloudFilterEntries, fakeProcessCloudFilterEntries, fakeProcessCloudFilters, fakeProcessCloudFilterWithDifferentEntries, fakeProcessFilter } from '../mock/process-filters-cloud.mock';
import { ProcessFilterCloudModel } from '../models/process-filter-cloud.model';
import { IdentityUserService } from '../../../people/services/identity-user.service';

describe('ProcessFilterCloudService', () => {
    let service: ProcessFilterCloudService;
    let getPreferencesSpy: jasmine.Spy;
    let getPreferenceByKeySpy: jasmine.Spy;
    let updatePreferenceSpy: jasmine.Spy;
    let createPreferenceSpy: jasmine.Spy;
    let getCurrentUserInfoSpy: jasmine.Spy;

    const identityUserMock = {
        username: 'mock-username',
        firstName: 'fake-identity-first-name',
        lastName: 'fake-identity-last-name',
        email: 'fakeIdentity@email.com'
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ],
        providers: [
            { provide: PROCESS_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(ProcessFilterCloudService);

        const preferenceCloudService = service.preferenceService;
        const identityUserService = TestBed.inject(IdentityUserService);

        createPreferenceSpy = spyOn(preferenceCloudService, 'createPreference').and.returnValue(of(fakeProcessCloudFilters));
        updatePreferenceSpy = spyOn(preferenceCloudService, 'updatePreference').and.returnValue(of(fakeProcessCloudFilters));
        getPreferenceByKeySpy = spyOn(preferenceCloudService, 'getPreferenceByKey').and.returnValue(of(fakeProcessCloudFilters));
        getPreferencesSpy = spyOn(preferenceCloudService, 'getPreferences').and.returnValue(of(fakeProcessCloudFilterEntries));
        getCurrentUserInfoSpy = spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue(identityUserMock);
    });

    it('should create processfilter key by using appName and the username', async () => {
        await service.getProcessFilters('mock-appName').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(getCurrentUserInfoSpy).toHaveBeenCalled();
        });
    });

    it('should create default process filters', async () => {
        getPreferencesSpy.and.returnValue(of(fakeEmptyProcessCloudFilterEntries));
        await service.getProcessFilters('mock-appName').subscribe((res: any) => {
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
        });
        expect(createPreferenceSpy).toHaveBeenCalled();
    });

    it('should fetch the process filters if filters are available', async () => {
        await service.getProcessFilters('mock-appName').subscribe((res: any) => {
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
        });
        expect(getPreferencesSpy).toHaveBeenCalled();
    });

    it('should create the process filters in case the filters are not exist in the user preferences', async () => {
        getPreferencesSpy.and.returnValue(of(fakeProcessCloudFilterWithDifferentEntries));
        await service.getProcessFilters('mock-appName').subscribe((res: any) => {
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
        });
        expect(getPreferencesSpy).toHaveBeenCalled();
        expect(createPreferenceSpy).toHaveBeenCalled();
    });

    it('should return filter by process filter id', async () => {
        await service.getFilterById('mock-appName', '2').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.appName).toBe('mock-appName');
            expect(res.id).toBe('2');
            expect(res.name).toBe('MOCK_PROCESS_NAME_2');
            expect(res.status).toBe('MOCK-RUNNING');
        });
        expect(getPreferenceByKeySpy).toHaveBeenCalled();
    });

    it('should add process filter if filter is not exist in the filters', async () => {
        getPreferenceByKeySpy.and.returnValue(of([]));
        await service.getFilterById('mock-appName', '2').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.appName).toBe('mock-appName');
            expect(res.id).toBe('2');
            expect(res.name).toBe('MOCK_PROCESS_NAME_2');
            expect(res.status).toBe('MOCK-RUNNING');
        });
    });

    it('should update filter', async () => {
        await service.updateFilter(fakeProcessFilter).subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);
            expect(res[0].appName).toBe('mock-appName');
            expect(res[1].appName).toBe('mock-appName');
            expect(res[2].appName).toBe('mock-appName');
        });
    });

    it('should create process filter when trying to update in case filter is not exist in the filters', async () => {
        getPreferenceByKeySpy.and.returnValue(of([]));
        await service.updateFilter(fakeProcessFilter).subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);
            expect(res[0].appName).toBe('mock-appName');
            expect(res[1].appName).toBe('mock-appName');
            expect(res[2].appName).toBe('mock-appName');
        });
        expect(createPreferenceSpy).toHaveBeenCalled();
    });

    it('should delete filter', async () => {
        await service.deleteFilter(fakeProcessFilter).subscribe((res: any) => {
            expect(res).toBeDefined();
        });
        expect(updatePreferenceSpy).toHaveBeenCalled();
    });

    it('should check if given filter is a default filter', () => {
        const fakeFilterName = 'fake-process-filter';
        const defaultFilterName = 'ADF_CLOUD_PROCESS_FILTERS.RUNNING_PROCESSES';

        expect(service.isDefaultFilter(defaultFilterName)).toBe(true);
        expect(service.isDefaultFilter(fakeFilterName)).toBe(false);
    });

    it('should reset filters to default values', async () => {
        const changedFilter = new ProcessFilterCloudModel(fakeProcessCloudFilters[0]);
        changedFilter.processDefinitionKey = 'modifiedProcessDefinitionKey';
        spyOn<any>(service, 'defaultProcessFilters').and.returnValue(fakeProcessCloudFilters);

        await service.resetProcessFilterToDefaults('mock-appName', changedFilter).toPromise();

        expect(updatePreferenceSpy).toHaveBeenCalledWith('mock-appName', 'process-filters-mock-appName-mock-username', fakeProcessCloudFilters);
    });
});
