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

import { Component, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService, LogService } from 'ng2-alfresco-core';
import { MinimalNodeEntity } from 'alfresco-js-api';

import { DocumentListService } from './../services/document-list.service';
import { ContentActionModel } from './../models/content-action.model';
import { PermissionModel } from '../models/permissions.model';

declare let dialogPolyfill: any;

const ERROR_FOLDER_ALREADY_EXIST = 409;

@Component({
    selector: 'alfresco-document-menu-action',
    styleUrls: ['./document-menu-action.component.css'],
    templateUrl: './document-menu-action.component.html'
})
export class DocumentMenuActionComponent implements OnChanges {

    @Input()
    folderId: string;

    @Input()
    disableWithNoPermission: boolean = true;

    @Output()
    success = new EventEmitter();

    @Output()
    error = new EventEmitter();

    @Output()
    permissionErrorEvent = new EventEmitter();

    @ViewChild('dialog')
    dialog: any;

    actions: ContentActionModel[] = [];

    message: string;

    folderName: string = '';

    allowableOperations: string[];

    constructor(private documentListService: DocumentListService,
                private translateService: AlfrescoTranslationService,
                private logService: LogService) {

        if (translateService) {
            translateService.addTranslationFolder('ng2-alfresco-documentlist', 'node_modules/ng2-alfresco-documentlist/src');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes && changes['folderId']) {
            if (changes['folderId'].currentValue !== changes['folderId'].previousValue) {
                this.loadCurrentNodePermissions(changes['folderId'].currentValue);
            }
        }
    }

    public createFolder(name: string) {
        this.cancel();
        if (this.hasCreatePermission()) {
            this.documentListService.createFolder(name, this.folderId)
                .subscribe(
                    (res: MinimalNodeEntity) => {
                        this.folderName = '';
                        this.logService.info(res.entry);
                        this.success.emit({ node: res.entry });
                    },
                    error => {
                        if (error.response) {
                            let errorMessagePlaceholder = this.getErrorMessage(error.response);
                            this.message = this.formatString(errorMessagePlaceholder, [name]);
                            this.error.emit({ message: this.message });
                            this.logService.error(this.message);
                        } else {
                            this.error.emit(error);
                            this.logService.error(error);
                        }
                    }
                );
        } else {
            this.permissionErrorEvent.emit(new PermissionModel({
                type: 'folder',
                action: 'create',
                permission: 'create'
            }));
        }
    }

    public showDialog() {
        if (!this.dialog.nativeElement.showModal) {
            dialogPolyfill.registerDialog(this.dialog.nativeElement);
        }
        this.dialog.nativeElement.showModal();
    }

    public cancel() {
        if (this.dialog) {
            this.dialog.nativeElement.close();
        }
    }

    /**
     * Retrive the error message using the error status code
     * @param response - object that contain the HTTP response
     * @returns {string}
     */
    private getErrorMessage(response: any): string {
        if (response.body && response.body.error.statusCode === ERROR_FOLDER_ALREADY_EXIST) {
            let errorMessage: any;
            errorMessage = this.translateService.get('FILE_UPLOAD.MESSAGES.FOLDER_ALREADY_EXIST');
            return errorMessage.value;
        }
    }

    /**
     * Replace a placeholder {0} in a message with the input keys
     * @param message - the message that conains the placeholder
     * @param keys - array of value
     * @returns {string} - The message without placeholder
     */
    private formatString(message: string, keys: any []) {
        let i = keys.length;
        while (i--) {
            message = message.replace(new RegExp('\\{' + i + '\\}', 'gm'), keys[i]);
        }
        return message;
    }

    isFolderNameEmpty() {
        return this.folderName === '' ? true : false;
    }

    isButtonDisabled(): boolean {
        return !this.hasCreatePermission() && this.disableWithNoPermission ? true : undefined;
    }

    hasPermission(permission: string): boolean {
        let hasPermission: boolean = false;
        if (this.allowableOperations) {
            let permFound = this.allowableOperations.find(element => element === permission);
            hasPermission = permFound ? true : false;
        }
        return hasPermission;
    }

    hasCreatePermission() {
        return this.hasPermission('create');
    }

    loadCurrentNodePermissions(nodeId: string) {
        this.documentListService.getFolderNode(nodeId).then(node => {
            this.allowableOperations = node ? node['allowableOperations'] : null;
        }).catch(err => this.error.emit(err));
    }
}
