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

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SiteModel, SitesApiService } from 'ng2-alfresco-core';

@Component({
    selector: 'adf-sites-dropdown',
    styleUrls: ['./sites-dropdown.component.scss'],
    templateUrl: './sites-dropdown.component.html'
})
export class DropdownSitesComponent implements OnInit {

    @Output()
    change: EventEmitter<SiteModel> = new EventEmitter();

    public DEFAULT_VALUE = 'default';

    siteList = [];

    public siteSelected: string;

    constructor(private sitesService: SitesApiService) {
    }

    ngOnInit() {
        this.sitesService.getSites().subscribe((result) => {
            this.siteList = result;
        });
    }

    selectedSite() {
        let siteFound;
        if (this.siteSelected === this.DEFAULT_VALUE) {
            siteFound = new SiteModel();
        }else {
           siteFound = this.siteList.find( site => site.guid === this.siteSelected);
        }
        this.change.emit(siteFound);
    }

}
