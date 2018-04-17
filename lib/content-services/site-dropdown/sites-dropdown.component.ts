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

import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { SitesService, LogService } from '@alfresco/adf-core';
import { SitePaging, SiteEntry } from 'alfresco-js-api';

export enum Relations {
    Members = 'members',
    Containers = 'containers'
}

@Component({
    selector: 'adf-sites-dropdown',
    styleUrls: ['./sites-dropdown.component.scss'],
    templateUrl: './sites-dropdown.component.html',
    encapsulation: ViewEncapsulation.None,
    host: { 'class': 'adf-sites-dropdown' }
})
export class DropdownSitesComponent implements OnInit {

    /** Hide the "My Files" option. */
    @Input()
    hideMyFiles: boolean = false;

    /** A custom list of sites to be displayed by the dropdown. If no value
     * is given, the sites of the current user are displayed by default. A
     * list of objects only with properties 'title' and 'guid' is enough to
     * be able to display the dropdown.
     */
    @Input()
    siteList: SitePaging = null;

    /** Id of the selected site */
    @Input()
    value: string = null;

    /** Text or a translation key to act as a placeholder. Default value is the
     * key "DROPDOWN.PLACEHOLDER_LABEL".
     */
    @Input()
    placeholder: string = 'DROPDOWN.PLACEHOLDER_LABEL';

    /** Filter for the results of the sites query. Possible values are
     * "members" and "containers". When "members" is used, the site list
     * will be restricted to the sites that the user is a member of.
     */
    @Input()
    relations: string;

    /** Emitted when the user selects a site. When the default option is selected,
     * an empty model is emitted.
     */
    @Output()
    change: EventEmitter<SiteEntry> = new EventEmitter();

    selected: SiteEntry = null;

    public MY_FILES_VALUE = '-my-';

    constructor(private sitesService: SitesService,
                private logService: LogService) {
    }

    ngOnInit() {
        if (!this.siteList) {
            this.setDefaultSiteList();
        }
    }

    selectedSite(event: any) {
        this.change.emit(event.value);
    }

    private setDefaultSiteList() {
        let extendedOptions = null;
        if (this.relations) {
            extendedOptions = { relations: [this.relations] };
        }
        this.sitesService.getSites(extendedOptions).subscribe((result) => {

            this.siteList = this.relations === Relations.Members ? this.filteredResultsByMember(result) : result;

            if (!this.hideMyFiles) {
                let myItem = { entry: { id: '-my-', guid: '-my-', title: 'DROPDOWN.MY_FILES_OPTION' } };

                this.siteList.list.entries.unshift(myItem);

                if (!this.value) {
                    this.value = '-my-';
                }
            }

            this.selected = this.siteList.list.entries.find(site => site.entry.id === this.value);
        },
        (error) => {
            this.logService.error(error);
        });
    }

    private filteredResultsByMember(sites: SitePaging): SitePaging {
        const loggedUserName = this.sitesService.getEcmCurrentLoggedUserName();
        sites.list.entries = sites.list.entries.filter( (site) => this.isCurrentUserMember(site, loggedUserName));
        return sites;
    }

    private isCurrentUserMember(site, loggedUserName): boolean {
        return site.entry.visibility === 'PUBLIC' ||
            !!site.relations.members.list.entries.find((member) => {
                return member.entry.id.toLowerCase() === loggedUserName.toLowerCase();
            });
    }

}
