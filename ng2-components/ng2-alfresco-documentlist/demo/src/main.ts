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
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { TranslateModule, TranslateLoader } from 'ng2-translate/ng2-translate';
import { CoreModule, AlfrescoTranslationLoader } from 'ng2-alfresco-core';
import { DataTableModule }  from 'ng2-alfresco-datatable';
import { DocumentListModule } from 'ng2-alfresco-documentlist';

import {
    AlfrescoSettingsService,
    AlfrescoAuthenticationService,
    AlfrescoTranslationService
} from 'ng2-alfresco-core';

import { DocumentActionsService } from 'ng2-alfresco-documentlist';

@Component({
    selector: 'alfresco-documentlist-demo',
    template: `
        <label for="ticket"><b>Insert a valid access ticket / ticket:</b></label><br>
               <input id="ticket" type="text" size="48" (change)="updateTicket(); documentList.reload()" [(ngModel)]="ticket"><br>
               <label for="host"><b>Insert the ip of your Alfresco instance:</b></label><br>
               <input id="host" type="text" size="48" (change)="updateHost(); documentList.reload()" [(ngModel)]="ecmHost"><br><br>
               <div *ngIf="!authenticated" style="color:#FF2323">
                    Authentication failed to ip {{ ecmHost }} with user: admin, admin, you can still try to add a valid ticket to perform
                    operations.
               </div>
               <hr>
 <alfresco-document-list-breadcrumb
            [currentFolderPath]="currentPath"
            [target]="documentList">
        </alfresco-document-list-breadcrumb>
        <alfresco-document-list
                #documentList
                [currentFolderPath]="currentPath"
                [contextMenuActions]="true"
                [contentActions]="true"
                (folderChange)="onFolderChanged($event)">
            <!--
            <empty-folder-content>
                <template>
                    <h1>Sorry, no content here</h1>
                </template>
            </empty-folder-content>
            -->
            <content-columns>
                <content-column key="$thumbnail" type="image"></content-column>
                <content-column
                        title="{{'DOCUMENT_LIST.COLUMNS.DISPLAY_NAME' | translate}}"
                        key="name"
                        sortable="true"
                        class="full-width ellipsis-cell">
                </content-column>
                <!--
                <content-column
                        title="Type"
                        source="content.mimeType">
                </content-column>
                -->
                <content-column
                        title="{{'DOCUMENT_LIST.COLUMNS.CREATED_BY' | translate}}"
                        key="createdByUser.displayName"
                        sortable="true"
                        class="desktop-only">
                </content-column>
                <content-column
                        title="{{'DOCUMENT_LIST.COLUMNS.CREATED_ON' | translate}}"
                        key="createdAt"
                        type="date"
                        format="medium"
                        sortable="true"
                        class="desktop-only">
                </content-column>
            </content-columns>

            <content-actions>
                <!-- folder actions -->
                <content-action
                        target="folder"
                        title="{{'DOCUMENT_LIST.ACTIONS.FOLDER.SYSTEM_1' | translate}}"
                        handler="system1">
                </content-action>
                <content-action
                        target="folder"
                        title="{{'DOCUMENT_LIST.ACTIONS.FOLDER.CUSTOM' | translate}}"
                        (execute)="myFolderAction1($event)">
                </content-action>
                <content-action
                        target="folder"
                        title="{{'DOCUMENT_LIST.ACTIONS.FOLDER.DELETE' | translate}}"
                        handler="delete">
                </content-action>
                <!-- document actions -->
                <content-action
                        target="document"
                        title="{{'DOCUMENT_LIST.ACTIONS.DOCUMENT.DOWNLOAD' | translate}}"
                        handler="download">
                </content-action>
                <content-action
                        target="document"
                        title="{{'DOCUMENT_LIST.ACTIONS.DOCUMENT.SYSTEM_2' | translate}}"
                        handler="system2">
                </content-action>
                <content-action
                        target="document"
                        title="{{'DOCUMENT_LIST.ACTIONS.DOCUMENT.CUSTOM' | translate}}"
                        (execute)="myCustomAction1($event)">
                </content-action>
                <content-action
                        target="document"
                        title="{{'DOCUMENT_LIST.ACTIONS.DOCUMENT.DELETE' | translate}}"
                        handler="delete">
                </content-action>
                <content-action
                        target="folder"
                        title="Activiti: View Form"
                        (execute)="viewActivitiForm($event)">
                </content-action>
            </content-actions>
        </alfresco-document-list>
            <context-menu-holder></context-menu-holder>
    `,
    styles: [':host > .container {padding: 10px}']
})
class DocumentListDemo implements OnInit {

    currentPath: string = '/';
    authenticated: boolean = false;
    ecmHost: string = 'http://devproducts-platform.alfresco.me';

    ticket: string;

    constructor(private authService: AlfrescoAuthenticationService, private settingsService: AlfrescoSettingsService,
                translation: AlfrescoTranslationService, private documentActions: DocumentActionsService) {

        settingsService.ecmHost = this.ecmHost;
        settingsService.setProviders('ECM');

        if (this.authService.getTicketEcm()) {
            this.ticket = this.authService.getTicketEcm();
        }

        translation.addTranslationFolder();
        documentActions.setHandler('my-handler', this.myDocumentActionHandler.bind(this));
    }

    public updateTicket(): void {
        localStorage.setItem('ticket-ECM', this.ticket);
    }

    public updateHost(): void {
        this.settingsService.ecmHost = this.ecmHost;
        this.login();
    }

    ngOnInit() {
        this.login();
    }

    myDocumentActionHandler() {
        window.alert('my custom action handler');
    }

    myCustomAction1(event) {
        let entry = event.value.entry;
        alert(`Custom document action for ${entry.name}`);
    }

    myFolderAction1(event) {
        let entry = event.value.entry;
        alert(`Custom folder action for ${entry.name}`);
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

    onFolderChanged(event?: any) {
        if (event) {
            this.currentPath = event.path;
        }
    }
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        CoreModule.forRoot(),
        DataTableModule,
        DocumentListModule.forRoot(),
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (http) => new AlfrescoTranslationLoader(http),
            deps: [Http]
        })
    ],
    declarations: [ DocumentListDemo ],
    bootstrap:    [ DocumentListDemo ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
