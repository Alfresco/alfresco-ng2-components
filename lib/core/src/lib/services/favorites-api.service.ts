/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Injectable } from '@angular/core';
import { NodePaging } from '@alfresco/js-api';
import { Observable, from, of } from 'rxjs';
import { AlfrescoApiService } from './alfresco-api.service';
import { UserPreferencesService } from './user-preferences.service';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FavoritesApiService {

    static remapEntry({ entry }: any): any {
        entry.properties = {
            'cm:title': entry.title,
            'cm:description': entry.description
        };

        return { entry };
    }

    remapFavoritesData(data: any = {}): NodePaging {
        const list = (data.list || {});
        const pagination = (list.pagination || {});
        const entries: any[] = this
            .remapFavoriteEntries(list.entries || []);

        return <NodePaging> {
            list: { entries, pagination }
        };
    }

    remapFavoriteEntries(entries: any[]) {
        return entries
            .map(({ entry: { target }}: any) => ({
                entry: target.file || target.folder
            }))
            .filter(({ entry }) => (!!entry))
            .map(FavoritesApiService.remapEntry);
    }

    constructor(
        private apiService: AlfrescoApiService,
        private preferences: UserPreferencesService
    ) {}

    private get favoritesApi() {
       return this.apiService.getInstance().core.favoritesApi;
    }

    /**
     * Gets the favorites for a user.
     * @param personId ID of the user
     * @param options Options supported by JS-API
     * @returns List of favorites
     */
    getFavorites(personId: string, options?: any): Observable<NodePaging> {
        const defaultOptions = {
            maxItems: this.preferences.paginationSize,
            skipCount: 0,
            where: '(EXISTS(target/file) OR EXISTS(target/folder))',
            include: [ 'properties', 'allowableOperations' ]
        };
        const queryOptions = Object.assign(defaultOptions, options);
        const promise = this.favoritesApi
            .getFavorites(personId, queryOptions)
            .then(this.remapFavoritesData);

        return from(promise).pipe(
            catchError((err) => of(err))
        );
    }
}
