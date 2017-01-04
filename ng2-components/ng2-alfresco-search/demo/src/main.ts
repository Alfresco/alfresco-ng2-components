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

import { NgModule, Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CoreModule } from 'ng2-alfresco-core';
import { SearchModule } from 'ng2-alfresco-search';

import {
    SettingsService,
    AlfrescoAuthenticationService,
    AlfrescoTranslationService
} from 'ng2-alfresco-core';

@Component({
    selector: 'alfresco-app-demo',
    template: `<label for="ticket"><b>Insert a valid access ticket / ticket:</b></label><br>
               <input id="ticket" type="text" size="48" (change)="updateTicket()" [(ngModel)]="ticket"><br>
               <label for="host"><b>Insert the ip of your Alfresco instance:</b></label><br>
               <input id="host" type="text" size="48" (change)="updateHost()" [(ngModel)]="ecmHost"><br><br>
               <div *ngIf="!authenticated" style="color:#FF2323">
                    Authentication failed to ip {{ host }} with user: admin, admin, you can still try to add a valid ticket to perform
                    operations.
               </div>
               <hr>
                <div class="container" *ngIf="authenticated">
                    <alfresco-search-control [searchTerm]="searchTerm"
                        (searchChange)="searchTermChange($event);"></alfresco-search-control>
                    <alfresco-search [searchTerm]="searchTerm"></alfresco-search>
                </div>
    `,
    styles: [':host > .container {padding: 10px}']
})
class SearchDemo implements OnInit {

    authenticated: boolean;

    public searchTerm: string = 'test';

    public ecmHost: string = 'http://localhost:8080';

    ticket: string;

    constructor(private authService: AlfrescoAuthenticationService,
                private settingsService: SettingsService,
                translation: AlfrescoTranslationService) {

        settingsService.ecmHost = this.ecmHost;
        settingsService.setProviders('ECM');

        translation.addTranslationFolder();
    }

    public updateHost(): void {
        this.settingsService.ecmHost = this.ecmHost;
        this.login();
    }

    ngOnInit() {
        this.login();
    }

    login() {
        this.authService.login('admin', 'admin').subscribe(
            ticket => {
                console.log(ticket);
                this.ticket = this.authService.getTicketEcm();
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

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        SearchModule
    ],
    declarations: [ SearchDemo ],
    bootstrap:    [ SearchDemo ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
