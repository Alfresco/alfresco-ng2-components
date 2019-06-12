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

import { async } from '@angular/core/testing';

import { ProcessCloudContentService } from './process-cloud-content.service';
import { AlfrescoApiServiceMock, setupTestBed, CoreModule, AlfrescoApiService, AppConfigService, LogService } from '@alfresco/adf-core';

describe('ProcessCloudContentService', () => {

  let service: ProcessCloudContentService;
  let alfrescoApiMock: AlfrescoApiServiceMock;

  const fakePngAnswer = {
    'id': 1155,
    'name': 'a_png_file.png',
    'created': '2017-07-25T17:17:37.099Z',
    'createdBy': { 'id': 1001, 'firstName': 'Admin', 'lastName': 'admin', 'email': 'admin' },
    'relatedContent': false,
    'contentAvailable': true,
    'link': false,
    'mimeType': 'image/png',
    'simpleType': 'image',
    'previewStatus': 'queued',
    'thumbnailStatus': 'queued'
  };

  function returFakeUploadFileResults() {
    return {
      upload: {
        uploadFile: () => {
          return Promise.resolve({ entry: fakePngAnswer });
        }
      }
    };
  }

  setupTestBed({
    imports: [
      CoreModule.forRoot()
    ],
    providers: [
      { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
    ]
  });

  beforeEach(async(() => {
    alfrescoApiMock = new AlfrescoApiServiceMock(new AppConfigService(null));
    service = new ProcessCloudContentService(alfrescoApiMock,
      new LogService(new AppConfigService(null)));

    spyOn(alfrescoApiMock, 'getInstance').and.callFake(returFakeUploadFileResults);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
