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

import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { CardViewMapItemComponent } from './card-view-mapitem.component';
import { CoreStoryModule } from './../../../testing/core.story.module';
import { CardViewMapItemModel, CARD_VIEW_DIRECTIVES } from '../../public-api';
import { importProvidersFrom } from '@angular/core';

export default {
    component: CardViewMapItemComponent,
    title: 'Core/Card View/Card View Map Item',
    decorators: [
        moduleMetadata({
            imports: [...CARD_VIEW_DIRECTIVES]
        }),
        applicationConfig({
            providers: [importProvidersFrom(CoreStoryModule)]
        })
    ],
    argTypes: {
        displayEmpty: {
            control: 'boolean',
            description: 'Defines if it should display CardView item when data is empty',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        property: {
            description: 'Card View Item Model with data',
            table: {
                type: { summary: 'CardViewMapItemModel' }
            }
        }
    },
    args: {
        displayEmpty: true
    }
} as Meta<CardViewMapItemComponent>;

const template: StoryFn<CardViewMapItemComponent> = (args) => ({
    props: args
});

export const CardViewMapItem = template.bind({});
CardViewMapItem.args = {
    property: new CardViewMapItemModel({
        label: 'My map',
        value: new Map([['999', 'My Value']]),
        key: 'map',
        default: 'default map value'
    })
};
CardViewMapItem.parameters = { layout: 'centered' };

export const EmptyCardViewMapItem = template.bind({});
EmptyCardViewMapItem.args = {
    property: new CardViewMapItemModel({
        label: 'My map',
        value: [],
        key: 'map',
        default: 'default map value'
    })
};
EmptyCardViewMapItem.parameters = { layout: 'centered' };
