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
import { AppDetailsCloudComponent } from './app-details-cloud.component';
import { ProcessServicesCloudStoryModule } from '../../testing/process-services-cloud-story.module';
import { AppListCloudModule } from '../app-list-cloud.module';
import { fakeApplicationInstance } from '../mock/app-model.mock';

export default {
    component: AppDetailsCloudComponent,
    title: 'Process Services Cloud/Components/App Details',
    decorators: [
        moduleMetadata({
            imports: [ProcessServicesCloudStoryModule, AppListCloudModule]
        })
    ]
} as Meta;

const template: Story<AppDetailsCloudComponent> = (args: AppDetailsCloudComponent) => ({
    props: args
});

export const primary = template.bind({});
primary.args = {
    applicationInstance: fakeApplicationInstance
};
