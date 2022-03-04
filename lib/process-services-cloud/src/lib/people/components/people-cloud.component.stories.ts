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
import { PeopleCloudComponent } from './people-cloud.component';
import { PeopleCloudModule } from '../people-cloud.module';
import { ProcessServicesCloudStoryModule } from '../../testing/process-services-cloud-story.module';
import { IdentityUserService } from '../services/identity-user.service';
import {
    IdentityUserServiceMock,
    mockFoodUsers,
    mockKielbasaSausage,
    mockShepherdsPie,
    mockYorkshirePudding
} from '../mock/people-cloud.mock';

export default {
    component: PeopleCloudComponent,
    title: 'Process Services Cloud/Components/People',
    decorators: [
        moduleMetadata({
            imports: [ProcessServicesCloudStoryModule, PeopleCloudModule],
            providers: [
                { provide: IdentityUserService, useClass: IdentityUserServiceMock}
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

const template: Story<PeopleCloudComponent> = (args: PeopleCloudComponent) => ({
    props: args
});

export const primary = template.bind({});
primary.args = {
    appName: 'app',
    excludedUsers: [],
    mode: 'single',
    preSelectUsers: [],
    readOnly: false,
    title: 'Users',
    validate: false
};

export const validPreselectedUsers = template.bind({});
validPreselectedUsers.args = {
    ...primary.args,
    validate: true,
    mode: 'multiple',
    preSelectUsers: mockFoodUsers
};

export const mandatoryPreselectedUsers = template.bind({});
mandatoryPreselectedUsers.args = {
    ...primary.args,
    validate: true,
    mode: 'multiple',
    preSelectUsers: [{ ...mockKielbasaSausage, readonly: true }, mockShepherdsPie]
};

export const invalidPreselectedUsers = template.bind({});
invalidPreselectedUsers.args = {
    ...primary.args,
    validate: true,
    mode: 'multiple',
    preSelectUsers: [{ id: 'invalid-user', username: 'Invalid User', firstName: 'Invalid', lastName: 'User', email: 'invalid@xyz.com' }]
};

export const excludedUsers = template.bind({});
excludedUsers.args = {
    ...primary.args,
    excludedUsers: [
        mockKielbasaSausage,
        mockYorkshirePudding
    ]
};

export const noUsers = template.bind({});
noUsers.args = {
    ...primary.args,
    excludedUsers: mockFoodUsers
};

export const invalidOrEmptyAppName = template.bind({});
invalidOrEmptyAppName.args = {
    ...primary.args,
    appName: null
};
