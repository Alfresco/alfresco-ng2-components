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
import { CardViewTextItemComponent } from './card-view-textitem.component';
import { CoreStoryModule } from './../../../testing/core.story.module';
import { CardViewModule, CardViewTextItemModel } from '../../public-api';

export default {
    component: CardViewTextItemComponent,
    title: 'Core/Card View/Card View Text Item',
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
        displayEmpty: {
            control: 'boolean',
            description:
                'Defines if it should display CardView item when data is empty',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: true }
            }
        },
        copyToClipboardAction: {
            control: 'boolean',
            description:
                'Copy to clipboard action - default template in editable mode',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: true }
            }
        },
        useChipsForMultiValueProperty: {
            control: 'boolean',
            description: 'Split text for chips using defined separator',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: true }
            }
        },
        multiValueSeparator: {
            control: 'text',
            description: 'Separator used for text splitting',
            defaultValue: ', ',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: ', ' }
            }
        }
    }
} as Meta;

const template: Story<CardViewTextItemComponent> = (
    args: CardViewTextItemComponent
) => ({
    props: args
});

export const ClickableCardViewTextItem = template.bind({});

ClickableCardViewTextItem.args = {
    property: new CardViewTextItemModel({
        label: 'CardView Text Item - Clickable template',
        value: 'click here',
        key: 'click',
        default: 'click here',
        editable: true,
        clickable: true,
        icon: 'close'
    })
};

export const ChipsCardViewTextItem = template.bind({});

ChipsCardViewTextItem.args = {
    property: new CardViewTextItemModel({
        label: 'CardView Text Item - Chips template',
        value: [1, 2, 3, 4],
        key: 'name',
        default: 'default bar',
        multiline: true,
        multivalued: true,
        icon: 'icon',
        editable: true
    })
};

export const EmptyCardViewTextItem = template.bind({});

EmptyCardViewTextItem.args = {
    property: new CardViewTextItemModel({
        label: 'CardView Text Item - Empty template',
        value: undefined,
        key: 'empty',
        default: '',
        icon: 'icon',
        editable: false
    }),
    editable: false,
    displayEmpty: false
};

export const DefaultCardViewTextItem = template.bind({});

DefaultCardViewTextItem.args = {
    property: new CardViewTextItemModel({
        label: 'CardView Text Item - Default template',
        value: 'input here',
        key: 'default',
        default: 'input here',
        editable: true,
        clickable: false,
        icon: 'close',
        multiline: false
    })
};
