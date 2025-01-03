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
import { AppDetailsCloudComponent } from './app-details-cloud.component';
import { ProcessServicesCloudStoryModule } from '../../../testing/process-services-cloud-story.module';
import { fakeApplicationInstance } from '../../mock/app-model.mock';
import { importProvidersFrom } from '@angular/core';

export default {
    component: AppDetailsCloudComponent,
    title: 'Process Services Cloud/App List Cloud/App Details Cloud',
    decorators: [
        moduleMetadata({
            imports: [AppDetailsCloudComponent]
        }),
        applicationConfig({
            providers: [importProvidersFrom(ProcessServicesCloudStoryModule)]
        })
    ],
    argTypes: {
        applicationInstance: {
            control: 'object',
            table: {
                type: { summary: 'ApplicationInstanceModel' }
            }
        },
        selectedApp: {
            action: 'selectedApp',
            description: 'Emitted when an app entry is clicked.',
            table: { category: 'Actions' }
        }
    },
    args: {
        applicationInstance: fakeApplicationInstance[0]
    }
} as Meta<AppDetailsCloudComponent>;

const template: StoryFn<AppDetailsCloudComponent> = (args) => ({
    props: args
});

export const AppDetailsCloud = template.bind({});
