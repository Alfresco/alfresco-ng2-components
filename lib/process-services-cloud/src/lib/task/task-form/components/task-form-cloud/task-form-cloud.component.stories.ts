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

import { applicationConfig, Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormCloudService } from '../../../../form/public-api';
import { TaskCloudService } from '../../../services/task-cloud.service';
import { TaskFormCloudComponent } from './task-form-cloud.component';
import { TaskCloudServiceMock } from '../../../mock/task-cloud.service.mock';
import { FormCloudServiceMock } from '../../../../form/mocks/form-cloud.service.mock';
import { provideStoryProcessServicesCloud } from '../../../../stories/process-services-cloud-story.providers';
import { taskWithFormDetailsMock } from '../../../task-header/mocks/task-details-cloud.mock';
import { Observable, of } from 'rxjs';
import { FormContent } from '../../../../services/form-fields.interfaces';

const allWidgetTypesForm: FormContent = {
    formRepresentation: {
        id: 'form-all-widget-types',
        name: 'Widget Alignment Test',
        description: '',
        version: 0,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    type: 'container',
                    id: 'row-text-dropdown',
                    name: 'Label',
                    tab: '',
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                type: 'text',
                                id: 'textField',
                                name: 'Text Field',
                                colspan: 1,
                                placeholder: null,
                                value: '',
                                required: false,
                                minLength: 0,
                                maxLength: 0,
                                regexPattern: null,
                                visibilityCondition: null,
                                params: { existingColspan: 1, maxColspan: 2 }
                            }
                        ],
                        2: [
                            {
                                type: 'dropdown',
                                id: 'dropdownField',
                                name: 'Dropdown Field',
                                colspan: 1,
                                value: '',
                                required: false,
                                optionType: 'manual',
                                options: [
                                    { id: 'empty', name: 'Choose one...' },
                                    { id: 'opt1', name: 'Option 1' },
                                    { id: 'opt2', name: 'Option 2' }
                                ],
                                visibilityCondition: null,
                                params: { existingColspan: 1, maxColspan: 2 }
                            }
                        ]
                    }
                },
                {
                    type: 'container',
                    id: 'row-amount-number',
                    name: 'Label',
                    tab: '',
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                type: 'amount',
                                id: 'amountField',
                                name: 'Amount Field',
                                colspan: 1,
                                placeholder: '123',
                                value: '',
                                required: false,
                                minValue: null,
                                maxValue: null,
                                visibilityCondition: null,
                                params: { existingColspan: 1, maxColspan: 2 },
                                enableFractions: false,
                                currency: '$'
                            }
                        ],
                        2: [
                            {
                                type: 'integer',
                                id: 'numberField',
                                name: 'Number Field',
                                colspan: 1,
                                placeholder: null,
                                value: null,
                                required: false,
                                minValue: null,
                                maxValue: null,
                                visibilityCondition: null,
                                params: { existingColspan: 1, maxColspan: 2 }
                            }
                        ]
                    }
                },
                {
                    type: 'container',
                    id: 'row-date-text2',
                    name: 'Label',
                    tab: '',
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                type: 'date',
                                id: 'dateField',
                                name: 'Date Field',
                                value: null,
                                colspan: 1,
                                placeholder: null,
                                required: false,
                                minValue: null,
                                maxValue: null,
                                visibilityCondition: null,
                                params: { existingColspan: 1, maxColspan: 2 },
                                dateDisplayFormat: 'D-M-YYYY'
                            }
                        ],
                        2: [
                            {
                                type: 'text',
                                id: 'textField2',
                                name: 'Another Text',
                                colspan: 1,
                                placeholder: null,
                                value: '',
                                required: false,
                                minLength: 0,
                                maxLength: 0,
                                regexPattern: null,
                                visibilityCondition: null,
                                params: { existingColspan: 1, maxColspan: 2 }
                            }
                        ]
                    }
                }
            ],
            outcomes: [],
            metadata: {},
            variables: []
        }
    }
};

class AllWidgetTypesFormCloudServiceMock extends FormCloudServiceMock {
    override getForm(_appName: string, _formKey: string, _version?: number): Observable<FormContent> {
        return of(allWidgetTypesForm);
    }
}

