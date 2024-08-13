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
import { CardViewComponent } from './card-view.component';
import { CoreStoryModule } from './../../../testing/core.story.module';
import { CARD_VIEW_DIRECTIVES } from '../../public-api';
import { cardViewDataSource, cardViewUndefinedValues } from '../../mock/card-view-content.mock';
import { importProvidersFrom } from '@angular/core';

export default {
    component: CardViewComponent,
    title: 'Core/Card View/Card View',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, ...CARD_VIEW_DIRECTIVES]
        }),
        applicationConfig({
            providers: [importProvidersFrom(CoreStoryModule)]
        })
    ],
    argTypes: {
        editable: {
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        displayEmpty: {
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        displayNoneOption: {
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        displayClearAction: {
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        copyToClipboardAction: {
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        useChipsForMultiValueProperty: {
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        multiValueSeparator: {
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: ', ' }
            }
        },
        displayLabelForChips: {
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        }
    },
    args: {
        editable: true,
        displayEmpty: true,
        displayNoneOption: true,
        displayClearAction: true,
        copyToClipboardAction: true,
        useChipsForMultiValueProperty: true,
        multiValueSeparator: ', ',
        displayLabelForChips: false
    }
} as Meta<CardViewComponent>;

const template: StoryFn<CardViewComponent> = (args) => ({
    props: args
});

export const DefaultCardView = template.bind({});
DefaultCardView.args = {
    properties: cardViewDataSource
};
DefaultCardView.parameters = { layout: 'centered' };

export const EmptyCardView = template.bind({});
EmptyCardView.args = {
    properties: cardViewUndefinedValues,
    editable: false
};
EmptyCardView.parameters = { layout: 'centered' };
