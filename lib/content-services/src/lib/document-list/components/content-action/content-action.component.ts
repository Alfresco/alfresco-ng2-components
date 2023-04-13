/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

 /* eslint-disable @angular-eslint/component-selector */

import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

import { ContentActionHandler } from '../../models/content-action.model';
import { DocumentActionsService } from '../../services/document-actions.service';
import { FolderActionsService } from '../../services/folder-actions.service';
import { ContentActionModel, ContentActionTarget } from './../../models/content-action.model';
import { ContentActionListComponent } from './content-action-list.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'content-action',
    template: '',
    providers: [
        DocumentActionsService,
        FolderActionsService
    ]
})
export class ContentActionComponent implements OnInit, OnChanges, OnDestroy {

    /** The title of the action as shown in the menu. */
    @Input()
    title: string = 'Action';

    /** The name of the icon to display next to the menu command (can be left blank). */
    @Input()
    icon: string;

    /** Visibility state (see examples). */
    @Input()
    visible: boolean | ((...args) => boolean) = true;

    /** System actions. Can be "delete", "download", "copy" or "move". */
    @Input()
    handler: string;

    /** Type of item that the action applies to. Can be "document" or "folder" */
    @Input()
    target: string = ContentActionTarget.All;

    /** The permission type. */
    @Input()
    permission: string;

    /** Should this action be disabled in the menu if the user doesn't have permission for it? */
    @Input()
    disableWithNoPermission: boolean;

    /** Is the menu item disabled? */
    @Input()
    disabled: boolean | ((...args) => boolean) = false;

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

    documentActionModel: ContentActionModel;
    folderActionModel: ContentActionModel;

    private subscriptions: Subscription[] = [];

    constructor(
        private list: ContentActionListComponent,
        private documentActions: DocumentActionsService,
        private folderActions: FolderActionsService) {
    }

    ngOnInit() {
        if (this.target === ContentActionTarget.All) {
            this.folderActionModel = this.generateAction(ContentActionTarget.Folder);
            this.documentActionModel = this.generateAction(ContentActionTarget.Document);
        } else {
            this.documentActionModel = this.generateAction(this.target);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.visible && !changes.visible.firstChange) {
            if (this.documentActionModel) {
                this.documentActionModel.visible = changes.visible.currentValue;
            }
            if (this.folderActionModel) {
                this.folderActionModel.visible = changes.visible.currentValue;
            }
        }

        if (changes.disabled && !changes.disabled.firstChange) {
            if (this.documentActionModel) {
                this.documentActionModel.disabled = changes.disabled.currentValue;
            }
            if (this.folderActionModel) {
                this.folderActionModel.disabled = changes.disabled.currentValue;
            }
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions = [];

        if (this.documentActionModel) {
            this.unregister(this.documentActionModel);
            this.documentActionModel = null;
        }

        if (this.folderActionModel) {
            this.unregister(this.folderActionModel);
            this.folderActionModel = null;
        }
    }

    register(model: ContentActionModel): boolean {
        if (this.list) {
            return this.list.registerAction(model);
        }
        return false;
    }

    unregister(model: ContentActionModel): boolean {
        if (this.list) {
            return this.list.unregisterAction(model);
        }
        return false;
    }

    private generateAction(target: string): ContentActionModel {
        const model = new ContentActionModel({
            title: this.title,
            icon: this.icon,
            permission: this.permission,
            disableWithNoPermission: this.disableWithNoPermission,
            target,
            disabled: this.disabled,
            visible: this.visible
        });
        if (this.handler) {
            model.handler = this.getSystemHandler(target, this.handler);
        }

        if (this.execute) {
            model.execute = (value: any): void => {
                this.execute.emit({ value });
            };
        }

        this.register(model);
        return model;
    }

    getSystemHandler(target: string, name: string): ContentActionHandler {
        if (target) {
            target = target.toLowerCase();

            if (target === ContentActionTarget.Document) {
                if (this.documentActions) {
                    this.subscriptions.push(
                        this.documentActions.permissionEvent.subscribe((permission) => {
                            this.permissionEvent.emit(permission);
                        }),
                        this.documentActions.error.subscribe((errors) => {
                            this.error.emit(errors);
                        }),
                        this.documentActions.success.subscribe((message) => {
                            this.success.emit(message);
                        })
                    );

                    return this.documentActions.getHandler(name);
                }
                return null;
            }

            if (target === ContentActionTarget.Folder) {
                if (this.folderActions) {
                    this.subscriptions.push(
                        this.folderActions.permissionEvent.subscribe((permission) => {
                            this.permissionEvent.emit(permission);
                        }),
                        this.folderActions.error.subscribe((errors) => {
                            this.error.emit(errors);
                        }),
                        this.folderActions.success.subscribe((message) => {
                            this.success.emit(message);
                        })
                    );

                    return this.folderActions.getHandler(name);
                }
                return null;
            }
        }
        return null;
    }
}
