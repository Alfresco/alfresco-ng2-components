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
import { setupTestBed, CoreModule, JwtHelperService } from '@alfresco/adf-core';
import { of } from 'rxjs';
import { TaskFilterCloudService } from './task-filter-cloud.service';
import { UserPreferenceCloudService } from '../../../services/user-preference.cloud.service';
import {
    fakeTaskCloudPreferenceList,
    fakeTaskCloudFilters,
    fakeEmptyTaskCloudPreferenceList,
    fakePreferenceWithNoTaskFilterPreference
} from '../mock/task-filters-cloud.mock';

describe('Task Filter Cloud Service', () => {
    let service: TaskFilterCloudService;
    let userPreferenceCloudService: UserPreferenceCloudService;
    let jwtHelperService: JwtHelperService;
    let getPreferencesSpy: jasmine.Spy;
    let getPreferenceByKeySpy: jasmine.Spy;
    let createPreferenceSpy: jasmine.Spy;
    let getCurrentUserInfoSpy: jasmine.Spy;

    const identityUserMock = { username: 'fakeusername', firstName: 'fake-identity-first-name', lastName: 'fake-identity-last-name', email: 'fakeIdentity@email.com' };

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ],
        providers: [TaskFilterCloudService, UserPreferenceCloudService, JwtHelperService]
    });

    beforeEach(async(() => {
        service = TestBed.get(TaskFilterCloudService);
        userPreferenceCloudService = TestBed.get(UserPreferenceCloudService);
        jwtHelperService = TestBed.get(JwtHelperService);
        getPreferencesSpy = spyOn(userPreferenceCloudService, 'getPreferences').and.returnValue(of(fakeTaskCloudPreferenceList));
        createPreferenceSpy = spyOn(userPreferenceCloudService, 'createPreference').and.returnValue(of(fakeTaskCloudFilters));
        getPreferenceByKeySpy = spyOn(userPreferenceCloudService, 'getPreferenceByKey').and.returnValue(of(fakeTaskCloudFilters));

        getCurrentUserInfoSpy = spyOn(jwtHelperService, 'getValueFromLocalAccessToken').and.returnValue(identityUserMock.username);
    }));

    it('should create TaskFilterCloudService instance', () => {
        expect(service).toBeDefined();
    });

    it('should create task filter key by using appName and the username', (done) => {
        expect(service.getKey('fakeAppName')).toEqual('task-filters-fakeAppName-fakeusername');
        expect(getCurrentUserInfoSpy).toHaveBeenCalled();
        done();
    });

    it('should create default task filters if there are no task filter preferences', (done) => {
        getPreferencesSpy.and.returnValue(of(fakeEmptyTaskCloudPreferenceList));
        service.getTaskListFilters('fakeAppName').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(createPreferenceSpy).toHaveBeenCalled();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);

            checkTaskResponseList(res);
            done();
        });
    });

    it('should return the task filters if filters available', (done) => {
        service.getTaskListFilters('fakeAppName').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(getPreferencesSpy).toHaveBeenCalled();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);

            checkTaskResponseList(res);
            done();
        });
    });

    it('should create the task filters if the user preference does not have task filters', (done) => {
        getPreferencesSpy.and.returnValue(of(fakePreferenceWithNoTaskFilterPreference));
        service.getTaskListFilters('fakeAppName').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(getPreferencesSpy).toHaveBeenCalled();
            expect(createPreferenceSpy).toHaveBeenCalled();
            expect(res).not.toBeNull();
            expect(res.length).toBe(3);

            checkTaskResponseList(res);
            done();
        });
    });

    it('should return filter by task filter id', (done) => {
        service.getTaskFilterById('fakeAppName', '2').subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(getPreferenceByKeySpy).toHaveBeenCalled();
            expect(res).not.toBeNull();
            expect(res.appName).toBe('fakeAppName');
            expect(res.id).toBe('2');
            expect(res.name).toBe('FAKE_TASK_2');
            expect(res.status).toBe('RUNNING');
            done();
        });
    });

    function checkTaskResponseList(res) {
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
    }
});
