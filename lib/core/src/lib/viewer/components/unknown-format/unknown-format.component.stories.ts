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
import { UnknownFormatComponent } from './unknown-format.component';
import { provideStoryCore } from '../../../stories/core-story.providers';

const meta: Meta<UnknownFormatComponent> = {
    component: UnknownFormatComponent,
    title: 'Core/Viewer/Unknown Format',
    decorators: [
        moduleMetadata({
            imports: [UnknownFormatComponent]
        }),
        applicationConfig({
            providers: [...provideStoryCore()]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Fallback view rendered by the Viewer when the file format is not supported.`
            }
        }
    },
    argTypes: {
        customError: {
            control: 'text',
            description: 'Custom error message displayed instead of the default unsupported-format text.',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' }
            }
        }
    },
    args: {
        customError: undefined
    }
};

export default meta;
type Story = StoryObj<UnknownFormatComponent>;

export const Default: Story = {
    render: (args) => ({ props: args })
};

export const WithCustomError: Story = {
    render: (args) => ({ props: args }),
    args: {
        customError: 'This file type is not supported by your tenant. Please contact your administrator.'
    }
};
