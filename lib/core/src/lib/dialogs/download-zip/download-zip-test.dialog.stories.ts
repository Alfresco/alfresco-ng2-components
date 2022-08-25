/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import {
    AlfrescoApiService,
    ContentService,
    DownloadZipService,
    NodesApiService
} from './../../services';
import { DownloadZipDialogStorybookComponent } from './download-zip.dialog.stories.component';
import {
    AlfrescoApiServiceMock,
    ContentApiMock,
    DownloadZipMockService,
    NodesApiMock
} from '../../mock/download-zip-service.mock';

export default {
    component: DownloadZipDialogStorybookComponent,
    title: 'Core/Dialog/Download ZIP v2 Dialog',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, DialogModule],
            providers: [
                {
                    provide: AlfrescoApiService,
                    useClass: AlfrescoApiServiceMock
                },
                {
                    provide: DownloadZipService,
                    useClass: DownloadZipMockService
                },
                { provide: ContentService, useClass: ContentApiMock },
                { provide: NodesApiService, useClass: NodesApiMock }
            ]
        })
    ],
    argTypes: {
        showLoading: {
            control: {
                type: 'boolean'
            }
        }
    }
} as Meta;

export const downloadZIPStory: Story = (args) => ({
    props: args
});
downloadZIPStory.args = {
    showLoading: false
};
