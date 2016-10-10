/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { ReflectiveInjector } from '@angular/core';
import {
    AlfrescoAuthenticationService,
    AlfrescoSettingsService,
    AlfrescoApiService
} from 'ng2-alfresco-core';
import { UserProcessInstanceFilterRepresentationModel } from '../models/filter.model';
import { ActivitiProcessService } from './activiti-process.service';

describe('ActivitiProcessService', () => {

    let service: ActivitiProcessService;
    let authenticationService: AlfrescoAuthenticationService;
    let injector: ReflectiveInjector;

    let fakeEmptyFilters = {
        size: 0, total: 0, start: 0,
        data: [ ]
    };

    let fakeApi = {
        activiti: {
            userFiltersApi: {
                getUserProcessInstanceFilters: (filterOpts) => Promise.resolve({}),
                createUserProcessInstanceFilter: (filter: UserProcessInstanceFilterRepresentationModel) => Promise.resolve(filter)
            }
        }
    };

    beforeEach(() => {
        injector = ReflectiveInjector.resolveAndCreate([
            ActivitiProcessService,
            AlfrescoApiService,
            AlfrescoAuthenticationService,
            AlfrescoSettingsService
        ]);
        service = injector.get(ActivitiProcessService);
        authenticationService = injector.get(AlfrescoAuthenticationService);
    });

    xit('should get process instances', (done) => {

        expect(true).toBe(true);
        done();
    });

    it('should return the default filters when none are returned by the API', (done) => {
        spyOn(fakeApi.activiti.userFiltersApi, 'getUserProcessInstanceFilters').
            and.returnValue(Promise.resolve(fakeEmptyFilters));
        spyOn(fakeApi.activiti.userFiltersApi, 'createUserProcessInstanceFilter').
            and.returnValue(Promise.resolve({}));
        spyOn(authenticationService, 'getAlfrescoApi').and.returnValue(fakeApi);

        service.getProcessFilters(null).subscribe(
            (res) => {
                expect(fakeApi.activiti.userFiltersApi.createUserProcessInstanceFilter).toHaveBeenCalledTimes(3);
                done();
            }
        );
    });

    it('should create the default filters when none are returned by the API', (done) => {
        spyOn(fakeApi.activiti.userFiltersApi, 'getUserProcessInstanceFilters').
        and.returnValue(Promise.resolve(fakeEmptyFilters));
        spyOn(fakeApi.activiti.userFiltersApi, 'createUserProcessInstanceFilter').
        and.returnValue(Promise.resolve({}));
        spyOn(authenticationService, 'getAlfrescoApi').and.returnValue(fakeApi);

        service.getProcessFilters(null).subscribe(
            (res) => {
                expect(res.length).toBe(3);
                done();
            }
        );
    });
});
