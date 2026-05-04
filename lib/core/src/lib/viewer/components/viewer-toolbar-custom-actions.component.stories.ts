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
import { ViewerToolbarCustomActionsComponent } from './viewer-toolbar-custom-actions.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { provideStoryCore } from '../../stories/core-story.providers';

type ViewerToolbarCustomActionsStoryArgs = ViewerToolbarCustomActionsComponent & {
    populated?: boolean;
};

const meta: Meta<ViewerToolbarCustomActionsStoryArgs> = {
    component: ViewerToolbarCustomActionsComponent,
    title: 'Core/Viewer/Viewer Toolbar Custom Actions',
    decorators: [
        moduleMetadata({
            imports: [ViewerToolbarCustomActionsComponent, MatButtonModule, MatIconModule]
        }),
        applicationConfig({
            providers: [...provideStoryCore()]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Slot for application-defined toolbar actions appended to the Viewer toolbar.`
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
type Story = StoryObj<ViewerToolbarCustomActionsStoryArgs>;

export const Empty: Story = {
    render: () => ({
        template: `<adf-viewer-toolbar-custom-actions style="display:inline-flex; padding:8px; border:1px dashed #ccc;"></adf-viewer-toolbar-custom-actions>`
    }),
    args: {
        populated: false
    }
};

export const Populated: Story = {
    render: () => ({
        template: `
            <adf-viewer-toolbar-custom-actions style="display:inline-flex; gap:8px; padding:8px;">
                <button mat-stroked-button>Share</button>
                <button mat-stroked-button color="primary">Approve</button>
                <button mat-flat-button color="warn">Reject</button>
            </adf-viewer-toolbar-custom-actions>`
    })
};
