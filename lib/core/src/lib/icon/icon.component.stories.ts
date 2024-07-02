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
import { CoreStoryModule } from '../testing/core.story.module';
import { IconComponent } from './icon.component';
import { importProvidersFrom } from '@angular/core';

export default {
    component: IconComponent,
    title: 'Core/Icon/Icon',
    decorators: [
        moduleMetadata({
            imports: [IconComponent]
        }),
        applicationConfig({
            providers: [importProvidersFrom(CoreStoryModule)]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Provides a universal way of rendering registered and named icons.`
            }
        }
    },
    argTypes: {
        color: {
            control: 'radio',
            options: ['primary', 'accent', 'warn', undefined],
            description: 'icon color',
            defaultValue: undefined,
            table: {
                type: { summary: 'ThemePalette' },
                defaultValue: { summary: 'undefined' }
            }
        },
        value: {
            description: 'icon name',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'settings' }
            }
        }
    }
} as Meta<IconComponent>;

const template: StoryFn<IconComponent> = (args) => ({
    props: args
});

export const DefaultIcon = template.bind({});
DefaultIcon.args = {
    value: ''
};
DefaultIcon.parameters = { layout: 'centered' };

export const CustomIcon = template.bind({});
CustomIcon.args = {
    value: 'cloud_download'
};
CustomIcon.parameters = { layout: 'centered' };
