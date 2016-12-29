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

import { Component, Output, EventEmitter } from '@angular/core';
import { TagService } from '../services/tag.service';

/**
 *
 * This component provide a list of all the tag inside the ECM
 *
 * @returns {TagList} .
 */

@Component({
    moduleId: module.id,
    selector: 'alfresco-tag-list',
    templateUrl: './tag-list.component.html'
})
export class TagList {

    tagsEntries: any;

    @Output()
    resultsEmitter = new EventEmitter();

    /**
     * Constructor
     * @param authService
     */
    constructor(private tagService: TagService) {
    }

    ngOnInit(changes) {
        return this.refreshTagEcm();
    }

    refreshTagEcm() {
        this.tagService.getAllTheTags().subscribe((data) => {
            this.tagsEntries = data.list.entries;
            this.resultsEmitter.emit(this.tagsEntries);
        });
    }
}
