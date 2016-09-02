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

import {Component, OnInit, Input} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';

import {
    ALFRESCO_CORE_PROVIDERS,
    AlfrescoSettingsService,
    AlfrescoAuthenticationService,
    CONTEXT_MENU_DIRECTIVES
} from 'ng2-alfresco-core';

import {TAGCOMPONENT, TAGSERVICES} from 'ng2-alfresco-tag';

@Component({
    selector: 'alfresco-tag-demo',
    template: `
               <label for="token"><b>Insert a valid access token / ticket:</b></label><br>
               <input id="token" type="text" size="48" (change)="updateToken();documentList.reload()" [(ngModel)]="token"><br>
               <label for="token"><b>Insert the ip of your Alfresco instance:</b></label><br>
               <input id="token" type="text" size="48" (change)="updateHost();documentList.reload()" [(ngModel)]="ecmHost"><br><br>
               <div *ngIf="!authenticated" style="color:#FF2323">
                    Authentication failed to ip {{ ecmHost }} with user: admin, admin, you can still try to add a valid token to perform
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
            <div class="mdl-cell mdl-cell--4-col">
                     Tag list By Node Properties
                    <alfresco-tag-node-list [properties]="propertiesDemo"></alfresco-tag-node-list>
              </div>
            </div>
        </div>
    `,
    directives: [TAGCOMPONENT, CONTEXT_MENU_DIRECTIVES],
    providers: [TAGSERVICES]
})
class TagDemo implements OnInit {

    propertiesDemo: string = '{"cm:taggable": ["008e722c-bf2a-4426-832c-29d1a9b174a8", "0350ff75-badb-40e5-b7de-1091a855dd70"]}';

    @Input()
    nodeId: string = '1a0b110f-1e09-4ca2-b367-fe25e4964a4e';

    currentPath: string = '/';

    authenticated: boolean;

    ecmHost: string = 'http://127.0.0.1:8080';

    token: string;

    constructor(private authService: AlfrescoAuthenticationService,
                private settingsService: AlfrescoSettingsService) {

        settingsService.ecmHost = this.ecmHost;
        if (this.authService.getTicket()) {
            this.token = this.authService.getTicket();
        }
    }

    public updateToken(): void {
        localStorage.setItem('token', this.token);
    }

    public updateHost(): void {
        this.settingsService.ecmHost = this.ecmHost;
        this.login();
    }

    ngOnInit() {
        this.login();
    }

    login() {
        this.authService.login('admin', 'admin', ['ECM']).subscribe(
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

    logData(data) {
        console.log(data);
    }
}

bootstrap(TagDemo, [
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS
]);
