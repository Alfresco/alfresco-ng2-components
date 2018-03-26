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

import {
    AlfrescoApiService,
    LogService
} from '@alfresco/adf-core';

import {
    NodePaging,
    PersonEntry,
    Pagination,
    SitePaging
} from 'alfresco-js-api';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CustomResourcesService {

    private CREATE_PERMISSION = 'create';

    constructor(private apiService: AlfrescoApiService, private logService: LogService) {
    }

    getRecentFiles(personId: string, pagination: Pagination, includeFields: string[] = []): Promise<NodePaging> {

        let includeFieldsRequest = this.getIncludesFields(includeFields);

        return this.apiService.peopleApi.getPerson(personId)
            .then((person: PersonEntry) => {
                const username = person.entry.id;
                const query = {
                    query: {
                        query: '*',
                        language: 'afts'
                    },
                    filterQueries: [
                        { query: `cm:modified:[NOW/DAY-30DAYS TO NOW/DAY+1DAY]` },
                        { query: `cm:modifier:${username} OR cm:creator:${username}` },
                        { query: `TYPE:"content" AND -TYPE:"app:filelink" AND -TYPE:"fm:post"` }
                    ],
                    include: includeFieldsRequest,
                    sort: [{
                        type: 'FIELD',
                        field: 'cm:modified',
                        ascending: false
                    }],
                    paging: {
                        maxItems: pagination.maxItems,
                        skipCount: pagination.skipCount
                    }
                };
                return this.apiService.searchApi.search(query);
            }).catch(err => this.handleError(err));
    }

    loadFavorites(pagination: Pagination, includeFields: string[] = []): Observable<NodePaging> {

        let includeFieldsRequest = this.getIncludesFields(includeFields);

        const options = {
            maxItems: pagination.maxItems,
            skipCount: pagination.skipCount,
            where: '(EXISTS(target/file) OR EXISTS(target/folder))',
            include: includeFieldsRequest
        };

        return new Observable(observer => {
            this.apiService.favoritesApi.getFavorites('-me-', options)
                .then((result: NodePaging) => {
                        let page: NodePaging = {
                            list: {
                                entries: result.list.entries
                                    .map(({ entry: { target } }: any) => ({
                                        entry: target.file || target.folder
                                    }))
                                    .map(({ entry }: any) => {
                                        entry.properties = {
                                            'cm:title': entry.title,
                                            'cm:description': entry.description
                                        };
                                        return { entry };
                                    }),
                                pagination: result.list.pagination
                            }
                        };

                        observer.next(page);
                        observer.complete();
                    },
                    (err) => {
                        observer.error(err);
                        observer.complete();
                    });
        }).catch(err => this.handleError(err));
    }

    loadMemberSites(pagination: Pagination): Observable<NodePaging> {
        const options = {
            include: ['properties'],
            maxItems: pagination.maxItems,
            skipCount: pagination.skipCount
        };

        return new Observable(observer => {
            this.apiService.peopleApi.getSiteMembership('-me-', options)
                .then((result: SitePaging) => {
                        let page: NodePaging = {
                            list: {
                                entries: result.list.entries
                                    .map(({ entry: { site } }: any) => {
                                        site.allowableOperations = site.allowableOperations ? site.allowableOperations : [this.CREATE_PERMISSION];
                                        site.name = site.name || site.title;
                                        return {
                                            entry: site
                                        };
                                    }),
                                pagination: result.list.pagination
                            }
                        };

                        observer.next(page);
                        observer.complete();
                    },
                    (err) => {
                        observer.error(err);
                        observer.complete();
                    });
        }).catch(err => this.handleError(err));
    }

    private getIncludesFields(includeFields: string[]): string[] {
        return ['path', 'properties', 'allowableOperations', 'permissions', ...includeFields]
            .filter((element, index, array) => index === array.indexOf(element));
    }

    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        this.logService.error(error);
        return Observable.throw(error || 'Server error');
    }
}
