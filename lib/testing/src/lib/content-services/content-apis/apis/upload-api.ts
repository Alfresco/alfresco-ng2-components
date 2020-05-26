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

import { Api } from './api';
import { UploadApi as AdfUploadApi } from '@alfresco/js-api';

import * as fs from 'fs';

export class UploadApi extends Api {
  upload = new AdfUploadApi(this.alfrescoJsApi);

  constructor(username: string, password: string) {
    super(username, password);
  }

  async uploadFile(filePath: string, fileName: string, parentId: string = '-my-') {
    const file = fs.createReadStream(filePath);
    const opts = {
      name: fileName,
      nodeType: 'cm:content',
      renditions: 'doclib'
    };

    try {
      await this.apiLogin();
      return await this.upload.uploadFile(file, '', parentId, null, opts);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.uploadFile.name}`, error);
    }
  }

  async uploadFileWithRename(filePath: string, parentId: string = '-my-', newName: string, title: string = '', description: string = '') {
    const file = fs.createReadStream(filePath);

    const nodeProps = {
      properties: {
        'cm:title': title,
        'cm:description': description
      }
    };

    const opts = {
        name: newName,
        nodeType: 'cm:content'
    };

    try {
      await this.apiLogin();
      return await this.upload.uploadFile(file, '', parentId, nodeProps, opts);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.uploadFileWithRename.name}`, error);
    }
  }

}
