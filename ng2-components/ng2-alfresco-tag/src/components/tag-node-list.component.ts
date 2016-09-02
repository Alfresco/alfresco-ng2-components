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

import {Component, Input} from '@angular/core';
import {AlfrescoAuthenticationService} from 'ng2-alfresco-core';
import {TagService} from '../services/tag.service';

/**
 *
 * This component, ShowNodeTag a list of the tag on relative a node
 *
 * @returns {TagNodeList} .
 */
declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'alfresco-tag-node-list',
    templateUrl: './tag-node-list.component.html',
    styleUrls: ['./tag-node-list.component.css']
})
export class TagNodeList {

    @Input()
    nodeId: string;

    @Input()
    properties: string;

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
        if (this.nodeId) {
            this.tagService.getTagsByNodeId(this.nodeId).then((data) => {
                this.tagsEntries = data;
            });
        } else if (this.properties) {
            this.tagService.getTagsByProperties(this.properties).then((data) => {
                this.tagsEntries = data;
            });
        }
    }

    removeTag(tag: string) {
        this.tagService.removeTag(this.nodeId, tag).then(() => {
            this.refreshTag();
        });
    }
}
