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

import { SearchCategory } from '../search';

export const expandableCategories = [
    {
        id: 'cat-1',
        name: 'category-1',
        expanded: false,
        enabled: false,
        component: {
            selector: 'cat-1-component',
            settings: null
        }
    }
];

export const disabledCategories = [
    {
        id: 'queryType',
        name: 'Type',
        expanded: true,
        enabled: false,
        component: {
            selector: 'check-list',
            settings: {
                field: null,
                pageSize: 5,
                options: [
                    { name: 'Folder', value: `TYPE:'cm:folder'` },
                    { name: 'Document', value: `TYPE:'cm:content'` }
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
                field: null,
                pageSize: 5,
                options: [
                    { name: 'Folder', value: `TYPE:'cm:folder'` },
                    { name: 'Document', value: `TYPE:'cm:content'` }
                ]
            }
        }
    }
];

export const simpleCategories: SearchCategory[] = [
    {
        id: 'queryName',
        name: 'Name',
        expanded: false,
        enabled: true,
        component: {
            selector: 'text',
            settings: {
                field: ''
            }
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
                field: 'check-list',
                pageSize: 5,
                options: [
                    { name: 'Folder', value: `TYPE:'cm:folder'` },
                    { name: 'Document', value: `TYPE:'cm:content'` }
                ]
            }
        }
    }

];

export const searchFilter = {
    'app:fields': [
        'cm:name'
    ],
    include: [
        'allowableOperations'
    ],
    sorting: {
        options: [
            {
                key: 'name',
                label: 'Name',
                type: 'FIELD',
                field: 'cm:name',
                ascending: true
            }
        ],
        defaults: [
            {
                key: 'score',
                type: 'FIELD',
                field: 'score',
                ascending: false
            }
        ]
    },
    resetButton: true,
    filterQueries: [
        {
            query: `TYPE:'cm:folder' OR TYPE:'cm:content'`
        },
        {
            query: 'NOT cm:creator:System'
        }
    ],
    facetFields: {
        expanded: true,
        fields: [
            {
                field: 'content.mimetype',
                mincount: 1,
                label: 'SEARCH.FACET_FIELDS.TYPE'
            },
            {
                field: 'content.size',
                mincount: 1,
                label: 'SEARCH.FACET_FIELDS.SIZE'
            },
            {
                field: 'creator',
                mincount: 1,
                label: 'SEARCH.FACET_FIELDS.CREATOR'
            },
            {
                field: 'modifier',
                mincount: 1,
                label: 'SEARCH.FACET_FIELDS.MODIFIER'
            },
            {
                field: 'created',
                mincount: 1,
                label: 'SEARCH.FACET_FIELDS.CREATED'
            }
        ]
    },
    facetQueries: {
        label: 'SEARCH.FACET_QUERIES.MY_FACET_QUERIES',
        pageSize: 5,
        expanded: true,
        mincount: 1,
        queries: [
            {
                query: 'created:2019',
                label: 'SEARCH.FACET_QUERIES.CREATED_THIS_YEAR'
            },
            {
                query: 'content.mimetype:text/html',
                label: 'SEARCH.FACET_QUERIES.MIMETYPE',
                group: 'Type facet queries'
            },
            {
                query: 'content.size:[0 TO 10240]',
                label: 'Extra Small',
                group: 'Size facet queries'
            },
            {
                query: 'content.size:[10240 TO 102400]',
                label: 'SEARCH.FACET_QUERIES.SMALL',
                group: 'Size facet queries'
            },
            {
                query: 'content.size:[102400 TO 1048576]',
                label: 'SEARCH.FACET_QUERIES.MEDIUM',
                group: 'Size facet queries'
            },
            {
                query: 'content.size:[1048576 TO 16777216]',
                label: 'SEARCH.FACET_QUERIES.LARGE',
                group: 'Size facet queries'
            },
            {
                query: 'content.size:[16777216 TO 134217728]',
                label: 'SEARCH.FACET_QUERIES.XTRALARGE',
                group: 'Size facet queries'
            },
            {
                query: 'content.size:[134217728 TO MAX]',
                label: 'SEARCH.FACET_QUERIES.XXTRALARGE',
                group: 'Size facet queries'
            },
            {
                query: 'content.size:[111111 TO MAX]',
                label: 'my1',
                group: 'Size facet queries'
            },
            {
                query: 'content.size:[222222 TO MAX]',
                label: 'my2',
                group: 'Size facet queries'
            },
            {
                query: 'content.size:[333333 TO MAX]',
                label: 'my3',
                group: 'Size facet queries'
            },
            {
                query: 'content.size:[444444 TO MAX]',
                label: 'my4',
                group: 'Size facet queries'
            },
            {
                query: 'content.size:[5555 TO MAX]',
                label: 'my5',
                group: 'Size facet queries'
            },
            {
                query: 'content.size:[666666 TO MAX]',
                label: 'my6',
                group: 'Size facet queries'
            },
            {
                query: 'content.size:[777777 TO MAX]',
                label: 'my7',
                group: 'Size facet queries'
            },
            {
                query: 'content.size:[888888 TO MAX]',
                label: 'my8',
                group: 'Size facet queries'
            }
        ]
    },
    facetIntervals: {
        expanded: true,
        intervals: [
            {
                label: 'The Created',
                field: 'cm:created',
                sets: [
                    {
                        label: 'lastYear',
                        start: '2018',
                        end: '2019',
                        endInclusive: false
                    },
                    {
                        label: 'currentYear',
                        start: 'NOW/YEAR',
                        end: 'NOW/YEAR+1YEAR'
                    },
                    {
                        label: 'earlier',
                        start: '*',
                        end: '2018',
                        endInclusive: false
                    }
                ]
            },
            {
                label: 'TheModified',
                field: 'cm:modified',
                sets: [
                    {
                        label: '2017',
                        start: '2017',
                        end: '2018',
                        endInclusive: false
                    },
                    {
                        label: '2017-2018',
                        start: '2017',
                        end: '2018',
                        endInclusive: true
                    },
                    {
                        label: 'currentYear',
                        start: 'NOW/YEAR',
                        end: 'NOW/YEAR+1YEAR'
                    },
                    {
                        label: 'earlierThan2017',
                        start: '*',
                        end: '2017',
                        endInclusive: false
                    }
                ]
            }
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
                    pattern: `cm:name:'(.*?)'`,
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
                    options: []
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
                    options: []
                }
            }
        }
    ]
};

