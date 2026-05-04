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
import { PdfViewerComponent } from './pdf-viewer.component';
import { provideStoryCore } from '../../../stories/core-story.providers';

const SAMPLE_PDF_URL = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';

const meta: Meta<PdfViewerComponent> = {
    component: PdfViewerComponent,
    title: 'Core/Viewer/PDF Viewer',
    decorators: [
        moduleMetadata({
            imports: [PdfViewerComponent]
        }),
        applicationConfig({
            providers: [...provideStoryCore()]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Renders PDF documents using \`pdfjs-dist\`. Stories require the pdf.js worker assets to be served by Storybook; see the Viewer documentation for details.`
            }
        }
    },
    argTypes: {
        urlFile: {
            control: 'text',
            description: 'External URL of the PDF file to load.',
            table: { type: { summary: 'string' } }
        },
        blobFile: {
            control: false,
            description: 'In-memory Blob containing the PDF binary content.',
            table: { type: { summary: 'Blob' } }
        },
        fileName: {
            control: 'text',
            description: 'Optional file name displayed by the toolbar.',
            table: { type: { summary: 'string' } }
        },
        showToolbar: {
            control: 'boolean',
            description: 'Whether to show the PDF viewer toolbar (page navigation, zoom, ...).',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
        },
        allowThumbnails: {
            control: 'boolean',
            description: 'Whether the thumbnails side panel can be opened.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
        },
        cacheType: {
            control: 'text',
            description: 'Optional `Cache-Control` header value used when loading via URL.',
            table: { type: { summary: 'string' } }
        },
        rendered: {
            action: 'rendered',
            description: 'Emitted after a page is rendered.',
            table: { type: { summary: 'EventEmitter <void>' }, category: 'Actions' }
        },
        error: {
            action: 'error',
            description: 'Emitted when the PDF fails to load.',
            table: { type: { summary: 'EventEmitter <void>' }, category: 'Actions' }
        },
        close: {
            action: 'close',
            description: 'Emitted when the password dialog is dismissed without supplying a password.',
            table: { type: { summary: 'EventEmitter <void>' }, category: 'Actions' }
        },
        pagesLoaded: {
            action: 'pagesLoaded',
            description: 'Emitted when all pages of the document finish loading.',
            table: { type: { summary: 'EventEmitter <void>' }, category: 'Actions' }
        }
    },
    args: {
        urlFile: SAMPLE_PDF_URL,
        fileName: 'sample.pdf',
        showToolbar: true,
        allowThumbnails: false
    },
    render: (args) => ({
        props: args,
        template: `<div style="height:600px; border:1px solid #ddd;">
            <adf-pdf-viewer
                [urlFile]="urlFile"
                [fileName]="fileName"
                [showToolbar]="showToolbar"
                [allowThumbnails]="allowThumbnails"
                [cacheType]="cacheType"
                (rendered)="rendered($event)"
                (error)="error($event)"
                (close)="close($event)"
                (pagesLoaded)="pagesLoaded($event)" />
        </div>`
    })
};

export default meta;
type Story = StoryObj<PdfViewerComponent>;

export const WithSamplePdf: Story = {
    args: {
        urlFile: SAMPLE_PDF_URL,
        showToolbar: true,
        allowThumbnails: false
    }
};

export const WithThumbnailsEnabled: Story = {
    args: {
        urlFile: SAMPLE_PDF_URL,
        showToolbar: true,
        allowThumbnails: true
    }
};

export const ToolbarHidden: Story = {
    args: {
        urlFile: SAMPLE_PDF_URL,
        showToolbar: false,
        allowThumbnails: false
    }
};
