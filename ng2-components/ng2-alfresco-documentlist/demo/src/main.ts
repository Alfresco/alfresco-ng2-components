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
    AlfrescoTranslationService,
    CONTEXT_MENU_DIRECTIVES
} from 'ng2-alfresco-core';

import {
    DOCUMENT_LIST_DIRECTIVES,
    DOCUMENT_LIST_PROVIDERS,
    DocumentActionsService
} from 'ng2-alfresco-documentlist';

@Component({
    selector: 'alfresco-documentlist-demo',
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
        <div class="container" *ngIf="authenticated">

            <alfresco-document-list-breadcrumb
                    [currentFolderPath]="currentPath"
                    [target]="documentList">
            </alfresco-document-list-breadcrumb>
            <alfresco-document-list
                    #documentList
                    [currentFolderPath]="currentPath"
                    [contextMenuActions]="true"
                    [contentActions]="true"
                    [multiselect]="true"
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
                </content-actions>
            </alfresco-document-list>
            <context-menu-holder></context-menu-holder>
        </div>
    `,
    styles: [':host > .container {padding: 10px}'],
    directives: [DOCUMENT_LIST_DIRECTIVES, CONTEXT_MENU_DIRECTIVES],
    providers: [DOCUMENT_LIST_PROVIDERS],
    pipes: [AlfrescoPipeTranslate]
})
class DocumentListDemo implements OnInit {

    currentPath: string = '/';
    authenticated: boolean;

    ecmHost: string = 'http://devproducts-platform.alfresco.me';
    // ecmHost: string = 'http://127.0.0.1:8080';

    token: string;

    constructor(
        private authService: AlfrescoAuthenticationService,
        private alfrescoSettingsService: AlfrescoSettingsService,
        translation: AlfrescoTranslationService,
        private documentActions: DocumentActionsService) {

        alfrescoSettingsService.ecmHost = this.ecmHost;
        if (this.authService.getTicket()) {
            this.token = this.authService.getTicket();
        }
        translation.addTranslationFolder();
        documentActions.setHandler('my-handler', this.myDocumentActionHandler.bind(this));
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

    onFolderChanged(event?: any) {
        if (event) {
            this.currentPath = event.path;
        }
    }
}

bootstrap(DocumentListDemo, [
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS
]);
