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
import { ViewerSidebarComponent } from './viewer-sidebar.component';
import { provideStoryCore } from '../../stories/core-story.providers';

type ViewerSidebarStoryArgs = ViewerSidebarComponent & {
    open?: boolean;
    position?: 'start' | 'end';
    headerText?: string;
    bodyText?: string;
};

const meta: Meta<ViewerSidebarStoryArgs> = {
    component: ViewerSidebarComponent,
    title: 'Core/Viewer/Viewer Sidebar',
    decorators: [
        moduleMetadata({
            imports: [ViewerSidebarComponent]
        }),
        applicationConfig({
            providers: [...provideStoryCore()]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Slot for the Viewer side panel content. Mounted on the start (left) or end (right) of the viewer container.`
            }
        }
    },
    argTypes: {
        open: {
            control: 'boolean',
            description: 'Toggles the sidebar visibility (mocked through `display` style on the host).',
            table: { category: 'Storybook Helpers' }
        },
        position: {
            control: 'inline-radio',
            options: ['start', 'end'],
            description: 'Switches the sample layout between a leading and trailing sidebar.',
            table: { category: 'Storybook Helpers' }
        },
        headerText: {
            control: 'text',
            description: 'Sample header text rendered inside the projected slot.',
            table: { category: 'Storybook Helpers' }
        },
        bodyText: {
            control: 'text',
            description: 'Sample body text rendered inside the projected slot.',
            table: { category: 'Storybook Helpers' }
        }
    },
    args: {
        open: true,
        position: 'end',
        headerText: 'Details',
        bodyText: 'Information about the selected document goes here.'
    }
};

export default meta;
type Story = StoryObj<ViewerSidebarStoryArgs>;

const sidebarTemplate = `
    <div style="display:flex; min-height:240px; border:1px solid #ddd;">
        <div *ngIf="position === 'start' && open" style="width:280px;">
            <adf-viewer-sidebar style="display:block; height:100%; padding:16px; background:#fafafa; border-right:1px solid #ddd;">
                <h3 style="margin-top:0;">{{ headerText }}</h3>
                <p>{{ bodyText }}</p>
            </adf-viewer-sidebar>
        </div>

        <div style="flex:1; display:flex; align-items:center; justify-content:center; color:#888;">
            Document preview area
        </div>

        <div *ngIf="position === 'end' && open" style="width:280px;">
            <adf-viewer-sidebar style="display:block; height:100%; padding:16px; background:#fafafa; border-left:1px solid #ddd;">
                <h3 style="margin-top:0;">{{ headerText }}</h3>
                <p>{{ bodyText }}</p>
            </adf-viewer-sidebar>
        </div>
    </div>`;

export const OpenEnd: Story = {
    render: (args) => ({ props: args, template: sidebarTemplate }),
    args: { open: true, position: 'end' }
};

export const OpenStart: Story = {
    render: (args) => ({ props: args, template: sidebarTemplate }),
    args: { open: true, position: 'start' }
};

export const Closed: Story = {
    render: (args) => ({ props: args, template: sidebarTemplate }),
    args: { open: false, position: 'end' }
};
