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

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { TagService } from './../services/tag.service';

/**
 *
 * This component, provide a list of the tags relative a node with actions button to add or remove new tag
 *
 * @returns {TagComponent} .
 */

@Component({
    selector: 'adf-tag-node-actions-list, alfresco-tag-node-actions-list',
    templateUrl: './tag-actions.component.html',
    styleUrls: ['./tag-actions.component.css']
})
export class TagActionsComponent implements OnChanges {

    @Input()
    nodeId: string;

    @Input()
    isContextMenu: boolean = false;

    @Output()
    successAdd: EventEmitter<any> = new EventEmitter();

    @Output()
    error: EventEmitter<any> = new EventEmitter();

    @Output()
    result = new EventEmitter();

    newTagName: string;

    tagsEntries: any;

    errorMsg: string;

    disableAddTag: boolean = true;

    constructor(private tagService: TagService, private translateService: AlfrescoTranslationService) {
        this.tagService.refresh.subscribe(() => {
            this.refreshTag();
        });
    }

    ngOnChanges() {
        return this.refreshTag();
    }

    refreshTag() {
        this.tagService.getTagsByNodeId(this.nodeId).subscribe((data) => {
            this.tagsEntries = data.list.entries;
            this.disableAddTag = false;
            this.result.emit(this.tagsEntries);
        }, () => {
            this.tagsEntries = null;
            this.disableAddTag = true;
            this.result.emit(this.tagsEntries);
        });
    }

    addTag() {
        if (this.searchTag(this.newTagName)) {
            this.translateService.get('TAG.MESSAGES.EXIST').subscribe((error) => {
                this.errorMsg = error;
            });
            this.error.emit(this.errorMsg);
        } else {
            this.tagService.addTag(this.nodeId, this.newTagName).subscribe(() => {
                this.newTagName = '';
                this.successAdd.emit(this.nodeId);
            });
        }
    }

    searchTag(searchTagName: string) {
        if (this.tagsEntries) {
            return this.tagsEntries.find((currentTag) => {
                return (searchTagName === currentTag.entry.tag);
            });
        }
    }

    cleanErrorMsg() {
        this.errorMsg = '';
    }

    removeTag(tag: string) {
        this.tagService.removeTag(this.nodeId, tag);
    }
}
