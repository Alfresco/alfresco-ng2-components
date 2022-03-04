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
import { GroupCloudModule } from '../group-cloud.module';
import { GroupCloudComponent } from './group-cloud.component';
import { ProcessServicesCloudStoryModule } from '../../testing/process-services-cloud-story.module';
import { IdentityGroupService } from '../services/identity-group.service';
import {
    IdentityGroupServiceMock,
    mockFoodGroups,
    mockMeatChicken,
    mockVegetableAubergine
} from '../mock/group-cloud.mock';

export default {
    component: GroupCloudComponent,
    title: 'Process Services Cloud/Components/Group',
    decorators: [
        moduleMetadata({
            imports: [ProcessServicesCloudStoryModule, GroupCloudModule],
            providers: [
                { provide: IdentityGroupService, useClass: IdentityGroupServiceMock }
            ]
        })
    ],
    argTypes: {
        appName: { table: { disable: true } },
        mode: {
            options: ['single', 'multiple'],
            control: 'radio'
        }
    }
} as Meta;

const template: Story<GroupCloudComponent> = (args: GroupCloudComponent) => ({
    props: args
});

export const primary = template.bind({});
primary.args = {
    appName: 'app',
    mode: 'single',
    preSelectGroups: [],
    readOnly: false,
    title: 'Groups',
    validate: false
};

export const validPreselectedGroups = template.bind({});
validPreselectedGroups.args = {
    ...primary.args,
    validate: true,
    mode: 'multiple',
    preSelectGroups: mockFoodGroups
};

export const mandatoryPreselectedGroups = template.bind({});
mandatoryPreselectedGroups.args = {
    ...primary.args,
    validate: true,
    mode: 'multiple',
    preSelectGroups: [mockVegetableAubergine, { ...mockMeatChicken, readonly: true }]
};

export const invalidPreselectedGroups = template.bind({});
invalidPreselectedGroups.args = {
    ...primary.args,
    validate: true,
    mode: 'multiple',
    preSelectGroups: [{ id: 'invalid-group', name: 'Invalid Group' }]
};

export const invalidOrEmptyAppName = template.bind({});
invalidOrEmptyAppName.args = {
    ...primary.args,
    appName: undefined
};
