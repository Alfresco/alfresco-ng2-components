/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { FormRendererComponent } from './form-renderer.component';
import { FormModel } from './widgets';
import { provideStoryCore } from '../stories/core-story.providers';
import { formSideNavLayoutMock, formTabsLayoutMock } from './mock/form.mock';

type FormRendererStoryArgs = {
    readOnly: boolean;
};

const meta: Meta<FormRendererStoryArgs> = {
    component: FormRendererComponent,
    title: 'Core/Form/Form Renderer',
    decorators: [
        moduleMetadata({
            imports: [FormRendererComponent]
        }),
        applicationConfig({
            providers: [...provideStoryCore()]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Renders an ADF form definition. Supports a flat \`tabs\` layout and a hierarchical \`sidenav\` layout where categories can optionally render their children as an inline tab group.`
            }
        }
    },
    argTypes: {
        readOnly: {
            control: 'boolean',
            description: 'Toggles the read-only mode of the form',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        }
    },
    args: {
        readOnly: false
    }
};

export default meta;
type Story = StoryObj<FormRendererStoryArgs>;

export const TabsLayout: Story = {
    render: (args) => ({
        props: {
            formDefinition: new FormModel(formTabsLayoutMock),
            readOnly: args.readOnly
        },
        template: `<adf-form-renderer [formDefinition]="formDefinition" [readOnly]="readOnly"></adf-form-renderer>`
    })
};

export const SidenavLayout: Story = {
    render: (args) => ({
        props: {
            formDefinition: new FormModel(formSideNavLayoutMock),
            readOnly: args.readOnly
        },
        template: `<adf-form-renderer [formDefinition]="formDefinition" [readOnly]="readOnly"></adf-form-renderer>`
    })
};
