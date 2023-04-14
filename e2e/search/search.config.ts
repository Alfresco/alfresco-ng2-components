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

export class SearchConfiguration {

    static getConfiguration() {
        return {
            'app:fields': [
                'cm:name',
                'cm:title',
                'cm:description',
                'ia:whatEvent',
                'ia:descriptionEvent',
                'lnk:title',
                'lnk:description',
                'TEXT',
                'TAG'
            ],
            include: ['path', 'allowableOperations'],
            sorting: {
                options: [
                    {key: 'name', label: 'Name', type: 'FIELD', field: 'cm:name', ascending: true},
                    {
                        key: 'content.sizeInBytes',
                        label: 'Size',
                        type: 'FIELD',
                        field: 'content.size',
                        ascending: true
                    },
                    {
                        key: 'description',
                        label: 'Description',
                        type: 'FIELD',
                        field: 'cm:description',
                        ascending: true
                    },
                    {
                        key: 'createdByUser',
                        label: 'Author',
                        type: 'FIELD',
                        field: 'cm:creator',
                        ascending: true
                    },
                    {key: 'createdAt', label: 'Created', type: 'FIELD', field: 'cm:created', ascending: true}
                ],
                defaults: [
                    {key: 'name', type: 'FIELD', field: 'cm:name', ascending: true}
                ]
            },
            filterQueries: [
                {query: 'TYPE:\'cm:folder\' OR TYPE:\'cm:content\''},
                {query: 'NOT cm:creator:System'}
            ],
            facetFields: {
                expanded: true,
                fields: [
                    {field: 'content.mimetype', mincount: 1, label: 'SEARCH.FACET_FIELDS.TYPE'},
                    {field: 'content.size', mincount: 1, label: 'SEARCH.FACET_FIELDS.SIZE'},
                    {field: 'creator', mincount: 1, label: 'SEARCH.FACET_FIELDS.CREATOR'},
                    {field: 'modifier', mincount: 1, label: 'SEARCH.FACET_FIELDS.MODIFIER'},
                    {field: 'created', mincount: 1, label: 'SEARCH.FACET_FIELDS.CREATED'}
                ]
            },
            facetQueries: {
                label: 'My facet queries',
                pageSize: 5,
                queries: [
                    {query: 'created:2018', label: '1.Created This Year'},
                    {query: 'content.mimetype:text/html', label: '2.Type: HTML'},
                    {query: 'content.size:[0 TO 10240]', label: '3.Size: xtra small'},
                    {query: 'content.size:[10240 TO 102400]', label: '4.Size: small'},
                    {query: 'content.size:[102400 TO 1048576]', label: '5.Size: medium'},
                    {query: 'content.size:[1048576 TO 16777216]', label: '6.Size: large'},
                    {query: 'content.size:[16777216 TO 134217728]', label: '7.Size: xtra large'},
                    {query: 'content.size:[134217728 TO MAX]', label: '8.Size: XX large'}
                ]
            },
            categories: [
                {
                    id: 'queryName',
                    name: 'Name',
                    enabled: true,
                    expanded: true,
                    component: {
                        selector: 'text',
                        settings: {
                            pattern: 'cm:name:\'(.*?)\'',
                            field: 'cm:name',
                            placeholder: 'Enter the name'
                        }
                    }
                },
                {
                    id: 'checkList',
                    name: 'Check List',
                    enabled: true,
                    component: {
                        selector: 'check-list',
                        settings: {
                            pageSize: 5,
                            operator: 'OR',
                            options: [
                                {name: 'Folder', value: 'TYPE:\'cm:folder\''},
                                {name: 'Document', value: 'TYPE:\'cm:content\''}
                            ]
                        }
                    }
                },
                {
                    id: 'contentSize',
                    name: 'Content Size',
                    enabled: true,
                    component: {
                        selector: 'slider',
                        settings: {
                            field: 'cm:content.size',
                            min: 0,
                            max: 18,
                            step: 1,
                            thumbLabel: true
                        }
                    }
                },
                {
                    id: 'contentSizeRange',
                    name: 'Content Size (range)',
                    enabled: true,
                    component: {
                        selector: 'number-range',
                        settings: {
                            field: 'cm:content.size',
                            format: '[{FROM} TO {TO}]'
                        }
                    }
                },
                {
                    id: 'createdDateRange',
                    name: 'Created Date (range)',
                    enabled: true,
                    component: {
                        selector: 'date-range',
                        settings: {
                            field: 'cm:created',
                            dateFormat: 'DD-MMM-YY'
                        }
                    }
                },
                {
                    id: 'queryType',
                    name: 'Type',
                    enabled: true,
                    component: {
                        selector: 'radio',
                        settings: {
                            field: null,
                            pageSize: 5,
                            options: [
                                {name: 'APP.SEARCH.RADIO.NONE', value: '', default: true},
                                {name: 'APP.SEARCH.RADIO.ALL', value: 'TYPE:\'cm:folder\' OR TYPE:\'cm:content\''},
                                {name: 'APP.SEARCH.RADIO.FOLDER', value: 'TYPE:\'cm:folder\''},
                                {name: 'APP.SEARCH.RADIO.DOCUMENT', value: 'TYPE:\'cm:content\''}
                            ]
                        }
                    }
                }
            ],
            highlight: {
                prefix: '¿',
                postfix: '?',
                mergeContiguous: true,
                fields: [
                    {
                        field: 'cm:title'
                    },
                    {
                        field: 'description',
                        prefix: '(',
                        postfix: ')'
                    }
                ]
            }
        };
    }
}
