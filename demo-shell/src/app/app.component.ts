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

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AlfrescoApiService, SettingsService, PageTitleService, StorageService } from '@alfresco/adf-core';
import { Router } from '@angular/router';
import { AuthenticationSSOService } from '@alfresco/adf-core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

    constructor(private settingsService: SettingsService,
                private storage: StorageService,
                private pageTitleService: PageTitleService,
                private alfrescoApiService: AlfrescoApiService,
                private authSSOService: AuthenticationSSOService,
                private router: Router) {
    }

    ngOnInit() {
        this.setProvider();

        this.pageTitleService.setTitle('title');

        this.alfrescoApiService.getInstance().on('error', (error) => {

            if (error.status === '404') {
                this.router.navigate(['/error', error.status]);
            }
        });
        this.authSSOService.loadDiscoveryDocumentAndLogin();
    }

    private setProvider() {
        if (this.storage.hasItem(`providers`)) {
            this.settingsService.setProviders(this.storage.getItem(`providers`));
        }
    }
}
