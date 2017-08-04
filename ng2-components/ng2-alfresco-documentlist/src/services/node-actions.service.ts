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

import { EventEmitter, Injectable } from '@angular/core';
import { MdDialog } from '@angular/material';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { AlfrescoContentService, AlfrescoTranslationService } from 'ng2-alfresco-core';
import { Subject } from 'rxjs/Rx';
import { ContentNodeSelectorComponent } from '../components/content-node-selector/content-node-selector.component';
import { DocumentListService } from './document-list.service';

@Injectable()
export class NodeActionsService {

    constructor(private dialog: MdDialog,
                private translateService: AlfrescoTranslationService,
                private documentListService?: DocumentListService,
                private contentService?: AlfrescoContentService) {
        if (translateService) {
            translateService.addTranslationFolder('ng2-alfresco-documentlist', 'assets/ng2-alfresco-documentlist');
        }
    }

    /**
     * Copy content node
     *
     * @param contentEntry node to copy
     * @param permission permission which is needed to apply the action
     */
    public copyContent(contentEntry: MinimalNodeEntryEntity, permission?: string): Subject<string> {
        return this.doFileOperation('copy', 'content', contentEntry, permission);
    }

    /**
     * Copy folder node
     *
     * @param contentEntry node to copy
     * @param permission permission which is needed to apply the action
     */
    public copyFolder(contentEntry: MinimalNodeEntryEntity, permission?: string): Subject<string> {
        return this.doFileOperation('copy', 'folder', contentEntry, permission);
    }

    /**
     * Move content node
     *
     * @param contentEntry node to move
     * @param permission permission which is needed to apply the action
     */
    public moveContent(contentEntry: MinimalNodeEntryEntity, permission?: string): Subject<string> {
        return this.doFileOperation('move', 'content', contentEntry, permission);
    }

    /**
     * Move folder node
     *
     * @param contentEntry node to move
     * @param permission permission which is needed to apply the action
     */
    public moveFolder(contentEntry: MinimalNodeEntryEntity, permission?: string): Subject<string> {
        return this.doFileOperation('move', 'folder', contentEntry, permission);
    }

    /**
     * General method for performing the given operation (copy|move)
     *
     * @param action the action to perform (copy|move)
     * @param type type of the content (content|folder)
     * @param contentEntry the contentEntry which has to have the action performed on
     * @param permission permission which is needed to apply the action
     */
    private doFileOperation(action: string, type: string, contentEntry: MinimalNodeEntryEntity, permission?: string): Subject<string> {
        const observable: Subject<string> = new Subject<string>();

        if (this.contentService.hasPermission(contentEntry, permission)) {
            const title = `${action} ${contentEntry.name} to ...`,
                select: EventEmitter<MinimalNodeEntryEntity> = new EventEmitter<MinimalNodeEntryEntity>();

            this.dialog.open(ContentNodeSelectorComponent, {
                data: { title, select },
                panelClass: 'adf-content-node-selector-dialog',
                width: '576px'
            });

            select.subscribe((parent: MinimalNodeEntryEntity) => {
                this.documentListService[`${action}Node`].call(this.documentListService, contentEntry.id, parent.id)
                    .subscribe(
                        () => {
                            let fileOperationMessage: any = this.translateService.get(`OPERATION.SUCCES.${type.toUpperCase()}.${action.toUpperCase()}`);
                            observable.next(fileOperationMessage.value);
                        },
                        (errors) => {
                            const errorStatusCode = JSON.parse(errors.message).error.statusCode;
                            observable.error(errorStatusCode);
                        }
                    );
                this.dialog.closeAll();
            });

            return observable;
        } else {
            observable.error(403);
            return observable;
        }
    }
}
