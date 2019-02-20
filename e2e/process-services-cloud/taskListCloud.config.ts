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

export class TaskListCloudConfiguration {

    constructor() {
    }

    getConfiguration() {
        return {
            'presets': {
            'default': [
                {
                    'key': 'entry.id',
                    'type': 'text',
                    'title': 'ADF_CLOUD_TASK_LIST.PROPERTIES.ID',
                    'sortable': true
                },
                {
                    'key': 'entry.name',
                    'type': 'text',
                    'title': 'ADF_CLOUD_TASK_LIST.PROPERTIES.NAME',
                    'sortable': true,
                    'cssClass': 'full-width name-column ellipsis-cell'
                },
                {
                    'key': 'entry.processDefinitionId',
                    'type': 'text',
                    'title': 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PROCESS_DEF_ID',
                    'sortable': true,
                    'cssClass': 'full-width name-column ellipsis-cell'
                },
                {
                    'key': 'entry.processInstanceId',
                    'type': 'text',
                    'title': 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PROCESS_INSTANCE_ID',
                    'sortable': true,
                    'cssClass': 'full-width name-column ellipsis-cell'
                },
                {
                    'key': 'entry.status',
                    'type': 'text',
                    'title': 'ADF_CLOUD_TASK_LIST.PROPERTIES.STATUS',
                    'sortable': true
                },
                {
                    'key': 'entry.priority',
                    'type': 'text',
                    'title': 'ADF_CLOUD_TASK_LIST.PROPERTIES.PRIORITY',
                    'sortable': true
                },
                {
                    'key': 'entry.createdDate',
                    'type': 'date',
                    'title': 'ADF_CLOUD_TASK_LIST.PROPERTIES.CREATED_DATE',
                    'sortable': true,
                    'format': 'timeAgo'
                },
                {
                    'key': 'entry.lastModified',
                    'type': 'date',
                    'title': 'ADF_CLOUD_TASK_LIST.PROPERTIES.LAST_MODIFIED',
                    'sortable': true,
                    'format': 'timeAgo'
                }
            ]
        }
        };
    }
}
