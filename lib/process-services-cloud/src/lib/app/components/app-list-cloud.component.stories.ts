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
import { ProcessServicesCloudStoryModule } from '../../testing/process-services-cloud-story.module';
import { APP_LIST_CLOUD_DIRECTIVES } from '../app-list-cloud.module';
import { AppListCloudComponent } from './app-list-cloud.component';
import { importProvidersFrom } from '@angular/core';

export default {
    component: AppListCloudComponent,
    title: 'Process Services Cloud/App List Cloud/App List Cloud',
    decorators: [
        moduleMetadata({
            imports: [...APP_LIST_CLOUD_DIRECTIVES]
        }),
        applicationConfig({
            providers: [importProvidersFrom(ProcessServicesCloudStoryModule)]
        })
    ],
    argTypes: {
        layoutType: {
            control: 'radio',
            options: ['GRID', 'LIST'],
            description: 'Defines the layout of the apps.',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'GRID' }
            }
        },
        appClick: {
            action: 'appClick',
            description: 'Emitted when an app entry is clicked.',
            table: { category: 'Actions' }
        }
    },
    args: {
        layoutType: 'GRID'
    }
} as Meta<AppListCloudComponent>;

const template: StoryFn<AppListCloudComponent> = (args) => ({
    props: args
});

export const AppListCloud = template.bind({});
