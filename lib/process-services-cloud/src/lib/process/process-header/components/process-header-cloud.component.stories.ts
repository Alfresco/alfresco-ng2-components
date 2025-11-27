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
import { provideStoryProcessServicesCloud } from '../../../testing/provide-story-process-services-cloud';
import { ProcessHeaderCloudComponent } from './process-header-cloud.component';
import { ProcessCloudServiceMock } from '../../mock/process-cloud.service.mock';
import { ProcessCloudService } from '../../services/process-cloud.service';

const meta: Meta<ProcessHeaderCloudComponent> = {
    component: ProcessHeaderCloudComponent,
    title: 'Process Services Cloud/Process Cloud/Process Header Cloud/Process Header Cloud',
    decorators: [
        moduleMetadata({
            imports: [ProcessHeaderCloudComponent]
        }),
        applicationConfig({
            providers: [{ provide: ProcessCloudService, useClass: ProcessCloudServiceMock }, ...provideStoryProcessServicesCloud()]
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
        processInstanceId: {
            control: 'text',
            description: '(Required) The id of the process instance.',
            table: {
                type: { summary: 'string' }
            }
        }
    }
};

export default meta;
type Story = StoryObj<ProcessHeaderCloudComponent>;

export const DefaultProcessHeaderCloud: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        appName: 'app',
        processInstanceId: 'mock-process-id'
    }
};

export const NoParentAndBusinessAndName: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        appName: 'app-placeholders',
        processInstanceId: 'mock-process-id'
    }
};

export const InvalidOrMissingAppName: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        appName: undefined,
        processInstanceId: 'mock-process-id'
    }
};

export const InvalidOrMissingProcessInstanceID: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        appName: 'app',
        processInstanceId: undefined
    }
};
