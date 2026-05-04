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
import { provideHttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ViewerComponent } from './viewer.component';
import { ViewerToolbarComponent } from './viewer-toolbar.component';
import { ViewerToolbarActionsComponent } from './viewer-toolbar-actions.component';
import { ViewerToolbarCustomActionsComponent } from './viewer-toolbar-custom-actions.component';
import { ViewerSidebarComponent } from './viewer-sidebar.component';
import { ViewerMoreActionsComponent } from './viewer-more-actions.component';
import { ViewerOpenWithComponent } from './viewer-open-with.component';
import { CloseButtonPosition } from '../models/viewer.model';
import { provideStoryCore } from '../../stories/core-story.providers';

const SAMPLE_IMAGE_URL =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/640px-PNG_transparency_demonstration_1.png';

type ViewerStoryArgs = ViewerComponent<unknown> & {
    showCustomToolbar?: boolean;
    showCustomActions?: boolean;
    showOpenWith?: boolean;
    showMoreActions?: boolean;
    showSidebar?: boolean;
};

const meta: Meta<ViewerStoryArgs> = {
    component: ViewerComponent,
    title: 'Core/Viewer/Viewer',
    decorators: [
        moduleMetadata({
            imports: [
                ViewerComponent,
                ViewerToolbarComponent,
                ViewerToolbarActionsComponent,
                ViewerToolbarCustomActionsComponent,
                ViewerSidebarComponent,
                ViewerMoreActionsComponent,
                ViewerOpenWithComponent,
                MatButtonModule,
                MatIconModule,
                MatMenuModule
            ]
        }),
        applicationConfig({
            providers: [provideHttpClient(), ...provideStoryCore()]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Top-level Viewer container that orchestrates the toolbar, sidebar, file rendering and download-prompt dialog flow.`
            }
        }
    },
    argTypes: {
        urlFile: {
            control: 'text',
            description: 'External URL pointing to the file to display.',
            table: { type: { summary: 'string' } }
        },
        blobFile: {
            control: false,
            description: 'In-memory Blob containing the file to display.',
            table: { type: { summary: 'Blob' } }
        },
        showViewer: {
            control: 'boolean',
            description: 'Toggles visibility of the entire viewer container.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
        },
        allowGoBack: {
            control: 'boolean',
            description: 'Shows the close (back) button on the toolbar.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
        },
        allowFullScreen: {
            control: 'boolean',
            description: 'Toggles the fullscreen action on the toolbar.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
        },
        showToolbar: {
            control: 'boolean',
            description: 'Toggles visibility of the built-in toolbar (ignored when a custom `<adf-viewer-toolbar>` is projected).',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
        },
        overlayMode: {
            control: 'boolean',
            description: 'When `true`, renders the viewer as a full-page overlay over the current content.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
        },
        allowNavigate: {
            control: 'boolean',
            description: 'Enables previous/next navigation buttons.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
        },
        canNavigateBefore: {
            control: 'boolean',
            description: 'Toggles the previous (`<`) navigation button. Requires `allowNavigate`.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
        },
        canNavigateNext: {
            control: 'boolean',
            description: 'Toggles the next (`>`) navigation button. Requires `allowNavigate`.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
        },
        allowLeftSidebar: {
            control: 'boolean',
            description: 'Allows showing the left-side info sidebar.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
        },
        allowRightSidebar: {
            control: 'boolean',
            description: 'Allows showing the right-side info sidebar.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
        },
        showLeftSidebar: {
            control: 'boolean',
            description: 'Visibility of the left sidebar. Requires `allowLeftSidebar`.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
        },
        showRightSidebar: {
            control: 'boolean',
            description: 'Visibility of the right sidebar. Requires `allowRightSidebar`.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
        },
        readOnly: {
            control: 'boolean',
            description: 'Disables editing functionality on the underlying renderer.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
        },
        allowedEditActions: {
            control: 'object',
            description: 'Per-action map controlling which editing actions are enabled (e.g. `{ rotate: true, crop: false }`).',
            table: { type: { summary: '{ [key: string]: boolean }' } }
        },
        tracks: {
            control: 'object',
            description: 'Media subtitles forwarded to the media player.',
            table: { type: { summary: 'Track[]' } }
        },
        mimeType: {
            control: 'text',
            description: 'Override MIME type for the file.',
            table: { type: { summary: 'string' } }
        },
        fileName: {
            control: 'text',
            description: 'Override file name displayed in the toolbar.',
            table: { type: { summary: 'string' } }
        },
        title: {
            control: 'text',
            description: 'Override content title displayed by the toolbar.',
            table: { type: { summary: 'string' } }
        },
        nodeId: {
            control: 'text',
            description: 'Identifier of the node currently opened by the viewer.',
            table: { type: { summary: 'string' } }
        },
        nodeMimeType: {
            control: 'text',
            description: 'Original node MIME type, used when the rendition MIME differs.',
            table: { type: { summary: 'string' } }
        },
        customError: {
            control: 'text',
            description: 'Custom error message displayed when the format is unsupported.',
            table: { type: { summary: 'string' } }
        },
        showToolbarDividers: {
            control: 'boolean',
            description: 'Toggles toolbar divider visibility.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
        },
        hideInfoButton: {
            control: 'boolean',
            description: 'Hides the info button on the toolbar.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
        },
        closeButtonPosition: {
            control: 'inline-radio',
            options: [CloseButtonPosition.Left, CloseButtonPosition.Right],
            description: 'Position of the close button: `left` or `right`.',
            table: { type: { summary: `'left' | 'right'` }, defaultValue: { summary: `'left'` } }
        },
        showCustomToolbar: {
            control: 'boolean',
            description: 'Replaces the built-in toolbar with a custom projected `<adf-viewer-toolbar>`.',
            table: { category: 'Storybook Helpers' }
        },
        showCustomActions: {
            control: 'boolean',
            description: 'Projects sample buttons inside `<adf-viewer-toolbar-custom-actions>`.',
            table: { category: 'Storybook Helpers' }
        },
        showOpenWith: {
            control: 'boolean',
            description: 'Projects a sample `<adf-viewer-open-with>` menu in the toolbar.',
            table: { category: 'Storybook Helpers' }
        },
        showMoreActions: {
            control: 'boolean',
            description: 'Projects a sample `<adf-viewer-more-actions>` overflow menu in the toolbar.',
            table: { category: 'Storybook Helpers' }
        },
        showSidebar: {
            control: 'boolean',
            description: 'Projects a sample `<adf-viewer-sidebar>` content panel.',
            table: { category: 'Storybook Helpers' }
        },
        downloadFile: {
            action: 'downloadFile',
            description: 'Emitted when the user clicks Download in the download prompt dialog.',
            table: { type: { summary: 'EventEmitter <void>' }, category: 'Actions' }
        },
        navigateBefore: {
            action: 'navigateBefore',
            description: 'Emitted when the user clicks the previous (`<`) navigation button.',
            table: { type: { summary: 'EventEmitter <Event>' }, category: 'Actions' }
        },
        navigateNext: {
            action: 'navigateNext',
            description: 'Emitted when the user clicks the next (`>`) navigation button.',
            table: { type: { summary: 'EventEmitter <Event>' }, category: 'Actions' }
        },
        showViewerChange: {
            action: 'showViewerChange',
            description: 'Emitted when the viewer is closed.',
            table: { type: { summary: 'EventEmitter <boolean>' }, category: 'Actions' }
        },
        submitFile: {
            action: 'submitFile',
            description: 'Emitted when an image edit is submitted by the image viewer.',
            table: { type: { summary: 'EventEmitter <Blob>' }, category: 'Actions' }
        }
    },
    args: {
        urlFile: SAMPLE_IMAGE_URL,
        fileName: 'sample-image.png',
        mimeType: 'image/png',
        showViewer: true,
        showToolbar: true,
        overlayMode: false,
        allowGoBack: true,
        allowFullScreen: true,
        allowNavigate: false,
        canNavigateBefore: true,
        canNavigateNext: true,
        allowLeftSidebar: false,
        allowRightSidebar: false,
        showLeftSidebar: false,
        showRightSidebar: false,
        readOnly: true,
        allowedEditActions: { rotate: true, crop: true },
        showToolbarDividers: true,
        hideInfoButton: false,
        closeButtonPosition: CloseButtonPosition.Left,
        showCustomToolbar: false,
        showCustomActions: false,
        showOpenWith: false,
        showMoreActions: false,
        showSidebar: false
    },
    render: (args) => ({
        props: args,
        template: `<div style="height:600px; border:1px solid #ddd;">
            <adf-viewer
                [urlFile]="urlFile"
                [blobFile]="blobFile"
                [showViewer]="showViewer"
                [allowGoBack]="allowGoBack"
                [allowFullScreen]="allowFullScreen"
                [showToolbar]="showToolbar"
                [overlayMode]="overlayMode"
                [allowNavigate]="allowNavigate"
                [canNavigateBefore]="canNavigateBefore"
                [canNavigateNext]="canNavigateNext"
                [allowLeftSidebar]="allowLeftSidebar"
                [allowRightSidebar]="allowRightSidebar"
                [showLeftSidebar]="showLeftSidebar"
                [showRightSidebar]="showRightSidebar"
                [readOnly]="readOnly"
                [allowedEditActions]="allowedEditActions"
                [tracks]="tracks || []"
                [mimeType]="mimeType"
                [fileName]="fileName"
                [title]="title"
                [nodeId]="nodeId"
                [nodeMimeType]="nodeMimeType"
                [customError]="customError"
                [showToolbarDividers]="showToolbarDividers"
                [hideInfoButton]="hideInfoButton"
                [closeButtonPosition]="closeButtonPosition"
                (downloadFile)="downloadFile($event)"
                (navigateBefore)="navigateBefore($event)"
                (navigateNext)="navigateNext($event)"
                (showViewerChange)="showViewerChange($event)"
                (submitFile)="submitFile($event)">

                <adf-viewer-toolbar *ngIf="showCustomToolbar" style="display:flex; align-items:center; gap:8px; padding:8px; background:#f5f5f5;">
                    <span><strong>Custom Toolbar</strong> · {{ fileName }}</span>
                    <span style="flex:1"></span>
                    <button mat-icon-button aria-label="Custom action"><mat-icon>star</mat-icon></button>
                </adf-viewer-toolbar>

                <adf-viewer-toolbar-custom-actions *ngIf="showCustomActions">
                    <button mat-stroked-button>Share</button>
                    <button mat-flat-button color="primary">Approve</button>
                </adf-viewer-toolbar-custom-actions>

                <adf-viewer-open-with *ngIf="showOpenWith">
                    <button mat-stroked-button [matMenuTriggerFor]="openWithMenu">Open With</button>
                    <mat-menu #openWithMenu="matMenu">
                        <button mat-menu-item>Microsoft Word</button>
                        <button mat-menu-item>Google Docs</button>
                    </mat-menu>
                </adf-viewer-open-with>

                <adf-viewer-more-actions *ngIf="showMoreActions">
                    <button mat-icon-button [matMenuTriggerFor]="moreMenu" aria-label="More">
                        <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #moreMenu="matMenu">
                        <button mat-menu-item>Rename</button>
                        <button mat-menu-item>Delete</button>
                    </mat-menu>
                </adf-viewer-more-actions>

                <adf-viewer-sidebar *ngIf="showSidebar" style="display:block; padding:16px; min-width:240px; background:#fafafa;">
                    <h3 style="margin-top:0;">Details</h3>
                    <p>Sidebar content goes here.</p>
                </adf-viewer-sidebar>
            </adf-viewer>
        </div>`
    })
};

export default meta;
type Story = StoryObj<ViewerStoryArgs>;

export const Default: Story = {
    args: {
        urlFile: SAMPLE_IMAGE_URL,
        fileName: 'sample-image.png',
        mimeType: 'image/png'
    }
};

export const WithSidebar: Story = {
    args: {
        urlFile: SAMPLE_IMAGE_URL,
        fileName: 'sample-image.png',
        mimeType: 'image/png',
        allowRightSidebar: true,
        showRightSidebar: true,
        showSidebar: true
    }
};

export const WithCustomToolbarActions: Story = {
    args: {
        urlFile: SAMPLE_IMAGE_URL,
        fileName: 'sample-image.png',
        mimeType: 'image/png',
        showCustomActions: true,
        showOpenWith: true,
        showMoreActions: true
    }
};

export const WithCustomToolbar: Story = {
    args: {
        urlFile: SAMPLE_IMAGE_URL,
        fileName: 'sample-image.png',
        mimeType: 'image/png',
        showCustomToolbar: true
    }
};

export const NavigationEnabled: Story = {
    args: {
        urlFile: SAMPLE_IMAGE_URL,
        fileName: 'sample-image.png',
        mimeType: 'image/png',
        allowNavigate: true,
        canNavigateBefore: true,
        canNavigateNext: true
    }
};

export const CloseButtonOnRight: Story = {
    args: {
        urlFile: SAMPLE_IMAGE_URL,
        fileName: 'sample-image.png',
        mimeType: 'image/png',
        closeButtonPosition: CloseButtonPosition.Right
    }
};
