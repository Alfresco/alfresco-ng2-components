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

import {Component, Input, Output, EventEmitter} from '@angular/core';
import {AlfrescoAuthenticationService} from 'ng2-alfresco-core';
import {TagService} from '../services/tag.service';

/**
 *
 * This component, provide a list of the tags relative a node with actions button to add or remove new tag
 *
 * @returns {TagComponent} .
 */
declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'alfresco-tag-node-actions-list',
    templateUrl: './tag-actions.component.html',
    styleUrls: ['./tag-actions.component.css']
})
export class TagActionsComponent {

    @Input()
    nodeId: string;

    @Input()
    isContextMenu: boolean = false;

    @Output()
    onSuccess: EventEmitter<any> = new EventEmitter();

    newTagName: string;

    tagsEntries: any;

    /**
     * Constructor
     * @param authService
     */
    constructor(public authService: AlfrescoAuthenticationService, private tagService: TagService) {

    }

    ngOnChanges(changes) {
        return this.refreshTag();
    }

    refreshTag() {
        this.tagService.getTagsByNodeId(this.nodeId).then((data) => {
            this.tagsEntries = data;
        });
    }

    addTag() {
        this.tagService.addTag(this.nodeId, this.newTagName).then((res) => {
            this.refreshTag();
            this.onSuccess.emit(res.entry.id);
        });
    }

    removeTag(tag: string) {
        this.tagService.removeTag(this.nodeId, tag).then(() => {
            this.refreshTag();
        });
    }
}
