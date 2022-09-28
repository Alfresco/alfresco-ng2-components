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

import { FormFieldModel, FormModel } from '../widgets';

export const fakeForm = new FormModel();

export const booleanData = new FormFieldModel(fakeForm, {
    id: 'booleanField',
    name: 'Checkbox',
    type: 'boolean'
});

export const dateData = new FormFieldModel(fakeForm, {
    id: 'dateField',
    value: Date.now(),
    type: 'date'
});

export const processCloudDateData = new FormFieldModel(fakeForm, {
    id: 'processCloudDateField',
    value: Date.now(),
    type: 'process-cloud-date'
});

export const datetimeData = new FormFieldModel(fakeForm, {
    id: 'dateField',
    value: Date.now(),
    type: 'datetime'
});

export const readonlyData = new FormFieldModel(fakeForm, {
    id: 'readOnlyField',
    value: 'Read only field',
    type: 'readonly'
});

export const readonlyTextData = new FormFieldModel(fakeForm, {
    id: 'readOnlyTextField',
    value: 'Read only text field',
    type: 'readonly-text'
});

export const integerData = new FormFieldModel(fakeForm, {
    id: 'integerField',
    value: 21,
    name: 'Type only integer',
    type: 'integer'
});

export const peopleData = new FormFieldModel(fakeForm, {
    id: 'peopleField',
    value: 'Users',
    name: 'Users',
    type: 'people'
});

export const uploadData = new FormFieldModel(fakeForm, {
    id: 'uploadField',
    type: 'upload'
});

export const processUploadData = new FormFieldModel(fakeForm, {
    id: 'processUploadField',
    type: 'process-upload'
});

export const processCloudUploadData = new FormFieldModel(fakeForm, {
    id: 'processCloudUploadField',
    type: 'process-cloud-upload',
    params: {
        existingColspan: 1,
        maxColspan: 2,
        fileSource: {
            serviceId: 'alfresco-content',
            name: 'Alfresco Content',
            metadataAllowed: false
        },
        multiple: true,
        menuOptions: {
            show: false,
            download: false,
            retrieveMetadata: false,
            remove: true
        },
        link: false
    }
});

export const processCloudPeopleData = new FormFieldModel(fakeForm, {
    id: 'processCloudPeopleField',
    value: null,
    name: 'Users',
    type: 'process-cloud-people'
});

export const textData = new FormFieldModel(fakeForm, {
    id: 'textField',
    name: 'Text Field',
    value: 'Text field',
    type: 'text'
});

export const unknownData = new FormFieldModel(fakeForm, { id: 'unknownType' });

export const amountData = new FormFieldModel(fakeForm, {
    id: 'amountField',
    value: 512,
    type: 'amount',
    name: 'Amount',
    minValue: '0',
    maxValue: '1024'
});

export const dropdownData = new FormFieldModel(fakeForm, {
    id: 'dropdownField',
    value: '1',
    options: [
        { id: '1', name: 'Item #1' },
        { id: '2', name: 'Item #2' },
        { id: '3', name: 'Item #3' }
    ],
    type: 'dropdown'
});

export const processCloudDropdownData = new FormFieldModel(fakeForm, {
    id: 'processCloudDropdownField',
    value: '1',
    options: [
        { id: '1', name: 'Cloud Item #1' },
        { id: '2', name: 'Cloud Item #2' },
        { id: '3', name: 'Cloud Item #3' }
    ],
    type: 'process-cloud-dropdown'
});

export const multiLineTextData = new FormFieldModel(fakeForm, {
    id: 'multiLineTextField',
    value: 'Multi\nLine\nText\nField',
    type: 'multi-line-text'
});

export const functionalGroupData = new FormFieldModel(fakeForm, {
    id: 'functionalGroupField',
    placeholder: 'Group name (Admins, Users)',
    type: 'functional-group'
});

export const processCloudFunctionalGroupData = new FormFieldModel(fakeForm, {
    id: 'processCloudFunctionalGroupField',
    placeholder: 'Group name',
    type: 'process-cloud-functional-group'
});

export const hyperlinkData = new FormFieldModel(fakeForm, {
    id: 'hyperlinkField',
    value: 'https://www.alfresco.com/',
    displayText: 'Alfresco hyperlink',
    type: 'hyperlink'
});

export const radioButtonsData = new FormFieldModel(fakeForm, {
    id: 'radioButtonsField',
    options: [
        { id: '1', name: 'Item #1' },
        { id: '2', name: 'Item #2' },
        { id: '3', name: 'Item #3' }
    ],
    type: 'radio-buttons'
});

