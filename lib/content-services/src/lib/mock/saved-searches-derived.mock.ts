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
import { of, Observable, ReplaySubject } from 'rxjs';
import { AlfrescoApiService } from '../services';
import { AuthenticationService } from '@alfresco/adf-core';
import { SavedSearch, SavedSearchesBaseService } from '../common';
import { Injectable } from '@angular/core';

@Injectable()
export class MockSavedSearchesService extends SavedSearchesBaseService {
    public fetchSubject = new ReplaySubject<SavedSearch[]>();

    public updateSpy = jasmine.createSpy('updateSavedSearches').and.returnValue(of({} as NodeEntry));

    constructor(apiService: AlfrescoApiService, authService: AuthenticationService) {
        super(apiService, authService);
    }

    protected fetchAllSavedSearches(): Observable<SavedSearch[]> {
        return this.fetchSubject.asObservable();
    }

    protected updateSavedSearches(searches: SavedSearch[]): Observable<NodeEntry> {
        return this.updateSpy(searches);
    }

    public mockFetch(searches: SavedSearch[]): void {
        this.fetchSubject.next(searches);
    }
}
