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

import { CreateEndpointBasicAuthRepresentation } from '../model/createEndpointBasicAuthRepresentation';
import { EndpointBasicAuthRepresentation } from '../model/endpointBasicAuthRepresentation';
import { EndpointConfigurationRepresentation } from '../model/endpointConfigurationRepresentation';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
 * AdminEndpointsApi service.
 * @module AdminEndpointsApi
 */
export class AdminEndpointsApi extends BaseApi {
    /**
     * Add an endpoint authorization
     *
     * @param createRepresentation createRepresentation
     * @return Promise<EndpointBasicAuthRepresentation>
     */
    createBasicAuthConfiguration(createRepresentation: CreateEndpointBasicAuthRepresentation): Promise<EndpointBasicAuthRepresentation> {
        throwIfNotDefined(createRepresentation, 'createRepresentation');

        return this.post({
            path: '/api/enterprise/admin/basic-auths',
            bodyParam: createRepresentation,
            returnType: EndpointBasicAuthRepresentation
        });
    }

    /**
     * Create an endpoint
     *
     * @param representation representation
     * @return Promise<EndpointConfigurationRepresentation>
     */
    createEndpointConfiguration(representation: EndpointConfigurationRepresentation): Promise<EndpointConfigurationRepresentation> {
        throwIfNotDefined(representation, 'representation');

        return this.post({
            path: '/api/enterprise/admin/endpoints',
            bodyParam: representation,
            returnType: EndpointConfigurationRepresentation
        });
    }

    /**
     * Get an endpoint authorization
     *
     * @param basicAuthId basicAuthId
     * @param tenantId tenantId
     * @return Promise<EndpointBasicAuthRepresentation>
     */
    getBasicAuthConfiguration(basicAuthId: number, tenantId: number): Promise<EndpointBasicAuthRepresentation> {
        throwIfNotDefined(basicAuthId, 'basicAuthId');
        throwIfNotDefined(tenantId, 'tenantId');

        const pathParams = {
            basicAuthId
        };

        const queryParams = {
            tenantId
        };

        return this.get({
            path: '/api/enterprise/admin/basic-auths/{basicAuthId}',
            pathParams,
            queryParams,
            returnType: EndpointBasicAuthRepresentation
        });
    }

    /**
     * List endpoint authorizations
     *
     * @param tenantId tenantId
     * @return Promise<EndpointBasicAuthRepresentation>
     */
    getBasicAuthConfigurations(tenantId: number): Promise<EndpointBasicAuthRepresentation> {
        throwIfNotDefined(tenantId, 'tenantId');

        const queryParams = {
            tenantId
        };

        return this.get({
            path: '/api/enterprise/admin/basic-auths',
            queryParams,
            returnType: EndpointBasicAuthRepresentation
        });
    }

    /**
     * Get an endpoint
     *
     * @param endpointConfigurationId endpointConfigurationId
     * @param tenantId tenantId
     * @return Promise<EndpointConfigurationRepresentation>
     */
    getEndpointConfiguration(endpointConfigurationId: number, tenantId: number): Promise<EndpointConfigurationRepresentation> {
        throwIfNotDefined(endpointConfigurationId, 'endpointConfigurationId');
        throwIfNotDefined(tenantId, 'tenantId');

        const pathParams = {
            endpointConfigurationId
        };

        const queryParams = {
            tenantId
        };

        return this.get({
            path: '/api/enterprise/admin/endpoints/{endpointConfigurationId}',
            pathParams,
            queryParams,
            returnType: EndpointConfigurationRepresentation
        });
    }

    /**
     * List endpoints
     *
     * @param tenantId tenantId
     * @return Promise<EndpointConfigurationRepresentation>
     */
    getEndpointConfigurations(tenantId: number): Promise<EndpointConfigurationRepresentation> {
        throwIfNotDefined(tenantId, 'tenantId');

        const queryParams = {
            tenantId
        };

        return this.get({
            path: '/api/enterprise/admin/endpoints',
            returnType: EndpointConfigurationRepresentation,
            queryParams
        });
    }

    /**
     * Delete an endpoint authorization
     *
     * @param basicAuthId basicAuthId
     * @param tenantId tenantId
     * @return Promise<{}>
     */
    removeBasicAuthConfiguration(basicAuthId: number, tenantId: number): Promise<void> {
        throwIfNotDefined(basicAuthId, 'basicAuthId');
        throwIfNotDefined(tenantId, 'tenantId');

        const pathParams = {
            basicAuthId
        };

        const queryParams = {
            tenantId
        };

        return this.delete({
            path: '/api/enterprise/admin/basic-auths/{basicAuthId}',
            pathParams,
            queryParams
        });
    }

    /**
     * Delete an endpoint
     *
     * @param endpointConfigurationId endpointConfigurationId
     * @param tenantId tenantId
     * @return Promise<{}>
     */
    removeEndpointConfiguration(endpointConfigurationId: number, tenantId: number): Promise<void> {
        throwIfNotDefined(endpointConfigurationId, 'endpointConfigurationId');
        throwIfNotDefined(tenantId, 'tenantId');

        const pathParams = {
            endpointConfigurationId
        };

        const queryParams = {
            tenantId
        };

        return this.delete({
            path: '/api/enterprise/admin/endpoints/{endpointConfigurationId}',
            pathParams,
            queryParams
        });
    }

    /**
     * Update an endpoint authorization
     *
     * @param basicAuthId basicAuthId
     * @param createRepresentation createRepresentation
     * @return Promise<EndpointBasicAuthRepresentation>
     */
    updateBasicAuthConfiguration(basicAuthId: number, createRepresentation: CreateEndpointBasicAuthRepresentation): Promise<EndpointBasicAuthRepresentation> {
        throwIfNotDefined(basicAuthId, 'basicAuthId');
        throwIfNotDefined(createRepresentation, 'createRepresentation');

        const pathParams = {
            basicAuthId
        };

        return this.put({
            path: '/api/enterprise/admin/basic-auths/{basicAuthId}',
            pathParams,
            bodyParam: createRepresentation,
            returnType: EndpointBasicAuthRepresentation
        });
    }

    /**
     * Update an endpoint
     *
     * @param endpointConfigurationId endpointConfigurationId
     * @param representation representation
     * @return Promise<EndpointConfigurationRepresentation>
     */
    updateEndpointConfiguration(endpointConfigurationId: number, representation: EndpointConfigurationRepresentation): Promise<EndpointConfigurationRepresentation> {
        throwIfNotDefined(endpointConfigurationId, 'endpointConfigurationId');
        throwIfNotDefined(representation, 'representation');

        const pathParams = {
            endpointConfigurationId
        };

        return this.put({
            path: '/api/enterprise/admin/endpoints/{endpointConfigurationId}',
            pathParams,
            bodyParam: representation,
            returnType: EndpointConfigurationRepresentation
        });
    }
}
