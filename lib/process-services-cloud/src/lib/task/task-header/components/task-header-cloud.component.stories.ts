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

import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { TaskHeaderCloudComponent } from './task-header-cloud.component';
import { TaskCloudService } from '../../services/task-cloud.service';
import { TaskCloudServiceMock } from '../../mock/task-cloud.service.mock';
import { provideStoryProcessServicesCloud } from '../../../stories/process-services-cloud-story.providers';

const meta: Meta<TaskHeaderCloudComponent> = {
    component: TaskHeaderCloudComponent,
    title: 'Process Services Cloud/Task Cloud/Task Header Cloud/Task Header Cloud',
    decorators: [
        moduleMetadata({
            imports: [TaskHeaderCloudComponent],
            providers: [{ provide: TaskCloudService, useClass: TaskCloudServiceMock }, provideStoryProcessServicesCloud()]
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
};

export default meta;
type Story = StoryObj<TaskHeaderCloudComponent>;

export const AssignedAndEditable: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        appName: 'app',
        taskId: 'mock-assigned-task'
    }
};

export const CompletedAndReadonly: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        ...AssignedAndEditable.args,
        taskId: 'mock-completed-task'
    }
};

export const Suspended: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        ...AssignedAndEditable.args,
        taskId: 'mock-suspended-task'
    }
};

export const WithParentId: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        ...AssignedAndEditable.args,
        taskId: 'mock-parent-task-id'
    }
};

export const WithoutAssignee: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        ...AssignedAndEditable.args,
        taskId: 'mock-created-task'
    }
};

export const NotClaimableByUser: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        ...AssignedAndEditable.args,
        taskId: 'mock-no-candidate-users'
    }
};

export const TaskNotClaimableByGroupUser: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        ...AssignedAndEditable.args,
        taskId: 'mock-no-candidate-groups'
    }
};

export const InvalidForMissingApp: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        ...AssignedAndEditable.args,
        appName: undefined
    }
};

export const InvalidForMissingTaskId: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        ...AssignedAndEditable.args,
        taskId: undefined
    }
};
