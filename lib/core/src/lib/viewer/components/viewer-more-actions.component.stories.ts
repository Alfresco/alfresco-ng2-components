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
import { ViewerMoreActionsComponent } from './viewer-more-actions.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { provideStoryCore } from '../../stories/core-story.providers';

type ViewerMoreActionsStoryArgs = ViewerMoreActionsComponent & {
    populated?: boolean;
};

const meta: Meta<ViewerMoreActionsStoryArgs> = {
    component: ViewerMoreActionsComponent,
    title: 'Core/Viewer/Viewer More Actions',
    decorators: [
        moduleMetadata({
            imports: [ViewerMoreActionsComponent, MatButtonModule, MatIconModule, MatMenuModule]
        }),
        applicationConfig({
            providers: [...provideStoryCore()]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Slot for the kebab/overflow menu attached to the Viewer toolbar.`
            }
        }
    },
    argTypes: {
        populated: {
            control: 'boolean',
            description: 'Toggles between an empty slot and a slot populated with a sample menu trigger.',
            table: { category: 'Storybook Helpers' }
        }
    },
    args: {
        populated: true
    }
};

export default meta;
type Story = StoryObj<ViewerMoreActionsStoryArgs>;

export const Empty: Story = {
    render: () => ({
        template: `<adf-viewer-more-actions style="display:inline-flex; padding:8px; border:1px dashed #ccc;"></adf-viewer-more-actions>`
    }),
    args: {
        populated: false
    }
};

export const Populated: Story = {
    render: () => ({
        template: `
            <adf-viewer-more-actions>
                <button mat-icon-button [matMenuTriggerFor]="moreMenu" aria-label="More actions">
                    <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #moreMenu="matMenu">
                    <button mat-menu-item>
                        <mat-icon>file_copy</mat-icon><span>Copy</span>
                    </button>
                    <button mat-menu-item>
                        <mat-icon>edit</mat-icon><span>Rename</span>
                    </button>
                    <button mat-menu-item>
                        <mat-icon>delete</mat-icon><span>Delete</span>
                    </button>
                </mat-menu>
            </adf-viewer-more-actions>`
    })
};
