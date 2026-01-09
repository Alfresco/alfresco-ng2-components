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
import { CardViewMapItemComponent } from './card-view-mapitem.component';
import { CardViewMapItemModel } from '../../public-api';
import { cardViewSharedMeta } from '../../stories/card-view-shared-meta';

const meta: Meta<CardViewMapItemComponent> = {
    ...cardViewSharedMeta,
    component: CardViewMapItemComponent,
    title: 'Core/Card View/Card View Map Item',
    argTypes: {
        ...cardViewSharedMeta.argTypes,
        property: {
            description: 'Card View Item Model with data',
            table: {
                type: { summary: 'CardViewMapItemModel' }
            }
        }
    }
};

export default meta;
type Story = StoryObj<CardViewMapItemComponent>;

export const CardViewMapItem: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        property: new CardViewMapItemModel({
            label: 'My map',
            value: new Map([['999', 'My Value']]),
            key: 'map',
            default: 'default map value'
        })
    }
};

export const EmptyCardViewMapItem: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        property: new CardViewMapItemModel({
            label: 'My map',
            value: [],
            key: 'map',
            default: 'default map value'
        })
    }
};
