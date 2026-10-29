/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import {
    CascadingDictionaryBodyCreate,
    CascadingDictionaryBodyUpdate,
    CascadingDictionaryContentBody,
    CascadingDictionaryCreateEntry,
    CascadingDictionaryEntry,
    CascadingDictionaryList,
    CascadingDictionaryUpdateEntry
} from '../model';
import { ContentPagingQuery } from './types';

export type CascadingDictionaryIncludeQuery = {
    /**
     * Returns additional information about the cascading dictionary.
     *
     * The only optional field that can be requested is `data`.
     */
    include?: Array<'data'>;
};

export type CascadingDictionaryContentQuery = {
    /**
     * If **true**, create a major version. Without this parameter, a new minor version is created.
     */
    majorVersion?: boolean;
};

/**
 * Cascading dictionaries service.
 *
 * **Note:** these endpoints are available in Alfresco Enterprise 26.2 and newer versions.
 */
export class CascadingDictionariesApi extends BaseApi {
    /**
     * List registered cascading dictionaries
     *
     * Gets a list of registered cascading dictionaries available in the system.
     * The latest version of each cascading dictionary is returned.
     *
     * @param opts Optional parameters
     * @returns Promise<CascadingDictionaryList>
     */
    listCascadingDictionaries(opts?: ContentPagingQuery): Promise<CascadingDictionaryList> {
        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems
        };

