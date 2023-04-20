/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

/* spell-checker: disable */
import { ProcessInstance } from '../../process-list/models/process-instance.model';

export class ProcessList {

    data: ProcessInstance[];
    size: number;
    start: number;
    total: number;

    constructor(data?: ProcessInstance[]) {
        this.data = data || [];
    }
}

export class SingleProcessList extends ProcessList {
    constructor(name?: string) {
        const instance = new ProcessInstance({
            id: '123',
            name
        });
        super([instance]);
    }
}

export const exampleProcess = new ProcessInstance({
    id: '123',
    name: 'Process 123',
    started: '2016-11-10T03:37:30.010+0000',
    startedBy: {
        id: 1001,
        firstName: 'Bob',
        lastName: 'Jones',
        email: 'bob@app.activiti.com'
    }
});

export const processEnded = new ProcessInstance({
    id: '123',
    name: 'Process 123',
    started: '2016-11-10T03:37:30.010+0000',
    startedBy: {
        id: 1001,
        firstName: 'Bob',
        lastName: 'Jones',
        email: 'bob@app.activiti.com'
    },
    ended: '2016-11-11T03:37:30.010+0000'
});

export const mockRunningProcess = new ProcessInstance({
    id: '123',
    name: 'Process 123',
    started: '2016-11-10T03:37:30.010+0000',
    startedBy: {
        id: 1001,
        firstName: 'Bob',
        lastName: 'Jones',
        email: 'bob@app.activiti.com'
    },
    ended: null
});

export const exampleProcessNoName = new ProcessInstance({
    id: '123',
    name: null,
    started: '2016-11-10T03:37:30.010+0000',
    startedBy: {
        id: 1001,
        firstName: 'Bob',
        lastName: 'Jones',
        email: 'bob@app.activiti.com'
    },
    processDefinitionName: 'My Process'
});

export const fakeProcessInstances = {
    size: 2,
    total: 2,
    start: 0,
    data: [
      {
        id: '340124',
        name: 'James Franklin EMEA Onboarding',
        businessKey: null,
        processDefinitionId: 'HROnboarding:60:338704',
        tenantId: 'tenant_1',
        started: new Date('2017-10-09T12:19:44.560+0000'),
        ended: null,
        startedBy: {
          id: 4004,
          firstName: 'Integration',
          lastName: 'Test',
          email: 'srintegrationtest@test.com'
        },
        processDefinitionName: 'HROnboarding',
        processDefinitionDescription: 'HR Onboarding Workflow',
        processDefinitionKey: 'fakeProcessDefinitionKey1',
        processDefinitionCategory: 'http://www.activiti.org/processdef',
        processDefinitionVersion: 60,
        processDefinitionDeploymentId: '338695',
        graphicalNotationDefined: true,
        startFormDefined: false,
        suspended: false,
        variables: []
      },
      {
        id: '340063',
        name: 'Mary Franklin AMERICAS Onboarding',
        businessKey: null,
        processDefinitionId: 'HROnboarding:60:338704',
        tenantId: 'tenant_1',
        started: '2017-10-09T12:18:07.484+0000',
        ended: null,
        startedBy: {
          id: 4004,
          firstName: 'Integration',
          lastName: 'Test',
          email: 'srintegrationtest@test.com'
        },
        processDefinitionName: 'HROnboarding',
        processDefinitionDescription: 'HR Onboarding Workflow',
        processDefinitionKey: 'HROnboarding',
        processDefinitionCategory: 'http://www.activiti.org/processdef',
        processDefinitionVersion: 60,
        processDefinitionDeploymentId: '338695',
        graphicalNotationDefined: true,
        startFormDefined: false,
        suspended: false,
        variables: []
      },
      {
        id: '337604',
        name: 'John Jacobs AMERICAS Onboarding',
        businessKey: null,
        processDefinitionId: 'HROnboarding:49:303243',
        tenantId: 'tenant_1',
        started: '2017-09-25T10:02:23.522+0000',
        ended: null,
        startedBy: {
          id: 4004,
          firstName: 'Integration',
          lastName: 'Test',
          email: 'srintegrationtest@test.com'
        },
        processDefinitionName: 'HROnboarding',
        processDefinitionDescription: 'HR Onboarding Workflow',
        processDefinitionKey: 'fakeProcessDefinitionKey2',
        processDefinitionCategory: 'http://www.activiti.org/processdef',
        processDefinitionVersion: 49,
        processDefinitionDeploymentId: '303234',
        graphicalNotationDefined: true,
        startFormDefined: false,
        suspended: false,
        variables: []
      }
    ]
  };
