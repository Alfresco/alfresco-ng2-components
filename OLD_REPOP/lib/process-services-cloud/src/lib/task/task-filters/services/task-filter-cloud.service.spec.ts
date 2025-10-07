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
import { of } from 'rxjs';
import { TASK_FILTERS_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { LocalPreferenceCloudService } from '../../../services/local-preference-cloud.service';
import { TaskFilterCloudService } from './task-filter-cloud.service';
import {
    fakeEmptyTaskCloudPreferenceList,
    fakePreferenceWithNoTaskFilterPreference,
    fakeTaskCloudFilters,
    fakeTaskCloudPreferenceList,
    fakeTaskFilter,
    taskCloudEngineEventsMock
} from '../mock/task-filters-cloud.mock';
import { UserPreferenceCloudService } from '../../../services/user-preference-cloud.service';
import { PreferenceCloudServiceInterface } from '../../../services/preference-cloud.interface';
import { NotificationCloudService } from '../../../services/notification-cloud.service';
import { IdentityUserService } from '../../../people/services/identity-user.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { StorageService, NoopAuthModule, NoopTranslateModule } from '@alfresco/adf-core';
import { TaskStatusFilter } from '../models/filter-cloud.model';

describe('TaskFilterCloudService', () => {
    let service: TaskFilterCloudService;
    let notificationCloudService: NotificationCloudService;

    let getPreferencesSpy: jasmine.Spy;
    let getPreferenceByKeySpy: jasmine.Spy;
    let createPreferenceSpy: jasmine.Spy;
    let getCurrentUserInfoSpy: jasmine.Spy;

    const identityUserMock = {
        username: 'fakeusername',
        firstName: 'fake-identity-first-name',
        lastName: 'fake-identity-last-name',
        email: 'fakeIdentity@email.com'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, NoopAuthModule, ApolloTestingModule],
            providers: [{ provide: TASK_FILTERS_SERVICE_TOKEN, useClass: UserPreferenceCloudService }]
        });
        service = TestBed.inject(TaskFilterCloudService);
        notificationCloudService = TestBed.inject(NotificationCloudService);

        const preferenceCloudService = service.preferenceService;
        createPreferenceSpy = spyOn(preferenceCloudService, 'createPreference').and.returnValue(of(fakeTaskCloudFilters));
        getPreferencesSpy = spyOn(preferenceCloudService, 'getPreferences').and.returnValue(of(fakeTaskCloudPreferenceList));
        getPreferenceByKeySpy = spyOn(preferenceCloudService, 'getPreferenceByKey').and.returnValue(of(fakeTaskCloudFilters));

        const identityUserService = TestBed.inject(IdentityUserService);
        getCurrentUserInfoSpy = spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue(identityUserMock);
    });

    it('should create task filter key by using appName and the username', (done) => {
        service.getTaskListFilters('fakeAppName').subscribe((res) => {
            expect(res).toBeDefined();
            expect(getCurrentUserInfoSpy).toHaveBeenCalled();
            done();
        });
    });

    it('should create default task filters if there are no task filter preferences', (done) => {
        getPreferencesSpy.and.returnValue(of(fakeEmptyTaskCloudPreferenceList));

        service.getTaskListFilters('fakeAppName').subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);

            expect(res[0].appName).toBe('fakeAppName');
            expect(res[0].id).toBe('1');
            expect(res[0].name).toBe('FAKE_TASK_1');
            expect(res[0].status).toBe(TaskStatusFilter.COMPLETED);
            expect(res[0].statuses).toContain(TaskStatusFilter.COMPLETED);

            expect(res[1].appName).toBe('fakeAppName');
            expect(res[1].id).toBe('2');
            expect(res[1].name).toBe('FAKE_TASK_2');
            expect(res[1].status).toBe(TaskStatusFilter.ASSIGNED);
            expect(res[1].statuses).toContain(TaskStatusFilter.ASSIGNED);

            expect(res[2].appName).toBe('fakeAppName');
            expect(res[2].id).toBe('3');
            expect(res[2].name).toBe('FAKE_TASK_3');
            expect(res[2].status).toBe(TaskStatusFilter.COMPLETED);
            expect(res[2].statuses).toContain(TaskStatusFilter.COMPLETED);

            expect(createPreferenceSpy).toHaveBeenCalled();
            done();
        });
    });

    it('should return the task filters if filters available', (done) => {
        service.getTaskListFilters('fakeAppName').subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);

            expect(res[0].appName).toBe('fakeAppName');
            expect(res[0].id).toBe('1');
            expect(res[0].name).toBe('FAKE_TASK_1');
            expect(res[0].status).toBe(TaskStatusFilter.COMPLETED);
            expect(res[0].statuses).toContain(TaskStatusFilter.COMPLETED);

            expect(res[1].appName).toBe('fakeAppName');
            expect(res[1].id).toBe('2');
            expect(res[1].name).toBe('FAKE_TASK_2');
            expect(res[1].status).toBe(TaskStatusFilter.ASSIGNED);
            expect(res[1].statuses).toContain(TaskStatusFilter.ASSIGNED);

            expect(res[2].appName).toBe('fakeAppName');
            expect(res[2].id).toBe('3');
            expect(res[2].name).toBe('FAKE_TASK_3');
            expect(res[2].status).toBe(TaskStatusFilter.COMPLETED);
            expect(res[2].statuses).toContain(TaskStatusFilter.COMPLETED);

            expect(getPreferencesSpy).toHaveBeenCalled();
            done();
        });
    });

    it('should create the task filters if the user preference does not have task filters', (done) => {
        getPreferencesSpy.and.returnValue(of(fakePreferenceWithNoTaskFilterPreference));

        service.getTaskListFilters('fakeAppName').subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);

            expect(res[0].appName).toBe('fakeAppName');
            expect(res[0].id).toBe('1');
            expect(res[0].name).toBe('FAKE_TASK_1');
            expect(res[0].status).toBe(TaskStatusFilter.COMPLETED);
            expect(res[0].statuses).toContain(TaskStatusFilter.COMPLETED);

            expect(res[1].appName).toBe('fakeAppName');
            expect(res[1].id).toBe('2');
            expect(res[1].name).toBe('FAKE_TASK_2');
            expect(res[1].status).toBe(TaskStatusFilter.ASSIGNED);
            expect(res[1].statuses).toContain(TaskStatusFilter.ASSIGNED);

            expect(res[2].appName).toBe('fakeAppName');
            expect(res[2].id).toBe('3');
            expect(res[2].name).toBe('FAKE_TASK_3');
            expect(res[2].status).toBe(TaskStatusFilter.COMPLETED);
            expect(res[2].statuses).toContain(TaskStatusFilter.COMPLETED);

            done();
        });
    });

    it('should return filter by task filter id', (done) => {
        service.getTaskFilterById('fakeAppName', '2').subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.appName).toBe('fakeAppName');
            expect(res.id).toBe('2');
            expect(res.name).toBe('FAKE_TASK_2');
            expect(res.status).toBe(TaskStatusFilter.ASSIGNED);
            expect(res.statuses).toContain(TaskStatusFilter.ASSIGNED);

            expect(getPreferenceByKeySpy).toHaveBeenCalled();
            done();
        });
    });

    it('should add task filter if filter is not exist in the filters', (done) => {
        getPreferenceByKeySpy.and.returnValue(of([]));

        service.getTaskFilterById('fakeAppName', '2').subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.appName).toBe('fakeAppName');
            expect(res.id).toBe('2');
            expect(res.name).toBe('FAKE_TASK_2');
            expect(res.status).toBe(TaskStatusFilter.ASSIGNED);
            expect(res.statuses).toContain(TaskStatusFilter.ASSIGNED);
            done();
        });
    });

    it('should update filter', (done) => {
        createPreferenceSpy.and.returnValue(of(fakeTaskCloudFilters));

        service.updateFilter(fakeTaskFilter).subscribe((res) => {
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

        service.updateFilter(fakeTaskFilter).subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);
            expect(res[0].appName).toBe('fakeAppName');
            expect(res[1].appName).toBe('fakeAppName');
            expect(res[2].appName).toBe('fakeAppName');

            expect(createPreferenceSpy).toHaveBeenCalled();
            done();
        });
    });

    it('should check if given filter is a default filter', () => {
        const fakeFilterName = 'fake-task-filter';
        const defaultFilterName = 'ADF_CLOUD_TASK_FILTERS.MY_TASKS';

        expect(service.isDefaultFilter(defaultFilterName)).toBe(true);
        expect(service.isDefaultFilter(fakeFilterName)).toBe(false);
    });

    it('should return engine event task subscription', (done) => {
        spyOn(notificationCloudService, 'makeGQLQuery').and.returnValue(of(taskCloudEngineEventsMock));

        service.getTaskNotificationSubscription('myAppName').subscribe((res) => {
            expect(res.length).toBe(1);
            expect(res[0].eventType).toBe('TASK_ASSIGNED');
            expect(res[0].entity.name).toBe('This is a new task');
            done();
        });
    });
});

