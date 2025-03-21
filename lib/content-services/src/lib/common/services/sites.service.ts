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

import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import {
    Node,
    SiteBodyCreate,
    SiteEntry,
    SiteGroupEntry,
    SiteGroupPaging,
    SiteMemberEntry,
    SiteMemberPaging,
    SiteMembershipBodyCreate,
    SiteMembershipBodyUpdate,
    SiteMembershipRequestWithPersonPaging,
    SitePaging,
    SitesApi
} from '@alfresco/js-api';
import { AlfrescoApiService } from '../../services/alfresco-api.service';

@Injectable({
    providedIn: 'root'
})
export class SitesService {
    private _sitesApi: SitesApi;
    get sitesApi(): SitesApi {
        this._sitesApi = this._sitesApi ?? new SitesApi(this.apiService.getInstance());
        return this._sitesApi;
    }

    constructor(private apiService: AlfrescoApiService) {}

    /**
     * Create a site
     *
     * @param siteBody SiteBodyCreate to create site
     * @returns site SiteEntry
     */
    createSite(siteBody: SiteBodyCreate): Observable<SiteEntry> {
        return from(this.sitesApi.createSite(siteBody));
    }

    /**
     * Gets a list of all sites in the repository.
     *
     * @param opts Options supported by JS-API
     * @returns List of sites
     */
    getSites(opts: any = {}): Observable<SitePaging> {
        const defaultOptions = {
            skipCount: 0,
            include: ['properties']
        };
        const queryOptions = Object.assign({}, defaultOptions, opts);
        return from(this.sitesApi.listSites(queryOptions));
    }

    /**
     * Gets the details for a site.
     *
     * @param siteId ID of the target site
     * @param opts Options supported by JS-API
     * @returns Information about the site
     */
    getSite(siteId: string, opts?: any): Observable<SiteEntry | any> {
        return from(this.sitesApi.getSite(siteId, opts));
    }

    /**
     * Deletes a site.
     *
     * @param siteId Site to delete
     * @param permanentFlag True: deletion is permanent; False: site is moved to the trash
     * @returns Null response notifying when the operation is complete
     */
    deleteSite(siteId: string, permanentFlag: boolean = true): Observable<any> {
        const options: any = {};
        options.permanent = permanentFlag;
        return from(this.sitesApi.deleteSite(siteId, options));
    }

    /**
     * Gets a site's content.
     *
     * @param siteId ID of the target site
     * @returns Site content
     */
    getSiteContent(siteId: string): Observable<SiteEntry | any> {
        return this.getSite(siteId, { relations: ['containers'] });
    }

    /**
     * Gets a list of all a site's members.
     *
     * @param siteId ID of the target site
     * @returns Site members
     */
    getSiteMembers(siteId: string): Observable<SiteEntry | any> {
        return this.getSite(siteId, { relations: ['members'] });
    }

    /**
     * Gets a list of all a site's members.
     *
     * @param siteId ID of the target site
     * @param opts Optional parameters supported by JS-API
     * @returns Observable<SiteMemberPaging>
     */
    listSiteMemberships(siteId: string, opts: any): Observable<SiteMemberPaging> {
        return from(this.sitesApi.listSiteMemberships(siteId, opts));
    }

    /**
     * Looks for a site inside the path of a Node and returns its guid if it finds one.
     * (return an empty string if no site is found)
     *
     * @param node Node to look for parent site
     * @returns Site guid
     */
    getSiteNameFromNodePath(node: Node): string {
        let siteName = '';
        if (node.path?.elements) {
            const foundNode = node.path.elements.find((pathNode) => pathNode.nodeType === 'st:site' && pathNode.name !== 'Sites');
            siteName = foundNode ? foundNode.name : '';
        }
        return siteName.toLocaleLowerCase();
    }

    /**
     * Gets a list of site membership requests.
     *
     * @param opts Options supported by JS-API
     * @returns Site membership requests
     */
    getSiteMembershipRequests(opts?: any): Observable<SiteMembershipRequestWithPersonPaging> {
        return from(this.sitesApi.getSiteMembershipRequests(opts));
    }

