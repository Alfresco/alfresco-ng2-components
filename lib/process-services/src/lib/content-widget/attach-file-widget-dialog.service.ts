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

import { MatDialog } from '@angular/material/dialog';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { AlfrescoApiService, TranslationService } from '@alfresco/adf-core';
import { Observable, of, Subject } from 'rxjs';
import { AttachFileWidgetDialogComponentData } from './attach-file-widget-dialog-component.interface';
import { AlfrescoEndpointRepresentation, Node, ContentApi } from '@alfresco/js-api';
import { AttachFileWidgetDialogComponent } from './attach-file-widget-dialog.component';
import { switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
// tslint:disable-next-line: directive-class-suffix
export class AttachFileWidgetDialogService {
    private externalApis: { [key: string]: AlfrescoApiService } = {};

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    constructor(private dialog: MatDialog,
                private translation: TranslationService) {
    }

    /**
     * Opens a dialog to choose a file to upload.
     * @param repository Alfresco endpoint that represents the content service
     * @param currentFolderId Upload file from specific folder
     * @returns Information about the chosen file(s)
     */
    openLogin(repository: AlfrescoEndpointRepresentation, currentFolderId = '-my-', accountIdentifier?: string): Observable<Node[]> {
        const { title, ecmHost, selected, registerExternalHost } = this.constructPayload(repository);
        const data: AttachFileWidgetDialogComponentData = {
            title,
            selected,
            ecmHost,
            currentFolderId,
            isSelectionValid: (entry: Node) => entry.isFile,
            showFilesInResult: true,
            registerExternalHost,
            accountIdentifier
        };

        this.openLoginDialog(data, 'adf-attach-file-widget-dialog', '630px');
        return selected;
    }

    private openLoginDialog(data: AttachFileWidgetDialogComponentData, currentPanelClass: string, chosenWidth: string) {
        this.dialog.open(AttachFileWidgetDialogComponent, { data, panelClass: currentPanelClass, width: chosenWidth });
    }

    private showExternalHostLoginDialog(repository: AlfrescoEndpointRepresentation): Observable<AlfrescoApiService> {
        const data = {
            ...this.constructPayload(repository),
            loginOnly: true
        };
        return this.dialog.open(AttachFileWidgetDialogComponent, { data, panelClass: 'adf-attach-file-widget-dialog', width: '630px' })
            .afterClosed();
    }

    downloadURL(repository: AlfrescoEndpointRepresentation, sourceId: string): Observable<string> {
        const { accountIdentifier } = this.constructPayload(repository);
        const contentApi = new ContentApi(this.externalApis[accountIdentifier].getInstance());

        if (this.externalApis[accountIdentifier]?.getInstance()?.isLoggedIn()) {
            return of(contentApi.getContentUrl(sourceId));
        }

        return this.showExternalHostLoginDialog(repository).pipe(
            switchMap(() => of(contentApi.getContentUrl(sourceId)))
        );
    }

    private constructPayload(repository: AlfrescoEndpointRepresentation) {
        const accountIdentifier = 'alfresco-' + repository.id + '-' + repository.name;
        const ecmHost = repository.repositoryUrl.replace('/alfresco', '');
        const selected = new Subject<Node[]>();
        selected.subscribe({
            complete: this.close.bind(this)
        });
        const title = this.getLoginTitleTranslation(ecmHost);
        const registerExternalHost = this.addService.bind(this);
        return { ecmHost, accountIdentifier, selected, title, registerExternalHost };
    }

    addService(accountIdentifier: string, apiService: AlfrescoApiService) {
        if (!this.externalApis[accountIdentifier]) {
            this.externalApis[accountIdentifier] = apiService;
        }
    }

    /** Closes the currently open dialog. */
    close() {
        this.dialog.closeAll();
    }

    private getLoginTitleTranslation(ecmHost: string): string {
        return this.translation.instant(`ATTACH-FILE.DIALOG.LOGIN`, { ecmHost });
    }
}
