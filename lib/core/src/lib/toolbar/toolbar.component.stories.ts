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

import { Meta, moduleMetadata, Story, componentWrapperDecorator } from '@storybook/angular';
import { CoreStoryModule } from '../testing/core.story.module';
import { ToolbarComponent } from './toolbar.component';
import { ToolbarModule } from './toolbar.module';

export default {
    component: ToolbarComponent,
    title: 'Core/Toolbar/Toolbar',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, ToolbarModule]
        })
    ],
    argTypes: {
        color: {
            control: 'radio',
            options: ['primary', 'accent', 'warn', undefined],
            description: 'Toolbar color.',
            defaultValue: undefined,
            table: {
                type: { summary: 'ThemePalette' },
                defaultValue: { summary: 'undefined' }
            }
        },
        title: {
            control: 'text',
            description: 'Toolbar title.',
            defaultValue: '',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        }
    }
} as Meta;

const template: Story<ToolbarComponent> = (args: ToolbarComponent) => ({
    props: args
});

export const defaultToolbar = template.bind({});

const wrap = (story: string, title?: string, content?:  string): string => `<h3>${title ? title : ''}</h3>${story}`.replace('></adf-toolbar>',`>${content ? content : ''}</adf-toolbar>`);
export const withToolbarTitleComponent = template.bind({});
withToolbarTitleComponent.decorators = [
    componentWrapperDecorator(story => wrap(
        story,
        `This story supplies the Toolbar component with an adf-toolbar-title element:`,
        `<div adf-toolbar-title>Toolbar Title</div>`
    ))
];

export const withProjectedContent = template.bind({});
withProjectedContent.decorators = [
    componentWrapperDecorator(story => wrap(
        story,
        `This story supplies the Toolbar component with a div with red background:`,
        `<div style="backgroundColor:red;">Projected content</div>`
    ))
];

export const withToolbarDivider = template.bind({});
withToolbarDivider.decorators = [
    componentWrapperDecorator(story => wrap(
        story,
        `This story supplies the Toolbar component with two Toolbar Divider components:`,
        `<div>Text One</div><adf-toolbar-divider></adf-toolbar-divider><div>Text Two</div><adf-toolbar-divider></adf-toolbar-divider><div>Text Three</div>`
    ))
];
