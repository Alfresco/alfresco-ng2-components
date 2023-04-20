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

import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { FormCloudService } from '../../../form/public-api';
import { TaskCloudService } from '../../services/task-cloud.service';
import { TaskFormModule } from '../task-form.module';
import { TaskFormCloudComponent } from './task-form-cloud.component';
import { TaskCloudServiceMock } from '../../mock/task-cloud.service.mock';
import { FormCloudServiceMock } from '../../../form/mocks/form-cloud.service.mock';
import { ProcessServicesCloudStoryModule } from '../../../testing/process-services-cloud-story.module';

export default {
    component: TaskFormCloudComponent,
    title: 'Process Services Cloud/Task Cloud/Task Form/Task Form Cloud',
    decorators: [
        moduleMetadata({
            imports: [ProcessServicesCloudStoryModule, TaskFormModule],
            providers: [
                { provide: TaskCloudService, useClass: TaskCloudServiceMock },
                { provide: FormCloudService, useClass: FormCloudServiceMock }
            ]
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
            description: 'mitted when the task is unclaimed.',
            table: { category: 'Actions' }
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
} as Meta;

const template: Story<TaskFormCloudComponent> = (args: TaskFormCloudComponent) => ({
    props: args
});

export const defaultTaskFormCloud = template.bind({});
defaultTaskFormCloud.args = {
    appName: 'app',
    taskId: 'mock-task-with-form'
};

export const invalidOrMissingApp = template.bind({});
invalidOrMissingApp.args = {
    ...defaultTaskFormCloud.args,
    appName: undefined
};

export const invalidOrMissingTaskId = template.bind({});
invalidOrMissingTaskId.args = {
    ...defaultTaskFormCloud.args,
    taskId: undefined
};
