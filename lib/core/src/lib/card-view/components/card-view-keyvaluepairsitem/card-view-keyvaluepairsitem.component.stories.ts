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
import { CardViewKeyValuePairsItemComponent } from './card-view-keyvaluepairsitem.component';
import { CoreStoryModule } from './../../../testing/core.story.module';
import { CardViewModule, CardViewKeyValuePairsItemModel } from '../../public-api';

export default {
    component: CardViewKeyValuePairsItemComponent,
    title: 'Core/Card View/Card View Key Value Pairs Item',
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
        property: {
            description: 'Card View Item Model with data',
            table: {
                type: { summary: 'CardViewKeyValuePairsItemModel' }
            }
        }
    }
} as Meta;

export const cardViewKeyValuePairsItem: Story<CardViewKeyValuePairsItemComponent> =
    (args: CardViewKeyValuePairsItemComponent) => ({
        props: args
    });
cardViewKeyValuePairsItem.args = {
    property: new CardViewKeyValuePairsItemModel({
        label: 'CardView Key-Value Pairs Item',
        value: [
            { name: 'hey', value: 'you' },
            { name: 'hey', value: 'you' }
        ],
        key: 'key-value-pairs',
        editable: true
    })
};
