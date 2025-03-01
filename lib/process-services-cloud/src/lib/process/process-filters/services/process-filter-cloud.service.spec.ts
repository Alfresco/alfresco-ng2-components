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
import { firstValueFrom, of } from 'rxjs';
import { ProcessFilterCloudService } from './process-filter-cloud.service';
import { PROCESS_FILTERS_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { LocalPreferenceCloudService } from '../../../services/local-preference-cloud.service';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import {
    fakeEmptyProcessCloudFilterEntries,
    fakeProcessCloudFilterEntries,
    fakeProcessCloudFilters,
    fakeProcessCloudFilterWithDifferentEntries,
    fakeProcessFilter,
    processCloudEngineEventsMock
} from '../mock/process-filters-cloud.mock';
import { ProcessFilterCloudModel } from '../models/process-filter-cloud.model';
import { IdentityUserService } from '../../../people/services/identity-user.service';
import { NotificationCloudService } from '../../../services/notification-cloud.service';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('ProcessFilterCloudService', () => {
    let service: ProcessFilterCloudService;
    let getPreferencesSpy: jasmine.Spy;
    let getPreferenceByKeySpy: jasmine.Spy;
    let updatePreferenceSpy: jasmine.Spy;
    let createPreferenceSpy: jasmine.Spy;
    let getCurrentUserInfoSpy: jasmine.Spy;
    let notificationCloudService: NotificationCloudService;

    const identityUserMock = {
        username: 'mock-username',
        firstName: 'fake-identity-first-name',
        lastName: 'fake-identity-last-name',
        email: 'fakeIdentity@email.com'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ProcessServiceCloudTestingModule, ApolloTestingModule],
            providers: [{ provide: PROCESS_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }]
        });
        service = TestBed.inject(ProcessFilterCloudService);

        const preferenceCloudService = TestBed.inject(PROCESS_FILTERS_SERVICE_TOKEN);
        const identityUserService = TestBed.inject(IdentityUserService);
        notificationCloudService = TestBed.inject(NotificationCloudService);

        createPreferenceSpy = spyOn(preferenceCloudService, 'createPreference').and.returnValue(of(fakeProcessCloudFilters));
        updatePreferenceSpy = spyOn(preferenceCloudService, 'updatePreference').and.returnValue(of(fakeProcessCloudFilters));
        getPreferenceByKeySpy = spyOn(preferenceCloudService, 'getPreferenceByKey').and.returnValue(of(fakeProcessCloudFilters));
        getPreferencesSpy = spyOn(preferenceCloudService, 'getPreferences').and.returnValue(of(fakeProcessCloudFilterEntries));
        getCurrentUserInfoSpy = spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue(identityUserMock);
    });

    it('should create processfilter key by using appName and the username', (done) => {
        service.getProcessFilters('mock-appName').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(getCurrentUserInfoSpy).toHaveBeenCalled();
            done();
        });
    });

    it('should create default process filters', (done) => {
        getPreferencesSpy.and.returnValue(of(fakeEmptyProcessCloudFilterEntries));
        service.getProcessFilters('mock-appName').subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);

            expect(res[0].appName).toBe('mock-appName');
            expect(res[0].id).toBe('1');
            expect(res[0].name).toBe('MOCK_PROCESS_NAME_1');
            expect(res[0].status).toBe('MOCK_ALL');
            expect(res[0].statuses).toContain('MOCK_ALL');

            expect(res[1].appName).toBe('mock-appName');
            expect(res[1].id).toBe('2');
            expect(res[1].name).toBe('MOCK_PROCESS_NAME_2');
            expect(res[1].status).toBe('MOCK-RUNNING');
            expect(res[1].statuses).toContain('MOCK-RUNNING');

            expect(res[2].appName).toBe('mock-appName');
            expect(res[2].id).toBe('3');
            expect(res[2].name).toBe('MOCK_PROCESS_NAME_3');
            expect(res[2].status).toBe('MOCK-COMPLETED');
            expect(res[2].statuses).toContain('MOCK-COMPLETED');

            expect(createPreferenceSpy).toHaveBeenCalled();
            done();
        });
    });

    it('should fetch the process filters if filters are available', (done) => {
        service.getProcessFilters('mock-appName').subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);

            expect(res[0].appName).toBe('mock-appName');
            expect(res[0].id).toBe('1');
            expect(res[0].name).toBe('MOCK_PROCESS_NAME_1');
            expect(res[0].status).toBe('MOCK_ALL');
            expect(res[0].statuses).toContain('MOCK_ALL');

            expect(res[1].appName).toBe('mock-appName');
            expect(res[1].id).toBe('2');
            expect(res[1].name).toBe('MOCK_PROCESS_NAME_2');
            expect(res[1].status).toBe('MOCK-RUNNING');
            expect(res[1].statuses).toContain('MOCK-RUNNING');

            expect(res[2].appName).toBe('mock-appName');
            expect(res[2].id).toBe('3');
            expect(res[2].name).toBe('MOCK_PROCESS_NAME_3');
            expect(res[2].status).toBe('MOCK-COMPLETED');
            expect(res[2].statuses).toContain('MOCK-COMPLETED');

            expect(getPreferencesSpy).toHaveBeenCalled();
            done();
        });
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
            expect(res[0].statuses).toContain('MOCK_ALL');

            expect(res[1].appName).toBe('mock-appName');
            expect(res[1].id).toBe('2');
            expect(res[1].name).toBe('MOCK_PROCESS_NAME_2');
            expect(res[1].status).toBe('MOCK-RUNNING');
            expect(res[1].statuses).toContain('MOCK-RUNNING');

            expect(res[2].appName).toBe('mock-appName');
            expect(res[2].id).toBe('3');
            expect(res[2].name).toBe('MOCK_PROCESS_NAME_3');
            expect(res[2].status).toBe('MOCK-COMPLETED');
            expect(res[2].statuses).toContain('MOCK-COMPLETED');

            expect(getPreferencesSpy).toHaveBeenCalled();
            expect(createPreferenceSpy).toHaveBeenCalled();
            done();
        });
    });

    it('should return filter by process filter id', (done) => {
        service.getFilterById('mock-appName', '2').subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.appName).toBe('mock-appName');
            expect(res.id).toBe('2');
            expect(res.name).toBe('MOCK_PROCESS_NAME_2');
            expect(res.status).toBe('MOCK-RUNNING');

            expect(getPreferenceByKeySpy).toHaveBeenCalled();
            done();
        });
    });

    it('should add process filter if filter is not exist in the filters', (done) => {
        getPreferenceByKeySpy.and.returnValue(of([]));

        service.getFilterById('mock-appName', '2').subscribe((res) => {
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
        service.updateFilter(fakeProcessFilter).subscribe((res) => {
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

        service.updateFilter(fakeProcessFilter).subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);
            expect(res[0].appName).toBe('mock-appName');
            expect(res[1].appName).toBe('mock-appName');
            expect(res[2].appName).toBe('mock-appName');

            expect(createPreferenceSpy).toHaveBeenCalled();
            done();
        });
    });

    it('should delete filter', (done) => {
        service.deleteFilter(fakeProcessFilter).subscribe((res) => {
            expect(res).toBeDefined();
            expect(updatePreferenceSpy).toHaveBeenCalled();
            done();
        });
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

    it('should return engine event task subscription', async () => {
        spyOn(notificationCloudService, 'makeGQLQuery').and.returnValue(of(processCloudEngineEventsMock));

        const result = await firstValueFrom(service.getProcessNotificationSubscription('testApp'));
        expect(result.length).toBe(1);
        expect(result[0].eventType).toBe('PROCESS_CREATED');
        expect(result[0].entity.status).toBe('CREATED');
    });
});
