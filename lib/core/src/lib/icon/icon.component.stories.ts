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
import { CoreStoryModule } from '../testing/core.story.module';
import { IconComponent } from './icon.component';
import { IconModule } from './icon.module';

export default {
    component: IconComponent,
    title: 'Core/Components/Icon',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, IconModule]
        })
    ],
    argTypes: {
        color: {
            control: 'radio',
            options: ['primary', 'accent', 'warn'],
            description: 'icon color',
            defaultValue: 'primary',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'primary' }
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
} as Meta;

const template: Story<IconComponent> = (args: IconComponent) => ({
    props: args
});

export const defaultIcon = template.bind({});
defaultIcon.args = {
    value: ''
};

export const customIcon = template.bind({});
customIcon.args = {
    value: 'cloud_download'
};
