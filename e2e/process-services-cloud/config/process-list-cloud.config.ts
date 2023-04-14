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

export class ProcessListCloudConfiguration {

    getConfiguration() {
        return {
            presets: {
                default: [
                    {
                        key: 'id',
                        type: 'text',
                        title: 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.ID',
                        sortable: true
                    },
                    {
                        key: 'name',
                        type: 'text',
                        title: 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.NAME',
                        sortable: true
                    },
                    {
                        key: 'status',
                        type: 'text',
                        title: 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.STATUS',
                        sortable: true
                    },
                    {
                        key: 'startDate',
                        type: 'date',
                        title: 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.START_DATE',
                        sortable: true,
                        format: 'timeAgo'
                    },
                    {
                        key: 'appName',
                        type: 'text',
                        title: 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.APP_NAME',
                        sortable: true
                    },
                    {
                        key: 'businessKey',
                        type: 'text',
                        title: 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.BUSINESS_KEY',
                        sortable: true
                    },
                    {
                        key: 'initiator',
                        type: 'text',
                        title: 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.STARTED_BY',
                        sortable: true
                    },
                    {
                        key: 'lastModified',
                        type: 'date',
                        title: 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.LAST_MODIFIED',
                        sortable: true
                    },
                    {
                        key: 'processDefinitionId',
                        type: 'text',
                        title: 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.PROCESS_DEF_ID',
                        sortable: true
                    },
                    {
                        key: 'processDefinitionKey',
                        type: 'text',
                        title: 'ADF_CLOUD_PROCESS_LIST.PROPERTIES.PROCESS_DEF_KEY',
                        sortable: true
                    }
                ]
            }
        };
    }
}
