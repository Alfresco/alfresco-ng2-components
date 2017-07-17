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
import { AlfrescoApiService } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { SiteModel } from '../models/site.model';

@Injectable()
export class SitesService {

    constructor(private apiService: AlfrescoApiService) {
    }

    getSites(opts?: any): any {
        return Observable.fromPromise(this.apiService.getInstance().core.sitesApi.getSites(opts))
            .map((res: any) => res.list.entries)
            .map((objList) => this.convertToModel(objList))
            .catch(this.handleError);
    }

    getSite(siteId: string, opts?: any): any {
        return Observable.fromPromise(this.apiService.getInstance().core.sitesApi.getSite(siteId, opts))
            .map((res: any) => new SiteModel(res))
            .catch(this.handleError);
    }

    deleteSite(siteId: string, permanent: boolean = true): any {
        return Observable.fromPromise(this.apiService.getInstance().core.sitesApi.deleteSite(siteId, Boolean(permanent))
            .catch(this.handleError);
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

    private convertToModel(objList: any[]) {
        let convertedList: SiteModel[] = [];
        if (objList && objList.length > 0) {
             objList.forEach((element: any) => {
                convertedList.push(new SiteModel(element));
            });
        }
        return convertedList;
    }
}
