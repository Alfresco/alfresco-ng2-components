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

import { NgModule, Component, Input } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CoreModule, AlfrescoSettingsService, AlfrescoAuthenticationService, StorageService, LogService } from 'ng2-alfresco-core';
import { TagModule } from 'ng2-alfresco-tag';

@Component({
    selector: 'alfresco-app-demo',
    template: `
               <label for="ticket"><b>Insert a valid access ticket / ticket:</b></label><br>
               <input id="ticket" type="text" size="48" (change)="updateTicket()" [(ngModel)]="ticket"><br>
               <label for="host"><b>Insert the ip of your Alfresco instance:</b></label><br>
               <input id="host" type="text" size="48" (change)="updateHost()" [(ngModel)]="ecmHost"><br><br>
               <hr>
                <label for="nodeId"><b>Insert Node Id</b></label><br>
                <input id="nodeId" type="text" size="48"  [(ngModel)]="nodeId"><br>
        <div class="container" >
            <div class="mdl-grid">
              <div class="mdl-cell mdl-cell--4-col"><alfresco-tag-node-actions-list [nodeId]="nodeId"></alfresco-tag-node-actions-list></div>
              <div class="mdl-cell mdl-cell--4-col">List Tags ECM <alfresco-tag-list></alfresco-tag-list></div>
              <div class="mdl-cell mdl-cell--4-col">
                    Tag list By Node ID
                    <alfresco-tag-node-list [nodeId]="nodeId"></alfresco-tag-node-list>
              </div>
            </div>
        </div>
    `
})
class TagDemo {

    @Input()
    nodeId: string = 'a892714b-56ac-4b42-8b43-db0fa01eef33';

    authenticated: boolean;
    ecmHost: string = 'http://localhost:8181/share/proxy';
    ticket: string;

    constructor(private authService: AlfrescoAuthenticationService,
                private settingsService: AlfrescoSettingsService,
                private storage: StorageService,
                private logService: LogService) {

        settingsService.ecmHost = this.ecmHost;
        settingsService.setProviders('ECM');

        if (this.authService.getTicketEcm()) {
            this.ticket = this.authService.getTicketEcm();
        }
    }

    public updateTicket(): void {
        this.storage.setItem('ticket-ECM', this.ticket);
    }

    public updateHost(): void {
        this.settingsService.ecmHost = this.ecmHost;
    }

    logData(data) {
        this.logService.info(data);
    }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        TagModule
    ],
    declarations: [ TagDemo ],
    bootstrap:    [ TagDemo ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
