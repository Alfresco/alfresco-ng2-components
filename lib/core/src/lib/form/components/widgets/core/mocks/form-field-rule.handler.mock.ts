/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { FormFieldRule } from '../form-field-rule';
import { RepeatableSectionModel } from '../repeatable-section.model';

export const mockRule: FormFieldRule = {
    ruleOn: 'mock-rule-on',
    entries: []
};

export const mockParentRule: FormFieldRule = {
    ruleOn: 'Text0c0ydk',
    entries: []
};

export const mockParentWithoutFields: RepeatableSectionModel = {
    id: 'mock-parent-id',
    uid: 'mock-id-Row123456789',
    fields: {},
    rowIndex: 0
};

export const mockParentWithFields: RepeatableSectionModel = {
    id: 'mock-parent-id',
    uid: 'mock-id-Row123456789',
    fields: {
        '1': [
            {
                id: 'Text0c0ydk',
                name: 'Text',
                type: 'text',
                readOnly: false,
                required: false,
                colspan: 1,
                rowspan: 1,
                placeholder: null,
                minLength: 0,
                maxLength: 0,
                regexPattern: null,
                visibilityCondition: null,
                params: {
                    existingColspan: 1,
                    maxColspan: 2
                }
            }
        ],
        '2': [
            {
                id: 'Text0c26k4',
                name: 'Text',
                type: 'text',
                readOnly: false,
                required: false,
                colspan: 1,
                rowspan: 1,
                placeholder: null,
                minLength: 0,
                maxLength: 0,
                regexPattern: null,
                visibilityCondition: null,
                params: {
                    existingColspan: 1,
                    maxColspan: 2
                }
            }
        ]
    },
    rowIndex: 0
};

export const mockParentWithSectionFields: RepeatableSectionModel = {
    id: 'mock-parent-id',
    uid: 'mock-id-Row123456789',
    fields: {
        '1': [
            {
                id: 'd376200a-7d22-4b36-bbcd-b5f11a462b3e',
                name: 'Section',
                type: 'section',
                numberOfColumns: 2,
                fields: {
                    '1': [
                        {
                            id: 'Text0c0ydk',
                            name: 'Text',
                            type: 'text',
                            readOnly: false,
                            required: false,
                            colspan: 1,
                            rowspan: 1,
                            placeholder: null,
                            minLength: 0,
                            maxLength: 0,
                            regexPattern: null,
                            visibilityCondition: null,
                            params: {
                                existingColspan: 1,
                                maxColspan: 2
                            }
                        }
                    ],
                    '2': [
                        {
                            id: 'Text0c26k4',
                            name: 'Text',
                            type: 'text',
                            readOnly: false,
                            required: false,
                            colspan: 1,
                            rowspan: 1,
                            placeholder: null,
                            minLength: 0,
                            maxLength: 0,
                            regexPattern: null,
                            visibilityCondition: null,
                            params: {
                                existingColspan: 1,
                                maxColspan: 2
                            }
                        }
                    ]
                },
                colspan: 1
            },
            {
                id: 'Text08wpzg',
                name: 'Text',
                type: 'text',
                readOnly: false,
                required: false,
                colspan: 1,
                rowspan: 1,
                placeholder: null,
                minLength: 0,
                maxLength: 0,
                regexPattern: null,
                visibilityCondition: null,
                params: {
                    existingColspan: 1,
                    maxColspan: 2
                }
            }
        ]
    },
    rowIndex: 0
};
