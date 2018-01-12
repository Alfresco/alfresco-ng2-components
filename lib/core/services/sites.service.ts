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
import { Observable } from 'rxjs/Observable';
import { AlfrescoApiService } from './alfresco-api.service';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/catch';
import { SitePaging, SiteEntry } from 'alfresco-js-api';

@Injectable()
export class SitesService {

    constructor(
        private apiService: AlfrescoApiService) { }

    getSites(opts: any = {}): Observable<SitePaging> {
        const defaultOptions = {
            skipCount: 0,
            include: ['properties']
        };
        const queryOptions = Object.assign({}, defaultOptions, opts);
        return Observable.fromPromise(this.apiService.getInstance().core.sitesApi.getSites(queryOptions))
            .catch(this.handleError);
    }

    getSite(siteId: string, opts?: any): Observable<SiteEntry> {
        return Observable.fromPromise(this.apiService.getInstance().core.sitesApi.getSite(siteId, opts))
            .catch(this.handleError);
    }

    deleteSite(siteId: string, permanentFlag: boolean = true): Observable<any> {
        let options: any = {};
        options.permanent = permanentFlag;
        return Observable.fromPromise(this.apiService.getInstance().core.sitesApi.deleteSite(siteId, options)
            .catch(this.handleError));
    }

    getSiteContent(siteId: string): Observable<SiteEntry> {
        return this.getSite(siteId, { relations: ['containers'] });
    }

    getSiteMembers(siteId: string): Observable<SiteEntry> {
        return this.getSite(siteId, { relations: ['members'] });
    }

    private handleError(error: Response): any {
        console.error(error);
        return Observable.throw(error || 'Server error');
    }
}
