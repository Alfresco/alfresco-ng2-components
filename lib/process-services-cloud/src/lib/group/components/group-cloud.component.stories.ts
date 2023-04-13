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
import { FormControl } from '@angular/forms';

const defaultFormControl = new FormControl({ value: '', disabled: false });

export default {
    component: GroupCloudComponent,
    title: 'Process Services Cloud/Group Cloud/Group Cloud',
    decorators: [
        moduleMetadata({
            imports: [ProcessServicesCloudStoryModule, GroupCloudModule],
            providers: [
                { provide: IdentityGroupService, useClass: IdentityGroupServiceMock }
            ]
        })
    ],
    argTypes: {
        appName: {
            control: 'text',
            description: 'Name of the application. If specified this shows the groups who have access to the app.',
            defaultValue: 'app',
            table: {
                type: { summary: 'string' }
            }
        },
        title: {
            control: 'text',
            description: 'Title of the field.',
            defaultValue: 'Groups',
            table: {
                type: { summary: 'string' }
            }
        },
        mode: {
            control: 'radio',
            options: ['single', 'multiple'],
            description: 'Group selection mode.',
            defaultValue: 'single',
            table: {
                type: { summary: 'ComponentSelectionMode' },
                defaultValue: { summary: 'single' }
            }
        },
        preSelectGroups: {
            control: 'object',
            description: 'Array of groups to be pre-selected. This pre-selects all groups in multi selection mode and only the first group of the array in single selection mode.',
            defaultValue: [],
            table: {
                type: { summary: 'IdentityGroupModel[]' },
                defaultValue: { summary: '[]' }
            }
        },
        validate: {
            control: 'boolean',
            description: 'This flag enables the validation on the preSelectGroups passed as input.\n\n'+
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
        groupChipsCtrl: {
            control: 'object',
            description: 'FormControl to list of group.',
            mapping: { default: defaultFormControl },
            table: {
                type: { summary: 'FormControl' },
                defaultValue: { summary: 'new FormControl({ value: \'\', disabled: false })' },
                category: 'Form Controls'
            }
        },
        searchGroupsControl: {
            control: 'object',
            description: 'FormControl to search the group.',
            mapping: { default: defaultFormControl },
            table: {
                type: { summary: 'FormControl' },
                defaultValue: { summary: 'new FormControl({ value: \'\', disabled: false })' },
                category: 'Form Controls'
            }
        },
        roles: {
            control: 'object',
            description: 'Role names of the groups to be listed.',
            defaultValue: [],
            table: {
                type: { summary: 'string[]' },
                defaultValue: { summary: '[]' }
            }
        },
        selectGroup: {
            action: 'selectGroup',
            description: 'Emitted when a group is selected.',
            table: { category: 'Actions' }
        },
        removeGroup: {
            action: 'removeGroup',
            description: 'Emitted when a group is removed.',
            table: { category: 'Actions' }
        },
        changedGroups: {
            action: 'changedGroups',
            description: 'Emitted when a group selection changes.',
            table: { category: 'Actions' }
        },
        warning: {
            action: 'warning',
            description: 'Emitted when an warning occurs.',
            table: { category: 'Actions' }
        }
    }
} as Meta;

const template: Story<GroupCloudComponent> = (args: GroupCloudComponent) => ({
    props: args
});

export const defaultGroupCloud = template.bind({});
defaultGroupCloud.args = {
    groupChipsCtrl: 'default',
    searchGroupsControl: 'default'
};

export const validPreselectedGroups = template.bind({});
validPreselectedGroups.args = {
    ...defaultGroupCloud.args,
    validate: true,
    mode: 'multiple',
    preSelectGroups: mockFoodGroups
};

export const mandatoryPreselectedGroups = template.bind({});
mandatoryPreselectedGroups.args = {
    ...defaultGroupCloud.args,
    validate: true,
    mode: 'multiple',
    preSelectGroups: [mockVegetableAubergine, { ...mockMeatChicken, readonly: true }]
};

export const invalidPreselectedGroups = template.bind({});
invalidPreselectedGroups.args = {
    ...defaultGroupCloud.args,
    validate: true,
    mode: 'multiple',
    preSelectGroups: [{ id: 'invalid-group', name: 'Invalid Group' }]
};
