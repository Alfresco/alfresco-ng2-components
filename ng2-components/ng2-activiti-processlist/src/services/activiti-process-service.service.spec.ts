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

import {
    it,
    describe,
    expect,
    beforeEachProviders,
    inject
} from '@angular/core/testing';
import {
    Response,
    ResponseOptions,
    HTTP_PROVIDERS,
    XHRBackend
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AlfrescoSettingsService } from 'ng2-alfresco-core';
import { ActivitiProcessService } from './activiti-process-service.service';
import { ProcessInstance } from '../models/process-instance';

describe('ActivitiProcessService', () => {

    beforeEachProviders(() => {
        return [
            HTTP_PROVIDERS,
            { provide: XHRBackend, useClass: MockBackend },
            ActivitiProcessService,
            AlfrescoSettingsService
        ];
    });

    it('should be there', inject([ActivitiProcessService], (processService: ActivitiProcessService) => {
        expect(typeof processService.getProcesses).toBe('function');
    }));

    it('should get process instances',
        inject([ActivitiProcessService, XHRBackend], (processService: ActivitiProcessService, mockBackend: MockBackend) => {
            mockBackend.connections.subscribe(
                (connection: MockConnection) => {
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            body: {
                                data: [{
                                    id: 'myprocess:1',
                                    name: 'my process'
                                }]
                            }
                        })));
                });

            processService.getProcesses().subscribe((instances: ProcessInstance[]) => {
                expect(instances.length).toBe(1);
                expect(instances[0].id).toBe('myprocess:1');
                expect(instances[0].name).toBe('my process');
            });

        }));

});
