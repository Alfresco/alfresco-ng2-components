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

export class ProcessListCloudConfiguration {

    constructor() {
    }

    getConfiguration() {
        return {
    'presets': {
    'default': [
        {
            'key': 'entry.id',
            'type': 'text',
            'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.ID',
            'sortable': true
        },
        {
            'key': 'entry.name',
            'type': 'text',
            'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.NAME',
            'sortable': true
        },
        {
            'key': 'entry.status',
            'type': 'text',
            'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.STATUS',
            'sortable': true
        },
        {
            'key': 'entry.startDate',
            'type': 'date',
            'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.START_DATE',
            'sortable': true,
            'format': 'timeAgo'
        },
        {
            'key': 'entry.appName',
            'type': 'text',
            'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.APP_NAME',
            'sortable': true
        },
        {
            'key': 'entry.businessKey',
            'type': 'text',
            'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.BUSINESS_KEY',
            'sortable': true
        },
        {
            'key': 'entry.description',
            'type': 'text',
            'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.DESCRIPTION',
            'sortable': true
        },
        {
            'key': 'entry.initiator',
            'type': 'text',
            'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.INITIATOR',
            'sortable': true
        },
        {
            'key': 'entry.lastModified',
            'type': 'date',
            'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.LAST_MODIFIED',
            'sortable': true
        },
        {
            'key': 'entry.processName',
            'type': 'text',
            'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.PROCESS_NAME',
            'sortable': true
        },
        {
            'key': 'entry.processId',
            'type': 'text',
            'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.PROCESS_ID',
            'sortable': true
        },
        {
            'key': 'entry.processDefinitionId',
            'type': 'text',
            'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.PROCESS_DEFINITION_ID',
            'sortable': true
        },
        {
            'key': 'entry.processDefinitionKey',
            'type': 'text',
            'title': 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.PROCESS_DEFINITION_KEY',
            'sortable': true
        }
    ]
    }
};
    }
}
