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
import {ContentActionModel} from './../models/content-action.model';
import {DocumentActionList} from './document-action-list';
import {DocumentActionsService} from '../services/document-actions.service';

@Component({
    selector: 'document-action',
    template: ''
})
export class DocumentAction implements OnInit {
    @Input() title: string = 'Action';
    @Input() handler: string;
    @Output() execute = new EventEmitter();

    constructor(
        private list: DocumentActionList,
        private documentActions: DocumentActionsService) {
    }

    ngOnInit() {
        let model = new ContentActionModel();
        model.title = this.title;

        if (this.handler) {
            model.handler = this.documentActions.getHandler(this.handler);
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
