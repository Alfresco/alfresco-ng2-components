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
import { CardViewTextItemComponent } from './card-view-textitem.component';
import { CARD_VIEW_DIRECTIVES, CardViewTextItemModel } from '../../public-api';
import { provideStoryCore } from './../../../testing';

const meta: Meta<CardViewTextItemComponent> = {
    component: CardViewTextItemComponent,
    title: 'Core/Card View/Card View Text Item',
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
        copyToClipboardAction: {
            control: 'boolean',
            description: 'Copy to clipboard action - default template in editable mode',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        useChipsForMultiValueProperty: {
            control: 'boolean',
            description: 'Split text for chips using defined separator',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        multiValueSeparator: {
            control: 'text',
            description: 'Separator used for text splitting',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: ', ' }
            }
        },
        displayLabelForChips: {
            control: 'boolean',
            description: 'Display label for chips property',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        }
    },
    args: {
        editable: false,
        displayEmpty: true,
        copyToClipboardAction: true,
        useChipsForMultiValueProperty: true,
        multiValueSeparator: ', ',
        displayLabelForChips: false
    }
};

export default meta;
type Story = StoryObj<CardViewTextItemComponent>;

export const ClickableCardViewTextItem: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        property: new CardViewTextItemModel({
            label: 'CardView Text Item - Clickable template',
            value: 'click here',
            key: 'click',
            default: 'click here',
            editable: true,
            clickable: true,
            icon: 'close'
        })
    },
    parameters: { layout: 'centered' }
};

export const ChipsCardViewTextItem: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        property: new CardViewTextItemModel({
            label: 'CardView Text Item - Chips template',
            value: [1, 2, 3, 4],
            key: 'name',
            default: 'default bar',
            multiline: true,
            multivalued: true,
            icon: 'icon',
            editable: true
        }),
        displayLabelForChips: false
    },
    parameters: { layout: 'centered' }
};

export const EmptyCardViewTextItem: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        property: new CardViewTextItemModel({
            label: 'CardView Text Item - Empty template',
            value: undefined,
            key: 'empty',
            default: '',
            icon: 'icon',
            editable: false
        }),
        editable: false,
        displayEmpty: false
    },
    parameters: { layout: 'centered' }
};

export const DefaultCardViewTextItem: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        property: new CardViewTextItemModel({
            label: 'CardView Text Item - Default template',
            value: 'input here',
            key: 'default',
            default: 'input here',
            editable: true,
            clickable: false,
            icon: 'close',
            multiline: false
        })
    },
    parameters: { layout: 'centered' }
};

export const DisplayLabelForChipsCardTextItem: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        property: new CardViewTextItemModel({
            label: 'CardView Text Item - Multi-Valued Chips template',
            value: ['Chip 1', 'Chip 2', 'Chip 3'],
            key: 'multivalued',
            default: 'default value',
            multiline: true,
            multivalued: true,
            icon: 'icon',
            editable: true
        }),
        displayLabelForChips: false
    },
    parameters: { layout: 'centered' }
};
