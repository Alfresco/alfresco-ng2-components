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
    AlfrescoAuthenticationService,
    AlfrescoSettingsService
} from 'ng2-alfresco-core';

declare var document: any;

@Component({
    selector: 'alfresco-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})
export class AppComponent {
    searchTerm: string = '';

    ecmHost: string = 'http://' + window.location.hostname + ':8080';
    bpmHost: string = 'http://' + window.location.hostname + ':9999';

    constructor(public auth: AlfrescoAuthenticationService,
                public router: Router,
                public alfrescoSettingsService: AlfrescoSettingsService,
                private translate: AlfrescoTranslationService) {
        this.setEcmHost();
        this.setBpmHost();
        this.setProvider();

        if (translate) {
            translate.addTranslationFolder('custom', 'custom-translation/');
            translate.addTranslationFolder('ng2-alfresco-login', 'custom-translation/alfresco-login');
        }
    }

    isLoggedIn(): boolean {
        this.redirectToLoginPageIfNotLoggedIn();
        return this.auth.isLoggedIn();
    }

    redirectToLoginPageIfNotLoggedIn(): void {
        if (!this.isLoginPage() && !this.auth.isLoggedIn()) {
            this.router.navigate(['/login']);
        }
    }

    isLoginPage(): boolean {
        return location.pathname === '/login' || location.pathname === '/' || location.pathname === '/settings';
    }

    onLogout(event) {
        event.preventDefault();
        this.auth.logout()
            .subscribe(
                () => {
                    this.router.navigate(['/login']);
                },
                ($event: any) => {
                    if ($event && $event.response && $event.response.status === 401) {
                        this.router.navigate(['/login']);
                    } else {
                        console.error('An unknown error occurred while logging out', $event);
                    }
                }
            );
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
    }

    hideDrawer() {
        // todo: workaround for drawer closing
        document.querySelector('.mdl-layout').MaterialLayout.toggleDrawer();
    }

    private setEcmHost() {
        if (localStorage.getItem(`ecmHost`)) {
            this.alfrescoSettingsService.ecmHost = localStorage.getItem(`ecmHost`);
            this.ecmHost = localStorage.getItem(`ecmHost`);
        } else {
            this.alfrescoSettingsService.ecmHost = this.ecmHost;
        }
    }

    private setBpmHost() {
        if (localStorage.getItem(`bpmHost`)) {
            this.alfrescoSettingsService.bpmHost = localStorage.getItem(`bpmHost`);
            this.bpmHost = localStorage.getItem(`bpmHost`);
        } else {
            this.alfrescoSettingsService.bpmHost = this.bpmHost;
        }
    }

    private setProvider() {
        if (localStorage.getItem(`providers`)) {
            this.alfrescoSettingsService.setProviders(localStorage.getItem(`providers`));
        }
    }
}
