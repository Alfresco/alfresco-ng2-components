/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { TaskHeaderCloudComponent } from './task-header-cloud.component';
import { TaskCloudService } from '../../services/task-cloud.service';
import { TaskCloudServiceMock } from '../../mock/task-cloud.service.mock';
import { ProcessServicesCloudStoryModule } from '../../../testing/process-services-cloud-story.module';
import { importProvidersFrom } from '@angular/core';

export default {
    component: TaskHeaderCloudComponent,
    title: 'Process Services Cloud/Task Cloud/Task Header Cloud/Task Header Cloud',
    decorators: [
        moduleMetadata({
            imports: [TaskHeaderCloudComponent],
            providers: [{ provide: TaskCloudService, useClass: TaskCloudServiceMock }]
        }),
        applicationConfig({
            providers: [importProvidersFrom(ProcessServicesCloudStoryModule)]
        })
    ],
    argTypes: {
        appName: {
            control: 'text',
            description: '(Required) The name of the application.',
            defaultValue: '',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        },
        taskId: {
            control: 'text',
            description: '(Required) The id of the task.',
            table: {
                type: { summary: 'string' }
            }
        },
        showTitle: {
            control: 'boolean',
            description: 'Show/Hide the task title.',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        claim: {
            action: 'claim',
            description: 'Emitted when the task is claimed.',
            table: { category: 'Actions' }
        },
        unclaim: {
            action: 'unclaim',
            description: 'Emitted when the task is unclaimed (ie, requeued).',
            table: { category: 'Actions' }
        },
        error: {
            action: 'error',
            description: 'Emitted when the given task has errors.',
            table: { category: 'Actions' }
        }
    }
} as Meta<TaskHeaderCloudComponent>;

const template: StoryFn<TaskHeaderCloudComponent> = (args) => ({
    props: args
});

export const AssignedAndEditable = template.bind({});
AssignedAndEditable.args = {
    appName: 'app',
    taskId: 'mock-assigned-task'
};

export const CompletedAndReadonly = template.bind({});
CompletedAndReadonly.args = {
    ...AssignedAndEditable.args,
    taskId: 'mock-completed-task'
};

export const Suspended = template.bind({});
Suspended.args = {
    ...AssignedAndEditable.args,
    taskId: 'mock-suspended-task'
};

export const WithParentId = template.bind({});
WithParentId.args = {
    ...AssignedAndEditable.args,
    taskId: 'mock-parent-task-id'
};

export const WithoutAssignee = template.bind({});
WithoutAssignee.args = {
    ...AssignedAndEditable.args,
    taskId: 'mock-created-task'
};

export const NotClaimableByUser = template.bind({});
NotClaimableByUser.args = {
    ...AssignedAndEditable.args,
    taskId: 'mock-no-candidate-users'
};

export const TaskNotClaimableByGroupUser = template.bind({});
TaskNotClaimableByGroupUser.args = {
    ...AssignedAndEditable.args,
    taskId: 'mock-no-candidate-groups'
};

export const InvalidForMissingApp = template.bind({});
InvalidForMissingApp.args = {
    ...AssignedAndEditable.args,
    appName: undefined
};

export const InvalidForMissingTaskId = template.bind({});
InvalidForMissingTaskId.args = {
    ...AssignedAndEditable.args,
    taskId: undefined
};
