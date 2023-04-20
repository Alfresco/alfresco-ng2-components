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
import { CardViewSelectItemComponent } from './card-view-selectitem.component';
import { CoreStoryModule } from './../../../testing/core.story.module';
import { CardViewSelectItemModel, CardViewModule } from '../../public-api';
import { of } from 'rxjs';

export default {
    component: CardViewSelectItemComponent,
    title: 'Core/Card View/Card View Select Item',
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
        displayNoneOption: {
            control: 'boolean',
            description: 'Shows None option inside select element',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: true }
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
        options$: {
            control: { disable: true },
            description: 'Data displayed in select element',
            table: {
                type: {
                    summary:
                        'Observable<CardViewSelectItemOption<string | number>[]>'
                }
            }
        },
        property: {
            description: 'Card View Item Model with data',
            table: {
                type: { summary: 'CardViewSelectItemModel' }
            }
        }
    }
} as Meta;

const template: Story<CardViewSelectItemComponent> = (
    args: CardViewSelectItemComponent
) => ({
    props: args
});

export const cardViewSelectItem = template.bind({});
cardViewSelectItem.args = {
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
};
cardViewSelectItem.parameters = { layout: 'centered' };
