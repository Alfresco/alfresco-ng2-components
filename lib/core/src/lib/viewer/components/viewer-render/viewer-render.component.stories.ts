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
import { ViewerRenderComponent } from './viewer-render.component';
import { Track } from '../../models/viewer.model';
import { provideStoryCore } from '../../../stories/core-story.providers';

const SAMPLE_IMAGE_URL =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/640px-PNG_transparency_demonstration_1.png';
const SAMPLE_PDF_URL = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';

const TEXT_BLOB = new Blob(['Hello from ViewerRender stories!\nThis text blob is rendered through the txt viewer renderer.'], { type: 'text/plain' });

type ViewerRenderStoryArgs = ViewerRenderComponent & {
    sampleTracks?: Track[];
};

const meta: Meta<ViewerRenderStoryArgs> = {
    component: ViewerRenderComponent,
    title: 'Core/Viewer/Viewer Render',
    decorators: [
        moduleMetadata({
            imports: [ViewerRenderComponent]
        }),
        applicationConfig({
            providers: [provideHttpClient(), ...provideStoryCore()]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Headless rendering surface used by the Viewer to delegate to the appropriate sub-viewer (image, pdf, txt, media, unknown) based on MIME type or file extension.`
            }
        }
    },
    argTypes: {
        urlFile: {
            control: 'text',
            description: 'External URL pointing to the file to render.',
            table: { type: { summary: 'string' } }
        },
        blobFile: {
            control: false,
            description: 'In-memory Blob containing the file content.',
            table: { type: { summary: 'Blob' } }
        },
        mimeType: {
            control: 'text',
            description: 'MIME type override used when the URL extension cannot be relied on.',
            table: { type: { summary: 'string' } }
        },
        fileName: {
            control: 'text',
            description: 'Optional file name; influences extension detection when no MIME type is supplied.',
            table: { type: { summary: 'string' } }
        },
        allowFullScreen: {
            control: 'boolean',
            description: 'Toggles fullscreen capability on supported sub-viewers.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
        },
        allowThumbnails: {
            control: 'boolean',
            description: 'Toggles PDF thumbnails support.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
        },
        readOnly: {
            control: 'boolean',
            description: 'Disables editing actions on sub-viewers (e.g. image crop / rotate).',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
        },
        allowedEditActions: {
            control: 'object',
            description: 'Map of editing action toggles forwarded to sub-viewers.',
            table: { type: { summary: '{ [key: string]: boolean }' } }
        },
        tracks: {
            control: 'object',
            description: 'Subtitle / caption tracks forwarded to the media-player sub-viewer.',
            table: { type: { summary: 'Track[]' } }
        },
        nodeId: {
            control: 'text',
            description: 'Identifier of the node opened in the viewer.',
            table: { type: { summary: 'string' } }
        },
        customError: {
            control: 'text',
            description: 'Custom error message displayed when the file format is unsupported.',
            table: { type: { summary: 'string' } }
        },
        extensionChange: {
            action: 'extensionChange',
            description: 'Emitted when the detected file extension changes.',
            table: { type: { summary: 'EventEmitter <string>' }, category: 'Actions' }
        },
        submitFile: {
            action: 'submitFile',
            description: 'Emitted when an image is saved by the image sub-viewer.',
            table: { type: { summary: 'EventEmitter <Blob>' }, category: 'Actions' }
        },
        close: {
            action: 'close',
            description: 'Emitted when the renderer requests a close (e.g. password dialog dismissed).',
            table: { type: { summary: 'EventEmitter <boolean>' }, category: 'Actions' }
        },
        isSaving: {
            action: 'isSaving',
            description: 'Emits `true` while an image edit is being saved.',
            table: { type: { summary: 'EventEmitter <boolean>' }, category: 'Actions' }
        }
    },
    args: {
        urlFile: SAMPLE_IMAGE_URL,
        fileName: 'sample-image.png',
        mimeType: 'image/png',
        allowFullScreen: true,
        allowThumbnails: true,
        readOnly: true,
        allowedEditActions: { rotate: true, crop: true }
    },
    render: (args) => ({
        props: args,
        template: `<div style="height:520px; border:1px solid #ddd;">
            <adf-viewer-render
                [urlFile]="urlFile"
                [blobFile]="blobFile"
                [mimeType]="mimeType"
                [fileName]="fileName"
                [allowFullScreen]="allowFullScreen"
                [allowThumbnails]="allowThumbnails"
                [readOnly]="readOnly"
                [allowedEditActions]="allowedEditActions"
                [tracks]="tracks || []"
                [nodeId]="nodeId"
                [customError]="customError"
                (extensionChange)="extensionChange($event)"
                (submitFile)="submitFile($event)"
                (close)="close($event)"
                (isSaving)="isSaving($event)" />
        </div>`
    })
};

export default meta;
type Story = StoryObj<ViewerRenderStoryArgs>;

export const ImageFromUrl: Story = {
    args: {
        urlFile: SAMPLE_IMAGE_URL,
        mimeType: 'image/png',
        fileName: 'sample-image.png'
    }
};

export const PdfFromUrl: Story = {
    args: {
        urlFile: SAMPLE_PDF_URL,
        mimeType: 'application/pdf',
        fileName: 'sample.pdf'
    }
};

export const TextFromBlob: Story = {
    args: {
        urlFile: undefined,
        blobFile: TEXT_BLOB,
        fileName: 'sample.txt',
        mimeType: 'text/plain'
    }
};

export const UnsupportedWithCustomError: Story = {
    args: {
        urlFile: 'https://example.com/file.bin',
        mimeType: 'application/octet-stream',
        fileName: 'unsupported.bin',
        customError: 'This file type cannot be previewed.'
    }
};
