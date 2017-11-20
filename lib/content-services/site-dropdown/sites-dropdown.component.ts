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

import { SiteModel, SitesApiService } from '@alfresco/adf-core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'adf-sites-dropdown',
    styleUrls: ['./sites-dropdown.component.scss'],
    templateUrl: './sites-dropdown.component.html'
})
export class DropdownSitesComponent implements OnInit {

    @Input()
    hideMyFiles: boolean = false;

    @Input()
    siteList: any[] = null;

    @Output()
    change: EventEmitter<SiteModel> = new EventEmitter();

    public MY_FILES_VALUE = 'default';

    public siteSelected: string;

    constructor(private sitesService: SitesApiService) {}

    ngOnInit() {
        if (!this.siteList) {
            this.setDefaultSiteList();
        }
    }

    selectedSite() {
        let siteFound;
        if (this.siteSelected === this.MY_FILES_VALUE) {
            siteFound = new SiteModel();
        }else {
           siteFound = this.siteList.find( site => site.guid === this.siteSelected);
        }
        this.change.emit(siteFound);
    }

    setDefaultSiteList() {
        this.siteList = [];
        this.sitesService.getSites().subscribe((result) => {
                this.siteList = result;
            },
            (error) => {});
    }

}
