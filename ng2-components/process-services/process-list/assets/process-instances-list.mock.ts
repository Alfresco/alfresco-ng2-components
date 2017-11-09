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

import { ProcessInstance } from '../models/process-instance.model';

export let fakeProcessInstances = [
    new ProcessInstance({
        id: 1,
        name: 'Process 773443333',
        processDefinitionId: 'fakeprocess:5:7507',
        processDefinitionKey: 'fakeprocess',
        processDefinitionName: 'Fake Process Name',
        description: null, category: null,
        started: '2015-11-09T12:36:14.184+0000',
        startedBy: {
            id: 3, firstName: 'tenant2', lastName: 'tenantLastname', email: 'tenant2@tenant'
        }
    }),
    new ProcessInstance({
        id: 2,
        name: 'Process 382927392',
        processDefinitionId: 'fakeprocess:5:7507',
        processDefinitionKey: 'fakeprocess',
        processDefinitionName: 'Fake Process Name',
        description: null,
        category: null,
        started: '2017-11-09T12:37:25.184+0000',
        startedBy: {
            id: 3, firstName: 'tenant2', lastName: 'tenantLastname', email: 'tenant2@tenant'
        }
    })
];

export let fakeProcessInstancesWithNoName = [
    new ProcessInstance({
        id: 1,
        name: null,
        processDefinitionId: 'fakeprocess:5:7507',
        processDefinitionKey: 'fakeprocess',
        processDefinitionName: 'Fake Process Name',
        description: null, category: null,
        started: '2017-11-09T12:36:14.184+0000',
        startedBy: {
            id: 3, firstName: 'tenant2', lastName: 'tenantLastname', email: 'tenant2@tenant'
        }
    }),
    new ProcessInstance({
        id: 2,
        name: '',
        processDefinitionId: 'fakeprocess:5:7507',
        processDefinitionKey: 'fakeprocess',
        processDefinitionName: 'Fake Process Name',
        description: null,
        category: null,
        started: '2017-11-09T12:37:25.184+0000',
        startedBy: {
            id: 3, firstName: 'tenant2', lastName: 'tenantLastname', email: 'tenant2@tenant'
        }
    })
];
