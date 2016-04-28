/**
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

import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import {ContentActionModel} from '../models/content-action.model';
import {QuickFolderActionList} from './quick-folder-action-list';
import {FolderActionsService} from '../services/folder-actions.service';

@Component({
    selector: 'quick-folder-action',
    template: ''
})
export class QuickFolderAction implements OnInit {
    @Input() icon: string;
    @Input() title: string;
    @Input() handler: string;
    @Output() execute = new EventEmitter();

    constructor(
        private list: QuickFolderActionList,
        private folderActions: FolderActionsService) {
    }

    ngOnInit() {
        let model = new ContentActionModel();
        model.icon = this.icon;
        model.title = this.title;

        if (this.handler) {
            model.handler = this.folderActions.getHandler(this.handler);
        } else if (this.execute) {
            model.handler = (document: any): void => {
                this.execute.emit({
                    value: document
                });
            };
        }

        this.list.registerAction(model);
    }
}
