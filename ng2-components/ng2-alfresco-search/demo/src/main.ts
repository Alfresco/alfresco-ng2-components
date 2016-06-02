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

import { Component, OnInit } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { HTTP_PROVIDERS } from 'angular2/http';

import {
    ALFRESCO_CORE_PROVIDERS,
    AlfrescoSettingsService,
    AlfrescoAuthenticationService,
    AlfrescoPipeTranslate,
    AlfrescoTranslationService
} from 'ng2-alfresco-core/dist/ng2-alfresco-core';

import {
    ALFRESCO_SEARCH_PROVIDERS,
    ALFRESCO_SEARCH_DIRECTIVES,
    AlfrescoService
} from 'ng2-alfresco-search/dist/ng2-alfresco-search';

@Component({
    selector: 'alfresco-search-demo',
    template: `
        <div class="container"  *ngIf="authenticated">
            <alfresco-search-control [searchTerm]="searchTerm"
                (searchChange)="searchTermChange($event);"></alfresco-search-control>
            <alfresco-search [searchTerm]="searchTerm"></alfresco-search>
        </div>
        <div *ngIf="!authenticated">
                Authentication failed to ip {{ host }}
        </div>
    `,
    styles: [':host > .container {padding: 10px}'],
    providers: [ALFRESCO_SEARCH_PROVIDERS],
    directives: [ALFRESCO_SEARCH_DIRECTIVES],
    pipes: [AlfrescoPipeTranslate]
})
class SearchDemo implements OnInit {

    authenticated: boolean;

    public searchTerm: string = 'foo bar';

    host: string = 'http://192.168.99.100:8080';

    constructor(
        private authService: AlfrescoAuthenticationService,
        settings: AlfrescoSettingsService,
        translation: AlfrescoTranslationService,
        searchService: AlfrescoService) {

        settings.host = this.host;
        translation.translationInit();
    }

    ngOnInit() {
        this.login();
    }

    login() {
       this.authService.login('admin', 'admin').subscribe(token => {
           this.authenticated = true;
       });
    }

    searchTermChange(event) {
        console.log('Search term changed', event);
        this.searchTerm = event.value;
    }
}

bootstrap(SearchDemo, [
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS
]);
