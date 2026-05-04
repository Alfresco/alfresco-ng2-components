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
import { ViewerToolbarComponent } from './viewer-toolbar.component';
import { ViewerToolbarActionsComponent } from './viewer-toolbar-actions.component';
import { ViewerToolbarCustomActionsComponent } from './viewer-toolbar-custom-actions.component';
import { ViewerMoreActionsComponent } from './viewer-more-actions.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { provideStoryCore } from '../../stories/core-story.providers';

type ViewerToolbarStoryArgs = ViewerToolbarComponent & {
    title?: string;
    showActions?: boolean;
    showCustomActions?: boolean;
    showMoreActions?: boolean;
};

const meta: Meta<ViewerToolbarStoryArgs> = {
    component: ViewerToolbarComponent,
    title: 'Core/Viewer/Viewer Toolbar',
    decorators: [
        moduleMetadata({
            imports: [
                ViewerToolbarComponent,
                ViewerToolbarActionsComponent,
                ViewerToolbarCustomActionsComponent,
                ViewerMoreActionsComponent,
                MatButtonModule,
                MatIconModule,
                MatMenuModule
            ]
        }),
        applicationConfig({
            providers: [...provideStoryCore()]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Container slot for the Viewer top toolbar. Wraps any custom toolbar projected through \`<adf-viewer-toolbar>\`.`
            }
        }
    },
    argTypes: {
        title: {
            control: 'text',
            description: 'Sample title rendered inside the toolbar slot.',
            table: {
                category: 'Storybook Helpers',
                type: { summary: 'string' }
            }
        },
        showActions: {
            control: 'boolean',
            description: 'Toggles the projected `adf-viewer-toolbar-actions` slot.',
            table: { category: 'Storybook Helpers' }
        },
        showCustomActions: {
            control: 'boolean',
            description: 'Toggles the projected `adf-viewer-toolbar-custom-actions` slot.',
            table: { category: 'Storybook Helpers' }
        },
        showMoreActions: {
            control: 'boolean',
            description: 'Toggles the projected `adf-viewer-more-actions` menu slot.',
            table: { category: 'Storybook Helpers' }
        }
    },
    args: {
        title: 'document.pdf',
        showActions: true,
        showCustomActions: false,
        showMoreActions: false
    }
};

export default meta;
type Story = StoryObj<ViewerToolbarStoryArgs>;

export const Default: Story = {
    render: (args) => ({
        props: args,
        template: `
            <adf-viewer-toolbar style="display:flex; align-items:center; gap:8px; padding:8px;">
                <span>{{ title }}</span>
            </adf-viewer-toolbar>`
    })
};

export const WithActions: Story = {
    render: (args) => ({
        props: args,
        template: `
            <adf-viewer-toolbar style="display:flex; align-items:center; gap:8px; padding:8px;">
                <span>{{ title }}</span>
                <span style="flex:1"></span>
                <adf-viewer-toolbar-actions *ngIf="showActions">
                    <button mat-icon-button aria-label="Download"><mat-icon>file_download</mat-icon></button>
                    <button mat-icon-button aria-label="Print"><mat-icon>print</mat-icon></button>
                </adf-viewer-toolbar-actions>
            </adf-viewer-toolbar>`
    }),
    args: {
        showActions: true
    }
};

export const WithCustomActions: Story = {
    render: (args) => ({
        props: args,
        template: `
            <adf-viewer-toolbar style="display:flex; align-items:center; gap:8px; padding:8px;">
                <span>{{ title }}</span>
                <span style="flex:1"></span>
                <adf-viewer-toolbar-custom-actions>
                    <button mat-stroked-button>Share</button>
                    <button mat-stroked-button color="primary">Approve</button>
                </adf-viewer-toolbar-custom-actions>
            </adf-viewer-toolbar>`
    }),
    args: {
        showCustomActions: true
    }
};

export const WithMoreActionsMenu: Story = {
    render: (args) => ({
        props: args,
        template: `
            <adf-viewer-toolbar style="display:flex; align-items:center; gap:8px; padding:8px;">
                <span>{{ title }}</span>
                <span style="flex:1"></span>
                <adf-viewer-more-actions>
                    <button mat-icon-button [matMenuTriggerFor]="moreMenu" aria-label="More actions">
                        <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #moreMenu="matMenu">
                        <button mat-menu-item>Rename</button>
                        <button mat-menu-item>Move</button>
                        <button mat-menu-item>Delete</button>
                    </mat-menu>
                </adf-viewer-more-actions>
            </adf-viewer-toolbar>`
    }),
    args: {
        showMoreActions: true
    }
};
