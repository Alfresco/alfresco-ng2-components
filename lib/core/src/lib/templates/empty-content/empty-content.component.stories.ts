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
import { EmptyContentComponent } from './empty-content.component';
import { CoreStoryModule } from '../../testing/core.story.module';
import { TemplateModule } from '../template.module';

export default {
    component: EmptyContentComponent,
    title: 'Core/Template/Empty Content',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, TemplateModule]
        })
    ],
    argTypes: {
        icon: {
            control: 'text',
            description: 'Material Icon to use.',
            defaultValue: 'cake',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'cake' }
            }
        },
        title: {
            control: 'text',
            description: 'String or Resource Key for the title.',
            defaultValue: 'title',
            table: {
                type: { summary: 'string' }
            }
        },
        subtitle: {
            control: 'text',
            description: 'String or Resource Key for the subtitle.',
            defaultValue: 'subtitle',
            table: {
                type: { summary: 'string' }
            }
        }
    }
} as Meta;

const template: Story<EmptyContentComponent> = (args: EmptyContentComponent) => ({
    props: args
});

export const defaultEmptyContent = template.bind({});

const wrap = (story: string, title?: string, content?:  string): string => `<h3>${title ? title : ''}</h3>${story}`.replace('></adf-empty-content>',`>${content ? content : ''}</adf-empty-content>`);
export const withProjectedContent = template.bind({});
withProjectedContent.decorators = [
    componentWrapperDecorator(story => wrap(
        story,
        `This story supplies the Empty Content component with a div with red background:`,
        `<div style="backgroundColor:red;">Projected content</div>`
    ))
];
