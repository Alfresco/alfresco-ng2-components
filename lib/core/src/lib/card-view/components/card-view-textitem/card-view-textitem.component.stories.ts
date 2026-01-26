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

import { Meta, StoryObj } from '@storybook/angular';
import { CardViewTextItemComponent } from './card-view-textitem.component';
import { CardViewTextItemModel } from '../../public-api';
import { cardViewSharedMeta } from '../../stories/card-view-shared-meta';

const meta: Meta<CardViewTextItemComponent> = {
    ...cardViewSharedMeta,
    component: CardViewTextItemComponent,
    title: 'Core/Card View/Card View Text Item',
    argTypes: {
        ...cardViewSharedMeta.argTypes
    },
    args: {
        ...cardViewSharedMeta.args,
        editable: false
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
    }
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
        })
    }
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
    }
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
    }
};
