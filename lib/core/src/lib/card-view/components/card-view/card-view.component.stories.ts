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
import { CardViewComponent } from './card-view.component';
import { CoreStoryModule } from './../../../testing/core.story.module';
import { CardViewModule } from '../../public-api';
import { cardViewDataSource, cardViewUndefinedValues } from '../../mock/card-view-content.mock';

export default {
    component: CardViewComponent,
    title: 'Core/Card View/Card View',
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

const template: Story<CardViewComponent> = (args: CardViewComponent) => ({
    props: args
});

export const defaultCardView = template.bind({});
defaultCardView.args = {
    properties: cardViewDataSource
};
defaultCardView.parameters = { layout: 'centered' };

export const emptyCardView = template.bind({});
emptyCardView.args = {
    properties: cardViewUndefinedValues,
    editable: false
};
emptyCardView.parameters = { layout: 'centered' };
