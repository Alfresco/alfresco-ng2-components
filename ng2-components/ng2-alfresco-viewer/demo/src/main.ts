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
import { bootstrap } from '@angular/platform-browser-dynamic';
import { VIEWERCOMPONENT } from 'ng2-alfresco-viewer';

import { HTTP_PROVIDERS } from '@angular/http';

import {
    ALFRESCO_CORE_PROVIDERS,
    AlfrescoSettingsService,
    AlfrescoAuthenticationService
} from 'ng2-alfresco-core';

@Component({
    selector: 'my-app',
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
        <div class="container" *ngIf="authenticated">
            <alfresco-viewer
                    [showViewer]="true"
                    [overlayMode]="true"
                    [urlFile]="'localTestFile.pdf'">
                    <div class="mdl-spinner mdl-js-spinner is-active"></div>
                   </alfresco-viewer>
                   </div>`,
    directives: [VIEWERCOMPONENT]
})
class MyDemoApp {
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
}
bootstrap(MyDemoApp, [
    VIEWERCOMPONENT,
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS
]);