describe('Inject [LocalPreferenceCloudService] into the TaskFilterCloudService', () => {
    let service: TaskFilterCloudService;
    let preferenceCloudService: PreferenceCloudServiceInterface;
    let identityUserService: IdentityUserService;
    let getPreferencesSpy: jasmine.Spy;
    let storageService: StorageService;

    const identityUserMock = {
        username: 'fakeusername',
        firstName: 'fake-identity-first-name',
        lastName: 'fake-identity-last-name',
        email: 'fakeIdentity@email.com'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, NoopAuthModule, ApolloTestingModule],
            providers: [{ provide: TASK_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }]
        });
        service = TestBed.inject(TaskFilterCloudService);
        preferenceCloudService = service.preferenceService;
        identityUserService = TestBed.inject(IdentityUserService);
        storageService = TestBed.inject(StorageService);
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
            expect(res[0].status).toEqual(TaskStatusFilter.ASSIGNED);
            expect(res[0].statuses).toContain(TaskStatusFilter.ASSIGNED);
            expect(res[0].assignee).toEqual(identityUserMock.username);
            expect(res[0].assignees).toContain(identityUserMock.username);

            expect(res[1].name).toEqual('ADF_CLOUD_TASK_FILTERS.QUEUED_TASKS');
            expect(res[1].key).toEqual('queued-tasks');
            expect(res[1].appName).toEqual(appName);
            expect(res[1].icon).toEqual('queue');
            expect(res[1].status).toEqual(TaskStatusFilter.CREATED);
            expect(res[1].statuses).toContain(TaskStatusFilter.CREATED);

            expect(res[2].name).toEqual('ADF_CLOUD_TASK_FILTERS.COMPLETED_TASKS');
            expect(res[2].key).toEqual('completed-tasks');
            expect(res[2].appName).toEqual(appName);
            expect(res[2].icon).toEqual('done');
            expect(res[2].status).toEqual(TaskStatusFilter.COMPLETED);
            expect(res[2].statuses).toContain(TaskStatusFilter.COMPLETED);
            expect(getPreferencesSpy).toHaveBeenCalled();

            const localData = JSON.parse(storageService.getItem(`task-filters-${appName}-${identityUserMock.username}`));
            expect(localData.length).toEqual(3);

            expect(localData[0].name).toEqual('ADF_CLOUD_TASK_FILTERS.MY_TASKS');
            expect(localData[0].key).toEqual('my-tasks');
            expect(localData[0].appName).toEqual(appName);
            expect(localData[0].icon).toEqual('inbox');
            expect(localData[0].status).toEqual(TaskStatusFilter.ASSIGNED);
            expect(localData[0].statuses).toContain(TaskStatusFilter.ASSIGNED);
            expect(localData[0].assignee).toEqual(identityUserMock.username);
            expect(localData[0].assignees).toContain(identityUserMock.username);

            expect(localData[1].name).toEqual('ADF_CLOUD_TASK_FILTERS.QUEUED_TASKS');
            expect(localData[1].key).toEqual('queued-tasks');
            expect(localData[1].appName).toEqual(appName);
            expect(localData[1].icon).toEqual('queue');
            expect(localData[1].status).toEqual(TaskStatusFilter.CREATED);
            expect(localData[1].statuses).toContain(TaskStatusFilter.CREATED);

            expect(localData[2].name).toEqual('ADF_CLOUD_TASK_FILTERS.COMPLETED_TASKS');
            expect(localData[2].key).toEqual('completed-tasks');
            expect(localData[2].appName).toEqual(appName);
            expect(localData[2].icon).toEqual('done');
            expect(localData[2].status).toEqual(TaskStatusFilter.COMPLETED);
            expect(localData[2].statuses).toContain(TaskStatusFilter.COMPLETED);

            done();
        });
    });
});
