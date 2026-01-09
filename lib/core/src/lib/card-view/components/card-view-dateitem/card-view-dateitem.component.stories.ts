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
import { CardViewDateItemComponent } from './card-view-dateitem.component';
import { CardViewDateItemModel, CardViewDatetimeItemModel } from '../../public-api';
import { cardViewSharedMeta } from '../../stories/card-view-shared-meta';

const meta: Meta<CardViewDateItemComponent> = {
    ...cardViewSharedMeta,
    component: CardViewDateItemComponent,
    title: 'Core/Card View/Card View Date Item',
    argTypes: {
        ...cardViewSharedMeta.argTypes,
        property: {
            description: 'Card View Item Model with data',
            table: {
                type: {
                    summary: 'CardViewDateItemModel | CardViewDatetimeItemModel'
                }
            }
        }
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
    }
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
    }
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
    }
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
    }
};
