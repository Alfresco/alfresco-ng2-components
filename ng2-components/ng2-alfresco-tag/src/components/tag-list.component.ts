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

import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { TagService } from '../services/tag.service';

/**
 *
 * This component provide a list of all the tag inside the ECM
 *
 * @returns {TagList} .
 */

@Component({
    selector: 'adf-tag-list, alfresco-tag-list',
    templateUrl: './tag-list.component.html',
    styleUrls: ['./tag-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TagListComponent implements OnInit {

    tagsEntries: any;

    @Output()
    result = new EventEmitter();

    /**
     * Constructor
     * @param tagService
     */
    constructor(private tagService: TagService) {
        this.tagService.refresh.subscribe(() => {
            this.refreshTag();
        });
    }

    ngOnInit() {
        return this.refreshTag();
    }

    refreshTag() {
        this.tagService.getAllTheTags().subscribe((data) => {
            this.tagsEntries = data.list.entries;
            this.result.emit(this.tagsEntries);
        });
    }
}
