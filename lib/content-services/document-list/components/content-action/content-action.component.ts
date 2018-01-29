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

 /* tslint:disable:component-selector  */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ContentActionHandler } from '../../models/content-action.model';
import { DocumentActionsService } from '../../services/document-actions.service';
import { FolderActionsService } from '../../services/folder-actions.service';
import { ContentActionModel } from './../../models/content-action.model';
import { ContentActionListComponent } from './content-action-list.component';

@Component({
    selector: 'content-action',
    template: '',
    providers: [
        DocumentActionsService,
        FolderActionsService
    ]
})
export class ContentActionComponent implements OnInit {

    /** The title of the action as shown in the menu. */
    @Input()
    title: string = 'Action';

    /** The name of the icon to display next to the menu command (can be left blank). */
    @Input()
    icon: string;

    /** System actions. Can be "delete", "download", "copy" or "move". */
    @Input()
    handler: string;

    /** Type of item that the action appies to. Can be "document" or "folder" */
    @Input()
    target: string = 'all';

    /** The permission type. */
    @Input()
    permission: string;

    /** Should this action be disabled in the menu if the user doesn't have permission for it? */
    @Input()
    disableWithNoPermission: boolean;

    /** Is the menu item disabled? */
    @Input()
    disabled: boolean = false;

    /** Emitted when the user selects the action from the menu. */
    @Output()
    execute = new EventEmitter();

    /** Emitted when a permission error occurs */
    @Output()
    permissionEvent = new EventEmitter();

    /** Emitted when an error occurs during the action.
     * Applies to copy and move actions.
     */
    @Output()
    error = new EventEmitter();

    /** Emitted when the action succeeds with the success string message.
     * Applies to copy, move and delete actions.
     */
    @Output()
    success = new EventEmitter();

    constructor(
        private list: ContentActionListComponent,
        private documentActions: DocumentActionsService,
        private folderActions: FolderActionsService) {
    }

    ngOnInit() {
        if (this.handler) {
            if (this.target === 'all') {
                this.generateAction('folder');
                this.generateAction('document');
            } else {
                this.generateAction(this.target);
            }
        }
    }

    register(model: ContentActionModel): boolean {
        if (this.list) {
            return this.list.registerAction(model);
        }
        return false;
    }

    private generateAction(target: string) {
        let model = new ContentActionModel({
            title: this.title,
            icon: this.icon,
            permission: this.permission,
            disableWithNoPermission: this.disableWithNoPermission,
            target: target,
            disabled: this.disabled
        });

        model.handler = this.getSystemHandler(target, this.handler);

        if (this.execute) {
            model.execute = (value: any): void => {
                this.execute.emit({ value });
            };
        }

        this.register(model);
    }

    getSystemHandler(target: string, name: string): ContentActionHandler {
        if (target) {
            let ltarget = target.toLowerCase();

            if (ltarget === 'document') {
                if (this.documentActions) {
                    this.documentActions.permissionEvent.subscribe((permission) => {
                        this.permissionEvent.emit(permission);
                    });

                    this.documentActions.error.subscribe((errors) => {
                        this.error.emit(errors);
                    });

                    this.documentActions.success.subscribe((message) => {
                        this.success.emit(message);
                    });

                    return this.documentActions.getHandler(name);
                }
                return null;
            }

            if (ltarget === 'folder') {
                if (this.folderActions) {
                    this.folderActions.permissionEvent.subscribe((permission) => {
                        this.permissionEvent.emit(permission);
                    });

                    this.folderActions.error.subscribe((errors) => {
                        this.error.emit(errors);
                    });

                    this.folderActions.success.subscribe((message) => {
                        this.success.emit(message);
                    });

                    return this.folderActions.getHandler(name);
                }
                return null;
            }
        }
        return null;
    }
}
