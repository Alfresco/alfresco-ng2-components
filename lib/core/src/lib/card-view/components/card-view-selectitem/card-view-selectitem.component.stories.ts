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
import { CardViewSelectItemComponent } from './card-view-selectitem.component';
import { CardViewSelectItemModel } from '../../public-api';
import { of } from 'rxjs';
import { cardViewSharedMeta } from '../../stories/card-view-shared-meta';

const meta: Meta<CardViewSelectItemComponent> = {
    ...cardViewSharedMeta,
    component: CardViewSelectItemComponent,
    title: 'Core/Card View/Card View Select Item',
    argTypes: {
        ...cardViewSharedMeta.argTypes,
        options$: {
            control: { disable: true },
            description: 'Data displayed in select element',
            table: {
                type: {
                    summary: 'Observable<CardViewSelectItemOption<string | number>[]>'
                }
            }
        },
        property: {
            description: 'Card View Item Model with data',
            table: {
                type: { summary: 'CardViewSelectItemModel' }
            }
        }
    },
    args: {
        ...cardViewSharedMeta.args,
        editable: false
    }
};

export default meta;
type Story = StoryObj<CardViewSelectItemComponent>;

export const CardViewSelectItem: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        property: new CardViewSelectItemModel({
            label: 'CardView Select Item',
            value: 'one',
            options$: of([
                { key: 'one', label: 'One' },
                { key: 'two', label: 'Two' }
            ]),
            key: 'select',
            editable: true
        })
    }
};
