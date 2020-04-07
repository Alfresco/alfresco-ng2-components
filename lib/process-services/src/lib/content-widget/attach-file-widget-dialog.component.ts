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
import { MAT_DIALOG_DATA } from '@angular/material';
import { ExternalAlfrescoApiService, AlfrescoApiService, AuthenticationService, LoginDialogPanelComponent, SitesService, SearchService, TranslationService } from '@alfresco/adf-core';
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

    @ViewChild('adfLoginPanel')
    loginPanel: LoginDialogPanelComponent;

    title: string;
    action: string;
    buttonActionName: string;
    chosenNode: Node[];

    constructor(private translation: TranslationService,
                @Inject(MAT_DIALOG_DATA) public data: AttachFileWidgetDialogComponentData,
                private externalApiService: AlfrescoApiService) {
        (<any> externalApiService).init(data.ecmHost, data.context);
        this.action = data.actionName ? data.actionName.toUpperCase() : 'CHOOSE';
        this.buttonActionName = `ATTACH-FILE.ACTIONS.${this.action}`;
        this.title = data.title;
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
        this.updateTitle(nodeList);
    }

    onClick() {
        this.data.selected.next(this.chosenNode);
        this.data.selected.complete();
    }

    updateTitle(nodeList: Node[]): void {
        if (this.action === 'CHOOSE' && nodeList) {
            if (nodeList[0].isFile) {
                this.title = this.getTitleTranslation(this.action + '_ITEM', nodeList[0].name);
            } else if (nodeList[0].isFolder) {
                this.title = this.getTitleTranslation(this.action + '_IN', nodeList[0].name);
            }
        }
    }

    getTitleTranslation(action: string, name: string): string {
        return this.translation.instant(`ATTACH-FILE.ACTIONS.${action}`, { name });
    }
}
