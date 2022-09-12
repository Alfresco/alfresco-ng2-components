/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { CardViewDateItemComponent } from './card-view-dateitem.component';
import { CoreStoryModule } from './../../../testing/core.story.module';
import {
    CardViewDateItemModel,
    CardViewDatetimeItemModel,
    CardViewModule
} from '../../../../..';

export default {
    component: CardViewDateItemComponent,
    title: 'Core/Card View/Card View Date Item',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, CardViewModule]
        })
    ],
    argTypes: {
        editable: {
            control: 'boolean',
            defaultValue: true
        },
        displayEmpty: {
            control: 'boolean',
            defaultValue: true
        },
        displayClearAction: {
            control: 'boolean',
            defaultValue: true
        }
    }
} as Meta;

const template: Story = (args) => ({
    props: args
});

export const DateItemCardView = template.bind({});

DateItemCardView.args = {
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

export const DatetimeItemCardView = template.bind({});

DatetimeItemCardView.args = {
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

// export const defaultStory = template.bind({});
// defaultStory.args = {
//     properties: dataSource
// };

// export const emptyStory = template.bind({})
// emptyStory.args = {
//     properties: valueAndDefaultUndefinedItems,
//     editable: false
// }
