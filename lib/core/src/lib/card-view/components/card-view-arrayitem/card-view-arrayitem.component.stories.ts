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
import { CardViewArrayItemComponent } from './card-view-arrayitem.component';
import { CoreStoryModule } from './../../../testing/core.story.module';
import { CardViewArrayItemModel, CardViewModule } from '../../../../..';
import { of } from 'rxjs';

export default {
    component: CardViewArrayItemComponent,
    title: 'Core/Card View/Card View Array Item',
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
        displayNoneOption: {
            control: 'boolean',
            defaultValue: true
        },
        displayClearAction: {
            control: 'boolean',
            defaultValue: true
        },
        copyToClipboardAction: {
            control: 'boolean',
            defaultValue: true
        },
        useChipsForMultiValueProperty: {
            control: 'boolean',
            defaultValue: true
        },
        multiValueSeparator: {
            control: 'text',
            defaultValue: ', '
        }
    }
} as Meta;

export const template: Story<CardViewArrayItemComponent> = (
    args: CardViewArrayItemComponent
) => ({
    props: args
});
template.args = {
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
        noOfItemsToDisplay: 2,
        editable: true
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
