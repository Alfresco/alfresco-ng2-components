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

import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AlfrescoSettingsService, PageTitleService, StorageService } from 'ng2-alfresco-core';

@Component({
    selector: 'adf-app',
    templateUrl: './app.component.html',
    styleUrls: ['./theme.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    searchTerm: string = '';
    showAppMenu = true;

    constructor(private settingsService: AlfrescoSettingsService,
                private storage: StorageService,
                pageTitleService: PageTitleService,
                route: ActivatedRoute,
                router: Router) {
        this.setProvider();
        pageTitleService.setTitle();

        router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe(() => {
                let currentRoute = route.root;

                while (currentRoute.firstChild) {
                    currentRoute = currentRoute.firstChild;
                }

                const snapshot: any = currentRoute.snapshot || {};
                const data: any = snapshot.data || {};

                if (data && data['showAppMenu'] !== undefined) {
                    this.showAppMenu = data && data.showAppMenu;
                } else {
                    this.showAppMenu = true;
                }
            });
    }

    private setProvider() {
        if (this.storage.hasItem(`providers`)) {
            this.settingsService.setProviders(this.storage.getItem(`providers`));
        }
    }
}
