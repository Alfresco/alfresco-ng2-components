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

import { Component, OnInit, Input } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';

import {
    ALFRESCO_CORE_PROVIDERS,
    AlfrescoSettingsService,
    AlfrescoAuthenticationService,
    CONTEXT_MENU_DIRECTIVES
} from 'ng2-alfresco-core';

import { TAGCOMPONENT, TAGSERVICES } from 'ng2-alfresco-tag';

@Component({
    selector: 'alfresco-tag-demo',
    template: `
               <label for="ticket"><b>Insert a valid access ticket / ticket:</b></label><br>
               <input id="ticket" type="text" size="48" (change)="updateTicket()" [(ngModel)]="ticket"><br>
               <label for="host"><b>Insert the ip of your Alfresco instance:</b></label><br>
               <input id="host" type="text" size="48" (change)="updateHost()" [(ngModel)]="ecmHost"><br><br>
               <div *ngIf="!authenticated" style="color:#FF2323">
                    Authentication failed to ip {{ ecmHost }} with user: admin, admin, you can still try to add a valid ticket to perform
                    operations.
               </div>
               <hr>
                <label for="nodeId"><b>Insert Node Id</b></label><br>
                <input id="nodeId" type="text" size="48"  [(ngModel)]="nodeId"><br>
        <div class="container" *ngIf="authenticated">
            <div class="mdl-grid">
              <div class="mdl-cell mdl-cell--4-col"><alfresco-tag-node-actions-list [nodeId]="nodeId"></alfresco-tag-node-actions-list></div>
              <div class="mdl-cell mdl-cell--4-col">List Tags ECM <alfresco-tag-list></alfresco-tag-list></div>
              <div class="mdl-cell mdl-cell--4-col">
                    Tag list By Node ID 
                    <alfresco-tag-node-list [nodeId]="nodeId"></alfresco-tag-node-list>
              </div>
            </div>
        </div>
    `,
    directives: [TAGCOMPONENT, CONTEXT_MENU_DIRECTIVES],
    providers: [TAGSERVICES]
})
class TagDemo implements OnInit {

    @Input()
    nodeId: string = '74cd8a96-8a21-47e5-9b3b-a1b3e296787d';

    currentPath: string = '/';

    authenticated: boolean;

    ecmHost: string = 'http://127.0.0.1:8080';

    ticket: string;

    constructor(private authService: AlfrescoAuthenticationService,
                private settingsService: AlfrescoSettingsService) {

        settingsService.ecmHost = this.ecmHost;
        settingsService.setProviders('ECM');

        if (this.authService.getTicketEcm()) {
            this.ticket = this.authService.getTicketEcm();
        }
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

    public updateTicket(): void {
        localStorage.setItem('ticket-ECM', this.ticket);
    }

    public updateHost(): void {
        this.settingsService.ecmHost = this.ecmHost;
        this.login();
    }

    logData(data) {
        console.log(data);
    }
}
bootstrap(TagDemo, [
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS
]);
