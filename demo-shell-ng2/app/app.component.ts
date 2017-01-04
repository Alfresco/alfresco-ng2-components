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

import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
    AlfrescoTranslationService,
    AuthService,
    SettingsService,
    StorageService
} from 'ng2-alfresco-core';

declare var document: any;

@Component({
    selector: 'alfresco-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    searchTerm: string = '';

    ecmHost: string = 'http://' + window.location.hostname + ':8080';
    bpmHost: string = 'http://' + window.location.hostname + ':9999';

    constructor(public authService: AuthService,
                public router: Router,
                public settingsService: SettingsService,
                private translate: AlfrescoTranslationService,
                private storage: StorageService) {
        this.setEcmHost();
        this.setBpmHost();
        this.setProvider();

        if (translate) {
            if (process.env.ENV === 'production') {
                translate.addTranslationFolder('custom', 'i18n/custom-translation');
                translate.addTranslationFolder('ng2-alfresco-login', 'i18n/custom-translation/alfresco-login');
            } else {
                translate.addTranslationFolder('custom', 'custom-translation');
                translate.addTranslationFolder('ng2-alfresco-login', 'custom-translation/alfresco-login');
            }
        }
    }

    isLoggedIn(): boolean {
        this.redirectToLoginPageIfNotLoggedIn();
        return this.authService.isLoggedIn();
    }

    redirectToLoginPageIfNotLoggedIn(): void {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
        }
    }

    isAPageWithHeaderBar(): boolean {
        return location.pathname === '/login' || location.pathname === '/settings';
    }

    onLogout(event) {
        event.preventDefault();
        this.authService.logout()
            .subscribe(
                () => {
                    this.navigateToLogin();
                },
                (error: any) => {
                    if (error && error.response && error.response.status === 401) {
                        this.navigateToLogin();
                    } else {
                        console.error('An unknown error occurred while logging out', error);
                        this.navigateToLogin();
                    }
                }
            );
    }

    navigateToLogin(){
        this.router.navigate(['/login']);
        this.hideDrawer();
    }

    onToggleSearch(event) {
        let expandedHeaderClass = 'header-search-expanded',
            header = document.querySelector('header');
        if (event.expanded) {
            header.classList.add(expandedHeaderClass);
        } else {
            header.classList.remove(expandedHeaderClass);
        }
    }

    changeLanguage(lang: string) {
        this.translate.use(lang);
        this.hideDrawer();
    }

    hideDrawer() {
        // todo: workaround for drawer closing
        document.querySelector('.mdl-layout').MaterialLayout.toggleDrawer();
    }

    private setEcmHost() {
        if (this.storage.hasItem(`ecmHost`)) {
            this.settingsService.ecmHost = this.storage.getItem(`ecmHost`);
            this.ecmHost = this.storage.getItem(`ecmHost`);
        } else {
            this.settingsService.ecmHost = this.ecmHost;
        }
    }

    private setBpmHost() {
        if (this.storage.hasItem(`bpmHost`)) {
            this.settingsService.bpmHost = this.storage.getItem(`bpmHost`);
            this.bpmHost = this.storage.getItem(`bpmHost`);
        } else {
            this.settingsService.bpmHost = this.bpmHost;
        }
    }

    private setProvider() {
        if (this.storage.hasItem(`providers`)) {
            this.settingsService.setProviders(this.storage.getItem(`providers`));
        }
    }
}
