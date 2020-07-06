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

import { TestBed } from '@angular/core/testing';
import {
    AlfrescoApiService,
    AlfrescoApiServiceMock,
    AppConfigService,
    AppConfigServiceMock,
    IdentityUserService,
    setupTestBed
} from '@alfresco/adf-core';
import { of } from 'rxjs';
import { TASK_FILTERS_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { LocalPreferenceCloudService } from '../../../services/local-preference-cloud.service';
import { TaskFilterCloudService } from './task-filter-cloud.service';
import {
    fakeEmptyTaskCloudPreferenceList,
    fakePreferenceWithNoTaskFilterPreference,
    fakeTaskCloudFilters,
    fakeTaskCloudPreferenceList,
    fakeTaskFilter
} from '../mock/task-filters-cloud.mock';
import { UserPreferenceCloudService } from '../../../services/user-preference-cloud.service';
import { PreferenceCloudServiceInterface } from '../../../services/preference-cloud.interface';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TaskFilterCloudService', () => {
    let service: TaskFilterCloudService;

    let getPreferencesSpy: jasmine.Spy;
    let getPreferenceByKeySpy: jasmine.Spy;
    let createPreferenceSpy: jasmine.Spy;
    let updatePreferenceSpy: jasmine.Spy;
    let getCurrentUserInfoSpy: jasmine.Spy;

    const identityUserMock = { username: 'fakeusername', firstName: 'fake-identity-first-name', lastName: 'fake-identity-last-name', email: 'fakeIdentity@email.com' };

    setupTestBed({
        imports: [
          HttpClientTestingModule
        ],
        providers: [
            { provide: TASK_FILTERS_SERVICE_TOKEN, useClass: UserPreferenceCloudService },
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
            { provide: AppConfigService, useClass: AppConfigServiceMock }
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(TaskFilterCloudService);

        const preferenceCloudService = service.preferenceService;
        createPreferenceSpy = spyOn(preferenceCloudService, 'createPreference').and.returnValue(of(fakeTaskCloudFilters));
        updatePreferenceSpy = spyOn(preferenceCloudService, 'updatePreference').and.returnValue(of(fakeTaskCloudFilters));
        getPreferencesSpy = spyOn(preferenceCloudService, 'getPreferences').and.returnValue(of(fakeTaskCloudPreferenceList));
        getPreferenceByKeySpy = spyOn(preferenceCloudService, 'getPreferenceByKey').and.returnValue(of(fakeTaskCloudFilters));

        const identityUserService = TestBed.inject(IdentityUserService);
        getCurrentUserInfoSpy = spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue(identityUserMock);
    });

    it('should create task filter key by using appName and the username', (done) => {
        service.getTaskListFilters('fakeAppName').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(getCurrentUserInfoSpy).toHaveBeenCalled();
            done();
        });
    });

    it('should create default task filters if there are no task filter preferences', (done) => {
        getPreferencesSpy.and.returnValue(of(fakeEmptyTaskCloudPreferenceList));
        service.getTaskListFilters('fakeAppName').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);

            expect(res[0].appName).toBe('fakeAppName');
            expect(res[0].id).toBe('1');
            expect(res[0].name).toBe('FAKE_TASK_1');
            expect(res[0].status).toBe('ALL');

            expect(res[1].appName).toBe('fakeAppName');
            expect(res[1].id).toBe('2');
            expect(res[1].name).toBe('FAKE_TASK_2');
            expect(res[1].status).toBe('RUNNING');

            expect(res[2].appName).toBe('fakeAppName');
            expect(res[2].id).toBe('3');
            expect(res[2].name).toBe('FAKE_TASK_3');
            expect(res[2].status).toBe('COMPLETED');
            done();
        });
        expect(createPreferenceSpy).toHaveBeenCalled();
    });

    it('should return the task filters if filters available', (done) => {
        service.getTaskListFilters('fakeAppName').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);

            expect(res[0].appName).toBe('fakeAppName');
            expect(res[0].id).toBe('1');
            expect(res[0].name).toBe('FAKE_TASK_1');
            expect(res[0].status).toBe('ALL');

            expect(res[1].appName).toBe('fakeAppName');
            expect(res[1].id).toBe('2');
            expect(res[1].name).toBe('FAKE_TASK_2');
            expect(res[1].status).toBe('RUNNING');

            expect(res[2].appName).toBe('fakeAppName');
            expect(res[2].id).toBe('3');
            expect(res[2].name).toBe('FAKE_TASK_3');
            expect(res[2].status).toBe('COMPLETED');
            done();
        });
        expect(getPreferencesSpy).toHaveBeenCalled();
    });

    it('should create the task filters if the user preference does not have task filters', (done) => {
        getPreferencesSpy.and.returnValue(of(fakePreferenceWithNoTaskFilterPreference));
        service.getTaskListFilters('fakeAppName').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);

            expect(res[0].appName).toBe('fakeAppName');
            expect(res[0].id).toBe('1');
            expect(res[0].name).toBe('FAKE_TASK_1');
            expect(res[0].status).toBe('ALL');

            expect(res[1].appName).toBe('fakeAppName');
            expect(res[1].id).toBe('2');
            expect(res[1].name).toBe('FAKE_TASK_2');
            expect(res[1].status).toBe('RUNNING');

            expect(res[2].appName).toBe('fakeAppName');
            expect(res[2].id).toBe('3');
            expect(res[2].name).toBe('FAKE_TASK_3');
            expect(res[2].status).toBe('COMPLETED');
            done();
        });
        expect(getPreferencesSpy).toHaveBeenCalled();
        expect(createPreferenceSpy).toHaveBeenCalled();
    });

    it('should return filter by task filter id', (done) => {
        service.getTaskFilterById('fakeAppName', '2').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.appName).toBe('fakeAppName');
            expect(res.id).toBe('2');
            expect(res.name).toBe('FAKE_TASK_2');
            expect(res.status).toBe('RUNNING');
            done();
        });
        expect(getPreferenceByKeySpy).toHaveBeenCalled();
    });

    it('should add task filter if filter is not exist in the filters', (done) => {
        getPreferenceByKeySpy.and.returnValue(of([]));
        service.getTaskFilterById('fakeAppName', '2').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.appName).toBe('fakeAppName');
            expect(res.id).toBe('2');
            expect(res.name).toBe('FAKE_TASK_2');
            expect(res.status).toBe('RUNNING');
            done();
        });
    });

    it('should update filter', (done) => {
        createPreferenceSpy.and.returnValue(of(fakeTaskCloudFilters));
        service.updateFilter(fakeTaskFilter).subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);
            expect(res[0].appName).toBe('fakeAppName');
            expect(res[1].appName).toBe('fakeAppName');
            expect(res[2].appName).toBe('fakeAppName');
            done();
        });
    });

    it('should create task filter when trying to update in case filter is not exist in the filters', (done) => {
        getPreferenceByKeySpy.and.returnValue(of([]));
        service.updateFilter(fakeTaskFilter).subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);
            expect(res[0].appName).toBe('fakeAppName');
            expect(res[1].appName).toBe('fakeAppName');
            expect(res[2].appName).toBe('fakeAppName');
            done();
        });
        expect(createPreferenceSpy).toHaveBeenCalled();
    });

    it('should delete filter', (done) => {
        service.deleteFilter(fakeTaskFilter).subscribe((res: any) => {
            expect(res).toBeDefined();
            done();
        });
        expect(updatePreferenceSpy).toHaveBeenCalled();
    });
});

