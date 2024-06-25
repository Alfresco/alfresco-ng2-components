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
import { PeopleCloudComponent } from './people-cloud.component';
import { PeopleCloudModule } from '../people-cloud.module';
import { ProcessServicesCloudStoryModule } from '../../testing/process-services-cloud-story.module';
import { IdentityUserService } from '../services/identity-user.service';
import { IdentityUserServiceMock, mockFoodUsers, mockKielbasaSausage, mockShepherdsPie, mockYorkshirePudding } from '../mock/people-cloud.mock';
import { importProvidersFrom } from '@angular/core';

export default {
    component: PeopleCloudComponent,
    title: 'Process Services Cloud/People Cloud/People Cloud',
    decorators: [
        moduleMetadata({
            imports: [PeopleCloudModule]
        }),
        applicationConfig({
            providers: [
                { provide: IdentityUserService, useClass: IdentityUserServiceMock },
                importProvidersFrom(ProcessServicesCloudStoryModule)
            ]
        })
    ],
    argTypes: {
        appName: {
            control: 'text',
            description: 'Name of the application. If specified, this shows the users who have access to the app.',
            table: {
                type: { summary: 'string' }
            }
        },
        mode: {
            control: 'radio',
            options: ['single', 'multiple'],
            description: 'User selection mode.',
            table: {
                type: { summary: 'ComponentSelectionMode' },
                defaultValue: { summary: 'single' }
            }
        },
        roles: {
            control: 'object',
            description: 'Role names of the users to be listed.',
            table: {
                type: { summary: 'string[]' },
                defaultValue: { summary: '[]' }
            }
        },
        validate: {
            control: 'boolean',
            description:
                'This flag enables the validation on the preSelectUsers passed as input.\n\n' +
                'In case the flag is true the components call the identity service to verify the validity of the information passed as input.\n\n' +
                'Otherwise, no check will be done.',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        readOnly: {
            control: 'boolean',
            description: 'Show the info in readonly mode.',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        required: {
            control: 'boolean',
            description: 'Mark this field as required.',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        preSelectUsers: {
            control: 'object',
            description:
                'Array of users to be pre-selected. All users in the array are pre-selected in multi selection mode, but only the first user is pre-selected in single selection mode. Mandatory properties are: id, email, username',
            table: {
                type: { summary: 'IdentityUserModel[]' },
                defaultValue: { summary: '[]' }
            }
        },
        excludedUsers: {
            control: 'object',
            description: 'Array of users to be excluded. Mandatory properties are: id, email, username',
            table: {
                type: { summary: 'IdentityUserModel[]' },
                defaultValue: { summary: '[]' }
            }
        },
        groupsRestriction: {
            control: 'object',
            description: 'Array of groups to restrict user searches. Mandatory property is group name',
            table: {
                type: { summary: 'string[]' },
                defaultValue: { summary: '[]' }
            }
        },
        userChipsCtrl: {
            control: 'object',
            description: 'FormControl to list of users.',
            table: {
                type: { summary: 'FormControl' },
                defaultValue: { summary: 'new FormControl({ value: \'\', disabled: false })' },
                category: 'Form Controls'
            }
        },
        searchUserCtrl: {
            control: 'object',
            description: 'FormControl to search the user.',
            table: {
                type: { summary: 'FormControl' },
                defaultValue: { summary: 'new FormControl({ value: \'\', disabled: false })' },
                category: 'Form Controls'
            }
        },
        title: {
            control: 'text',
            description: 'Title of the field.',
            table: {
                type: { summary: 'string' }
            }
        },
        selectUser: {
            action: 'selectUser',
            description: 'Emitted when a user is selected.',
            table: { category: 'Actions' }
        },
        removeUser: {
            action: 'removeUser',
            description: 'Emitted when a selected user is removed in multi selection mode.',
            table: { category: 'Actions' }
        },
        changedUsers: {
            action: 'changedUsers',
            description: 'Emitted when a user selection changes.',
            table: { category: 'Actions' }
        },
        warning: {
            action: 'warning',
            description: 'Emitted when an warning occurs.',
            table: { category: 'Actions' }
        }
    },
    args: {
        appName: 'app',
        mode: 'single',
        roles: [],
        validate: false,
        readOnly: false,
        required: false,
        preSelectUsers: [],
        excludedUsers: [],
        groupsRestriction: []
    }
} as Meta<PeopleCloudComponent>;

const template: StoryFn<PeopleCloudComponent> = args => ({
    props: args
});

export const DefaultPeopleCloud = template.bind({});

export const ValidPreselectedUsers = template.bind({});
ValidPreselectedUsers.args = {
    validate: true,
    mode: 'multiple',
    preSelectUsers: mockFoodUsers
};

export const MandatoryPreselectedUsers = template.bind({});
MandatoryPreselectedUsers.args = {
    validate: true,
    mode: 'multiple',
    preSelectUsers: [{ ...mockKielbasaSausage, readonly: true }, mockShepherdsPie]
};

export const InvalidPreselectedUsers = template.bind({});
InvalidPreselectedUsers.args = {
    validate: true,
    mode: 'multiple',
    preSelectUsers: [{ id: 'invalid-user', username: 'Invalid User', firstName: 'Invalid', lastName: 'User', email: 'invalid@xyz.com' }]
};

export const ExcludedUsers = template.bind({});
ExcludedUsers.args = {
    excludedUsers: [mockKielbasaSausage, mockYorkshirePudding]
};

export const NoUsers = template.bind({});
NoUsers.args = {
    excludedUsers: mockFoodUsers
};

export const InvalidOrEmptyAppName = template.bind({});
InvalidOrEmptyAppName.args = {
    appName: null
};
