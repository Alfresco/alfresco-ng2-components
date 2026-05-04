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
import { provideHttpClient } from '@angular/common/http';
import { TxtViewerComponent } from './txt-viewer.component';
import { provideStoryCore } from '../../../stories/core-story.providers';

type TxtViewerStoryArgs = TxtViewerComponent & {
    sampleText?: string;
};

const SHORT_TEXT = `Hello from the ADF Text Viewer!

Use this story to preview short snippets of plain-text content.`;

const LONG_TEXT = Array.from(
    { length: 60 },
    (_, i) => `${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
).join('\n');

const buildBlob = (content: string) => new Blob([content], { type: 'text/plain' });

const meta: Meta<TxtViewerStoryArgs> = {
    component: TxtViewerComponent,
    title: 'Core/Viewer/Txt Viewer',
    decorators: [
        moduleMetadata({
            imports: [TxtViewerComponent]
        }),
        applicationConfig({
            providers: [provideHttpClient(), ...provideStoryCore()]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Renders the textual content of a plain-text file from either an external URL or an in-memory \`Blob\`.`
            }
        }
    },
    argTypes: {
        urlFile: {
            control: 'text',
            description: 'External URL pointing to the text file to load.',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' }
            }
        },
        blobFile: {
            control: false,
            description: 'In-memory Blob containing the text content.',
            table: {
                type: { summary: 'Blob' },
                defaultValue: { summary: 'undefined' }
            }
        },
        sampleText: {
            control: 'text',
            description: 'Sample text content used to build the Blob input for the story.',
            table: { category: 'Storybook Helpers' }
        },
        contentLoaded: {
            action: 'contentLoaded',
            description: 'Emitted when the text content finishes loading.',
            table: {
                type: { summary: 'EventEmitter <void>' },
                category: 'Actions'
            }
        }
    },
    args: {
        sampleText: SHORT_TEXT
    },
    render: (args) => ({
        props: {
            ...args,
            blobFile: args.sampleText ? buildBlob(args.sampleText) : undefined
        },
        template: `<div style="height:320px; border:1px solid #ddd; overflow:auto;">
            <adf-txt-viewer [blobFile]="blobFile" (contentLoaded)="contentLoaded($event)" />
        </div>`
    })
};

export default meta;
type Story = StoryObj<TxtViewerStoryArgs>;

export const ShortContent: Story = {
    args: {
        sampleText: SHORT_TEXT
    }
};

export const LongScrollingContent: Story = {
    args: {
        sampleText: LONG_TEXT
    }
};

export const Empty: Story = {
    args: {
        sampleText: ''
    }
};
