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
import { ProcessServicesCloudStoryModule } from '../testing/process-services-cloud-story.module';
import { RichTextEditorComponent } from './rich-text-editor.component';
import { importProvidersFrom } from '@angular/core';

export default {
    component: RichTextEditorComponent,
    title: 'Process Services Cloud/Rich Text Editor',
    decorators: [
        moduleMetadata({
            imports: [RichTextEditorComponent]
        }),
        applicationConfig({
            providers: [importProvidersFrom(ProcessServicesCloudStoryModule)]
        })
    ],
    argTypes: {
        data: {
            control: 'object',
            description: 'Output data.',
            table: {
                type: { summary: 'OutputData' }
            }
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder text.',
            table: {
                type: { summary: 'string' }
            }
        },
        autoFocus: {
            control: 'boolean',
            description: 'Focus on the editor when it is loaded.',
            table: {
                type: { summary: 'boolean' }
            }
        }
    }
} as Meta<RichTextEditorComponent>;

const template: StoryFn<RichTextEditorComponent> = (args) => ({
    props: args,
    template: `
    <adf-cloud-rich-text-editor [data]=data [placeholder]=placeholder [autofocus]=autofocus #editor>
    </adf-cloud-rich-text-editor>
    <hr/>
    <h3>Output data from editor:</h3>
    <pre>{{editor.outputData$ | async | json}}</pre>
    `
});

export const DefaultRichTextEditor = template.bind({});
DefaultRichTextEditor.args = {
    data: {
        time: 1550476186479,
        blocks: [
            {
                type: 'paragraph',
                data: {
                    text: 'The example of text that was written in <b>one of popular</b> text editors.'
                }
            },
            {
                type: 'header',
                data: {
                    text: 'With the header of course',
                    level: 2
                }
            },
            {
                type: 'paragraph',
                data: {
                    text: 'So what do we have?'
                }
            }
        ],
        version: '2.29.0'
    },
    placeholder: 'Type something here...',
    autoFocus: true
};
