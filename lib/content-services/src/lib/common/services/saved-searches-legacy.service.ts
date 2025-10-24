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

import { NodeEntry } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { Observable, of, from, throwError } from 'rxjs';
import { catchError, concatMap, first, map } from 'rxjs/operators';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { SavedSearch } from '../interfaces/saved-search.interface';
import { AuthenticationService } from '@alfresco/adf-core';
import { SavedSearchesBaseService } from './saved-searches-base.service';

@Injectable({
    providedIn: 'root'
})
export class SavedSearchesLegacyService extends SavedSearchesBaseService {
    private savedSearchFileNodeId: string;
    private currentUserLocalStorageKey: string;
    private createFileAttempt = false;

    constructor(apiService: AlfrescoApiService, authService: AuthenticationService) {
        super(apiService, authService);
    }

    protected fetchAllSavedSearches(): Observable<SavedSearch[]> {
        return this.getSavedSearchesNodeId().pipe(
            concatMap(() =>
                from(this.nodesApi.getNodeContent(this.savedSearchFileNodeId).then((content) => this.mapFileContentToSavedSearches(content))).pipe(
                    catchError((error) => {
                        if (!this.createFileAttempt) {
                            this.createFileAttempt = true;
                            localStorage.removeItem(this.getLocalStorageKey());
                            return this.fetchAllSavedSearches();
                        }
                        return throwError(() => error);
                    })
                )
            )
        );
    }

    protected updateSavedSearches(searches: SavedSearch[]): Observable<NodeEntry> {
        return from(this.nodesApi.updateNodeContent(this.savedSearchFileNodeId, JSON.stringify(searches)));
    }

    private getSavedSearchesNodeId(): Observable<string> {
        const localStorageKey = this.getLocalStorageKey();
        if (this.currentUserLocalStorageKey && this.currentUserLocalStorageKey !== localStorageKey) {
            this.resetSavedSearchesStream();
        }
        this.currentUserLocalStorageKey = localStorageKey;
        let savedSearchesNodeId = localStorage.getItem(this.currentUserLocalStorageKey) ?? '';
        if (savedSearchesNodeId === '') {
            return from(this.nodesApi.getNode('-my-', { relativePath: 'config.json' })).pipe(
                first(),
                concatMap((configNode) => {
                    savedSearchesNodeId = configNode.entry.id;
                    localStorage.setItem(this.currentUserLocalStorageKey, savedSearchesNodeId);
                    this.savedSearchFileNodeId = savedSearchesNodeId;
                    return savedSearchesNodeId;
                }),
                catchError((error) => {
                    const errorStatusCode = JSON.parse(error.message).error.statusCode;
                    if (errorStatusCode === 404) {
                        return this.createSavedSearchesNode('-my-').pipe(
                            first(),
                            map((node) => {
                                localStorage.setItem(this.currentUserLocalStorageKey, node.entry.id);
                                return node.entry.id;
                            })
                        );
                    } else {
                        return throwError(() => error);
                    }
                })
            );
        } else {
            this.savedSearchFileNodeId = savedSearchesNodeId;
            return of(savedSearchesNodeId);
        }
    }

    private createSavedSearchesNode(parentNodeId: string): Observable<NodeEntry> {
        return from(this.nodesApi.createNode(parentNodeId, { name: 'config.json', nodeType: 'cm:content' }));
    }

    private async mapFileContentToSavedSearches(blob: Blob): Promise<Array<SavedSearch>> {
        return blob.text().then((content) => (content ? JSON.parse(content) : []));
    }

    private getLocalStorageKey(): string {
        return `saved-searches-node-id__${this.authService.getUsername()}`;
    }
}
