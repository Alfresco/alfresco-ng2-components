/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    EventEmitter,
    Input,
    OnChanges,
    Output,
    ViewEncapsulation,
    OnDestroy,
    OnInit,
    ViewChild,
    ElementRef,
    ViewChildren,
    QueryList,
    ChangeDetectorRef,
    AfterViewInit
} from '@angular/core';
import { TagService } from './services/tag.service';
import { TagEntry } from '@alfresco/js-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatChip } from '@angular/material/chips';

/**
 *
 * This component, ShowNodeTag a list of the tag on relative a node
 */

@Component({
    selector: 'adf-tag-node-list',
    templateUrl: './tag-node-list.component.html',
    styleUrls: ['./tag-node-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TagNodeListComponent implements OnChanges, OnDestroy, OnInit, AfterViewInit {
    /* eslint no-underscore-dangle: ["error", { "allow": ["_elementRef"] }]*/
    /** The identifier of a node. */
    @Input()
    nodeId: string;

    /** Show delete button */
    @Input()
    showDelete = true;

    /** Should limit number of tags displayed */
    @Input()
    limitTagsDisplayed = false;

    @ViewChild('nodeListContainer')
    containerView: ElementRef;

    @ViewChildren(MatChip)
    tagChips: QueryList<MatChip>;

    tagsEntries: TagEntry[] = [];
    calculationsDone = false;
    columnFlexDirection = false;
    undisplayedTagsCount = 0;
    viewMoreButtonLeftOffset: number;

    /** Emitted when a tag is selected. */
    @Output()
    results = new EventEmitter();

    private onDestroy$ = new Subject<boolean>();
    private initialLimitTagsDisplayed: boolean;
    private initialTagsEntries: TagEntry[] = [];
    private viewMoreButtonLeftOffsetBeforeFlexDirection: number;
    private requestedDisplayingAllTags = false;
    private resizeObserver = new ResizeObserver(() => {
        this.calculateTagsToDisplay();
        this.changeDetectorRef.detectChanges();
    });

    /**
     * Constructor
     *
     * @param tagService
     * @param changeDetectorRef
     */
    constructor(private tagService: TagService, private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnChanges() {
        this.refreshTag();
    }

    ngOnInit() {
        this.initialLimitTagsDisplayed = this.limitTagsDisplayed;
        this.tagService.refresh
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => this.refreshTag());

        this.results
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => {
                if (this.limitTagsDisplayed && this.tagsEntries.length > 0) {
                    this.calculateTagsToDisplay();
                }
        });
    }

    ngAfterViewInit() {
        this.resizeObserver.observe(this.containerView.nativeElement);
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
        this.resizeObserver.unobserve(this.containerView.nativeElement);
    }

    refreshTag() {
        if (this.nodeId) {
            this.tagService.getTagsByNodeId(this.nodeId).subscribe((tagPaging) => {
                this.tagsEntries = tagPaging.list.entries;
                this.initialTagsEntries = tagPaging.list.entries;
                this.results.emit(this.tagsEntries);
            });
        }
    }

    removeTag(tag: string) {
        this.tagService.removeTag(this.nodeId, tag).subscribe(() => {
            this.refreshTag();
        });
    }

    displayAllTags(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.limitTagsDisplayed = false;
        this.requestedDisplayingAllTags = true;
        this.resizeObserver.unobserve(this.containerView.nativeElement);
        this.refreshTag();
    }

    private calculateTagsToDisplay() {
        if (!this.requestedDisplayingAllTags) {
            this.tagsEntries = this.initialTagsEntries;
            this.changeDetectorRef.detectChanges();
            this.undisplayedTagsCount = 0;
            let tagsToDisplay = 1;
            const containerWidth: number = this.containerView.nativeElement.clientWidth;
            const viewMoreBtnWidth: number = this.containerView.nativeElement.children[1].offsetWidth;
            const firstTag = this.tagChips.get(0);
            const tagChipMargin = firstTag ? this.getTagChipMargin(this.tagChips.get(0)) : 0;
            const tagChipsWidth: number = this.tagChips.reduce((width, val, index) => {
                width += val._elementRef.nativeElement.offsetWidth + tagChipMargin;
                if (containerWidth - viewMoreBtnWidth > width) {
                    tagsToDisplay = index + 1;
                    this.viewMoreButtonLeftOffset = width;
                    this.viewMoreButtonLeftOffsetBeforeFlexDirection = width;
                }
                return width;
            }, 0);
            if ((containerWidth - tagChipsWidth) <= 0) {
                this.columnFlexDirection = tagsToDisplay === 1 && (containerWidth < (this.tagChips.get(0)._elementRef.nativeElement.offsetWidth + viewMoreBtnWidth));
                this.undisplayedTagsCount = this.tagsEntries.length - tagsToDisplay;
                this.tagsEntries = this.tagsEntries.slice(0, tagsToDisplay);
            }
            this.limitTagsDisplayed = this.undisplayedTagsCount ? this.initialLimitTagsDisplayed : false;
            this.viewMoreButtonLeftOffset = this.columnFlexDirection ? 0 : this.viewMoreButtonLeftOffsetBeforeFlexDirection;
            this.calculationsDone = true;
        }
    }

    private getTagChipMargin(chip: MatChip): number {
        const tagChipStyles = window.getComputedStyle(chip._elementRef.nativeElement);
        return parseInt(tagChipStyles.marginLeft, 10) + parseInt(tagChipStyles.marginRight, 10);
    }
}
