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
    AlfrescoAuthenticationService
} from 'ng2-alfresco-core';
import { ALFRESCO_ULPOAD_COMPONENTS, UploadService } from 'ng2-alfresco-upload';


@Component({
    selector: 'my-app',
    template: `<label for="ticket"><b>Insert a valid access ticket / ticket:</b></label><br>
               <input id="ticket" type="text" size="48" (change)="updateTicket()" [(ngModel)]="ticket"><br>
               <label for="host"><b>Insert the ip of your Alfresco instance:</b></label><br>
               <input id="host" type="text" size="48" (change)="updateHost()" [(ngModel)]="ecmHost"><br><br>
               <div *ngIf="!authenticated" style="color:#FF2323">
                    Authentication failed to ip {{ host }} with user: admin, admin, you can still try to add a valid ticket to perform
                    operations.
               </div>
               <hr>
               <alfresco-upload-button [showUdoNotificationBar]="true"
                                       [uploadFolders]="false"
                                       [multipleFiles]="false"
                                       (onSuccess)="customMethod($event)">
               </alfresco-upload-button>

               <br><br>

               <alfresco-upload-button [showUdoNotificationBar]="true"
                                       [uploadFolders]="true"
                                       [multipleFiles]="false"
                                       (onSuccess)="customMethod($event)">
               </alfresco-upload-button>

               <br><br>

               <alfresco-upload-button [showUdoNotificationBar]="true"
                                       [uploadFolders]="false"
                                       [multipleFiles]="true"
                                       (onSuccess)="customMethod($event)">
               </alfresco-upload-button>

               <br><br>

               <alfresco-upload-drag-area (onSuccess)="customMethod($event)" class="upload-border">
                     <div class="drag-area">
                         DRAG HERE
                     </div>
               </alfresco-upload-drag-area>
               <file-uploading-dialog></file-uploading-dialog>
               `,
    styles: [`.upload-border { position: absolute; padding: 5px 5px }`,
        `.drag-area { width: 200px; height: 100px; border: 1px solid #888888;}`],
    directives: [ALFRESCO_ULPOAD_COMPONENTS]
})
export class MyDemoApp implements OnInit {

    authenticated: boolean;

    public ecmHost: string = 'http://devproducts-platform.alfresco.me';

    ticket: string;

    constructor(private authService: AlfrescoAuthenticationService, private settingsService: AlfrescoSettingsService) {
        settingsService.ecmHost = this.ecmHost;
        settingsService.setProviders('ECM');

        if (this.authService.getTicketEcm()) {
            this.ticket = this.authService.getTicketEcm();
        }
    }

    public updateTicket(): void {
        localStorage.setItem('ticket-ECM', this.ticket);
    }

    public updateHost(): void {
        this.settingsService.ecmHost = this.ecmHost;
        this.login();
    }

    public customMethod(event: Object): void {
        console.log('File uploaded');
    }

    public ngOnInit(): void {
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
}

bootstrap(MyDemoApp, [
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS,
    UploadService
]);
