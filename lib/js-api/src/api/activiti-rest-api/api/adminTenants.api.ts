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

import { CreateTenantRepresentation, ImageUploadRepresentation, LightTenantRepresentation, TenantEvent, TenantRepresentation } from '../model';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
 * AdminTenantsApi service.
 */
export class AdminTenantsApi extends BaseApi {
    /**
     * Create a tenant
     * Only a tenant manager may access this endpoint
     * @param createTenantRepresentation createTenantRepresentation
     * @return Promise<LightTenantRepresentation>
     */
    createTenant(createTenantRepresentation: CreateTenantRepresentation): Promise<LightTenantRepresentation> {
        throwIfNotDefined(createTenantRepresentation, 'groupId');

        return this.post({
            path: '/api/enterprise/admin/tenants',
            bodyParam: createTenantRepresentation
        });
    }

    /**
     * Delete a tenant
     * @param tenantId tenantId
     * @return Promise<{}>
     */
    deleteTenant(tenantId: number): Promise<void> {
        throwIfNotDefined(tenantId, 'tenantId');

        const pathParams = {
            tenantId
        };

        return this.delete({
            path: '/api/enterprise/admin/tenants/{tenantId}',
            pathParams
        });
    }

    /**
     * Get tenant events
     * @param tenantId tenantId
     * @return Promise<TenantEvent>
     */
    getTenantEvents(tenantId: number): Promise<TenantEvent> {
        throwIfNotDefined(tenantId, 'tenantId');

        const pathParams = {
            tenantId
        };

        return this.get({
            path: '/api/enterprise/admin/tenants/{tenantId}/events',
            pathParams,
            returnType: TenantEvent
        });
    }

    /**
     * Get a tenant's logo
     * @param tenantId tenantId
     * @return Promise<{}>
     */
    getTenantLogo(tenantId: number): Promise<any> {
        throwIfNotDefined(tenantId, 'tenantId');

        const pathParams = {
            tenantId
        };

        return this.get({
            path: '/api/enterprise/admin/tenants/{tenantId}/logo',
            pathParams
        });
    }

    /**
     * Get a tenant
     * @param tenantId tenantId
     * @return Promise<TenantRepresentation>
     */
    getTenant(tenantId: number): Promise<TenantRepresentation> {
        throwIfNotDefined(tenantId, 'tenantId');

        const pathParams = {
            tenantId
        };

        return this.get({
            path: '/api/enterprise/admin/tenants/{tenantId}',
            pathParams,
            returnType: TenantRepresentation
        });
    }

    /**
     * List tenants
     * Only a tenant manager may access this endpoint
     * @return Promise<LightTenantRepresentation>
     */
    getTenants(): Promise<LightTenantRepresentation> {
        return this.get({
            path: '/api/enterprise/admin/tenants'
        });
    }

    /**
     * Update a tenant
     * @param tenantId tenantId
     * @param createTenantRepresentation createTenantRepresentation
     * @return Promise<TenantRepresentation>
     */
    update(tenantId: number, createTenantRepresentation: CreateTenantRepresentation): Promise<TenantRepresentation> {
        throwIfNotDefined(tenantId, 'tenantId');
        throwIfNotDefined(createTenantRepresentation, 'createTenantRepresentation');

        const pathParams = {
            tenantId
        };

        return this.put({
            path: '/api/enterprise/admin/tenants/{tenantId}',
            pathParams,
            bodyParam: createTenantRepresentation,
            returnType: TenantRepresentation
        });
    }

    /**
     * Update a tenant's logo
     * @param tenantId tenantId
     * @param file file
     * @return Promise<ImageUploadRepresentation>
     */
    uploadTenantLogo(tenantId: number, file: any): Promise<ImageUploadRepresentation> {
        throwIfNotDefined(tenantId, 'tenantId');
        throwIfNotDefined(file, 'file');

        const pathParams = {
            tenantId
        };

        const formParams = {
            file
        };

        return this.post({
            path: '/api/enterprise/admin/tenants/{tenantId}/logo',
            pathParams,
            formParams,
            contentTypes: ['multipart/form-data'],
            returnType: ImageUploadRepresentation
        });
    }
}
