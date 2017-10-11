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

import { AppDefinitionRepresentationModel, Comment, TaskDetailsModel } from 'ng2-activiti-tasklist';
import { LightUserRepresentation } from 'ng2-alfresco-core';
import { FilterProcessRepresentationModel } from '../models/filter-process.model';
import { ProcessDefinitionRepresentation } from '../models/process-definition.model';

export let fakeFilters = {
    size: 1, total: 1, start: 0,
    data: [new FilterProcessRepresentationModel({
        'name': 'Running',
        'appId': '22',
        'id': 333,
        'recent': true,
        'icon': 'glyphicon-random',
        'filter': {'sort': 'created-desc', 'name': '', 'state': 'running'}
    })]
};

export let fakeEmptyFilters = {
    size: 0, total: 0, start: 0,
    data: []
};

export let fakeError = {
    message: null,
    messageKey: 'GENERAL.ERROR.FORBIDDEN'
};

export let fakeApp1 = new AppDefinitionRepresentationModel({
    deploymentId: 26,
    name: 'HR processes',
    icon: 'glyphicon-cloud',
    description: null,
    theme: 'theme-6',
    modelId: 4,
    id: 1
});

export let fakeApp2 = new AppDefinitionRepresentationModel({
    deploymentId: 2501,
    name: 'Sales onboarding',
    icon: 'glyphicon-asterisk',
    description: null,
    theme: 'theme-1',
    modelId: 1002,
    id: 1000
});

export let fakeTaskList = {
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

export let fakeComment = new Comment(1, 'Test', '2016-11-10T03:37:30.010+0000', new LightUserRepresentation({
    id: 13,
    firstName: 'Wilbur',
    lastName: 'Adams',
    email: 'wilbur@app.com'
}));

export let fakeProcessDef = new ProcessDefinitionRepresentation({
    id: '32323',
    key: 'blah',
    name: 'Process 1'
});