export const mockSearchResult = {
    list: {
        pagination: { count: 20, hasMoreItems: true, totalItems: 20284, skipCount: 0, maxItems: 20 },
        context: {
            consistency: { lastTxId: 122854 },
            facets: [
                {
                    type: 'query',
                    label: 'Type facet queries',
                    buckets: [
                        {
                            label: 'SEARCH.FACET_QUERIES.MIMETYPE',
                            filterQuery: 'content.mimetype:text/html',
                            metrics: [{ type: 'count', value: { count: 13 } }]
                        }]
                }, {
                    type: 'query',
                    label: 'Size facet queries',
                    buckets: [
                        {
                            label: 'my1',
                            filterQuery: 'content.size:[111111 TO MAX]',
                            metrics: [{ type: 'count', value: { count: 806 } }]
                        }, {
                            label: 'my3',
                            filterQuery: 'content.size:[333333 TO MAX]',
                            metrics: [{ type: 'count', value: { count: 669 } }]
                        }, {
                            label: 'my2',
                            filterQuery: 'content.size:[222222 TO MAX]',
                            metrics: [{ type: 'count', value: { count: 691 } }]
                        }, {
                            label: 'my5',
                            filterQuery: 'content.size:[5555 TO MAX]',
                            metrics: [{ type: 'count', value: { count: 1866 } }]
                        }, {
                            label: 'my4',
                            filterQuery: 'content.size:[444444 TO MAX]',
                            metrics: [{ type: 'count', value: { count: 665 } }]
                        }, {
                            label: 'my7',
                            filterQuery: 'content.size:[777777 TO MAX]',
                            metrics: [{ type: 'count', value: { count: 641 } }]
                        }, {
                            label: 'SEARCH.FACET_QUERIES.SMALL',
                            filterQuery: 'content.size:[10240 TO 102400]',
                            metrics: [{ type: 'count', value: { count: 526 } }]
                        }, {
                            label: 'my6',
                            filterQuery: 'content.size:[666666 TO MAX]',
                            metrics: [{ type: 'count', value: { count: 652 } }]
                        }, {
                            label: 'SEARCH.FACET_QUERIES.XTRALARGE',
                            filterQuery: 'content.size:[16777216 TO 134217728]',
                            metrics: [{ type: 'count', value: { count: 617 } }]
                        }, {
                            label: 'my8',
                            filterQuery: 'content.size:[888888 TO MAX]',
                            metrics: [{ type: 'count', value: { count: 641 } }]
                        }, {
                            label: 'SEARCH.FACET_QUERIES.XXTRALARGE',
                            filterQuery: 'content.size:[134217728 TO MAX]',
                            metrics: [{ type: 'count', value: { count: 0 } }]
                        }, {
                            label: 'SEARCH.FACET_QUERIES.MEDIUM',
                            filterQuery: 'content.size:[102400 TO 1048576]',
                            metrics: [{ type: 'count', value: { count: 630 } }]
                        }, {
                            label: 'SEARCH.FACET_QUERIES.LARGE',
                            filterQuery: 'content.size:[1048576 TO 16777216]',
                            metrics: [{ type: 'count', value: { count: 23 } }]
                        }, {
                            label: 'Extra Small',
                            filterQuery: 'content.size:[0 TO 10240]',
                            metrics: [{ type: 'count', value: { count: 10239 } }]
                        }]
                }, {
                    type: 'query',
                    label: 'SEARCH.FACET_QUERIES.MY_FACET_QUERIES',
                    buckets: [
                        {
                            label: 'SEARCH.FACET_QUERIES.CREATED_THIS_YEAR',
                            filterQuery: 'created:2019',
                            metrics: [{ type: 'count', value: { count: 0 } }]
                        }]
                },
                {
                    type: 'field',
                    label: 'SEARCH.FACET_FIELDS.SIZE',
                    buckets: []
                }, {
                    type: 'field',
                    label: 'SEARCH.FACET_FIELDS.CREATED',
                    buckets: []
                }, {
                    type: 'field',
                    label: 'SEARCH.FACET_FIELDS.TYPE',
                    buckets: []
                }, {
                    type: 'field',
                    label: 'SEARCH.FACET_FIELDS.MODIFIER',
                    buckets: []
                }, {
                    type: 'field',
                    label: 'SEARCH.FACET_FIELDS.CREATOR',
                    buckets: []
                }, {
                    type: 'interval',
                    label: 'TheModified',
                    buckets: []
                }, {
                    type: 'interval',
                    label: 'The Created',
                    buckets: []
                }]
        }
    }
};

