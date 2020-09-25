/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

export const taskPresetsCloudDefaultModel = {
    'default': [
        {
            'key': 'entry.name',
            'type': 'text',
            'title': 'ADF_CLOUD_TASK_LIST.PROPERTIES.NAME',
            'sortable': true
        },
        {
            'key': 'entry.created',
            'type': 'text',
            'title': 'ADF_CLOUD_TASK_LIST.PROPERTIES.CREATED',
            'cssClass': 'hidden',
            'sortable': true
        },
        {
            'key': 'entry.assignee',
            'type': 'text',
            'title': 'ADF_CLOUD_TASK_LIST.PROPERTIES.ASSIGNEE',
            'cssClass': 'hidden',
            'sortable': true
        }
    ]
};

export const serviceTaskPresetsCloudDefaultModel = {
    'default': [
        {
            'key': 'entry.activityName',
            'type': 'text',
            'title': 'ADF_CLOUD_SERVICE_TASK_LIST.PROPERTIES.ACTIVITY_NAME',
            'sortable': true
        },
        {
            'key': 'entry.status',
            'type': 'text',
            'title': 'ADF_CLOUD_SERVICE_TASK_LIST.PROPERTIES.STATUS',
            'sortable': true
        },
        {
            'key': 'entry.startedDate',
            'type': 'text',
            'title': 'ADF_CLOUD_SERVICE_TASK_LIST.PROPERTIES.STARTED_DATE',
            'cssClass': 'hidden',
            'sortable': true
        },
        {
            'key': 'entry.completedDate',
            'type': 'text',
            'title': 'ADF_CLOUD_SERVICE_TASK_LIST.PROPERTIES.COMPLETED_DATE',
            'cssClass': 'hidden',
            'sortable': true
        }
    ]
};
