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
import { ViewerToolbarActionsComponent } from './viewer-toolbar-actions.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { provideStoryCore } from '../../stories/core-story.providers';

type ViewerToolbarActionsStoryArgs = ViewerToolbarActionsComponent & {
    populated?: boolean;
};

const meta: Meta<ViewerToolbarActionsStoryArgs> = {
    component: ViewerToolbarActionsComponent,
    title: 'Core/Viewer/Viewer Toolbar Actions',
    decorators: [
        moduleMetadata({
            imports: [ViewerToolbarActionsComponent, MatButtonModule, MatIconModule]
        }),
        applicationConfig({
            providers: [...provideStoryCore()]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Slot used by the Viewer to host built-in toolbar actions (download, print, etc.). Renders projected content as-is.`
            }
        }
    },
    argTypes: {
        populated: {
            control: 'boolean',
            description: 'Toggles between an empty slot and a slot populated with sample buttons.',
            table: { category: 'Storybook Helpers' }
        }
    },
    args: {
        populated: true
    }
};

export default meta;
type Story = StoryObj<ViewerToolbarActionsStoryArgs>;

export const Empty: Story = {
    render: () => ({
        template: `<adf-viewer-toolbar-actions style="display:inline-flex; padding:8px; border:1px dashed #ccc;"></adf-viewer-toolbar-actions>`
    }),
    args: {
        populated: false
    }
};

export const Populated: Story = {
    render: () => ({
        template: `
            <adf-viewer-toolbar-actions style="display:inline-flex; gap:4px; padding:8px;">
                <button mat-icon-button aria-label="Download"><mat-icon>file_download</mat-icon></button>
                <button mat-icon-button aria-label="Print"><mat-icon>print</mat-icon></button>
                <button mat-icon-button aria-label="Fullscreen"><mat-icon>fullscreen</mat-icon></button>
            </adf-viewer-toolbar-actions>`
    })
};
