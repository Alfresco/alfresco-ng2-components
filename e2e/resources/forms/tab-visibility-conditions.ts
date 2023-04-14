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

const createField = (id = 'TextTwo', name = 'TextTwo') => ({
    id,
    name,
    type: 'text',
    required: false,
    colspan: 1,
    placeholder: null,
    minLength: 0,
    maxLength: 0,
    regexPattern: null,
    visibilityCondition: null,
    params: {
        existingColspan: 1,
        maxColspan: 2
    }
});

const createFieldDefinition = (id = 'dcde7e13-2444-48bc-ab30-32902cea549e', tabName = '71da814d-5580-4f1f-972a-8089253aeded', fields = {
    1: [createField()],
    2: []
}) => ({
    id,
    name: 'Label',
    type: 'container',
    tab: tabName,
    numberOfColumns: 2,
    fields
});

const fieldDefinition1 = createFieldDefinition();
const fieldDefinition2 = createFieldDefinition('1308e433-08ce-4448-a62a-0accc1187d15', '0e538a28-f8d6-4cb8-ae93-dbfb2efdf3b1', {
    1: [createField('TextOne', 'TextOne')],
    2: []
});
const fieldDefinition3 = createFieldDefinition('df452297-d0e8-4406-b9d3-10842033549d', '442eea0b-65f9-484e-b37f-f5a91d5e1f21', {
    1: [createField('TextOne', 'TextOne')],
    2: [createField('TextThree', 'TextThree')]
});

const fieldsDefinitions1 = [fieldDefinition1, fieldDefinition2];
const fieldsDefinitions2 = [fieldDefinition1, fieldDefinition3];

const createVisibilityCondition = (leftType = 'field', leftValue = 'TextOne', nextCondition?: any, rightValue = 'showTab', rightType = 'value', operator = '==') => ({
    leftType,
    leftValue,
    operator,
    rightValue,
    rightType,
    nextConditionOperator: nextCondition ? 'and' : '',
    nextCondition
});

const createTab = (id = '71da814d-5580-4f1f-972a-8089253aeded', title = 'tabBasicFieldValue', visibilityCondition = createVisibilityCondition('field', 'TextOne', null)) => ({
    id,
    title,
    visibilityCondition
});

const createTabVisibilityJson = (tabs = [
    createTab(),
    createTab('442eea0b-65f9-484e-b37f-f5a91d5e1f21', 'tabWithFields', null)
], fields = [
    createFieldDefinition(),
    createFieldDefinition('df452297-d0e8-4406-b9d3-10842033549d', '442eea0b-65f9-484e-b37f-f5a91d5e1f21', {
        1: [
            {
                id: 'TextOne',
                name: 'TextOne',
                type: 'text',
                required: false,
                colspan: 1,
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
        2: []
    })
], variables = []) => ({
    formRepresentation: {
        id: 'form-3aff57d3-62af-4adf-9b14-1d8f44a28077',
        name: 'tabvisibility',
        description: '',
        version: 0,
        standalone: true,
        formDefinition: {
            tabs,
            fields,
            outcomes: [],
            metadata: {},
            variables
        }
    }
});

export const tabFieldValueVisibilityJson = createTabVisibilityJson();

export const tabVarValueVisibilityJson = createTabVisibilityJson([
    createTab('71da814d-5580-4f1f-972a-8089253aeded', 'tabBasicVarValue', createVisibilityCondition('variable', 'stringVar'))
], [fieldDefinition1], [
    {
        id: '803269e6-a568-40e2-aec3-75ad2f411688',
        name: 'stringVar',
        type: 'string',
        value: 'showTab'
    }
]);

export const tabVarFieldVisibilityJson = createTabVisibilityJson([
    createTab(
        '71da814d-5580-4f1f-972a-8089253aeded',
        'tabBasicVarField',
        createVisibilityCondition('variable', 'stringVar', undefined, 'TextOne', 'field')
    ),
    createTab('0e538a28-f8d6-4cb8-ae93-dbfb2efdf3b1', 'tabWithFields', null)
], fieldsDefinitions1, [
    {
        id: '803269e6-a568-40e2-aec3-75ad2f411688',
        name: 'stringVar',
        type: 'string',
        value: 'showTab'
    }
]);

export const tabFieldFieldVisibilityJson = createTabVisibilityJson([
    createTab(
        '71da814d-5580-4f1f-972a-8089253aeded',
        'tabBasicFieldField',
        createVisibilityCondition('field', 'TextThree', undefined, 'TextOne', 'field')
    ),
    createTab('442eea0b-65f9-484e-b37f-f5a91d5e1f21', 'tabWithFields', null)
], fieldsDefinitions2);

export const tabFieldVarVisibilityJson = createTabVisibilityJson([
    createTab(
        '71da814d-5580-4f1f-972a-8089253aeded',
        'tabBasicVarField',
        createVisibilityCondition('field', 'TextOne', undefined, 'stringVar', 'variable')
    ),
    createTab('0e538a28-f8d6-4cb8-ae93-dbfb2efdf3b1', 'tabWithFields', null)
], fieldsDefinitions1, [
    {
        id: '803269e6-a568-40e2-aec3-75ad2f411688',
        name: 'stringVar',
        type: 'string',
        value: 'showTab'
    }
]);

export const tabVarVarVisibilityJson = createTabVisibilityJson([
    createTab(
        'ef512cb3-0c41-4d12-84ef-a7ef8f0b111a',
        'tabBasicVarVar',
        createVisibilityCondition('variable', 'showTabOne', undefined, 'showTabTwo', 'variable')
    )
], [
    createFieldDefinition('6eeb9e54-e51d-44f3-9557-503308f07361', 'ef512cb3-0c41-4d12-84ef-a7ef8f0b111a', {
        1: [createField('TextOne', 'TextOne')],
        2: []
    })
], [
    {
        id: 'b116df99-f6b5-45f8-b48c-15b74f7f1c92',
        name: 'showTabOne',
        type: 'string',
        value: 'showTab'
    },
    {
        id: '6e3e88ab-848c-4f48-8326-a404d1427f60',
        name: 'showTabTwo',
        type: 'string',
        value: 'showTab'
    }
]);

export const tabNextOperatorsVisibilityJson = createTabVisibilityJson([
    createTab(
        '71da814d-5580-4f1f-972a-8089253aeded',
        'tabNextOperators',
        createVisibilityCondition('field', 'TextOne', createVisibilityCondition('field', 'TextThree', null, 'showTab', 'value', '!='))
    ),
    createTab('442eea0b-65f9-484e-b37f-f5a91d5e1f21', 'tabWithFields', null)
], fieldsDefinitions2);
