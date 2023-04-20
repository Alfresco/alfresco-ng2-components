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

import { TaskCloudModel } from '../models/task-cloud.model';

export const getTaskCloudModelMock = (cloudModel: Partial<TaskCloudModel> = {}): TaskCloudModel => ({
    id: '1',
    appName: 'app',
    appVersion: 'version',
    assignee: 'hr',
    candidateGroups: [],
    candidateUsers: [],
    createdDate: '2022-06-01T10:33:52.275+0000',
    formKey: '',
    inFinalState: true,
    lastModified: '2022-07-01T10:33:52.275+0000',
    name: '',
    priority: 1,
    processDefinitionId: '',
    processDefinitionName: '',
    processDefinitionVersion: 1,
    processInstanceId: '',
    serviceFullName: '',
    serviceName: '',
    serviceVersion: '',
    standalone: true,
    status: '',
    taskDefinitionKey: '',
    processVariables: undefined,
    ...cloudModel
});
