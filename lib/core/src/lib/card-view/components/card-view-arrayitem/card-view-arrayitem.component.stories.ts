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
import { CardViewArrayItemComponent } from './card-view-arrayitem.component';
import { CardViewArrayItemModel, CARD_VIEW_DIRECTIVES } from '../../public-api';
import { of } from 'rxjs';
import { provideStoryCore } from './../../../testing';

const meta: Meta<CardViewArrayItemComponent> = {
    component: CardViewArrayItemComponent,
    title: 'Core/Card View/Card View Array Item',
    decorators: [
        moduleMetadata({
            imports: [...CARD_VIEW_DIRECTIVES]
        }),
        applicationConfig({
            providers: [...provideStoryCore()]
        })
    ],
    argTypes: {
        property: {
            description: 'Card View Item Model with data',
            table: {
                type: { summary: 'CardViewArrayItemModel' }
            }
        }
    }
};

export default meta;
type Story = StoryObj<CardViewArrayItemComponent>;

export const CardViewArrayItem: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        property: new CardViewArrayItemModel({
            label: 'CardView Array of items',
            value: of([
                { icon: 'directions_bike', value: 'Zlatan' },
                { icon: 'directions_bike', value: 'Lionel Messi' },
                { value: 'Mohamed', directions_bike: 'save' },
                { value: 'Ronaldo' }
            ]),
            key: 'array',
            icon: 'edit',
            default: 'Empty',
            noOfItemsToDisplay: 2
        })
    },
    parameters: { layout: 'centered' }
};
