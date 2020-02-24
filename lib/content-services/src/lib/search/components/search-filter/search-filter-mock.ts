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

export const disabledCategories = [
    {
        id: 'queryType',
        name: 'Type',
        expanded: true,
        enabled: false,
        component: {
            selector: 'check-list',
            settings: {
                'field': null,
                'pageSize': 5,
                'options': [
                    { 'name': 'Folder', 'value': "TYPE:'cm:folder'" },
                    { 'name': 'Document', 'value': "TYPE:'cm:content'" }
                ]
            }
        }
    }
];

export const expandedCategories = [
    {
        id: 'queryType',
        name: 'Type',
        expanded: true,
        enabled: true,
        component: {
            selector: 'check-list',
            settings: {
                'field': null,
                'pageSize': 5,
                'options': [
                    { 'name': 'Folder', 'value': "TYPE:'cm:folder'" },
                    { 'name': 'Document', 'value': "TYPE:'cm:content'" }
                ]
            }
        }
    }
];

export const simpleCategories = [
    {
        id: 'queryName',
        name: 'Name',
        expanded: false,
        enabled: true,
        component: {
            selector: 'text',
            settings: {}
        }
    },
    {
        id: 'queryType',
        name: 'Type',
        expanded: false,
        enabled: true,
        component: {
            selector: 'check-list',
            settings: {
                'field': null,
                'pageSize': 5,
                'options': [
                    { 'name': 'Folder', 'value': "TYPE:'cm:folder'" },
                    { 'name': 'Document', 'value': "TYPE:'cm:content'" }
                ]
            }
        }
    }

];
