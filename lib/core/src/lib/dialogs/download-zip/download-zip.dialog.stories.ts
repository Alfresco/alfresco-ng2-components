/*!
 * @license
 * Copyright 2022 Alfresco Software, Ltd.
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

import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { CoreStoryModule } from '../../testing/core.story.module';
import { DialogModule } from '../dialog.module';
import { DownloadZipDialogComponent } from './download-zip.dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
    LogService,
    DownloadZipService,
    NodesApiService,
    ContentService
} from './../../services';

const dataMock = {
    nodeIds: ['123']
};

export default {
    component: DownloadZipDialogComponent,
    title: 'Core/Dialog/Download ZIP Dialog',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, DialogModule],
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: {}
                },
                { provide: MAT_DIALOG_DATA, useValue: dataMock },
                LogService,
                DownloadZipService,
                NodesApiService,
                ContentService
            ]
        })
    ]
} as Meta;

export const downloadZIPStory: Story = (args) => ({
    props: args
});