export const stepOne = [
    'Extra Small (10239)',
    'SEARCH.FACET_QUERIES.SMALL (526)',
    'SEARCH.FACET_QUERIES.MEDIUM (630)',
    'SEARCH.FACET_QUERIES.LARGE (23)',
    'SEARCH.FACET_QUERIES.XTRALARGE (617)'
];

export const stepTwo = [
    'Extra Small (10239)',
    'SEARCH.FACET_QUERIES.SMALL (526)',
    'SEARCH.FACET_QUERIES.MEDIUM (630)',
    'SEARCH.FACET_QUERIES.LARGE (23)',
    'SEARCH.FACET_QUERIES.XTRALARGE (617)',
    'my1 (806)',
    'my2 (691)',
    'my3 (669)',
    'my4 (665)',
    'my5 (1866)'
];

export const stepThree = [
    'Extra Small (10239)',
    'SEARCH.FACET_QUERIES.SMALL (526)',
    'SEARCH.FACET_QUERIES.MEDIUM (630)',
    'SEARCH.FACET_QUERIES.LARGE (23)',
    'SEARCH.FACET_QUERIES.XTRALARGE (617)',
    'my1 (806)',
    'my2 (691)',
    'my3 (669)',
    'my4 (665)',
    'my5 (1866)',
    'my6 (652)',
    'my7 (641)',
    'my8 (641)'
];

export const sizeOptions = [
    {
        name: 'Extra Small (10239)',
        value: 'Extra Small (10239)'
    },
    {
        name: 'SEARCH.FACET_QUERIES.SMALL (526)',
        value: 'SEARCH.FACET_QUERIES.SMALL (526)'
    },
    {
        name: 'SEARCH.FACET_QUERIES.MEDIUM (630)',
        value: 'SEARCH.FACET_QUERIES.MEDIUM (630)'
    },
    {
        name: 'SEARCH.FACET_QUERIES.LARGE (23)',
        value: 'SEARCH.FACET_QUERIES.LARGE (23)'
    },
    {
        name: 'SEARCH.FACET_QUERIES.XTRALARGE (617)',
        value: 'SEARCH.FACET_QUERIES.XTRALARGE (617)'
    },
    {
        name: 'my1 (806)',
        group: 'my1 (806)'
    },
    {
        name: 'my2 (691)',
        value: 'my2 (691)'
    },
    {
        name: 'my3 (669)',
        value: 'my3 (669)'
    },
    {
        name: 'my4 (665)',
        value: 'my4 (665)'
    },
    {
        name: 'my5 (1866)',
        group: 'my5 (1866)'
    },
    {
        name: 'my6 (652)',
        group: 'my6 (652)'
    },
    {
        name: 'my7 (641)',
        value: 'my7 (641)'
    },
    {
        name: 'my8 (641)',
        value: 'my8 (641)'
    }
];

export const filteredResult = [
    'my1 (806)',
    'my2 (691)',
    'my3 (669)',
    'my4 (665)',
    'my5 (1866)'
];

export const mockContentSizeResponseBucket = {
        label: '5875',
        filterQuery: 'content.size:5875',
        metrics: [
            {
                type: 'count',
                value: {
                    count: 364
                }
            }
        ]
    };

export const getMockSearchResultWithResponseBucket = () => {
    const cloneResult = JSON.parse(JSON.stringify( mockSearchResult));
    cloneResult.list.context.facets[3].buckets.push(mockContentSizeResponseBucket);
    return cloneResult;
};
