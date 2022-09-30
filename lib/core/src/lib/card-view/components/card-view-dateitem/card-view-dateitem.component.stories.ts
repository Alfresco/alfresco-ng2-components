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
import { CardViewDateItemComponent } from './card-view-dateitem.component';
import { CoreStoryModule } from './../../../testing/core.story.module';
import {
    CardViewDateItemModel,
    CardViewDatetimeItemModel,
    CardViewModule
} from '../../public-api';

export default {
    component: CardViewDateItemComponent,
    title: 'Core/Card View/Card View Date Item',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, CardViewModule]
        })
    ],
    argTypes: {
        editable: {
            control: 'boolean',
            description: 'Defines if CardView item is editable',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
        displayEmpty: {
            control: 'boolean',
            description:
                'Defines if it should display CardView item when data is empty',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: true }
            }
        },
        displayClearAction: {
            control: 'boolean',
            description:
                'Defines if it should display clear input action (only with SingleValued components)',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: true }
            }
        },
        property: {
            description: 'Card View Item Model with data',
            table: {
                type: {
                    summary:
                        'CardViewDateItemModel | CardViewDatetimeItemModel'
                }
            }
        }
    }
} as Meta;

const template: Story = (args) => ({
    props: args
});

export const SingleValuedDateItemCardView = template.bind({});

SingleValuedDateItemCardView.args = {
    property: new CardViewDateItemModel({
        label: 'CardView Date Item',
        value: [new Date(1983, 11, 24, 10, 0, 30)],
        key: 'date',
        default: new Date(1983, 11, 24, 10, 0, 30),
        format: 'shortDate',
        editable: true
    })
};

export const MultiValuedDateItemCardView = template.bind({});

MultiValuedDateItemCardView.args = {
    property: new CardViewDateItemModel({
        label: 'CardView Date Item - Multivalue (chips)',
        value: [new Date(1983, 11, 24, 10, 0, 30)],
        key: 'date',
        default: new Date(1983, 11, 24, 10, 0, 30),
        format: 'shortDate',
        editable: true,
        multivalued: true
    })
};

export const SingleValuedDatetimeItemCardView = template.bind({});

SingleValuedDatetimeItemCardView.args = {
    property: new CardViewDatetimeItemModel({
        label: 'CardView Datetime Item',
        value: undefined,
        key: 'datetime',
        default: undefined,
        format: 'short',
        editable: true
    })
};

export const MultiValuedDatetimeItemCardView = template.bind({});

MultiValuedDatetimeItemCardView.args = {
    property: new CardViewDatetimeItemModel({
        label: 'CardView Datetime Item - Multivalue (chips)',
        value: undefined,
        key: 'datetime',
        default: undefined,
        format: 'short',
        editable: true,
        multivalued: true
    })
};
