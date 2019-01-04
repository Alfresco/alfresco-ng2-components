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

import { ProcessInstanceCloud } from '../models/process-instance-cloud.model';
import { ProcessPayloadCloud } from '../models/process-payload-cloud.model';
import { ProcessDefinitionCloud } from '../models/process-definition-cloud.model';

export let fakeProcessInstance = new ProcessInstanceCloud({
    appName: 'simple-app',
    appVersion: '',
    serviceName: 'simple-app-rb',
    serviceFullName: 'simple-app-rb',
    serviceType: 'runtime-bundle',
    serviceVersion: '',
    id: 'd0b30377-dc5a-11e8-ae24-0a58646001fa',
    name: 'My Process Name',
    startDate: '2018-10-30T15:45:24.136+0000',
    initiator: 'usermock',
    status: 'RUNNING',
    processDefinitionId: 'BasicProcess:1:d05062f1-c6fb-11e8-ae24-0a58646001fa',
    processDefinitionKey: 'BasicProcess'
});

export let fakeProcessDefinitions: ProcessDefinitionCloud[] = [
    new ProcessDefinitionCloud({
        appName: 'myApp',
        appVersion: 0,
        id: 'NewProcess:1',
        key: 'NewProcess 1',
        name: 'NewProcess 1',
        serviceFullName: 'myApp-rb',
        serviceName: 'myApp-rb',
        serviceType: 'runtime-bundle',
        serviceVersion: null
    }),
    new ProcessDefinitionCloud({
        appName: 'myApp',
        appVersion: 0,
        id: 'NewProcess:2',
        key: 'NewProcess 2',
        name: 'NewProcess 2',
        serviceFullName: 'myApp-rb',
        serviceName: 'myApp-rb',
        serviceType: 'runtime-bundle',
        serviceVersion: null
    })
];

export let fakeProcessPayload = new ProcessPayloadCloud({
    processDefinitionKey: 'NewProcess:1',
    processInstanceName: 'NewProcess 1',
    payloadType: 'string'
});