        return this.get({
            path: '/cascading-dictionaries',
            queryParams,
            returnType: CascadingDictionaryList
        });
    }

    /**
     * Get a registered cascading dictionary
     *
     * Gets the cascading dictionary registered in the system for **aspectId**.
     * The latest version of the cascading dictionary is returned.
     *
     * You can use the **include** parameter to return the dictionary **data**.
     *
     * @param aspectId The prefixed name of an aspect (`prefix:name`) that represents the cascading dictionary, e.g. 'cdict:account'.
     * @param opts Optional parameters
     * @returns Promise<CascadingDictionaryEntry>
     */
    getCascadingDictionary(aspectId: string, opts?: CascadingDictionaryIncludeQuery): Promise<CascadingDictionaryEntry> {
        throwIfNotDefined(aspectId, 'aspectId');

        const pathParams = {
            aspectId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv')
        };

        return this.get({
            path: '/cascading-dictionaries/{aspectId}',
            pathParams,
            queryParams,
            returnType: CascadingDictionaryEntry
        });
    }

    /**
     * Get a specific version of a registered cascading dictionary
     *
     * You can use the **include** parameter to return the dictionary **data**.
     *
     * @param aspectId The prefixed name of an aspect (`prefix:name`) that represents the cascading dictionary, e.g. 'cdict:account'.
     * @param versionId The identifier of a version, ie. version label, within the version history of the cascading dictionary.
     * @param opts Optional parameters
     * @returns Promise<CascadingDictionaryEntry>
     */
    getCascadingDictionaryVersion(aspectId: string, versionId: string, opts?: CascadingDictionaryIncludeQuery): Promise<CascadingDictionaryEntry> {
        throwIfNotDefined(aspectId, 'aspectId');
        throwIfNotDefined(versionId, 'versionId');

        const pathParams = {
            aspectId,
            versionId
        };

        const queryParams = {
            include: buildCollectionParam(opts?.include, 'csv')
        };

        return this.get({
            path: '/cascading-dictionaries/{aspectId}/versions/{versionId}',
            pathParams,
            queryParams,
            returnType: CascadingDictionaryEntry
        });
    }

    /**
     * Create a cascading dictionary definition
     *
     * Creates a new cascading dictionary definition for the specified aspect.
     * The aspect must be correctly defined and registered in the system before creating a definition for it,
     * and only one definition can be created per aspect.
     *
     * You must have admin rights to create a cascading dictionary.
     *
     * **Note:** the response contains only the creation timestamp. Use
     * {@link CascadingDictionariesApi.getCascadingDictionary} to read the created dictionary back.
     *
     * @param cascadingDictionaryBodyCreate The cascading dictionary information to create.
     * @returns Promise<CascadingDictionaryCreateEntry>
     */
    createCascadingDictionary(cascadingDictionaryBodyCreate: CascadingDictionaryBodyCreate): Promise<CascadingDictionaryCreateEntry> {
        throwIfNotDefined(cascadingDictionaryBodyCreate, 'cascadingDictionaryBodyCreate');

        return this.post({
            path: '/cascading-dictionaries',
            bodyParam: cascadingDictionaryBodyCreate,
            returnType: CascadingDictionaryCreateEntry
        });
    }

    /**
     * Update a cascading dictionary definition
     *
     * Updates the metadata of an existing cascading dictionary definition for the specified aspect.
     *
     * You must have admin rights to update a cascading dictionary.
     *
     * **Note:** the response contains only the modification timestamp. Use
     * {@link CascadingDictionariesApi.getCascadingDictionary} to read the updated dictionary back.
     *
     * @param aspectId The prefixed name of an aspect (`prefix:name`) that represents the cascading dictionary, e.g. 'cdict:account'.
     * @param cascadingDictionaryBodyUpdate The cascading dictionary information to update.
     * @returns Promise<CascadingDictionaryUpdateEntry>
     */
    updateCascadingDictionary(
        aspectId: string,
        cascadingDictionaryBodyUpdate: CascadingDictionaryBodyUpdate
    ): Promise<CascadingDictionaryUpdateEntry> {
        throwIfNotDefined(aspectId, 'aspectId');
        throwIfNotDefined(cascadingDictionaryBodyUpdate, 'cascadingDictionaryBodyUpdate');

        const pathParams = {
            aspectId
        };

        return this.put({
            path: '/cascading-dictionaries/{aspectId}',
            pathParams,
            bodyParam: cascadingDictionaryBodyUpdate,
            returnType: CascadingDictionaryUpdateEntry
        });
    }

    /**
     * Create cascading dictionary content
     *
     * Creates a new content version of the cascading dictionary registered by **aspectId**.
     * The cascading dictionary is versionable, and the **majorVersion** option controls versioning behaviour.
     * Without it, a new minor version is created.
     *
     * You must have admin rights to update the cascading dictionary content.
     *
     * @param aspectId The prefixed name of an aspect (`prefix:name`) that represents the cascading dictionary, e.g. 'cdict:account'.
     * @param cascadingDictionaryContentBody The content of the cascading dictionary.
     * @param opts Optional parameters
     * @returns Promise<CascadingDictionaryEntry>
     */
    createCascadingDictionaryContent(
        aspectId: string,
        cascadingDictionaryContentBody: CascadingDictionaryContentBody,
        opts?: CascadingDictionaryContentQuery
    ): Promise<CascadingDictionaryEntry> {
        throwIfNotDefined(aspectId, 'aspectId');
        throwIfNotDefined(cascadingDictionaryContentBody, 'cascadingDictionaryContentBody');

        const pathParams = {
            aspectId
        };

        const queryParams = {
            majorVersion: opts?.majorVersion
        };

        return this.post({
            path: '/cascading-dictionaries/{aspectId}/content',
            pathParams,
            queryParams,
            bodyParam: cascadingDictionaryContentBody,
            returnType: CascadingDictionaryEntry
        });
    }

    /**
     * Delete a cascading dictionary definition and content
     *
     * Deletes the cascading dictionary metadata and content for the specified aspect.
     * All versions of the content will be deleted. The aspect properties used to classify nodes
     * will not be deleted.
     *
     * You must have admin rights to delete a cascading dictionary.
     *
     * @param aspectId The prefixed name of an aspect (`prefix:name`) that represents the cascading dictionary, e.g. 'cdict:account'.
     * @returns Promise<{}>
     */
    deleteCascadingDictionary(aspectId: string): Promise<void> {
        throwIfNotDefined(aspectId, 'aspectId');

        const pathParams = {
            aspectId
        };

        return this.delete({
            path: '/cascading-dictionaries/{aspectId}',
            pathParams
        });
    }
}
