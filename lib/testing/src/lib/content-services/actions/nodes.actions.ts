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

import { NodeEntry, NodesApi, AlfrescoApi } from '@alfresco/js-api';
import { Logger } from '../../core/utils/logger';

export class NodesActions {

    nodesApi: NodesApi;

    constructor(alfrescoApi: AlfrescoApi) {
        this.nodesApi = new NodesApi(alfrescoApi);
    }

    async getNodeByPath(relativePath: string = '/'): Promise<NodeEntry | any> {
        try {
          return await this.nodesApi.getNode('-my-', { relativePath });
        } catch (error) {
            Logger.error(`Error GET Node by path`);
        }
      }
}
