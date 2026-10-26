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

import { Injectable, inject } from '@angular/core';
import {
    CascadingDictionariesApi,
    CascadingDictionaryBodyCreate,
    CascadingDictionaryBodyUpdate,
    CascadingDictionaryContentBody,
    CascadingDictionaryCreateEntry,
    CascadingDictionaryEntry,
    CascadingDictionaryList,
    CascadingDictionaryUpdateEntry,
    LazyApi
} from '@alfresco/js-api';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CascadingDictionaryService {
    private readonly apiService = inject(AlfrescoApiService);

    @LazyApi((self: CascadingDictionaryService) => new CascadingDictionariesApi(self.apiService.getInstance()))
    declare readonly cascadingDictionariesApi: CascadingDictionariesApi;

    /**
     * Lists cascading dictionaries registered in the system, with their latest version.
     *
     * @param skipCount Number of cascading dictionaries to skip.
     * @param maxItems Maximum number of cascading dictionaries to return.
     * @returns Observable<CascadingDictionaryList>
     */
    listCascadingDictionaries(skipCount?: number, maxItems?: number): Observable<CascadingDictionaryList> {
        return from(this.cascadingDictionariesApi.listCascadingDictionaries({ skipCount, maxItems }));
    }

    /**
     * Gets the latest version of the cascading dictionary registered for an aspect.
     *
     * @param aspectId The prefixed name of the aspect, e.g. 'cdict:account'.
     * @param includeData Whether the dictionary entries should be returned alongside the metadata.
     * @returns Observable<CascadingDictionaryEntry>
     */
    getCascadingDictionary(aspectId: string, includeData = false): Observable<CascadingDictionaryEntry> {
        return from(this.cascadingDictionariesApi.getCascadingDictionary(aspectId, includeData ? { include: ['data'] } : undefined));
    }

    /**
     * Gets a specific version of the cascading dictionary registered for an aspect.
     *
     * @param aspectId The prefixed name of the aspect, e.g. 'cdict:account'.
     * @param versionId The version label, e.g. '1.0'.
     * @param includeData Whether the dictionary entries should be returned alongside the metadata.
     * @returns Observable<CascadingDictionaryEntry>
     */
    getCascadingDictionaryVersion(aspectId: string, versionId: string, includeData = false): Observable<CascadingDictionaryEntry> {
        return from(
            this.cascadingDictionariesApi.getCascadingDictionaryVersion(aspectId, versionId, includeData ? { include: ['data'] } : undefined)
        );
    }

    /**
     * Creates a cascading dictionary definition. Requires admin rights.
     *
     * The response carries only the creation timestamp, so call `getCascadingDictionary` to read
     * the created dictionary back.
     *
     * @param payload The cascading dictionary information to create.
     * @returns Observable<CascadingDictionaryCreateEntry>
     */
    createCascadingDictionary(payload: CascadingDictionaryBodyCreate): Observable<CascadingDictionaryCreateEntry> {
        return from(this.cascadingDictionariesApi.createCascadingDictionary(payload));
    }

    /**
     * Updates the metadata of a cascading dictionary definition. Requires admin rights.
     *
     * The response carries only the modification timestamp, so call `getCascadingDictionary` to read
     * the updated dictionary back.
     *
     * @param aspectId The prefixed name of the aspect, e.g. 'cdict:account'.
     * @param payload The cascading dictionary information to update.
     * @returns Observable<CascadingDictionaryUpdateEntry>
     */
    updateCascadingDictionary(aspectId: string, payload: CascadingDictionaryBodyUpdate): Observable<CascadingDictionaryUpdateEntry> {
        return from(this.cascadingDictionariesApi.updateCascadingDictionary(aspectId, payload));
    }

    /**
     * Uploads a new content version of a cascading dictionary. Requires admin rights.
     *
     * @param aspectId The prefixed name of the aspect, e.g. 'cdict:account'.
     * @param content The levels and entries of the cascading dictionary.
     * @param majorVersion Whether a major version should be created instead of a minor one.
     * @returns Observable<CascadingDictionaryEntry>
     */
    createCascadingDictionaryContent(
        aspectId: string,
        content: CascadingDictionaryContentBody,
        majorVersion = false
    ): Observable<CascadingDictionaryEntry> {
        return from(this.cascadingDictionariesApi.createCascadingDictionaryContent(aspectId, content, { majorVersion }));
    }

    /**
     * Deletes a cascading dictionary definition and all of its content versions. Requires admin rights.
     *
     * @param aspectId The prefixed name of the aspect, e.g. 'cdict:account'.
     * @returns Observable<void>
     */
    deleteCascadingDictionary(aspectId: string): Observable<void> {
        return from(this.cascadingDictionariesApi.deleteCascadingDictionary(aspectId));
    }
}
