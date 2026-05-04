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
import { PdfThumbListComponent } from './pdf-viewer-thumbnails.component';
import { provideStoryCore } from '../../../stories/core-story.providers';

const buildPdfViewerMock = (totalPages: number) => {
    const pageHandlers: Array<(event: { pageNumber: number }) => void> = [];

    const buildMockPage = (id: number) => ({
        id,
        width: 91,
        height: 114
    });

    const buildPageProxy = (id: number) => ({
        getViewport: ({ scale }: { scale: number }) => ({ width: 91 * scale, height: 114 * scale }),
        render: ({ canvasContext, viewport }: { canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number } }) => {
            canvasContext.fillStyle = id % 2 ? '#e3f2fd' : '#f3e5f5';
            canvasContext.fillRect(0, 0, viewport.width, viewport.height);
            canvasContext.fillStyle = '#333';
            canvasContext.font = '12px sans-serif';
            canvasContext.fillText(`Page ${id}`, 12, 20);
            return { promise: Promise.resolve() };
        }
    });

    return {
        currentPageNumber: 1,
        pagesCount: totalPages,
        _pages: Array.from({ length: totalPages }, (_, i) => buildMockPage(i + 1)),
        pdfDocument: {
            getPage: (id: number) => Promise.resolve(buildPageProxy(id))
        },
        eventBus: {
            on: (event: string, handler: (e: { pageNumber: number }) => void) => {
                if (event === 'pagechanging') {
                    pageHandlers.push(handler);
                }
            },
            off: () => undefined
        }
    } as any;
};

type PdfThumbnailsStoryArgs = PdfThumbListComponent & {
    pageCount?: number;
};

const meta: Meta<PdfThumbnailsStoryArgs> = {
    component: PdfThumbListComponent,
    title: 'Core/Viewer/PDF Viewer Thumbnails',
    decorators: [
        moduleMetadata({
            imports: [PdfThumbListComponent]
        }),
        applicationConfig({
            providers: [...provideStoryCore()]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Side panel listing thumbnails for every page of the PDF currently rendered by the \`adf-pdf-viewer\`. Stories use a lightweight mock of the underlying \`PDFViewer\`.`
            }
        }
    },
    argTypes: {
        pdfViewer: {
            control: false,
            description: 'Reference to the underlying pdf.js `PDFViewer` instance. Required input.',
            table: { type: { summary: 'PDFViewer' } }
        },
        pageCount: {
            control: { type: 'number', min: 0, max: 50 },
            description: 'Number of pages used to build the mock `PDFViewer`.',
            table: { category: 'Storybook Helpers' }
        },
        close: {
            action: 'close',
            description: 'Emitted when the user requests to close the thumbnails panel (e.g. via Escape).',
            table: { type: { summary: 'EventEmitter <void>' }, category: 'Actions' }
        }
    },
    args: {
        pageCount: 5
    },
    render: (args) => ({
        props: {
            ...args,
            pdfViewer: buildPdfViewerMock(args.pageCount ?? 0)
        },
        template: `<div style="height:480px; width:140px; border:1px solid #ddd; overflow:hidden;">
            <adf-pdf-thumbnails [pdfViewer]="pdfViewer" (close)="close($event)" style="display:block; height:100%;" />
        </div>`
    })
};

export default meta;
type Story = StoryObj<PdfThumbnailsStoryArgs>;

export const Empty: Story = {
    args: { pageCount: 0 }
};

export const Populated: Story = {
    args: { pageCount: 8 }
};

export const Selected: Story = {
    args: { pageCount: 4 }
};