export const dynamicTableData = new FormFieldModel(fakeForm, {
    id: 'dynamicTableField',
    type: 'dynamic-table',
    params: {
        existingColspan: 1,
        maxColspan: 1
    },
    layout: {
        row: -1,
        column: -1,
        colspan: 2
    },
    sizeX: 2,
    sizeY: 2,
    row: -1,
    col: -1,
    columnDefinitions: [
        {
            id: 'id',
            name: 'id',
            type: 'String',
            required: true,
            editable: true,
            sortable: true,
            visible: true
        },
        {
            id: 'name',
            name: 'name',
            type: 'String',
            required: true,
            editable: true,
            sortable: true,
            visible: true
        }
    ]
});

export const groupData = new FormFieldModel(fakeForm, {
    id: 'groupField',
    name: 'Group (Header) section field',
    value: 'users',
    type: 'group',
    fields: {
        1: [textData, amountData, integerData]
    }
});

export const selectFolderData = new FormFieldModel(fakeForm, {
    id: 'selectFolder',
    name: 'Select Folder',
    type: 'select-folder',
    value: null,
    params: {
        folderSource: {
            selectedFolder: {
                pathId: '-my-'
            }
        }
    }
});

export const fileViewerData = new FormFieldModel(fakeForm, {
    id: 'fileViewer',
    name: 'File viewer',
    type: 'file-viewer',
    readOnly: false,
    required: false,
    colspan: 1,
    value: 'loremIpsumPdfNode',
    visibilityCondition: null
});

export const documentData = new FormFieldModel(fakeForm, {
    id: 'document',
    name: 'Document',
    type: 'document',
    readOnly: false,
    required: false,
    colspan: 1,
    value: {
        id: 'test'
    }
});

export const jsonData = new FormFieldModel(fakeForm, {
    id: 'json',
    name: 'json',
    type: 'json',
    readOnly: false,
    required: false,
    colspan: 1,
    value: {
        widget: {
            debug: 'on',
            window: {
                title: 'Sample JSON Widget',
                name: 'main_window',
                width: 500,
                height: 500
            },
            image: {
                src: 'Images/Sun.png',
                name: 'sun1',
                hOffset: 250,
                vOffset: 250,
                alignment: 'center'
            },
            text: {
                data: 'Click Here',
                size: 36,
                style: 'bold',
                name: 'text1',
                hOffset: 250,
                vOffset: 100,
                alignment: 'center',
                onMouseUp: 'sun1.opacity = (sun1.opacity / 100) * 90;'
            }
        }
    }
});

export const typeaheadData = new FormFieldModel(
    new FormModel({
        processVariables: [
            { name: 'typeahead-id_LABEL', value: 'FakeProcessValue' }
        ],
        taskId: 999
    }),
    {
        id: 'typeahead-id',
        name: 'Typeahead',
        type: 'typeahead',
        params: {
            field: {
                id: 'typeahead-id',
                name: 'typeahead-name',
                type: 'typeahead'
            }
        },
        restUrl: 'https://jsonplaceholder.typicode.com/users',
        restResponsePath: null,
        restIdProperty: 'typeahead-id',
        restLabelProperty: 'typeahead-name'
    }
);

export const containerData = new FormFieldModel(fakeForm, {
    id: 'test',
    name: 'test',
    type: 'container',
    tab: null,
    fields: {
        1: [
            {
                id: 'textField',
                name: 'Text field 1',
                value: 'Fields',
                type: 'text'
            },
            { id: 'textField', value: 'inside', type: 'text' },
            {
                id: 'textField',
                name: 'Text field 3',
                value: 'container field',
                type: 'text'
            }
        ],
        2: [
            {
                id: 'integerField',
                value: 123,
                name: 'Integer field 1',
                type: 'integer'
            },
            { id: 'integerField', value: 321, type: 'integer' },
            {
                id: 'integerField',
                value: 999,
                name: 'Integer field 3',
                type: 'integer'
            }
        ],
        3: [
            {
                id: 'readOnlyField',
                name: 'Readonly field 1',
                value: 'Fields',
                type: 'readonly'
            },
            { id: 'readOnlyField', value: 'inside', type: 'readonly' },
            {
                id: 'readOnlyField',
                name: 'Readonly field 3',
                value: 'field',
                type: 'readonly'
            }
        ]
    }
});
