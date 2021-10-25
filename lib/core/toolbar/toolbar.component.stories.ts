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
import { ToolbarComponent } from './toolbar.component';
import { ToolbarModule } from './toolbar.module';

export default {
    component: ToolbarComponent,
    title: 'Core/Components/Toolbar',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, ToolbarModule]
        })
    ],
    argTypes: {
        color: {
            control: 'radio',
            options: ['primary', 'accent', 'warn']
        }
    }
} as Meta;

const template: Story<ToolbarComponent> = (args: ToolbarComponent) => ({
    props: args
});

export const primary = template.bind({});
primary.args = {
    title: 'Alfresco Storybook App',
    color: 'primary'
};

export const invalidOrMissingColor = template.bind({});
invalidOrMissingColor.args = {
    title: 'Alfresco Storybook App',
    color: undefined
};
