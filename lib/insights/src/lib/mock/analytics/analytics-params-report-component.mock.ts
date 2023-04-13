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

import { ReportParameterDetailsModel } from '../../diagram/models/report/report-parameter-details.model';

export const reportDefParamStatus = {
    id: 2005,
    name: 'Fake Task overview status',
    created: '2016-10-05T15:39:40.222+0000',
    definition: '{ "parameters" :[{"id":"status","name":null,"nameKey":null,"type":"status","value":null,"dependsOn":null}]}'
};

export const reportDefParamNumber = {
    id: 2005,
    name: 'Fake Process instances overview',
    created: '2016-10-05T15:39:40.222+0000',
    definition: '{ "parameters"' +
    ' :[{"id":"slowProcessInstanceInteger","name":null,"nameKey":null,"type":"integer","value":10,"dependsOn":null}]}'
};

export const reportDefParamDuration = {
    id: 2005,
    name: 'Fake Task service level agreement',
    created: '2016-10-05T15:39:40.222+0000',
    definition: '{ "parameters"' +
    ' :[{"id":"duration","name":null,"nameKey":null,"type":"duration","value":null,"dependsOn":null}]}'
};

export const reportDefParamCheck = {
    id: 2005,
    name: 'Fake Task service level agreement',
    created: '2016-10-05T15:39:40.222+0000',
    definition: '{ "parameters"' +
    ' :[{"id":"typeFiltering","name":null,"nameKey":null,"type":"boolean","value":true,"dependsOn":null}]}'
};

export const reportDefParamDateRange = {
    id: 2005,
    name: 'Fake Process instances overview',
    created: '2016-10-05T15:39:40.222+0000',
    definition: '{ "parameters" :[{"id":"dateRange","name":null,"nameKey":null,"type":"dateRange","value":null,"dependsOn":null}]}'
};

export const reportDefParamRangeInterval = {
    id: 2006,
    name: 'Fake Task overview RangeInterval',
    created: '2016-10-05T15:39:40.222+0000',
    definition: '{ "parameters" :[{"id":"dateRangeInterval","name":null,"nameKey":null,"type":"dateInterval","value":null,"dependsOn":null}]}'
};

export const reportDefParamProcessDef = {
    id: 2006,
    name: 'Fake Task overview ProcessDefinition',
    created: '2016-10-05T15:39:40.222+0000',
    definition: '{ "parameters" :[{"id":"processDefinitionId","name":null,"nameKey":null,"type":"processDefinition","value":null,"dependsOn":null}]}'
};

export const reportDefParamProcessDefOptionsNoApp = [
    {
        id: 'FakeProcessTest 1:1:1',
        name: 'Fake Process Test 1 Name ',
        version: 1
    },
    {
        id: 'FakeProcessTest 1:2:1',
        name: 'Fake Process Test 1 Name ',
        version: 2
    },
    {
        id: 'FakeProcessTest 2:1:1',
        name: 'Fake Process Test 2 Name ',
        version: 1
    },
    {
        id: 'FakeProcessTest 3:1:1',
        name: 'Fake Process Test 3 Name ',
        version: 1
    }
];

export const reportDefParamProcessDefOptions = {
    size: 4, total: 4, start: 0, data: [
        {
            id: 'FakeProcessTest 1:1:1',
            name: 'Fake Process Test 1 Name ',
            version: 1
        },
        {
            id: 'FakeProcessTest 1:2:1',
            name: 'Fake Process Test 1 Name ',
            version: 2
        },
        {
            id: 'FakeProcessTest 2:1:1',
            name: 'Fake Process Test 2 Name ',
            version: 1
        },
        {
            id: 'FakeProcessTest 3:1:1',
            name: 'Fake Process Test 3 Name ',
            version: 1
        }
    ]
};

export const reportDefParamProcessDefOptionsApp = {
    size: 2, total: 2, start: 2, data: [
        {
            id: 'FakeProcessTest 1:1:1',
            name: 'Fake Process Test 1 Name ',
            version: 1
        },
        {
            id: 'FakeProcessTest 1:2:1',
            name: 'Fake Process Test 1 Name ',
            version: 2
        }
    ]
};

export const reportDefParamTask = {
    id: 2006,
    name: 'Fake Task service level agreement',
    created: '2016-10-05T15:39:40.222+0000',
    definition: '{ "parameters" :[{"id":"taskName","name":null,"nameKey":null,"type":"task","value":null,"dependsOn":"processDefinitionId"}]}'
};

export const reportNoParameterDefinitions = {
    id: 2006,
    name: 'Fake Task service level agreement',
    created: '2016-10-05T15:39:40.222+0000',
    definition: '{ "parameters" : []}'
};

export const reportDefParamTaskOptions = ['Fake task name 1', 'Fake task name 2'];

export const fieldProcessDef = new ReportParameterDetailsModel(
    {
        id: 'processDefinitionId',
        type: 'processDefinition',
        value: 'fake-process-name:1:15027'
    }
);
