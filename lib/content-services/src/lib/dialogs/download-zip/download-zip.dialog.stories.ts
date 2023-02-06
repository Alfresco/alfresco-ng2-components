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
import { AlfrescoApiService, ContentService, NodesApiService } from '@alfresco/adf-core';
import { MatButtonModule } from '@angular/material/button';
import { DownloadZipDialogStorybookComponent } from './download-zip.dialog.stories.component';
import {
    AlfrescoApiServiceMock,
    ContentApiMock,
    DownloadZipMockService,
    NodesApiMock
} from './mock/download-zip-service.mock';
import { DownloadZipDialogModule } from './download-zip.dialog.module';
import { DownloadZipService } from './services/download-zip.service';

export default {
    component: DownloadZipDialogStorybookComponent,
    title: 'Core/Dialog/Download ZIP Dialog',
    decorators: [
        moduleMetadata({
            imports: [
                DownloadZipDialogModule,
                MatButtonModule
            ],
            providers: [
                {
                    provide: AlfrescoApiService,
                    useClass: AlfrescoApiServiceMock
                },
                {
                    provide: DownloadZipService,
                    useClass: DownloadZipMockService
                },
                {
                    provide: ContentService,
                    useClass: ContentApiMock
                },
                {
                    provide: NodesApiService,
                    useClass: NodesApiMock
                }
            ]
        })
    ],
    argTypes: {
        showLoading: {
            control: {
                type: 'boolean'
            },
            table: {
                category: 'Story controls',
                type: {
                    summary: 'boolean'
                }
            },
            defaultValue: false
        }
    }
} as Meta;

export const downloadZIPDialog: Story<DownloadZipDialogStorybookComponent> = (
    args: DownloadZipDialogStorybookComponent
) => ({
    props: args
});
downloadZIPDialog.parameters = { layout: 'centered' };
