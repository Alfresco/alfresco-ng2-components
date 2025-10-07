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

import { TypeEntry } from '../model/typeEntry';
import { TypePaging } from '../model/typePaging';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';

export interface ListTypesOpts {
    /**
     * Optionally filter the list. Here are some examples:
     *
     * A type should be represented in the following format(prefix:name). e.g 'cm:content'.
     *
     * The following where clause will only return types from the namespace1:model and namespace2:model.
     *  - where=(modelId in ('namespace1:model','namespace2:model'))
     *  - where=(modelId in ('namespace1:model INCLUDESUBTYPES','namespace2:model'))
     *
     * The following where clause will only return sub types for the given parents.
     *  - where=(parentId in ('namespace1:parent','namespace2:parent'))
     *
     * The following where clause will only return types that match the pattern.
     *  - where=(namespaceUri matches('http://www.alfresco.*'))
     *
     * The following where clause will only return types that don't match the pattern.
     *  - where=(not namespaceUri matches('http://www.alfresco.*'))
     */
    where?: string;
    // The number of entities that exist in the collection before those included in this list.
    // If not supplied then the default value is 0.
    skipCount?: number;
    // The maximum number of items to return in the list.
    // If not supplied then the default value is 100.
    maxItems?: number;
    /**
     * Returns additional information about the type.
     * The following optional fields can be requested:
     * - properties
     * - mandatoryAspects
     * - associations
     */
    include?: string[];
}

/**
 * Types service.
 */
export class TypesApi extends BaseApi {
    /**
     * Get a type
     *
     * **Note:** This is available in Alfresco 7.0.0 and newer versions.
     * @param typeId The `Qname` of a type(prefix:name) e.g 'cm:content'
     * @returns Promise<TypeEntry>
     */
    getType(typeId: string): Promise<TypeEntry> {
        throwIfNotDefined(typeId, 'typeId');

        const pathParams = {
            typeId
        };

        return this.get<TypeEntry>({
            path: '/types/{typeId}',
            pathParams,
            returnType: TypeEntry
        });
    }

    /**
     * List types
     *
     * **Note:** This is available in Alfresco 7.0.0 and newer versions.
     * @param opts Optional parameters
     * @returns Promise<TypePaging>
     */
    listTypes(opts?: ListTypesOpts): Promise<TypePaging> {
        const queryParams = {
            where: opts?.where,
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            include: buildCollectionParam(opts?.include, 'csv')
        };

        return this.get<TypePaging>({
            path: '/types',
            queryParams,
            returnType: TypePaging
        });
    }
}
