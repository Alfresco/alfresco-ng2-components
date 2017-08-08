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

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { ContentActionHandler } from '../../models/content-action.model';
import { DocumentActionsService } from '../../services/document-actions.service';
import { FolderActionsService } from '../../services/folder-actions.service';
import { ContentActionModel } from './../../models/content-action.model';
import { ContentActionListComponent } from './content-action-list.component';

@Component({
    selector: 'content-action',
    template: ''
})
export class ContentActionComponent implements OnInit, OnChanges {

    @Input()
    title: string = 'Action';

    @Input()
    icon: string;

    @Input()
    handler: string;

    @Input()
    target: string;

    @Input()
    permission: string;

    @Input()
    disableWithNoPermission: boolean;

    @Input()
    disabled: boolean = false;

    @Output()
    execute = new EventEmitter();

    @Output()
    permissionEvent = new EventEmitter();

    @Output()
    error = new EventEmitter();

    @Output()
    success = new EventEmitter();

    model: ContentActionModel;

    constructor(
        private list: ContentActionListComponent,
        private documentActions: DocumentActionsService,
        private folderActions: FolderActionsService) {
        this.model = new ContentActionModel();
    }

    ngOnInit() {
        this.model = new ContentActionModel({
            title: this.title,
            icon: this.icon,
            permission: this.permission,
            disableWithNoPermission: this.disableWithNoPermission,
            target: this.target,
            disabled: this.disabled
        });

        if (this.handler) {
            this.model.handler = this.getSystemHandler(this.target, this.handler);
        }

        if (this.execute) {
            this.model.execute = (value: any): void => {
                this.execute.emit({ value });
            };
        }

        this.register();
    }

    register(): boolean {
        if (this.list) {
            return this.list.registerAction(this.model);
        }
        return false;
    }

    ngOnChanges(changes) {
        // update localizable properties
        this.model.title = this.title;
    }

    getSystemHandler(target: string, name: string): ContentActionHandler {
        if (target) {
            let ltarget = target.toLowerCase();

            if (ltarget === 'document') {
                if (this.documentActions) {
                    this.documentActions.permissionEvent.subscribe((permision) => {
                        this.permissionEvent.emit(permision);
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
                    this.folderActions.permissionEvent.subscribe((permision) => {
                        this.permissionEvent.emit(permision);
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
