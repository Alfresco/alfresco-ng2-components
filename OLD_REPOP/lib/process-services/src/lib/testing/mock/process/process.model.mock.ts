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

/* spell-checker: disable */
import { ProcessInstanceRepresentation } from '@alfresco/js-api';

export const exampleProcess: ProcessInstanceRepresentation = {
    id: '123',
    name: 'Process 123',
    started: new Date('2016-11-10T03:37:30.010+0000'),
    startedBy: {
        id: 1001,
        firstName: 'Bob',
        lastName: 'Jones',
        email: 'bob@app.activiti.com'
    }
};

export const processEnded: ProcessInstanceRepresentation = {
    id: '123',
    name: 'Process 123',
    started: new Date('2016-11-10T03:37:30.010+0000'),
    startedBy: {
        id: 1001,
        firstName: 'Bob',
        lastName: 'Jones',
        email: 'bob@app.activiti.com'
    },
    ended: new Date('2016-11-11T03:37:30.010+0000')
};

export const mockRunningProcess: ProcessInstanceRepresentation = {
    id: '123',
    name: 'Process 123',
    started: new Date('2016-11-10T03:37:30.010+0000'),
    startedBy: {
        id: 1001,
        firstName: 'Bob',
        lastName: 'Jones',
        email: 'bob@app.activiti.com'
    },
    ended: null
};

export const exampleProcessNoName: ProcessInstanceRepresentation = {
    id: '123',
    name: null,
    started: new Date('2016-11-10T03:37:30.010+0000'),
    startedBy: {
        id: 1001,
        firstName: 'Bob',
        lastName: 'Jones',
        email: 'bob@app.activiti.com'
    },
    processDefinitionName: 'My Process'
};