const meta: Meta<TaskFormCloudComponent> = {
    component: TaskFormCloudComponent,
    title: 'Process Services Cloud/Task Cloud/Task Form/Task Form Cloud',
    decorators: [
        moduleMetadata({
            imports: [TaskFormCloudComponent],
            providers: [
                { provide: TaskCloudService, useClass: TaskCloudServiceMock },
                { provide: FormCloudService, useClass: FormCloudServiceMock }
            ]
        }),
        applicationConfig({
            providers: [...provideStoryProcessServicesCloud()]
        })
    ],
    argTypes: {
        appName: {
            control: 'text',
            description: 'App id to fetch corresponding form and values.',
            defaultValue: '',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        },
        taskId: {
            control: 'text',
            description: 'Task id to fetch corresponding form and values.',
            table: {
                type: { summary: 'string' }
            }
        },
        showTitle: {
            control: 'boolean',
            description: 'Toggle rendering of the form title.',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        showRefreshButton: {
            control: 'boolean',
            description: 'Toggle rendering of the `Refresh` button.',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        showValidationIcon: {
            control: 'boolean',
            description: 'Toggle rendering of the `Validation` icon.',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        showCancelButton: {
            control: 'boolean',
            description: 'Toggle rendering of the `Cancel` button.',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        showCompleteButton: {
            control: 'boolean',
            description: 'Toggle rendering of the `Complete` button.',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        readOnly: {
            control: 'boolean',
            description: 'Toggle readonly state of the task.',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        taskDetails: {
            control: 'object',
            description: 'Task details.',
            table: {
                type: { summary: 'TaskDetailsCloudModel' }
            }
        },
        displayModeConfigurations: {
            control: 'object',
            description: 'The available display configurations for the form.',
            table: {
                type: { summary: 'FormCloudDisplayModeConfiguration[]' }
            }
        },
        formSaved: {
            action: 'formSaved',
            description: 'Emitted when the form is saved.',
            table: { category: 'Actions' }
        },
        formCompleted: {
            action: 'formCompleted',
            description: 'Emitted when the form is submitted with the `Complete` outcome.',
            table: { category: 'Actions' }
        },
        taskCompleted: {
            action: 'taskCompleted',
            description: 'Emitted when the task is completed.',
            table: { category: 'Actions' }
        },
        taskClaimed: {
            action: 'taskClaimed',
            description: 'Emitted when the task is claimed.',
            table: { category: 'Actions' }
        },
        taskUnclaimed: {
            action: 'taskUnclaimed',
            description: 'Emitted when the task is unclaimed.',
            table: { category: 'Actions' }
        },
        candidateUsers: {
            control: 'object',
            description: 'Candidate users.',
            table: {
                type: { summary: 'string[]' },
                defaultValue: { summary: '[]' }
            }
        },
        candidateGroups: {
            control: 'object',
            description: 'Candidate groups.',
            table: {
                type: { summary: 'string[]' },
                defaultValue: { summary: '[]' }
            }
        },
        cancelClick: {
            action: 'cancelClick',
            description: 'Emitted when the cancel button is clicked.',
            table: { category: 'Actions' }
        },
        formContentClicked: {
            action: 'formContentClicked',
            description: 'Emitted when form content is clicked.',
            table: { category: 'Actions' }
        },
        error: {
            action: 'error',
            description: 'Emitted when any error occurs.',
            table: { category: 'Actions' }
        }
    }
};

export default meta;
type Story = StoryObj<TaskFormCloudComponent>;

export const DefaultTaskFormCloud: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        appName: 'app',
        taskId: 'mock-task-with-form',
        taskDetails: { ...taskWithFormDetailsMock }
    }
};

export const InvalidOrMissingApp: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        ...DefaultTaskFormCloud.args,
        appName: undefined,
        taskDetails: { ...taskWithFormDetailsMock }
    }
};

export const InvalidOrMissingTaskId: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        ...DefaultTaskFormCloud.args,
        taskId: undefined,
        taskDetails: { ...taskWithFormDetailsMock }
    }
};

export const AllWidgetTypes: Story = {
    decorators: [
        moduleMetadata({
            imports: [TaskFormCloudComponent],
            providers: [
                { provide: TaskCloudService, useClass: TaskCloudServiceMock },
                { provide: FormCloudService, useClass: AllWidgetTypesFormCloudServiceMock }
            ]
        }),
        applicationConfig({
            providers: [...provideStoryProcessServicesCloud()]
        })
    ],
    render: (args) => ({
        props: args
    }),
    args: {
        appName: 'app',
        taskId: 'mock-task-with-form',
        taskDetails: { ...taskWithFormDetailsMock }
    }
};
