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
import { PdfThumbComponent } from './pdf-viewer-thumb.component';
import { provideStoryCore } from '../../../stories/core-story.providers';

const buildMockPage = (id: number, color: string) => ({
    id,
    getWidth: () => 91,
    getHeight: () => 114,
    getPage: () =>
        Promise.resolve({
            getViewport: ({ scale }: { scale: number }) => ({ width: 91 * scale, height: 114 * scale }),
            render: ({ canvasContext, viewport }: { canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number } }) => {
                canvasContext.fillStyle = color;
                canvasContext.fillRect(0, 0, viewport.width, viewport.height);
                canvasContext.fillStyle = '#333';
                canvasContext.font = '14px sans-serif';
                canvasContext.fillText(`Page ${id}`, 16, 24);
                return { promise: Promise.resolve() };
            }
        })
});

const EMPTY_PAGE = {
    id: 0,
    getWidth: () => 91,
    getHeight: () => 114,
    getPage: () => new Promise(() => undefined)
};

type PdfThumbStoryArgs = PdfThumbComponent & {
    selected?: boolean;
};

const meta: Meta<PdfThumbStoryArgs> = {
    component: PdfThumbComponent,
    title: 'Core/Viewer/PDF Viewer Thumb',
    decorators: [
        moduleMetadata({
            imports: [PdfThumbComponent]
        }),
        applicationConfig({
            providers: [...provideStoryCore()]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Single thumbnail tile rendered for a page in the PDF Viewer thumbnails panel. Renders a small canvas preview from the supplied \`page\` descriptor.`
            }
        }
    },
    argTypes: {
        page: {
            control: false,
            description: 'Page descriptor providing `getPage()`, `getWidth()` and `getHeight()` used to render the thumbnail.',
            table: { type: { summary: 'PdfThumbnailPage' } }
        },
        selected: {
            control: 'boolean',
            description: 'Visual flag toggled by the parent thumbnails list when the page is the active one.',
            table: { category: 'Storybook Helpers' }
        }
    }
};

export default meta;
type Story = StoryObj<PdfThumbStoryArgs>;

export const Empty: Story = {
    args: {
        page: EMPTY_PAGE,
        selected: false
    },
    render: (args) => ({
        props: args,
        template: `<adf-pdf-thumb [page]="page" style="display:inline-block; padding:8px;" />`
    })
};

export const Populated: Story = {
    args: {
        page: buildMockPage(1, '#e3f2fd'),
        selected: false
    },
    render: (args) => ({
        props: args,
        template: `<adf-pdf-thumb [page]="page" style="display:inline-block; padding:8px;" />`
    })
};

export const Selected: Story = {
    args: {
        page: buildMockPage(2, '#bbdefb'),
        selected: true
    },
    render: (args) => ({
        props: args,
        template: `<div [style.outline]="selected ? '2px solid #1976d2' : 'none'" style="display:inline-block; padding:8px;">
            <adf-pdf-thumb [page]="page" />
        </div>`
    })
};
