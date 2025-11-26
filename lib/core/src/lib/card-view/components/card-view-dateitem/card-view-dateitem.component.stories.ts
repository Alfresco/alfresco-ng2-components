/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { applicationConfig, Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CardViewDateItemComponent } from './card-view-dateitem.component';
import { CardViewDateItemModel, CardViewDatetimeItemModel, CARD_VIEW_DIRECTIVES } from '../../public-api';
import { provideStoryCore } from './../../../testing';

const meta: Meta<CardViewDateItemComponent> = {
    component: CardViewDateItemComponent,
    title: 'Core/Card View/Card View Date Item',
    decorators: [
        moduleMetadata({
            imports: [...CARD_VIEW_DIRECTIVES]
        }),
        applicationConfig({
            providers: [...provideStoryCore()]
        })
    ],
    argTypes: {
        editable: {
            control: 'boolean',
            description: 'Defines if CardView item is editable',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        displayEmpty: {
            control: 'boolean',
            description: 'Defines if it should display CardView item when data is empty',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        displayClearAction: {
            control: 'boolean',
            description: 'Defines if it should display clear input action (only with SingleValued components)',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        property: {
            description: 'Card View Item Model with data',
            table: {
                type: {
                    summary: 'CardViewDateItemModel | CardViewDatetimeItemModel'
                }
            }
        }
    },
    args: {
        editable: true,
        displayEmpty: true,
        displayClearAction: true
    }
};

export default meta;
type Story = StoryObj<CardViewDateItemComponent>;

export const SingleValuedDateItemCardView: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        property: new CardViewDateItemModel({
            label: 'CardView Date Item',
            value: [new Date(1983, 11, 24, 10, 0, 30)],
            key: 'date',
            default: new Date(1983, 11, 24, 10, 0, 30),
            format: 'shortDate',
            editable: true
        })
    },
    parameters: { layout: 'centered' }
};

export const MultiValuedDateItemCardView: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        property: new CardViewDateItemModel({
            label: 'CardView Date Item - Multivalue (chips)',
            value: [new Date(1983, 11, 24, 10, 0, 30)],
            key: 'date',
            default: new Date(1983, 11, 24, 10, 0, 30),
            format: 'shortDate',
            editable: true,
            multivalued: true
        })
    },
    parameters: { layout: 'centered' }
};

export const SingleValuedDatetimeItemCardView: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        property: new CardViewDatetimeItemModel({
            label: 'CardView Datetime Item',
            value: undefined,
            key: 'datetime',
            default: undefined,
            format: 'short',
            editable: true
        })
    },
    parameters: { layout: 'centered' }
};

export const MultiValuedDatetimeItemCardView: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        property: new CardViewDatetimeItemModel({
            label: 'CardView Datetime Item - Multivalue (chips)',
            value: undefined,
            key: 'datetime',
            default: undefined,
            format: 'short',
            editable: true,
            multivalued: true
        })
    },
    parameters: { layout: 'centered' }
};
