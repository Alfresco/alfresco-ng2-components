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
import { TaskHeaderCloudModule } from '../task-header-cloud.module';
import { TaskHeaderCloudComponent } from './task-header-cloud.component';
import { TaskCloudService } from '../../services/task-cloud.service';
import { TaskCloudServiceMock } from '../../mock/task-cloud.service.mock';
import { ProcessServicesCloudStoryModule } from '../../../testing/process-services-cloud-story.module';

export default {
    component: TaskHeaderCloudComponent,
    title: 'Process Services Cloud/Task Cloud/Task Header Cloud/Task Header Cloud',
    decorators: [
        moduleMetadata({
            imports: [ProcessServicesCloudStoryModule, TaskHeaderCloudModule],
            providers: [
                { provide: TaskCloudService, useClass: TaskCloudServiceMock }
            ]
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
} as Meta;

const template: Story<TaskHeaderCloudComponent> = (args: TaskHeaderCloudComponent) => ({
    props: args
});

export const assignedAndEditable = template.bind({});
assignedAndEditable.args = {
    appName: 'app',
    taskId: 'mock-assigned-task'
};

export const completedAndReadonly = template.bind({});
completedAndReadonly.args = {
    ...assignedAndEditable.args,
    taskId: 'mock-completed-task'
};

export const suspended = template.bind({});
suspended.args = {
    ...assignedAndEditable.args,
    taskId: 'mock-suspended-task'
};

export const withParentId = template.bind({});
withParentId.args = {
    ...assignedAndEditable.args,
    taskId: 'mock-parent-task-id'
};

export const withoutAssignee = template.bind({});
withoutAssignee.args = {
    ...assignedAndEditable.args,
    taskId: 'mock-created-task'
};

export const notClaimableByUser = template.bind({});
notClaimableByUser.args = {
    ...assignedAndEditable.args,
    taskId: 'mock-no-candidate-users'
};

export const taskNotClaimableByGroupUser = template.bind({});
taskNotClaimableByGroupUser.args = {
    ...assignedAndEditable.args,
    taskId: 'mock-no-candidate-groups'
};

export const invalidForMissingApp = template.bind({});
invalidForMissingApp.args = {
    ...assignedAndEditable.args,
    appName: undefined
};

export const invalidForMissingTaskId = template.bind({});
invalidForMissingTaskId.args = {
    ...assignedAndEditable.args,
    taskId: undefined
};
