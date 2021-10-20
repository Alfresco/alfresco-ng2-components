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
    title: 'Process Services Cloud/Components/Task Form',
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
        appName: { table: { disable: true } },
        taskId: { table: { disable: true } },
        readOnly: { table: { disable: true } }
    }
} as Meta;

const template: Story<TaskFormCloudComponent> = (args: TaskFormCloudComponent) => ({
    props: args
});

export const primary = template.bind({});
primary.args = {
    appName: 'app',
    readOnly: false,
    showCancelButton: true,
    showCompleteButton: true,
    showRefreshButton: false,
    showTitle: true,
    showValidationIcon: true,
    taskId: 'mock-task-with-form'
};

export const readOnly = template.bind({});
readOnly.args = {
    ...primary.args,
    readOnly: true
};

export const showRefreshButton = template.bind({});
showRefreshButton.args = {
    ...primary.args,
    showRefreshButton: true
};

export const hideValidationIcon = template.bind({});
hideValidationIcon.args = {
    ...primary.args,
    showValidationIcon: false
};

export const invalidOrMissingApp = template.bind({});
invalidOrMissingApp.args = {
    ...primary.args,
    appName: undefined
};

export const invalidOrMissingTaskId = template.bind({});
invalidOrMissingTaskId.args = {
    ...primary.args,
    taskId: undefined
};