    /**
     * Creates a site membership for person **personId** on site **siteId**.
     *
     * @param siteId The identifier of a site
     * @param siteMembershipBodyCreate The person to add and their role
     * @param opts Optional parameters
     * @returns Observable<SiteMemberEntry>
     */
    createSiteMembership(siteId: string, siteMembershipBodyCreate: SiteMembershipBodyCreate, opts?: any): Observable<SiteMemberEntry> {
        return from(this.sitesApi.createSiteMembership(siteId, siteMembershipBodyCreate, opts));
    }

    /**
     * Update a site membership
     *
     * @param siteId The identifier of a site.
     * @param personId The identifier of a person.
     * @param siteMembershipBodyUpdate The persons new role
     * @param opts Optional parameters
     * @returns Observable<SiteMemberEntry>
     */
    updateSiteMembership(
        siteId: string,
        personId: string,
        siteMembershipBodyUpdate: SiteMembershipBodyUpdate,
        opts?: any
    ): Observable<SiteMemberEntry> {
        return from(this.sitesApi.updateSiteMembership(siteId, personId, siteMembershipBodyUpdate, opts));
    }

    /**
     * Delete a site membership
     *
     * @param siteId The identifier of a site.
     * @param personId The identifier of a person.
     * @returns Null response notifying when the operation is complete
     */
    deleteSiteMembership(siteId: string, personId: string): Observable<void> {
        return from(this.sitesApi.deleteSiteMembership(siteId, personId));
    }

    /**
     * Accept site membership requests.
     *
     * @param siteId The identifier of a site.
     * @param inviteeId The invitee user name.
     * @param opts Options supported by JS-API
     * @returns  Null response notifying when the operation is complete
     */
    approveSiteMembershipRequest(siteId: string, inviteeId: string, opts?: any): Observable<SiteMembershipRequestWithPersonPaging> {
        return from(this.sitesApi.approveSiteMembershipRequest(siteId, inviteeId, opts));
    }

    /**
     * Reject site membership requests.
     *
     * @param siteId The identifier of a site.
     * @param inviteeId The invitee user name.
     * @param opts Options supported by JS-API
     * @returns  Null response notifying when the operation is complete
     */
    rejectSiteMembershipRequest(siteId: string, inviteeId: string, opts?: any): Observable<SiteMembershipRequestWithPersonPaging> {
        return from(this.sitesApi.rejectSiteMembershipRequest(siteId, inviteeId, opts));
    }

    /**
     * List group membership for site
     *
     * @param siteId The identifier of a site.
     * @param opts Options supported by JS-API
     * @returns  Observable<SiteGroupPaging>
     */
    listSiteGroups(siteId: string, opts?: any): Observable<SiteGroupPaging> {
        return from(this.sitesApi.listSiteGroups(siteId, opts));
    }

    /**
     * Create a site membership for group
     *
     * @param siteId The identifier of a site.
     * @param siteMembershipBodyCreate The Group to add and its role
     * @returns Observable<SiteGroupEntry>
     */
    createSiteGroupMembership(siteId: string, siteMembershipBodyCreate: SiteMembershipBodyCreate): Observable<SiteGroupEntry> {
        return from(this.sitesApi.createSiteGroupMembership(siteId, siteMembershipBodyCreate));
    }

    /**
     * Get information about site membership of group
     *
     * @param siteId The identifier of a site.
     * @param groupId The authorityId of a group.
     * @returns Observable<SiteGroupEntry>
     */
    getSiteGroupMembership(siteId: string, groupId: string): Observable<SiteGroupEntry> {
        return from(this.sitesApi.getSiteGroupMembership(siteId, groupId));
    }

    /**
     * Update site membership of group
     *
     * @param siteId The identifier of a site.
     * @param groupId The authorityId of a group.
     * @param siteMembershipBodyUpdate The group new role
     * @returns Observable<SiteGroupEntry>
     */
    updateSiteGroupMembership(siteId: string, groupId: string, siteMembershipBodyUpdate: SiteMembershipBodyUpdate): Observable<SiteGroupEntry> {
        return from(this.sitesApi.updateSiteGroupMembership(siteId, groupId, siteMembershipBodyUpdate));
    }

    /**
     * Delete a group membership for site
     *
     * @param siteId The identifier of a site.
     * @param groupId The authorityId of a group.
     * @returns Observable<void>
     */
    deleteSiteGroupMembership(siteId: string, groupId: string): Observable<void> {
        return from(this.sitesApi.deleteSiteGroupMembership(siteId, groupId));
    }
}
