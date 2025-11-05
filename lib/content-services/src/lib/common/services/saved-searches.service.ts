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

import { NodeEntry, PreferencesApi, ContentFieldsQuery, PreferenceEntry } from '@alfresco/js-api';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable, of, from, throwError } from 'rxjs';
import { catchError, concatMap, first, map, switchMap, take, tap } from 'rxjs/operators';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { SavedSearch } from '../interfaces/saved-search.interface';
import { AuthenticationService } from '@alfresco/adf-core';
import { SavedSearchesBaseService } from './saved-searches-base.service';

export interface SavedSearchesPreferencesApiService {
    getPreference: (personId: string, preferenceName: string, opts?: ContentFieldsQuery) => Promise<PreferenceEntry> | Observable<PreferenceEntry>;
    updatePreference: (personId: string, preferenceName: string, preferenceValue: string) => Promise<PreferenceEntry> | Observable<PreferenceEntry>;
}

export const SAVED_SEARCHES_SERVICE_PREFERENCES = new InjectionToken<SavedSearchesPreferencesApiService>('SAVED_SEARCHES_SERVICE_PREFERENCES');

@Injectable({
    providedIn: 'root'
})
export class SavedSearchesService extends SavedSearchesBaseService {
    private savedSearchFileNodeId: string;
    private _preferencesApi: SavedSearchesPreferencesApiService;
    private preferencesService = inject(SAVED_SEARCHES_SERVICE_PREFERENCES, { optional: true });

    get preferencesApi(): SavedSearchesPreferencesApiService {
        if (this.preferencesService) {
            this._preferencesApi = this.preferencesService;
            return this._preferencesApi;
        }

        this._preferencesApi = this._preferencesApi ?? new PreferencesApi(this.apiService.getInstance());
        return this._preferencesApi;
    }

    constructor(apiService: AlfrescoApiService, authService: AuthenticationService) {
        super(apiService, authService);
    }

    protected fetchAllSavedSearches(): Observable<SavedSearch[]> {
        const savedSearchesMigrated = localStorage.getItem(this.getLocalStorageKey()) ?? '';
        if (savedSearchesMigrated === 'true') {
            return this.getSavedSearchesFromPreferenceApi();
        } else {
            return this.getSavedSearchesNodeId().pipe(
                take(1),
                switchMap(() => {
                    if (this.savedSearchFileNodeId !== '') {
                        return this.migrateSavedSearches();
                    } else {
                        return this.getSavedSearchesFromPreferenceApi();
                    }
                }),
                catchError(() => this.getSavedSearchesFromPreferenceApi())
            );
        }
    }

    protected updateSavedSearches(updatedSavedSearches: SavedSearch[]): Observable<NodeEntry> {
        return from(this.preferencesApi.updatePreference('-me-', 'saved-searches', JSON.stringify(updatedSavedSearches))).pipe(
            map((preference) => JSON.parse(preference.entry.value))
        );
    }

    private getSavedSearchesNodeId(): Observable<string> {
        return from(this.nodesApi.getNode('-my-', { relativePath: 'config.json' })).pipe(
            first(),
            concatMap((configNode) => {
                this.savedSearchFileNodeId = configNode.entry.id;
                return configNode.entry.id;
            }),
            catchError((error) => {
                const errorStatusCode = JSON.parse(error.message).error.statusCode;
                if (errorStatusCode === 404) {
                    localStorage.setItem(this.getLocalStorageKey(), 'true');
                }
                return throwError(() => error);
            })
        );
    }

    private async mapFileContentToSavedSearches(blob: Blob): Promise<Array<SavedSearch>> {
        return blob
            .text()
            .then((content) => (content ? JSON.parse(content) : []))
            .catch(() => []);
    }

    private getLocalStorageKey(): string {
        return `saved-searches-${this.authService.getUsername()}-migrated`;
    }

    private migrateSavedSearches(): Observable<SavedSearch[]> {
        return from(this.nodesApi.getNodeContent(this.savedSearchFileNodeId).then((content) => this.mapFileContentToSavedSearches(content))).pipe(
            tap((savedSearches) => {
                this.preferencesApi.updatePreference('-me-', 'saved-searches', JSON.stringify(savedSearches));
                localStorage.setItem(this.getLocalStorageKey(), 'true');
                this.nodesApi.deleteNode(this.savedSearchFileNodeId, { permanent: true });
            })
        );
    }

    private getSavedSearchesFromPreferenceApi(): Observable<SavedSearch[]> {
        return from(this.preferencesApi.getPreference('-me-', 'saved-searches')).pipe(
            map((preference) => JSON.parse(preference.entry.value)),
            catchError(() => of([]))
        );
    }
}
