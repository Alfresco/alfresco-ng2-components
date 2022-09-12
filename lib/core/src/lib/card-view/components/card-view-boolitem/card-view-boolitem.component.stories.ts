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
import { CardViewBoolItemComponent } from './card-view-boolitem.component';
import { CoreStoryModule } from './../../../testing/core.story.module';
import { CardViewBoolItemModel, CardViewModule } from '../../../../..';

export default {
    component: CardViewBoolItemComponent,
    title: 'Core/Card View/Card View Bool Item',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, CardViewModule]
        })
    ]
} as Meta;

export const template: Story<CardViewBoolItemComponent> = (
    args: CardViewBoolItemComponent
) => ({
    props: args
});
template.args = {
    property: new CardViewBoolItemModel({
        label: 'Agree to all terms and conditions',
        value: true,
        key: 'boolean',
        default: false,
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
