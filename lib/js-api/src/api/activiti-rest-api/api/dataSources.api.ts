/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ResultListDataRepresentationDataSourceRepresentation } from '../model/resultListDataRepresentationDataSourceRepresentation';
import { BaseApi } from './base.api';

/**
* DataSourcesApi service.
* @module DataSourcesApi
*/
export class DataSourcesApi extends BaseApi {
    /**
    * Get data sources
    *
    * @param opts Optional parameters
    * @return Promise<ResultListDataRepresentationDataSourceRepresentation>
    */
    getDataSources(opts?: { tenantId?: number }): Promise<ResultListDataRepresentationDataSourceRepresentation> {
        return this.get({
            path: '/api/enterprise/editor/data-sources',
            queryParams: opts,
            returnType: ResultListDataRepresentationDataSourceRepresentation
        });
    }
}
