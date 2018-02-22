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
import { SitesService } from '@alfresco/adf-core';
import { SitePaging, SiteEntry } from 'alfresco-js-api';

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

    /** Text or a translation key to act as a placeholder. */
    @Input()
    placeholder: string = 'DROPDOWN.PLACEHOLDER_LABEL';

    /** Emitted when the user selects a site. When the default option is selected,
     * an empty model is emitted.
     */
    @Output()
    change: EventEmitter<SiteEntry> = new EventEmitter();

    public MY_FILES_VALUE = 'default';

    public siteSelected: string;

    constructor(private sitesService: SitesService) {}

    ngOnInit() {
        if (!this.siteList) {
            this.setDefaultSiteList();
        }
    }

    selectedSite() {
        let siteFound;
        if (this.siteSelected === this.MY_FILES_VALUE) {
           siteFound = { entry: {}};
        } else {
           siteFound = this.siteList.list.entries.find( site => site.entry.guid === this.siteSelected);
        }
        this.change.emit(siteFound);
    }

    setDefaultSiteList() {
        this.sitesService.getSites().subscribe((result) => {
                this.siteList = result;
            },
            (error) => {});
    }

}
