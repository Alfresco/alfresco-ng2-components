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
import { MediaPlayerComponent } from './media-player.component';
import { Track } from '../../models/viewer.model';
import { provideStoryCore } from '../../../stories/core-story.providers';

const SAMPLE_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const SAMPLE_AUDIO_URL = 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Mozart_Eine_Kleine_Nachtmusik_K525_1st_movement.ogg';

const SAMPLE_TRACK: Track = {
    src: 'data:text/vtt;base64,V0VCVlRUCgowMDowMDowMC4wMDAgLS0+IDAwOjAwOjAyLjAwMApIZWxsbyBmcm9tIHN0b3J5Ym9vayB0cmFja3M=',
    label: 'English',
    kind: 'subtitles',
    srclang: 'en'
};

const meta: Meta<MediaPlayerComponent> = {
    component: MediaPlayerComponent,
    title: 'Core/Viewer/Media Player',
    decorators: [
        moduleMetadata({
            imports: [MediaPlayerComponent]
        }),
        applicationConfig({
            providers: [...provideStoryCore()]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Plays audio and video files using native browser controls. Accepts URLs, blobs and an optional list of subtitle tracks.`
            }
        }
    },
    argTypes: {
        urlFile: {
            control: 'text',
            description: 'External URL of the audio/video file to play.',
            table: { type: { summary: 'string' } }
        },
        blobFile: {
            control: false,
            description: 'In-memory Blob containing media data.',
            table: { type: { summary: 'Blob' } }
        },
        mimeType: {
            control: 'text',
            description: 'MIME type used to determine whether to render an audio or video player.',
            table: { type: { summary: 'string' } }
        },
        fileName: {
            control: 'text',
            description: 'Optional file name (used as a fallback when the MIME type cannot be derived).',
            table: { type: { summary: 'string' } }
        },
        tracks: {
            control: 'object',
            description: 'Array of subtitle / caption tracks attached to the player.',
            table: { type: { summary: 'Track[]' }, defaultValue: { summary: '[]' } }
        },
        error: {
            action: 'error',
            description: 'Emitted when the underlying media element raises an error.',
            table: { type: { summary: 'EventEmitter <Event>' }, category: 'Actions' }
        },
        canPlay: {
            action: 'canPlay',
            description: 'Emitted when the media element reports that it can start playback.',
            table: { type: { summary: 'EventEmitter <void>' }, category: 'Actions' }
        }
    },
    args: {
        urlFile: SAMPLE_VIDEO_URL,
        mimeType: 'video/mp4',
        fileName: 'sample.mp4',
        tracks: []
    },
    render: (args) => ({
        props: args,
        template: `<div style="max-width:720px; border:1px solid #ddd;">
            <adf-media-player
                [urlFile]="urlFile"
                [mimeType]="mimeType"
                [fileName]="fileName"
                [tracks]="tracks"
                (error)="error($event)"
                (canPlay)="canPlay($event)" />
        </div>`
    })
};

export default meta;
type Story = StoryObj<MediaPlayerComponent>;

export const Video: Story = {
    args: {
        urlFile: SAMPLE_VIDEO_URL,
        mimeType: 'video/mp4',
        fileName: 'sample.mp4'
    }
};

export const VideoWithSubtitleTrack: Story = {
    args: {
        urlFile: SAMPLE_VIDEO_URL,
        mimeType: 'video/mp4',
        fileName: 'sample.mp4',
        tracks: [SAMPLE_TRACK]
    }
};

export const Audio: Story = {
    args: {
        urlFile: SAMPLE_AUDIO_URL,
        mimeType: 'audio/ogg',
        fileName: 'sample.ogg',
        tracks: []
    }
};
