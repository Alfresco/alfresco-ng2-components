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

import { SimpleChange } from '@angular/core';
import moment from 'moment';
import { fakeApplicationInstance } from '../../../app/mock/app-model.mock';

export const mockAlfrescoApi: any = {
    oauth2Auth: {
        callCustomApi: () => Promise.resolve(fakeApplicationInstance)
    },
    isEcmLoggedIn: () => false,
    reply: jasmine.createSpy('reply')
};

export const mockTaskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);

export const mockTaskFilterResponse = {
    name: 'FakeInvolvedTasks',
    icon: 'adjust',
    id: 'mock-task-filter-id',
    appName: 'mock-app-name',
    processDefinitionId: 'process-def-id',
    assignee: 'fake-involved',
    order: 'ASC',
    sort: 'id',
    processInstanceId: 'fakeProcessInstanceIdFromResponse'
};

export const mockTaskFilterResponseWithProcessInstanceIdNull = {
    name: 'FakeInvolvedTasks',
    icon: 'adjust',
    id: 'mock-task-filter-id',
    appName: 'mock-app-name',
    processDefinitionId: 'process-def-id',
    assignee: 'fake-involved',
    order: 'ASC',
    sort: 'id',
    processInstanceId: null
};

export const mockDefaultTaskFilter = {
    name: 'ADF_CLOUD_TASK_FILTERS.MY_TASKS',
    id: 'filter-id',
    key: 'all-fake-task',
    icon: 'adjust',
    sort: 'startDate',
    status: 'ALL',
    order: 'DESC'
};

export const mockDateFilterFromTo = {
    startFrom: moment().startOf('day').toISOString(true),
    startTo: moment().endOf('day').toISOString(true)
};

export const mockDateFilterStartEnd = {
    startDate: moment().startOf('day').toISOString(true),
    endDate: moment().endOf('day').toISOString(true)
};

export const mockDueDateFilter = {
    key: 'dueDateRange',
    label: '',
    type: 'date-range',
    value: '',
    attributes: {
        dateType: 'dueDateType',
        from: '_dueDateFrom',
        to: '_dueDateTo'
    }
};

export const mockCompletedDateFilter = {
    key: 'completedDateType',
    label: '',
    type: 'date-range',
    value: '',
    attributes: {
        dateType: 'completedDateType',
        from: '_completedFrom',
        to: '_completedTo'
    }
};

export const mockCreatedDateFilter = {
    key: 'createdDateType',
    label: '',
    type: 'date-range',
    value: '',
    attributes: {
        dateType: 'createdDateType',
        from: '_createdFrom',
        to: '_createdTo'
    }
};

export const mockApplicationsSelectorOptions = [
    {
        label: 'application-new-1 (test-env-name-1)',
        value: 'application-new-1'
    },
    {
        label: 'application-new-1 (test-env-name-1)',
        value: 'application-new-1'
    },
    {
        label: 'application-new-1 (test-env-name-1)',
        value: 'application-new-1'
    }
];

export const mockApplicationTaskFilterProperties = [
    {
        label: 'test-label',
        type: 'select',
        key: 'appName',
        value: mockApplicationsSelectorOptions[0].value,
        options: mockApplicationsSelectorOptions
    }
];
