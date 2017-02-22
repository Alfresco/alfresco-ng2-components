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
import { TagService } from './../services/tag.service';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';

/**
 *
 * This component, provide a list of the tags relative a node with actions button to add or remove new tag
 *
 * @returns {TagComponent} .
 */

@Component({
    moduleId: module.id,
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

    errorMsg: string;

    constructor(private tagService: TagService, private translateService: AlfrescoTranslationService) {
        if (translateService) {
            translateService.addTranslationFolder('ng2-alfresco-tag', 'node_modules/ng2-alfresco-tag/src');
        }
    }

    ngOnChanges() {
        return this.refreshTag();
    }

    refreshTag() {
        this.tagService.getTagsByNodeId(this.nodeId).subscribe((data) => {
            this.tagsEntries = data.list.entries;
            this.resultsEmitter.emit(this.tagsEntries);
        });
    }

    addTag() {
        if (this.searchTag(this.newTagName)) {
            this.translateService.get('TAG.MESSAGES.EXIST').subscribe((error) => {
                this.errorMsg = error;
            });
        }

        this.tagService.addTag(this.nodeId, this.newTagName).subscribe(() => {
            this.newTagName = '';
            this.refreshTag();
            this.addEmitter.emit(this.nodeId);
        });
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
        this.tagService.removeTag(this.nodeId, tag).subscribe(() => {
            this.refreshTag();
        });
    }
}
