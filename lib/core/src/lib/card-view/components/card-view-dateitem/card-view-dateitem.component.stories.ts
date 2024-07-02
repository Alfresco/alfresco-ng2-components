/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { CardViewDateItemComponent } from './card-view-dateitem.component';
import { CoreStoryModule } from './../../../testing/core.story.module';
import { CardViewDateItemModel, CardViewDatetimeItemModel, CardViewModule } from '../../public-api';
import { importProvidersFrom } from '@angular/core';

export default {
    component: CardViewDateItemComponent,
    title: 'Core/Card View/Card View Date Item',
    decorators: [
        moduleMetadata({
            imports: [CardViewModule]
        }),
        applicationConfig({
            providers: [importProvidersFrom(CoreStoryModule)]
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
} as Meta<CardViewDateItemComponent>;

const template: StoryFn = (args) => ({
    props: args
});

export const SingleValuedDateItemCardView = template.bind({});
SingleValuedDateItemCardView.args = {
    property: new CardViewDateItemModel({
        label: 'CardView Date Item',
        value: [new Date(1983, 11, 24, 10, 0, 30)],
        key: 'date',
        default: new Date(1983, 11, 24, 10, 0, 30),
        format: 'shortDate',
        editable: true
    })
};
SingleValuedDateItemCardView.parameters = { layout: 'centered' };

export const MultiValuedDateItemCardView = template.bind({});
MultiValuedDateItemCardView.args = {
    property: new CardViewDateItemModel({
        label: 'CardView Date Item - Multivalue (chips)',
        value: [new Date(1983, 11, 24, 10, 0, 30)],
        key: 'date',
        default: new Date(1983, 11, 24, 10, 0, 30),
        format: 'shortDate',
        editable: true,
        multivalued: true
    })
};
MultiValuedDateItemCardView.parameters = { layout: 'centered' };

export const SingleValuedDatetimeItemCardView = template.bind({});
SingleValuedDatetimeItemCardView.args = {
    property: new CardViewDatetimeItemModel({
        label: 'CardView Datetime Item',
        value: undefined,
        key: 'datetime',
        default: undefined,
        format: 'short',
        editable: true
    })
};
SingleValuedDatetimeItemCardView.parameters = { layout: 'centered' };

export const MultiValuedDatetimeItemCardView = template.bind({});
MultiValuedDatetimeItemCardView.args = {
    property: new CardViewDatetimeItemModel({
        label: 'CardView Datetime Item - Multivalue (chips)',
        value: undefined,
        key: 'datetime',
        default: undefined,
        format: 'short',
        editable: true,
        multivalued: true
    })
};
MultiValuedDatetimeItemCardView.parameters = { layout: 'centered' };
