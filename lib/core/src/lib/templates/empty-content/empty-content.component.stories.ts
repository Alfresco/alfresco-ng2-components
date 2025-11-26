/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { applicationConfig, Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { EmptyContentComponent } from './empty-content.component';
import { TEMPLATE_DIRECTIVES } from '../template.module';
import { provideStoryCore } from '../../testing';

type EmptyContentStoryArgs = EmptyContentComponent & {
    anyContentProjection?: boolean;
};

const meta: Meta<EmptyContentStoryArgs> = {
    component: EmptyContentComponent,
    title: 'Core/Template/Empty Content',
    decorators: [
        moduleMetadata({
            imports: [...TEMPLATE_DIRECTIVES]
        }),
        applicationConfig({
            providers: [...provideStoryCore()]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Provides a generic "Empty Content" placeholder for components.`
            }
        }
    },
    argTypes: {
        icon: {
            control: 'text',
            description: 'Material Icon to use.',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'cake' }
            }
        },
        title: {
            control: 'text',
            description: 'String or Resource Key for the title.',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'title' }
            }
        },
        subtitle: {
            control: 'text',
            description: 'String or Resource Key for the subtitle.',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'subtitle' }
            }
        },
        anyContentProjection: {
            name: 'with any component / selector',
            control: 'boolean',
            description: 'Showcase content projection with any component / selector',
            table: {
                category: 'Content Projection',
                type: {
                    summary: 'code',
                    detail: '<div style="color:red">\n  projected content\n</div>'
                },
                defaultValue: { summary: 'false' }
            }
        }
    },
    args: {
        icon: 'cake',
        title: 'title',
        subtitle: 'subtitle',
        anyContentProjection: false
    }
};

export default meta;
type Story = StoryObj<EmptyContentStoryArgs>;

export const EmptyContent: Story = {
    render: (args: EmptyContentComponent & { anyContentProjection: boolean }) => ({
        props: args,
        template: `
    <adf-empty-content icon="${args.icon}" title="${args.title}" subtitle="${args.subtitle}">
        <div *ngIf="${args.anyContentProjection}" style="color:red">
            projected content
        </div>
    </adf-empty-content>`
    }),
    parameters: { layout: 'centered' }
};
