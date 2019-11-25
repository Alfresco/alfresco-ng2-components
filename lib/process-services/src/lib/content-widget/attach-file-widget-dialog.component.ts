/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Component, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExternalAlfrescoApiService, AlfrescoApiService, AuthenticationService, LoginDialogPanelComponent, SitesService, SearchService } from '@alfresco/adf-core';
import { DocumentListService, ContentNodeSelectorService } from '@alfresco/adf-content-services';
import { AttachFileWidgetDialogComponentData } from './attach-file-widget-dialog-component.interface';
import { Node } from '@alfresco/js-api';

@Component({
    selector: 'adf-attach-file-widget-dialog',
    templateUrl: './attach-file-widget-dialog.component.html',
    styleUrls: ['./attach-file-widget-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ AuthenticationService,
                 DocumentListService,
                 SitesService,
                 ContentNodeSelectorService,
                 SearchService,
                 { provide: AlfrescoApiService, useClass: ExternalAlfrescoApiService} ]
})
export class AttachFileWidgetDialogComponent {

    @ViewChild('adfLoginPanel', { static: false })
    loginPanel: LoginDialogPanelComponent;

    chosenNode: Node[];
    buttonActionName;

    constructor(@Inject(MAT_DIALOG_DATA) public data: AttachFileWidgetDialogComponentData,
                private externalApiService: AlfrescoApiService) {
        (<any> externalApiService).init(data.ecmHost, data.context);
        this.buttonActionName = data.actionName ? `ATTACH-FILE.ACTIONS.${data.actionName.toUpperCase()}` : 'ATTACH-FILE.ACTIONS.CHOOSE';
    }

    isLoggedIn() {
        return this.externalApiService.getInstance().isLoggedIn();
    }

    performLogin() {
        this.loginPanel.submitForm();
    }

    close() {
        this.data.selected.complete();
    }

    onSelect(nodeList: Node[]) {
        if (nodeList && nodeList[0].isFile) {
            this.chosenNode = nodeList;
        } else {
            this.chosenNode = null;
        }
    }

    onClick() {
        this.data.selected.next(this.chosenNode);
        this.data.selected.complete();
    }

}
