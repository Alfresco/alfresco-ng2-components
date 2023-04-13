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

import { AppDefinitionRepresentationModel, TaskDetailsModel } from '../../task-list';
import { ProcessDefinitionRepresentation } from '../../process-list/models/process-definition.model';

export const mockError = {
    message: null,
    messageKey: 'GENERAL.ERROR.FORBIDDEN'
};

export const fakeApp1 = new AppDefinitionRepresentationModel({
    deploymentId: 26,
    name: 'HR processes',
    icon: 'glyphicon-cloud',
    description: null,
    theme: 'theme-6',
    modelId: 4,
    id: 1
});

export const fakeApp2 = new AppDefinitionRepresentationModel({
    deploymentId: 2501,
    name: 'Sales onboarding',
    icon: 'glyphicon-asterisk',
    description: null,
    theme: 'theme-1',
    modelId: 1002,
    id: 1000
});

export const fakeTasksList = {
    data: [new TaskDetailsModel({
        id: 1,
        name: 'Task 1',
        processInstanceId: 1000,
        created: '2016-11-10T03:37:30.010+0000'
    }), new TaskDetailsModel({
        id: 2,
        name: 'Task 2',
        processInstanceId: 1000,
        created: '2016-11-10T03:37:30.010+0000'
    })]
};

export const fakeProcessDef = new ProcessDefinitionRepresentation({
    id: '32323',
    key: 'blah',
    name: 'Process 1'
});
