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
import { setupTestBed, CoreModule, IdentityUserService } from '@alfresco/adf-core';
import { of } from 'rxjs';
import { TASK_FILTERS_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { LocalPreferenceCloudService } from '../../../services/local-preference-cloud.service';
import { TaskFilterCloudService } from './task-filter-cloud.service';
import {
    fakeTaskCloudPreferenceList,
    fakeTaskCloudFilters,
    fakeEmptyTaskCloudPreferenceList,
    fakePreferenceWithNoTaskFilterPreference,
    fakeTaskFilter
} from '../mock/task-filters-cloud.mock';
import { UserPreferenceCloudService } from '../../../services/user-preference-cloud.service';
import { PreferenceCloudServiceInterface } from '../../../services/preference-cloud.interface';

describe('TaskFilterCloudService', () => {
    let service: TaskFilterCloudService;
    let preferenceCloudService: PreferenceCloudServiceInterface;
    let identityUserService: IdentityUserService;
    let getPreferencesSpy: jasmine.Spy;
    let getPreferenceByKeySpy: jasmine.Spy;
    let createPreferenceSpy: jasmine.Spy;
    let updatePreferenceSpy: jasmine.Spy;
    let getCurrentUserInfoSpy: jasmine.Spy;

    const identityUserMock = { username: 'fakeusername', firstName: 'fake-identity-first-name', lastName: 'fake-identity-last-name', email: 'fakeIdentity@email.com' };

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ],
        providers: [
            { provide: TASK_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }
        ]
    });

    beforeEach(async(() => {
        service = TestBed.get(TaskFilterCloudService);
        preferenceCloudService = service.preferenceService;
        identityUserService = TestBed.get(IdentityUserService);
        createPreferenceSpy = spyOn(preferenceCloudService, 'createPreference').and.returnValue(of(fakeTaskCloudFilters));
        updatePreferenceSpy = spyOn(preferenceCloudService, 'updatePreference').and.returnValue(of(fakeTaskCloudFilters));
        getPreferencesSpy = spyOn(preferenceCloudService, 'getPreferences').and.returnValue(of(fakeTaskCloudPreferenceList));
        getPreferenceByKeySpy = spyOn(preferenceCloudService, 'getPreferenceByKey').and.returnValue(of(fakeTaskCloudFilters));
        getCurrentUserInfoSpy = spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue(identityUserMock);
    }));

    it('should create TaskFilterCloudService instance', () => {
        expect(service).toBeDefined();
    });

    it('should be able to use LocalPreferenceCloudService', () => {
        expect(preferenceCloudService instanceof LocalPreferenceCloudService).toBeTruthy();
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

describe('Inject [UserPreferenceCloudService] into the TaskFilterCloudService', () => {
    let service: TaskFilterCloudService;
    let preferenceCloudService: PreferenceCloudServiceInterface;
    let identityUserService: IdentityUserService;

    const identityUserMock = { username: 'fakeusername', firstName: 'fake-identity-first-name', lastName: 'fake-identity-last-name', email: 'fakeIdentity@email.com' };

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ],
        providers: [
            { provide: TASK_FILTERS_SERVICE_TOKEN, useClass: UserPreferenceCloudService }
        ]
    });

    beforeEach(async(() => {
        service = TestBed.get(TaskFilterCloudService);
        preferenceCloudService = service.preferenceService;
        identityUserService = TestBed.get(IdentityUserService);
        spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue(identityUserMock);
    }));

    it('should create TaskFilterCloudService instance', () => {
        expect(service).toBeDefined();
    });

    it('should be able to inject UserPreferenceCloudService when you override with user preferece service', () => {
        expect(preferenceCloudService instanceof UserPreferenceCloudService).toBeTruthy();
    });
});
