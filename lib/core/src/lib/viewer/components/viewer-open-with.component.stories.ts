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
import { ViewerOpenWithComponent } from './viewer-open-with.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { provideStoryCore } from '../../stories/core-story.providers';

type ViewerOpenWithStoryArgs = ViewerOpenWithComponent & {
    populated?: boolean;
};

const meta: Meta<ViewerOpenWithStoryArgs> = {
    component: ViewerOpenWithComponent,
    title: 'Core/Viewer/Viewer Open With',
    decorators: [
        moduleMetadata({
            imports: [ViewerOpenWithComponent, MatButtonModule, MatIconModule, MatMenuModule]
        }),
        applicationConfig({
            providers: [...provideStoryCore()]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Slot used to project an "Open With" menu inside the Viewer toolbar, listing alternative viewers/applications.`
            }
        }
    },
    argTypes: {
        populated: {
            control: 'boolean',
            description: 'Toggles between an empty slot and a slot populated with a sample menu.',
            table: { category: 'Storybook Helpers' }
        }
    },
    args: {
        populated: true
    }
};

export default meta;
type Story = StoryObj<ViewerOpenWithStoryArgs>;

export const Empty: Story = {
    render: () => ({
        template: `<adf-viewer-open-with style="display:inline-flex; padding:8px; border:1px dashed #ccc;"></adf-viewer-open-with>`
    }),
    args: {
        populated: false
    }
};

export const Populated: Story = {
    render: () => ({
        template: `
            <adf-viewer-open-with>
                <button mat-stroked-button [matMenuTriggerFor]="openWithMenu">
                    <mat-icon>open_in_new</mat-icon>
                    Open With
                </button>
                <mat-menu #openWithMenu="matMenu">
                    <button mat-menu-item>
                        <mat-icon>description</mat-icon><span>Microsoft Word</span>
                    </button>
                    <button mat-menu-item>
                        <mat-icon>edit_note</mat-icon><span>Google Docs</span>
                    </button>
                    <button mat-menu-item>
                        <mat-icon>cloud</mat-icon><span>Online Editor</span>
                    </button>
                </mat-menu>
            </adf-viewer-open-with>`
    })
};
