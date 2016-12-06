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

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { TagService } from '../services/tag.service';

/**
 *
 * This component, provide a list of the tags relative a node with actions button to add or remove new tag
 *
 * @returns {TagComponent} .
 */

@Component({
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
    addEmitter: EventEmitter<any> = new EventEmitter();

    @Output()
    resultsEmitter = new EventEmitter();

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
        this.tagService.getTagsByNodeId(this.nodeId).subscribe((data) => {
            this.tagsEntries = data.list.entries;
            this.resultsEmitter.emit(this.tagsEntries);
        });
    }

    addTag() {
        this.tagService.addTag(this.nodeId, this.newTagName).subscribe((res) => {
            this.refreshTag();
            this.addEmitter.emit(this.nodeId);
        });
    }

    removeTag(tag: string) {
        this.tagService.removeTag(this.nodeId, tag).subscribe(() => {
            this.refreshTag();
        });
    }
}
