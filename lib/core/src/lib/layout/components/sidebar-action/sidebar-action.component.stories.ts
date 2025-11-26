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
import { LAYOUT_DIRECTIVES } from '../../layout.module';
import { SidebarActionMenuComponent } from './sidebar-action-menu.component';
import { provideStoryCore } from '../../../testing';

const meta: Meta<SidebarActionMenuComponent> = {
    component: SidebarActionMenuComponent,
    title: 'Core/Layout/Sidebar Action Menu',
    decorators: [
        moduleMetadata({
            imports: [...LAYOUT_DIRECTIVES]
        }),
        applicationConfig({
            providers: [...provideStoryCore()]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Displays a sidebar-action menu information panel.`
            }
        }
    },
    argTypes: {
        expanded: {
            control: 'boolean',
            description: 'Toggle the sidebar action menu on expand',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        title: {
            control: 'text',
            description: 'The title of the sidebar action',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' }
            }
        },
        width: {
            control: 'number',
            description: 'Width in pixels for sidebar action menu options',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '272' }
            }
        }
    },
    args: {
        expanded: true,
        width: 272
    }
};

export default meta;
type Story = StoryObj<SidebarActionMenuComponent>;

export const sidebarActionMenu: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        title: 'Hello from Sidebar Action Menu!'
    }
};
