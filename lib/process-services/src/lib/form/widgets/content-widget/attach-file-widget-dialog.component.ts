/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, DestroyRef, inject, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService, LoginDialogPanelComponent, TranslationService } from '@alfresco/adf-core';
import { AttachFileWidgetDialogComponentData } from './attach-file-widget-dialog-component.interface';
import {
    AlfrescoApiService,
    ContentNodeSelectorPanelComponent,
    DocumentListService,
    SearchService,
    SitesService
} from '@alfresco/adf-content-services';
import { ExternalAlfrescoApiService } from '../../services/external-alfresco-api.service';
import { Node } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-attach-file-widget-dialog',
    imports: [CommonModule, MatDialogModule, LoginDialogPanelComponent, MatButtonModule, TranslateModule, ContentNodeSelectorPanelComponent],
    templateUrl: './attach-file-widget-dialog.component.html',
    styleUrls: ['./attach-file-widget-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        AuthenticationService,
        DocumentListService,
        SitesService,
        SearchService,
        { provide: AlfrescoApiService, useClass: ExternalAlfrescoApiService }
    ]
})
export class AttachFileWidgetDialogComponent implements OnInit {
    @ViewChild('adfLoginPanel')
    loginPanel: LoginDialogPanelComponent;

    title: string;
    action: string;
    buttonActionName: string;
    chosenNode: Node[];

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private translation: TranslationService,
        @Inject(MAT_DIALOG_DATA) public data: AttachFileWidgetDialogComponentData,
        private externalApiService: AlfrescoApiService,
        private authenticationService: AuthenticationService,
        private matDialogRef: MatDialogRef<AttachFileWidgetDialogComponent>
    ) {
        (externalApiService as ExternalAlfrescoApiService).init(data.ecmHost, data.context);
        this.action = data.actionName ? data.actionName.toUpperCase() : 'CHOOSE';
        this.buttonActionName = `ATTACH-FILE.ACTIONS.${this.action}`;
        this.updateTitle('DROPDOWN.MY_FILES_OPTION');
    }

    ngOnInit() {
        this.authenticationService.onLogin.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.registerAndClose());

        if (this.isLoggedIn()) {
            this.registerAndClose();
        }
    }
    isLoggedIn(): boolean {
        return !!this.externalApiService.getInstance()?.isLoggedIn();
    }

    performLogin() {
        this.loginPanel.submitForm();
    }

    close() {
        this.data.selected.complete();
    }

    onSelect(nodeList: Node[]) {
        this.chosenNode = nodeList;
    }

    onSiteChange(siteTitle: string) {
        this.updateTitle(siteTitle);
    }

    onClick() {
        this.data.selected.next(this.chosenNode);
        this.data.selected.complete();
    }

    updateTitle(siteTitle: string) {
        if (this.action === 'CHOOSE' && siteTitle) {
            this.title = this.getTitleTranslation(this.action, siteTitle);
        }
    }

    getTitleTranslation(action: string, name?: string): string {
        return this.translation.instant(`ATTACH-FILE.ACTIONS.${action}_ITEM`, { name: this.translation.instant(name) });
    }

    hasNodeSelected(): boolean {
        return this.chosenNode?.length > 0;
    }

    private registerAndClose() {
        if (this.data) {
            this.data.registerExternalHost?.(this.data.accountIdentifier, this.externalApiService);

            if (this.data.loginOnly) {
                this.data.selected?.complete();
                this.matDialogRef.close();
            }
        }
    }
}
