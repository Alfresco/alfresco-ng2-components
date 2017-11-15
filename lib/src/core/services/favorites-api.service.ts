/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { NodePaging } from 'alfresco-js-api';
import { Observable } from 'rxjs/Rx';
import { AlfrescoApiService } from './alfresco-api.service';
import { UserPreferencesService } from './user-preferences.service';

@Injectable()
export class FavoritesApiService {
    static remapFavoritesData(data: any = {}): NodePaging {
        const list = (data.list || {});
        const pagination = (list.pagination || {});
        const entries: any[] = FavoritesApiService
            .remapFavoriteEntries(list.entries || []);

        return <NodePaging> {
            list: { entries, pagination }
        };
    }

    static remapEntry({ entry }: any): any {
        entry.properties = {
            'cm:title': entry.title,
            'cm:description': entry.description
        };

        return { entry };
    }

    static remapFavoriteEntries(entries: any[]) {
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

    getFavorites(personId: string, options?: any): Observable<NodePaging> {
        const { favoritesApi, handleError } = this;
        const defaultOptions = {
            maxItems: this.preferences.paginationSize,
            skipCount: 0,
            where: '(EXISTS(target/file) OR EXISTS(target/folder))',
            include: [ 'properties', 'allowableOperations' ]
        };
        const queryOptions = Object.assign(defaultOptions, options);
        const promise = favoritesApi
            .getFavorites(personId, queryOptions)
            .then(FavoritesApiService.remapFavoritesData);

        return Observable
            .fromPromise(promise)
            .catch(handleError);
    }

    private handleError(error): Observable<any> {
        return Observable.of(error);
    }
}
