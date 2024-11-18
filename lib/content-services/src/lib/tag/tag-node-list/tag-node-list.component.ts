/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import {
    Component,
    DestroyRef,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core';
import { TagService } from '../services/tag.service';
import { TagEntry } from '@alfresco/js-api';
import { Chip, DynamicChipListComponent } from '@alfresco/adf-core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 *
 * This component, ShowNodeTag a list of the tag on relative a node
 */

@Component({
    selector: 'adf-tag-node-list',
    standalone: true,
    imports: [DynamicChipListComponent],
    templateUrl: './tag-node-list.component.html',
    encapsulation: ViewEncapsulation.None
})
export class TagNodeListComponent implements OnChanges, OnInit {
    /** The identifier of a node. */
    @Input()
    nodeId: string;

    /** Show delete button */
    @Input()
    showDelete = true;

    /** Should limit number of tags displayed */
    @Input()
    limitTagsDisplayed = false;

    /** Emitted when a tag is selected. */
    @Output()
    results = new EventEmitter<TagEntry[]>();

    private destroyRef = inject(DestroyRef);
    private _tagChips: Chip[] = [];

    get tagChips(): Chip[] {
        return this._tagChips;
    }

    constructor(private tagService: TagService) {}

    ngOnChanges(): void {
        this.refreshTag();
    }

    ngOnInit(): void {
        this.tagService.refresh.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.refreshTag());
    }

    refreshTag(): void {
        if (this.nodeId) {
            this.tagService.getTagsByNodeId(this.nodeId).subscribe((tagPaging) => {
                this._tagChips = tagPaging.list.entries.map((tag) => ({
                    id: tag.entry.id,
                    name: tag.entry.tag
                }));
                this.results.emit(tagPaging.list.entries);
            });
        }
    }

    removeTag(tag: string): void {
        this.tagService.removeTag(this.nodeId, tag).subscribe(() => {
            this.refreshTag();
        });
    }
}
