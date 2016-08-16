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
    CONTEXT_MENU_DIRECTIVES
} from 'ng2-alfresco-core';

import { WEBSCRIPTCOMPONENT } from 'ng2-alfresco-webscript';

@Component({
    selector: 'alfresco-webscript-demo',
    template: `
               <label for="token"><b>Insert a valid access token / ticket:</b></label><br>
               <input id="token" type="text" size="48" (change)="updateToken();documentList.reload()" [(ngModel)]="token"><br>
               <label for="token"><b>Insert the ip of your Alfresco instance:</b></label><br>
               <input id="token" type="text" size="48" (change)="updateHost();documentList.reload()" [(ngModel)]="host"><br><br>
               <div *ngIf="!authenticated" style="color:#FF2323">
                    Authentication failed to ip {{ host }} with user: admin, admin, you can still try to add a valid token to perform
                    operations.
               </div>
               <hr>
                <label for="token"><b>Insert a scriptPath</b></label><br>
                <input id="token" type="text" size="48"  [(ngModel)]="scriptPath"><br>
                <label for="token"><b>Insert a contextRoot</b></label><br>
                <input id="token" type="text" size="48"  [(ngModel)]="contextRoot"><br>
                <label for="token"><b>Insert a servicePath</b></label><br>
                <input id="token" type="text" size="48"  [(ngModel)]="servicePath"><br>
        <div class="container" *ngIf="authenticated">
            <alfresco-webscript-get [scriptPath]="scriptPath"
                           [scriptArgs]="scriptArgs"
                           [contextRoot]="contextRoot"
                           [servicePath]="servicePath"
                           [contentType]="'HTML'"
                           (onSuccess)= "logData($event)"></alfresco-webscript-get>
        </div>
    `,
    directives: [WEBSCRIPTCOMPONENT, CONTEXT_MENU_DIRECTIVES]
})
class WebscriptDemo implements OnInit {

    currentPath: string = '/';

    authenticated: boolean;

    ecmHost: string = 'http://127.0.0.1:8080';

    scriptPath: string = 'sample/folder/Company%20Home';

    contextRoot: string = 'alfresco';

    servicePath: string = 'service';

    scriptArgs: string = '';

    token: string;

    constructor(private authService: AlfrescoAuthenticationService,
                private alfrescoSettingsService: AlfrescoSettingsService) {

        alfrescoSettingsService.ecmHost = this.ecmHost;
        alfrescoSettingsService.setProviders('ECM');

        if (this.authService.getTicket()) {
            this.token = this.authService.getTicket();
        }
    }

    public updateToken(): void {
        localStorage.setItem('token', this.token);
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

    logData(data) {
        console.log(data);
    }
}

bootstrap(WebscriptDemo, [
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS
]);
