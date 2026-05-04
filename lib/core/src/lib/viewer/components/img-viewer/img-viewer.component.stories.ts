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
import { ImgViewerComponent } from './img-viewer.component';
import { provideStoryCore } from '../../../stories/core-story.providers';

const SAMPLE_IMAGE_URL =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/640px-PNG_transparency_demonstration_1.png';
const LARGE_IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/2560px-Cat03.jpg';

const meta: Meta<ImgViewerComponent> = {
    component: ImgViewerComponent,
    title: 'Core/Viewer/Image Viewer',
    decorators: [
        moduleMetadata({
            imports: [ImgViewerComponent]
        }),
        applicationConfig({
            providers: [...provideStoryCore()]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Renders an image with zoom, rotation and (optional) crop / save editing actions powered by Cropper.js.`
            }
        }
    },
    argTypes: {
        urlFile: {
            control: 'text',
            description: 'External URL of the image to display.',
            table: { type: { summary: 'string' } }
        },
        blobFile: {
            control: false,
            description: 'In-memory Blob containing the image content.',
            table: { type: { summary: 'Blob' } }
        },
        fileName: {
            control: 'text',
            description: 'Optional file name used by the toolbar/aria labels.',
            table: { type: { summary: 'string' } }
        },
        showToolbar: {
            control: 'boolean',
            description: 'Whether to show the image viewer toolbar (zoom, rotate, ...).',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
        },
        readOnly: {
            control: 'boolean',
            description: 'When `true`, editing actions (rotate, crop, save) are hidden.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
        },
        allowedEditActions: {
            control: 'object',
            description: 'Map controlling which editing actions are enabled. Example: `{ rotate: true, crop: false }`.',
            table: { type: { summary: '{ [key: string]: boolean }' } }
        },
        error: {
            action: 'error',
            description: 'Emitted when the image fails to load.',
            table: { type: { summary: 'EventEmitter <void>' }, category: 'Actions' }
        },
        submit: {
            action: 'submit',
            description: 'Emitted with the edited Blob when the user saves the cropped/rotated image.',
            table: { type: { summary: 'EventEmitter <Blob>' }, category: 'Actions' }
        },
        isSaving: {
            action: 'isSaving',
            description: 'Emits `true` while the edited image is being saved.',
            table: { type: { summary: 'EventEmitter <boolean>' }, category: 'Actions' }
        },
        imageLoaded: {
            action: 'imageLoaded',
            description: 'Emitted once the underlying `<img>` element finishes loading.',
            table: { type: { summary: 'EventEmitter <void>' }, category: 'Actions' }
        }
    },
    args: {
        urlFile: SAMPLE_IMAGE_URL,
        fileName: 'sample-image.png',
        showToolbar: true,
        readOnly: true,
        allowedEditActions: { rotate: true, crop: true }
    },
    render: (args) => ({
        props: args,
        template: `<div style="height:480px; border:1px solid #ddd;">
            <adf-img-viewer
                [urlFile]="urlFile"
                [fileName]="fileName"
                [showToolbar]="showToolbar"
                [readOnly]="readOnly"
                [allowedEditActions]="allowedEditActions"
                (error)="error($event)"
                (submit)="submit($event)"
                (isSaving)="isSaving($event)"
                (imageLoaded)="imageLoaded($event)" />
        </div>`
    })
};

export default meta;
type Story = StoryObj<ImgViewerComponent>;

export const SimpleImage: Story = {
    args: {
        urlFile: SAMPLE_IMAGE_URL,
        readOnly: true
    }
};

export const LargeImage: Story = {
    args: {
        urlFile: LARGE_IMAGE_URL,
        readOnly: true
    }
};

export const EditableWithRotateOnly: Story = {
    args: {
        urlFile: SAMPLE_IMAGE_URL,
        readOnly: false,
        allowedEditActions: { rotate: true, crop: false }
    }
};

export const FullyEditable: Story = {
    args: {
        urlFile: SAMPLE_IMAGE_URL,
        readOnly: false,
        allowedEditActions: { rotate: true, crop: true }
    }
};
