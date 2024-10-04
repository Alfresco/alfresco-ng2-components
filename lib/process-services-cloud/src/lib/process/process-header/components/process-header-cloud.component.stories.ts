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
import { ProcessServicesCloudStoryModule } from '../../../testing/process-services-cloud-story.module';
import { ProcessHeaderCloudComponent } from './process-header-cloud.component';
import { ProcessCloudServiceMock } from '../../mock/process-cloud.service.mock';
import { ProcessCloudService } from '../../services/process-cloud.service';
import { importProvidersFrom } from '@angular/core';

export default {
    component: ProcessHeaderCloudComponent,
    title: 'Process Services Cloud/Process Cloud/Process Header Cloud/Process Header Cloud',
    decorators: [
        moduleMetadata({
            imports: [ProcessHeaderCloudComponent]
        }),
        applicationConfig({
            providers: [{ provide: ProcessCloudService, useClass: ProcessCloudServiceMock }, importProvidersFrom(ProcessServicesCloudStoryModule)]
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
} as Meta<ProcessHeaderCloudComponent>;

const template: StoryFn<ProcessHeaderCloudComponent> = (args) => ({
    props: args
});

export const DefaultProcessHeaderCloud = template.bind({});
DefaultProcessHeaderCloud.args = {
    appName: 'app',
    processInstanceId: 'mock-process-id'
};

export const NoParentAndBusinessAndName = template.bind({});
NoParentAndBusinessAndName.args = {
    appName: 'app-placeholders',
    processInstanceId: 'mock-process-id'
};

export const InvalidOrMissingAppName = template.bind({});
InvalidOrMissingAppName.args = {
    appName: undefined,
    processInstanceId: 'mock-process-id'
};

export const InvalidOrMissingProcessInstanceID = template.bind({});
InvalidOrMissingProcessInstanceID.args = {
    appName: 'app',
    processInstanceId: undefined
};
