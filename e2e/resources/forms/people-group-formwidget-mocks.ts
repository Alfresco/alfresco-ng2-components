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

export const peopleSingleModeFormMock = {
    formRepresentation: {
        id: 'form-d74a4136-af83-4333-ac37-a6a74ac7aa84',
        name: 'singlepeople',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: '7c9ea025-4ae6-4a5a-9184-da8f7d5c5543',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'PeopleSingleMode',
                                name: 'People',
                                type: 'people',
                                readOnly: false,
                                required: false,
                                colspan: 1,
                                optionType: 'single',
                                visibilityCondition: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                }
                            }
                        ],
                        2: []
                    }
                }
            ],
            outcomes: [],
            metadata: {},
            variables: []
        }
    }
};

export const peopleMultipleModeFormMock = {
    formRepresentation: {
        id: 'form-0fec4293-a33a-4408-923c-ba2d0645459c',
        name: 'people',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: '44e485d4-c286-425a-b488-3fda1707d319',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'PeopleMultipleMode',
                                name: 'People',
                                type: 'people',
                                readOnly: false,
                                required: false,
                                colspan: 1,
                                optionType: 'multiple',
                                visibilityCondition: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                }
                            }
                        ],
                        2: []
                    }
                }
            ],
            outcomes: [],
            metadata: {},
            variables: [
                {
                    id: 'd6060d6b-1cb0-45dc-a18b-4d7898a9a5ad',
                    name: 'people',
                    type: 'string',
                    value: 'user1'
                }
            ]
        }
    }
};

export const peopleRequiredFormMock = {
    formRepresentation: {
        id: 'form-0fec4293-a33a-4408-923c-ba2d0645459c',
        name: 'people',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: '44e485d4-c286-425a-b488-3fda1707d319',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'PeopleRequired',
                                name: 'People',
                                type: 'people',
                                readOnly: false,
                                required: true,
                                colspan: 1,
                                optionType: 'single',
                                visibilityCondition: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                }
                            }
                        ],
                        2: []
                    }
                }
            ],
            outcomes: [],
            metadata: {},
            variables: [
                {
                    id: 'd6060d6b-1cb0-45dc-a18b-4d7898a9a5ad',
                    name: 'people',
                    type: 'string',
                    value: 'user1'
                }
            ]
        }
    }
};

export const groupSingleModeFormMock = {
    formRepresentation: {
        id: 'form-0fec4293-a33a-4408-923c-ba2d0645459c',
        name: 'people',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: 'abccf2c9-b526-45c7-abd4-b969bdf8ce15',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'GroupSingleMode',
                                name: 'Group of people',
                                type: 'functional-group',
                                readOnly: false,
                                required: false,
                                colspan: 1,
                                optionType: 'single',
                                visibilityCondition: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                }
                            }
                        ],
                        2: []
                    }
                }
            ],
            outcomes: [],
            metadata: {},
            variables: [
                {
                    id: 'd6060d6b-1cb0-45dc-a18b-4d7898a9a5ad',
                    name: 'people',
                    type: 'string',
                    value: 'user1'
                }
            ]
        }
    }
};

export const groupMultipleModeFormMock = {
    formRepresentation: {
        id: 'form-0fec4293-a33a-4408-923c-ba2d0645459c',
        name: 'people',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: 'abccf2c9-b526-45c7-abd4-b969bdf8ce15',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'GroupMultipleMode',
                                name: 'Group of people',
                                type: 'functional-group',
                                readOnly: false,
                                required: false,
                                colspan: 1,
                                optionType: 'multiple',
                                visibilityCondition: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                }
                            }
                        ],
                        2: []
                    }
                }
            ],
            outcomes: [],
            metadata: {},
            variables: [
                {
                    id: 'd6060d6b-1cb0-45dc-a18b-4d7898a9a5ad',
                    name: 'people',
                    type: 'string',
                    value: 'user1'
                }
            ]
        }
    }
};

export const groupRequiredFormMock = {
    formRepresentation: {
        id: 'form-0fec4293-a33a-4408-923c-ba2d0645459c',
        name: 'people',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: 'abccf2c9-b526-45c7-abd4-b969bdf8ce15',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'GroupRequired',
                                name: 'Group of people',
                                type: 'functional-group',
                                readOnly: false,
                                required: true,
                                colspan: 1,
                                optionType: 'single',
                                visibilityCondition: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                }
                            }
                        ],
                        2: []
                    }
                }
            ],
            outcomes: [],
            metadata: {},
            variables: [
                {
                    id: 'd6060d6b-1cb0-45dc-a18b-4d7898a9a5ad',
                    name: 'people',
                    type: 'string',
                    value: 'user1'
                }
            ]
        }
    }
};

export const peopleReadOnlyFormMock = {
    formRepresentation: {
        id: 'form-0fec4293-a33a-4408-923c-ba2d0645459c',
        name: 'people',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: '44e485d4-c286-425a-b488-3fda1707d319',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'PeopleReadOnly',
                                name: 'People',
                                type: 'people',
                                readOnly: true,
                                required: false,
                                colspan: 1,
                                optionType: 'single',
                                visibilityCondition: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                }
                            }
                        ],
                        2: []
                    }
                }
            ],
            outcomes: [],
            metadata: {},
            variables: [
                {
                    id: 'd6060d6b-1cb0-45dc-a18b-4d7898a9a5ad',
                    name: 'people',
                    type: 'string',
                    value: 'user1'
                }
            ]
        }
    }
};

export const groupReadOnlyFormMock = {
    formRepresentation: {
        id: 'form-0fec4293-a33a-4408-923c-ba2d0645459c',
        name: 'people',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: 'abccf2c9-b526-45c7-abd4-b969bdf8ce15',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'GroupReadOnly',
                                name: 'Group of people',
                                type: 'functional-group',
                                readOnly: true,
                                required: false,
                                colspan: 1,
                                optionType: 'single',
                                visibilityCondition: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                }
                            }
                        ],
                        2: []
                    }
                }
            ],
            outcomes: [],
            metadata: {},
            variables: [
                {
                    id: 'd6060d6b-1cb0-45dc-a18b-4d7898a9a5ad',
                    name: 'people',
                    type: 'string',
                    value: 'user1'
                }
            ]
        }
    }
};
