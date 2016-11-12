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
import { fakeApi, fakeEmptyFilters, fakeFilters, fakeError } from '../assets/activiti-process.service.mock';
import { ActivitiProcessService } from './activiti-process.service';

describe('ActivitiProcessService', () => {

    let service: ActivitiProcessService;
    let injector: ReflectiveInjector;

    beforeEach(() => {
        injector = ReflectiveInjector.resolveAndCreate([
            ActivitiProcessService,
            AlfrescoApiService,
            AlfrescoAuthenticationService,
            AlfrescoSettingsService
        ]);
        service = injector.get(ActivitiProcessService);
        let authenticationService: AlfrescoAuthenticationService = injector.get(AlfrescoAuthenticationService);
        spyOn(authenticationService, 'getAlfrescoApi').and.returnValue(fakeApi);
    });

    xit('should get process instances', (done) => {

        expect(true).toBe(true);
        done();
    });

    describe('filters', () => {

        let userFiltersApi = fakeApi.activiti.userFiltersApi;
        let getFilters: any, createFilter: any;

        beforeEach(() => {
            getFilters = spyOn(userFiltersApi, 'getUserProcessInstanceFilters');
            createFilter = spyOn(userFiltersApi, 'createUserProcessInstanceFilter');
        });

        it('should call the API without an appId defined by default', () => {
            getFilters = getFilters.and.returnValue(Promise.resolve(fakeFilters));
            service.getProcessFilters(null);
            expect(getFilters).toHaveBeenCalledWith({});
        });

        it('should call the API with the correct appId when specified', () => {
            getFilters = getFilters.and.returnValue(Promise.resolve(fakeFilters));
            service.getProcessFilters('226');
            expect(getFilters).toHaveBeenCalledWith({appId: '226'});
        });

        it('should return the non-empty filter list that is returned by the API', (done) => {
            getFilters = getFilters.and.returnValue(Promise.resolve(fakeFilters));
            service.getProcessFilters(null).subscribe(
                (res) => {
                    expect(res.length).toBe(1);
                    done();
                }
            );
        });

        it('should return the default filters when none are returned by the API', (done) => {
            getFilters = getFilters.and.returnValue(Promise.resolve(fakeEmptyFilters));

            service.getProcessFilters(null).subscribe(
                (res) => {
                    expect(res.length).toBe(3);
                    done();
                }
            );
        });

        it('should create the default filters when none are returned by the API', (done) => {
            getFilters = getFilters.and.returnValue(Promise.resolve(fakeEmptyFilters));
            createFilter = createFilter.and.returnValue(Promise.resolve({}));

            service.getProcessFilters(null).subscribe(
                (res) => {
                    expect(createFilter).toHaveBeenCalledTimes(3);
                    done();
                }
            );
        });

        it('should pass on any error that is returned by the API', (done) => {
            getFilters = getFilters.and.returnValue(Promise.reject(fakeError));

            service.getProcessFilters(null).subscribe(
                () => {},
                (res) => {
                    expect(res).toBe(fakeError);
                    done();
                }
            );
        });
    });
});
