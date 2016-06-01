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
    DOCUMENT_LIST_DIRECTIVES,
    DOCUMENT_LIST_PROVIDERS,
    DocumentActionsService
} from 'ng2-alfresco-documentlist/dist/ng2-alfresco-documentlist';

@Component({
    selector: 'alfresco-documentlist-demo',
    template: `
        <div class="container">
            <alfresco-document-list *ngIf="authenticated">
                <content-columns>
                    <content-column source="$thumbnail"></content-column>
                    <content-column
                            title="{{'DOCUMENT_LIST.COLUMNS.DISPLAY_NAME' | translate}}"
                            source="name"
                            class="full-width name-column">
                    </content-column>
                    <content-column
                            title="{{'DOCUMENT_LIST.COLUMNS.CREATED_BY' | translate}}"
                            source="createdByUser.displayName">
                    </content-column>
                    <content-column
                            title="{{'DOCUMENT_LIST.COLUMNS.CREATED_ON' | translate}}"
                            source="createdAt">
                    </content-column>
                    <content-column
                            title="{{'DOCUMENT_LIST.COLUMNS.CREATED_ON' | translate}}"
                            source="createdAt">
                    </content-column>
                </content-columns>
                <content-actions>
                    <!-- folder actions -->
                    <content-action
                            target="folder"
                            type="button"
                            icon="delete"
                            handler="system1">
                    </content-action>
                    <content-action
                            target="folder"
                            type="menu"
                            title="{{'DOCUMENT_LIST.ACTIONS.FOLDER.SYSTEM_1' | translate}}"
                            handler="system1">
                    </content-action>
                    <content-action
                            target="folder"
                            type="menu"
                            title="{{'DOCUMENT_LIST.ACTIONS.FOLDER.CUSTOM' | translate}}"
                            (execute)="myFolderAction1($event)">
                    </content-action>
                    <content-action
                            target="folder"
                            type="menu"
                            title="{{'DOCUMENT_LIST.ACTIONS.FOLDER.DELETE' | translate}}"
                            handler="delete">
                    </content-action>
                    
                    <!-- document actions -->
                    <content-action
                            target="document"
                            type="button"
                            icon="account_circle"
                            handler="my-handler">
                    </content-action>
                    <content-action
                            target="document"
                            type="button"
                            icon="cloud_download"
                            handler="download">
                    </content-action>
                    <content-action
                            target="document"
                            type="menu"
                            title="{{'DOCUMENT_LIST.ACTIONS.DOCUMENT.DOWNLOAD' | translate}}"
                            handler="download">
                    </content-action>
                    <content-action
                            target="document"
                            type="menu"
                            title="{{'DOCUMENT_LIST.ACTIONS.DOCUMENT.SYSTEM_2' | translate}}"
                            handler="system2">
                    </content-action>
                    <content-action
                            target="document"
                            type="menu"
                            title="{{'DOCUMENT_LIST.ACTIONS.DOCUMENT.CUSTOM' | translate}}"
                            (execute)="myCustomAction1($event)">
                    </content-action>
                    <content-action
                            target="document"
                            type="menu"
                            title="{{'DOCUMENT_LIST.ACTIONS.DOCUMENT.DELETE' | translate}}"
                            handler="delete">
                    </content-action>
                </content-actions>
            </alfresco-document-list>
        </div>
    `,
    styles: [':host > .container {padding: 10px}'],
    directives: [DOCUMENT_LIST_DIRECTIVES],
    providers: [DOCUMENT_LIST_PROVIDERS],
    pipes: [AlfrescoPipeTranslate]
})
class DocumentListDemo implements OnInit {

    authenticated: boolean;

    constructor(
        private authService: AlfrescoAuthenticationService,
        settings: AlfrescoSettingsService,
        translation: AlfrescoTranslationService,
        documentActions: DocumentActionsService) {

        settings.host = 'http://192.168.99.100:8080';
        translation.translationInit();
        documentActions.setHandler('my-handler', this.myDocumentActionHandler.bind(this));
    }

    ngOnInit() {
        this.login();
    }

    myDocumentActionHandler(obj: any) {
        window.alert('my custom action handler');
    }

    myCustomAction1(event) {
        alert('Custom document action for ' + event.value.displayName);
    }

    myFolderAction1(event) {
        alert('Custom folder action for ' + event.value.displayName);
    }

    login() {
       this.authService.login('admin', 'admin').subscribe(token => {
           this.authenticated = true;
       });
    }
}

bootstrap(DocumentListDemo, [
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS
]);
