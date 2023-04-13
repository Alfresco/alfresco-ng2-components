/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { FormControl } from '@angular/forms';

const defaultFormControl = new FormControl({ value: '', disabled: false });

export default {
    component: PeopleCloudComponent,
    title: 'Process Services Cloud/People Cloud/People Cloud',
    decorators: [
        moduleMetadata({
            imports: [ProcessServicesCloudStoryModule, PeopleCloudModule],
            providers: [
                { provide: IdentityUserService, useClass: IdentityUserServiceMock }
            ]
        })
    ],
    argTypes: {
        appName: {
            control: 'text',
            description: 'Name of the application. If specified, this shows the users who have access to the app.',
            defaultValue: 'app',
            table: {
                type: { summary: 'string' }
            }
        },
        mode: {
            control: 'radio',
            options: ['single', 'multiple'],
            description: 'User selection mode.',
            defaultValue: 'single',
            table: {
                type: { summary: 'ComponentSelectionMode' },
                defaultValue: { summary: 'single' }
            }
        },
        roles: {
            control: 'object',
            description: 'Role names of the users to be listed.',
            defaultValue: [],
            table: {
                type: { summary: 'string[]' },
                defaultValue: { summary: '[]' }
            }
        },
        validate: {
            control: 'boolean',
            description: 'This flag enables the validation on the preSelectUsers passed as input.\n\n'+
            'In case the flag is true the components call the identity service to verify the validity of the information passed as input.\n\n'+
            'Otherwise, no check will be done.',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        readOnly: {
            control: 'boolean',
            description: 'Show the info in readonly mode.',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        required: {
            control: 'boolean',
            description: 'Mark this field as required.',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        preSelectUsers: {
            control: 'object',
            description: 'Array of users to be pre-selected. All users in the array are pre-selected in multi selection mode, but only the first user is pre-selected in single selection mode. Mandatory properties are: id, email, username',
            defaultValue: [],
            table: {
                type: { summary: 'IdentityUserModel[]' },
                defaultValue: { summary: '[]' }
            }
        },
        excludedUsers: {
            control: 'object',
            description: 'Array of users to be excluded. Mandatory properties are: id, email, username',
            defaultValue: [],
            table: {
                type: { summary: 'IdentityUserModel[]' },
                defaultValue: { summary: '[]' }
            }
        },
        groupsRestriction: {
            control: 'object',
            description: 'Array of groups to restrict user searches. Mandatory property is group name',
            defaultValue: [],
            table: {
                type: { summary: 'string[]' },
                defaultValue: { summary: '[]' }
            }
        },
        userChipsCtrl: {
            control: 'object',
            description: 'FormControl to list of users.',
            mapping: { default: defaultFormControl },
            table: {
                type: { summary: 'FormControl' },
                defaultValue: { summary: 'new FormControl({ value: \'\', disabled: false })' },
                category: 'Form Controls'
            }
        },
        searchUserCtrl: {
            control: 'object',
            description: 'FormControl to search the user.',
            mapping: { default: defaultFormControl },
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
    }
} as Meta;

const template: Story<PeopleCloudComponent> = (args: PeopleCloudComponent) => ({
    props: args
});

export const defaultPeopleCloud = template.bind({});
defaultPeopleCloud.args = {
    userChipsCtrl: 'default',
    searchUserCtrl: 'default'
};

export const validPreselectedUsers = template.bind({});
validPreselectedUsers.args = {
    ...defaultPeopleCloud.args,
    validate: true,
    mode: 'multiple',
    preSelectUsers: mockFoodUsers
};

export const mandatoryPreselectedUsers = template.bind({});
mandatoryPreselectedUsers.args = {
    ...defaultPeopleCloud.args,
    validate: true,
    mode: 'multiple',
    preSelectUsers: [{ ...mockKielbasaSausage, readonly: true }, mockShepherdsPie]
};

export const invalidPreselectedUsers = template.bind({});
invalidPreselectedUsers.args = {
    ...defaultPeopleCloud.args,
    validate: true,
    mode: 'multiple',
    preSelectUsers: [{ id: 'invalid-user', username: 'Invalid User', firstName: 'Invalid', lastName: 'User', email: 'invalid@xyz.com' }]
};

export const excludedUsers = template.bind({});
excludedUsers.args = {
    ...defaultPeopleCloud.args,
    excludedUsers: [
        mockKielbasaSausage,
        mockYorkshirePudding
    ]
};

export const noUsers = template.bind({});
noUsers.args = {
    ...defaultPeopleCloud.args,
    excludedUsers: mockFoodUsers
};

export const invalidOrEmptyAppName = template.bind({});
invalidOrEmptyAppName.args = {
    ...defaultPeopleCloud.args,
    appName: null
};
