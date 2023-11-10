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

import { EndpointConfigurationRepresentation } from '../model/endpointConfigurationRepresentation';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
* Endpoints service.
* @module EndpointsApi
*/
export class EndpointsApi extends BaseApi {
    /**
    * Get an endpoint configuration
    *
    * @param endpointConfigurationId endpointConfigurationId
    * @return Promise<EndpointConfigurationRepresentation>
    */
    getEndpointConfiguration(endpointConfigurationId: number): Promise<EndpointConfigurationRepresentation> {
        throwIfNotDefined(endpointConfigurationId, 'endpointConfigurationId');

        const pathParams = {
            endpointConfigurationId
        };

        return this.get({
            path: '/api/enterprise/editor/endpoints/{endpointConfigurationId}',
            pathParams,
            returnType: EndpointConfigurationRepresentation
        });
    }

    /**
    * List endpoint configurations
    *
    * @return Promise<EndpointConfigurationRepresentation>
    */
    getEndpointConfigurations(): Promise<EndpointConfigurationRepresentation> {
        return this.get({
            path: '/api/enterprise/editor/endpoints',
            returnType: EndpointConfigurationRepresentation
        });
    }
}
