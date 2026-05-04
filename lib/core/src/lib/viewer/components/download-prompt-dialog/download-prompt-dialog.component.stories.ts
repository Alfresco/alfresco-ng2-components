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
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { DownloadPromptDialogComponent } from './download-prompt-dialog.component';
import { DownloadPromptDialogStorybookComponent } from './download-prompt-dialog.dialog.stories.component';
import { provideStoryCore } from '../../../stories/core-story.providers';

const meta: Meta<DownloadPromptDialogStorybookComponent> = {
    component: DownloadPromptDialogStorybookComponent,
    title: 'Core/Viewer/Download Prompt Dialog',
    decorators: [
        moduleMetadata({
            imports: [DownloadPromptDialogStorybookComponent, DownloadPromptDialogComponent, MatButtonModule, MatDialogModule]
        }),
        applicationConfig({
            providers: [...provideStoryCore()]
        })
    ],
    parameters: {
        docs: {
            description: {
                component:
                    `Dialog shown by the Viewer to prompt the user to download the file when the preview takes too long to render. ` +
                    `The story uses a launcher button so the dialog can be opened with the configured \`MAT_DIALOG_DATA\` context.`
            }
        }
    },
    argTypes: {
        closed: {
            action: 'closed',
            description: 'Emitted when the dialog is dismissed, with the user-selected `DownloadPromptActions` value.',
            table: {
                type: { summary: 'EventEmitter <DownloadPromptActions>' },
                category: 'Actions'
            }
        }
    }
};

export default meta;
type Story = StoryObj<DownloadPromptDialogStorybookComponent>;

export const Default: Story = {
    render: (args) => ({ props: args })
};
