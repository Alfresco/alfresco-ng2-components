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

import { ProcessScopeRepresentation, ProcessScopesRequestRepresentation } from '../model';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
 * ProcessScopesApi service.
 */
export class ProcessScopesApi extends BaseApi {
    /**
     * List runtime process scopes
     * @param processScopesRequest processScopesRequest
     * @return Promise<ProcessScopeRepresentation>
     */
    getRuntimeProcessScopes(processScopesRequest: ProcessScopesRequestRepresentation): Promise<ProcessScopeRepresentation> {
        throwIfNotDefined(processScopesRequest, 'processScopesRequest');

        return this.post({
            path: '/api/enterprise/process-scopes',
            bodyParam: processScopesRequest
        });
    }
}
