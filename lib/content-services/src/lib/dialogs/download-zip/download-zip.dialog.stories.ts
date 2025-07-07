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

import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { MatButtonModule } from '@angular/material/button';
import { DownloadZipDialogStorybookComponent } from './download-zip.dialog.stories.component';
import { AlfrescoApiServiceMock, ContentApiMock, DownloadZipMockService, NodesApiMock } from './mock/download-zip-service.mock';
import { DownloadZipService } from './services/download-zip.service';
import { ContentService } from '../../common/services/content.service';
import { NodesApiService } from '../../common/services/nodes-api.service';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { importProvidersFrom } from '@angular/core';
import { CoreStoryModule } from '../../../../../core/src/public-api';
import { AlfrescoApiService } from '../../services';

export default {
    component: DownloadZipDialogStorybookComponent,
    title: 'Core/Dialog/Download ZIP Dialog',
    decorators: [
        moduleMetadata({
            imports: [MatButtonModule, MatDialogModule, HttpClientTestingModule, DownloadZipDialogStorybookComponent],
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
        }),
        applicationConfig({
            providers: [importProvidersFrom(CoreStoryModule)]
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
                },
                defaultValue: {
                    summary: 'false'
                }
            }
        }
    },
    args: {
        showLoading: false
    }
} as Meta<DownloadZipDialogStorybookComponent>;

export const DownloadZIPDialog: StoryFn<DownloadZipDialogStorybookComponent> = (args) => ({
    props: args
});
DownloadZIPDialog.parameters = { layout: 'centered' };
