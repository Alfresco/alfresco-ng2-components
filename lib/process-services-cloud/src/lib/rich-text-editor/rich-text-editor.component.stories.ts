/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { RichTextEditorModule } from './rich-text-editor.module';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ProcessServicesCloudStoryModule } from '../testing/process-services-cloud-story.module';
import { RichTextEditorComponent } from './rich-text-editor.component';
import { exampleData } from './mocks/rich-text-editor.mock';

export default {
    component: RichTextEditorComponent,
    title: 'Core/Rich Text Editor/Rich Text Editor',
    decorators: [
        moduleMetadata({
            imports: [ProcessServicesCloudStoryModule, RichTextEditorModule]
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
        readOnly: {
            control: 'boolean',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        }
    }
} as Meta;

const template: Story<RichTextEditorComponent> = (args: RichTextEditorComponent) => ({
    props: args,
    template: `
    <adf-rich-text-editor
        [data]=data
        [readOnly]=readOnly
        #editor >
    </adf-rich-text-editor>
    <hr/>
    <h3>Output data from editor:</h3>
    <pre>{{editor.outputData$ | async | json}}</pre>
    `
});

export const defaultRichTextEditor = template.bind({});
defaultRichTextEditor.args = {
    data: {
        time: 1663761278752,
        blocks: [
            {
                id: 'yOV_DfEQhC',
                type: 'paragraph',
                data: {
                    text: 'text'
                }
            }
        ],
        version: '2.25.0'
    }
};

export const readOnlyRichTextEditor = template.bind({});
readOnlyRichTextEditor.args = {
    readOnly: true,
    data: exampleData
};
