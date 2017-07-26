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
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SiteModel } from '../models/site.model';
import { AlfrescoApiService } from './alfresco-api.service';
import { UserPreferencesService } from './user-preferences.service';

@Injectable()
export class SitesApiService {

    constructor(
        private apiService: AlfrescoApiService,
        private preferences: UserPreferencesService) { }

    getSites(opts: any = {}): any {
        const defaultOptions = {
            maxItems: this.preferences.paginationSize,
            skipCount: 0,
            include: ['properties']
        };
        const queryOptions = Object.assign({}, defaultOptions, opts);
        return Observable.fromPromise(this.apiService.getInstance().core.sitesApi.getSites(queryOptions))
            .map((res) => this.convertToModel(res))
            .catch(this.handleError);
    }

    getSite(siteId: string, opts?: any): any {
        return Observable.fromPromise(this.apiService.getInstance().core.sitesApi.getSite(siteId, opts))
            .map((res: any) => new SiteModel(res))
            .catch(this.handleError);
    }

    deleteSite(siteId: string, permanentFlag: boolean = true): any {
        let options: any = {};
        options.permanent = permanentFlag;
        return Observable.fromPromise(this.apiService.getInstance().core.sitesApi.deleteSite(siteId, options)
            .catch(this.handleError));
    }

    getSiteContent(siteId: string): Observable<any> {
        return this.getSite(siteId, { relations: ['containers'] });
    }

    getSiteMembers(siteId: string): Observable<any> {
        return this.getSite(siteId, { relations: ['members'] });
    }

    private handleError(error: Response): any {
        console.error(error);
        return Observable.throw(error || 'Server error');
    }

    private convertToModel(response: any) {
        let convertedList: SiteModel[] = [];
        if (response &&
            response.list &&
            response.list.entries &&
            response.list.entries.length > 0) {
            response.list.entries.forEach((element: any) => {
                element.pagination = response.list.pagination;
                convertedList.push(new SiteModel(element));
            });
        }
        return convertedList;
    }
}
