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
            description: 'Angular Material icon',
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'string'
                },
                defaultValue: {
                    summary: 'cake'
                }
            }
        },
        title: {
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'string'
                },
                defaultValue: {
                    summary: ''
                }
            }
        },
        subtitle: {
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'string'
                },
                defaultValue: {
                    summary: ''
                }
            }
        },
        lines: {
            name: 'lines',
            description: 'Content Projection Text',
            control: {type: 'object'},
            defaultValue: [
                'Items you removed are moved to the Trash',
                'Empty Trash to permanently delete items'
            ],
            table: {
                category: 'Strories Controls',
                type: {
                    summary: 'array'
                }
            }
        }
    }
} as Meta;

const template: Story<EmptyContentComponent> = (
    args: EmptyContentComponent
) => ({
    props: args
});

export const defaultStory = template.bind({});
defaultStory.argTypes = {
    lines: {
        control: { disable: true }
    }
};
defaultStory.args = {
    icon: 'star_rate',
    title: 'No favourite files or folders',
    subtitle: 'Favourite items that you want to easily find later'
};
defaultStory.storyName = 'Default';

export const multipleLines: Story<EmptyContentComponent> = (
    args: EmptyContentComponent & { lines: string[] }
) => ({
    props: {
        ...args
    },
    template: `
    <adf-empty-content icon="delete" title="Trash is empty">
        <p class="adf-empty-content__text" *ngFor="let line of ${JSON.stringify(
            args.lines
        ).replace(/\"/g, '\'')}">
            {{ line }}
        </p>
    </adf-empty-content>`
});
