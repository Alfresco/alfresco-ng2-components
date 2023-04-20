/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { LogService, InfiniteSelectScrollDirective } from '@alfresco/adf-core';
import { SitePaging, SiteEntry } from '@alfresco/js-api';
import { MatSelectChange } from '@angular/material/select';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {TranslateService} from '@ngx-translate/core';
import { SitesService } from '../common/services/sites.service';

/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */

export enum Relations {
    Members = 'members',
    Containers = 'containers'
}

@Component({
    selector: 'adf-sites-dropdown',
    styleUrls: ['./sites-dropdown.component.scss'],
    templateUrl: './sites-dropdown.component.html',
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-sites-dropdown' }
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

    private loading = true;
    private skipCount = 0;

    selected: SiteEntry = null;
    MY_FILES_VALUE = '-my-';

    constructor(private sitesService: SitesService,
                private logService: LogService,
                private liveAnnouncer: LiveAnnouncer,
                private translateService: TranslateService) {
    }

    ngOnInit() {
        if (!this.siteList) {
            this.loadSiteList();
        }
    }

    loadAllOnScroll() {
        if (this.isInfiniteScrollingEnabled()) {
            this.loading = true;
            this.loadSiteList();
        }
    }

    selectedSite(event: MatSelectChange) {
        this.liveAnnouncer.announce(this.translateService.instant('ADF_DROPDOWN.SELECTION_ARIA_LABEL', {
            placeholder: this.translateService.instant(this.placeholder),
            selectedOption: this.translateService.instant(event.value.entry.title)
        }));
        this.change.emit(event.value);
    }

    private loadSiteList() {
        const extendedOptions: any = {
            skipCount: this.skipCount,
            maxItems: InfiniteSelectScrollDirective.MAX_ITEMS
        };

        this.skipCount += InfiniteSelectScrollDirective.MAX_ITEMS;

        if (this.relations) {
            extendedOptions.relations = [this.relations];
        }

        this.sitesService.getSites(extendedOptions).subscribe((sitePaging: SitePaging) => {

                if (!this.siteList) {
                    this.siteList = this.relations === Relations.Members ? this.filteredResultsByMember(sitePaging) : sitePaging;

                    if (!this.hideMyFiles) {
                        const siteEntry = new SiteEntry({
                            entry: {
                                id: this.MY_FILES_VALUE,
                                guid: this.MY_FILES_VALUE,
                                title: 'DROPDOWN.MY_FILES_OPTION'
                            }
                        });

                        this.siteList.list.entries.unshift(siteEntry);

                        if (!this.value) {
                            this.value = this.MY_FILES_VALUE;
                        }
                    }

                } else {
                    const siteList: SitePaging = this.relations === Relations.Members ? this.filteredResultsByMember(sitePaging) : sitePaging;

                    this.siteList.list.entries = this.siteList.list.entries.concat(siteList.list.entries);
                    this.siteList.list.pagination = sitePaging.list.pagination;
                }

                this.selected = this.siteList.list.entries.find((site: SiteEntry) => site.entry.id === this.value);

                if (this.value && !this.selected && this.siteListHasMoreItems()) {
                    this.loadSiteList();
                }

                this.loading = false;
            },
            (error) => {
                this.logService.error(error);
            });
    }

    showLoading(): boolean {
        return this.loading && this.siteListHasMoreItems();
    }

    isInfiniteScrollingEnabled(): boolean {
        return !this.loading && this.siteListHasMoreItems();
    }

    private siteListHasMoreItems(): boolean {
        return this.siteList && this.siteList.list.pagination && this.siteList.list.pagination.hasMoreItems;
    }

    private filteredResultsByMember(sites: SitePaging): SitePaging {
        const loggedUserName = this.sitesService.getEcmCurrentLoggedUserName();
        sites.list.entries = sites.list.entries.filter((site) => this.isCurrentUserMember(site, loggedUserName));
        return sites;
    }

    private isCurrentUserMember(site, loggedUserName): boolean {
        return site.entry.visibility === 'PUBLIC' ||
            !!site.relations.members.list.entries.find((member) => member.entry.id.toLowerCase() === loggedUserName.toLowerCase());
    }
}
