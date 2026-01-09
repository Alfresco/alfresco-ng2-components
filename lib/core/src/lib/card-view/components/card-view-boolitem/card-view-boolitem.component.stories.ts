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
import { CardViewBoolItemComponent } from './card-view-boolitem.component';
import { CardViewBoolItemModel } from '../../public-api';
import { cardViewSharedMeta } from '../../stories/card-view-shared-meta';

const meta: Meta<CardViewBoolItemComponent> = {
    ...cardViewSharedMeta,
    component: CardViewBoolItemComponent,
    title: 'Core/Card View/Card View Bool Item',
    argTypes: {
        ...cardViewSharedMeta.argTypes,
        property: {
            description: 'Card View Item Model with data',
            table: {
                type: { summary: 'CardViewBoolItemModel' }
            }
        }
    }
};

export default meta;
type Story = StoryObj<CardViewBoolItemComponent>;

export const CardViewBoolItem: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        property: new CardViewBoolItemModel({
            label: 'Agree to all terms and conditions',
            value: true,
            key: 'boolean',
            default: false,
            editable: true
        })
    }
};