describe('Inject [LocalPreferenceCloudService] into the TaskFilterCloudService', () => {
    let service: TaskFilterCloudService;
    let preferenceCloudService: PreferenceCloudServiceInterface;
    let identityUserService: IdentityUserService;
    let getPreferencesSpy: jasmine.Spy;

    const identityUserMock = { username: 'fakeusername', firstName: 'fake-identity-first-name', lastName: 'fake-identity-last-name', email: 'fakeIdentity@email.com' };

    setupTestBed({
        imports: [
            HttpClientTestingModule
        ],
        providers: [
            { provide: TASK_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(TaskFilterCloudService);
        preferenceCloudService = service.preferenceService;
        identityUserService = TestBed.inject(IdentityUserService);
        getPreferencesSpy = spyOn(preferenceCloudService, 'getPreferences').and.returnValue(of([]));
        spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue(identityUserMock);
    });

    it('should create default task filters if there are no task filter preferences', (done) => {
        const appName = 'fakeAppName';
        service.getTaskListFilters(appName).subscribe((res) => {
            expect(res.length).toEqual(3);

            expect(res[0].name).toEqual('ADF_CLOUD_TASK_FILTERS.MY_TASKS');
            expect(res[0].key).toEqual('my-tasks');
            expect(res[0].appName).toEqual(appName);
            expect(res[0].icon).toEqual('inbox');
            expect(res[0].status).toEqual('ASSIGNED');
            expect(res[0].assignee).toEqual(identityUserMock.username);

            expect(res[1].name).toEqual('ADF_CLOUD_TASK_FILTERS.QUEUED_TASKS');
            expect(res[1].key).toEqual('queued-tasks');
            expect(res[1].appName).toEqual(appName);
            expect(res[1].icon).toEqual('queue');
            expect(res[1].status).toEqual('CREATED');

            expect(res[2].name).toEqual('ADF_CLOUD_TASK_FILTERS.COMPLETED_TASKS');
            expect(res[2].key).toEqual('completed-tasks');
            expect(res[2].appName).toEqual(appName);
            expect(res[2].icon).toEqual('done');
            expect(res[2].status).toEqual('COMPLETED');

            done();
        });
        expect(getPreferencesSpy).toHaveBeenCalled();

        const localData = JSON.parse(localStorage.getItem(`task-filters-${appName}-${identityUserMock.username}`));
        expect(localData.length).toEqual(3);

        expect(localData[0].name).toEqual('ADF_CLOUD_TASK_FILTERS.MY_TASKS');
        expect(localData[0].key).toEqual('my-tasks');
        expect(localData[0].appName).toEqual(appName);
        expect(localData[0].icon).toEqual('inbox');
        expect(localData[0].status).toEqual('ASSIGNED');
        expect(localData[0].assignee).toEqual(identityUserMock.username);

        expect(localData[1].name).toEqual('ADF_CLOUD_TASK_FILTERS.QUEUED_TASKS');
        expect(localData[1].key).toEqual('queued-tasks');
        expect(localData[1].appName).toEqual(appName);
        expect(localData[1].icon).toEqual('queue');
        expect(localData[1].status).toEqual('CREATED');

        expect(localData[2].name).toEqual('ADF_CLOUD_TASK_FILTERS.COMPLETED_TASKS');
        expect(localData[2].key).toEqual('completed-tasks');
        expect(localData[2].appName).toEqual(appName);
        expect(localData[2].icon).toEqual('done');
        expect(localData[2].status).toEqual('COMPLETED');
    });
});
