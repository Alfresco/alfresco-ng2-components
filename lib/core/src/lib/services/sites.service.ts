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
import { Observable, from, throwError } from 'rxjs';
import { AlfrescoApiService } from './alfresco-api.service';
import { SitePaging, SiteEntry } from '@alfresco/js-api';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SitesService {

    constructor(
        private apiService: AlfrescoApiService) {
    }

    /**
     * Gets a list of all sites in the repository.
     * @param opts Options supported by JS-API
     * @returns List of sites
     */
    getSites(opts: any = {}): Observable<SitePaging> {
        const defaultOptions = {
            skipCount: 0,
            include: ['properties']
        };
        const queryOptions = Object.assign({}, defaultOptions, opts);
        return from(this.apiService.getInstance().core.sitesApi.getSites(queryOptions))
            .pipe(
                catchError((err: any) => this.handleError(err))
            );
    }

    /**
     * Gets the details for a site.
     * @param siteId ID of the target site
     * @param opts Options supported by JS-API
     * @returns Information about the site
     */
    getSite(siteId: string, opts?: any): Observable<SiteEntry | {}> {
        return from(this.apiService.getInstance().core.sitesApi.getSite(siteId, opts))
            .pipe(
                catchError((err: any) => this.handleError(err))
            );
    }

    /**
     * Deletes a site.
     * @param siteId Site to delete
     * @param permanentFlag True: deletion is permanent; False: site is moved to the trash
     * @returns Null response notifying when the operation is complete
     */
    deleteSite(siteId: string, permanentFlag: boolean = true): Observable<any> {
        const options: any = {};
        options.permanent = permanentFlag;
        return from(this.apiService.getInstance().core.sitesApi.deleteSite(siteId, options))
            .pipe(
                catchError((err: any) => this.handleError(err))
            );
    }

    /**
     * Gets a site's content.
     * @param siteId ID of the target site
     * @returns Site content
     */
    getSiteContent(siteId: string): Observable<SiteEntry | {}> {
        return this.getSite(siteId, { relations: ['containers'] });
    }

    /**
     * Gets a list of all a site's members.
     * @param siteId ID of the target site
     * @returns Site members
     */
    getSiteMembers(siteId: string): Observable<SiteEntry | {}> {
        return this.getSite(siteId, { relations: ['members'] });
    }

    /**
     * Gets the username of the user currently logged into ACS.
     * @returns Username string
     */
    getEcmCurrentLoggedUserName(): string {
        return this.apiService.getInstance().getEcmUsername();
    }

    private handleError(error: any): any {
        console.error(error);
        return throwError(error || 'Server error');
    }
}
