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

import { Component, OnInit } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import {
    ALFRESCO_CORE_PROVIDERS,
    AlfrescoSettingsService,
    AlfrescoAuthenticationService,
    AlfrescoPipeTranslate,
    AlfrescoTranslationService
} from 'ng2-alfresco-core';
import {
    ALFRESCO_SEARCH_PROVIDERS,
    ALFRESCO_SEARCH_DIRECTIVES
} from 'ng2-alfresco-search';

@Component({
    selector: 'alfresco-search-demo',
    template: `<label for="token"><b>Insert a valid access token / ticket:</b></label><br>
               <input id="token" type="text" size="48" (change)="updateToken()" [(ngModel)]="token"><br>
               <label for="token"><b>Insert the ip of your Alfresco instance:</b></label><br>
               <input id="token" type="text" size="48" (change)="updateHost()" [(ngModel)]="host"><br><br>
               <div *ngIf="!authenticated" style="color:#FF2323">
                    Authentication failed to ip {{ host }} with user: admin, admin, you can still try to add a valid token to perform
                    operations.
               </div>
               <hr>
                <div class="container" *ngIf="authenticated">
                    <alfresco-search-control [searchTerm]="searchTerm"
                        (searchChange)="searchTermChange($event);"></alfresco-search-control>
                    <alfresco-search [searchTerm]="searchTerm"></alfresco-search>
                </div>
    `,
    styles: [':host > .container {padding: 10px}'],
    providers: [ALFRESCO_SEARCH_PROVIDERS],
    directives: [ALFRESCO_SEARCH_DIRECTIVES],
    pipes: [AlfrescoPipeTranslate]
})
class SearchDemo implements OnInit {

    authenticated: boolean;

    public searchTerm: string = 'test';

    public ecmHost: string = 'http://devproducts-platform.alfresco.me';

    token: string;

    constructor(private authService: AlfrescoAuthenticationService,
                private alfrescoSettingsService: AlfrescoSettingsService,
                translation: AlfrescoTranslationService) {

        alfrescoSettingsService.ecmHost = this.ecmHost;

        translation.addTranslationFolder();
    }

    public updateHost(): void {
        this.alfrescoSettingsService.ecmHost = this.ecmHost;
        this.login();
    }

    ngOnInit() {
        this.login();
    }

    login() {
        this.authService.login('admin', 'admin').subscribe(
            token => {
                console.log(token);
                this.token = token;
                this.authenticated = true;
            },
            error => {
                console.log(error);
                this.authenticated = false;
            });
    }

    searchTermChange(event) {
        console.log('Search term changed', event);
        this.searchTerm = event.value;
    }
}

bootstrap(SearchDemo, [
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS,
    ALFRESCO_SEARCH_PROVIDERS
]);
