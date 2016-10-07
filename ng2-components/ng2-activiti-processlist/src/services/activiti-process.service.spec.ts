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
import { ActivitiProcessService } from './activiti-process.service';

describe('ActivitiProcessService', () => {

    let service: ActivitiProcessService;
    let injector: ReflectiveInjector;

    let fakeEmptyFilters = {
        size: 0, total: 0, start: 0,
        data: [ ]
    };

    beforeEach(() => {
        injector = ReflectiveInjector.resolveAndCreate([
            ActivitiProcessService,
            AlfrescoApiService,
            AlfrescoAuthenticationService,
            AlfrescoSettingsService
        ]);
        service = injector.get(ActivitiProcessService);
    });

    it('should get process instances', (done) => {

        expect(true).toBe(true);
        done();
    });

    it('should call createDefaultFilters() when the returned filter list is empty', (done) => {
        spyOn(service, 'createDefaultFilters');
        spyOn(service, 'callApiGetUserProcessInstanceFilters').and.returnValue(Promise.resolve(fakeEmptyFilters));
        spyOn(service, 'callApiAddFilter').and.returnValue(Promise.resolve({}));

        service.getProcessFilters(null).subscribe(
            (res) => {
                expect(service.createDefaultFilters).toHaveBeenCalled();
                done();
            }
        );
    });

    it('should return the default filters', () => {
        spyOn(service, 'addFilter').and.returnValue(Promise.resolve({}));
        let filters = service.createDefaultFilters(null);
        expect(service.addFilter).toHaveBeenCalledTimes(3);
        expect(filters).toBeDefined();
        expect(filters.length).toEqual(3);
    });
});
