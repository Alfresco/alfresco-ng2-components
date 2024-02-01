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
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef, EventEmitter,
    Input,
    OnDestroy,
    OnInit, Output,
    QueryList,
    ViewChild,
    ViewChildren,
    ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { MatChip } from '@angular/material/chips';
import { Chip } from './chip';
import { Pagination } from '@alfresco/js-api';

/**
 *
 * This component show dynamic list of chips which render depending on free space.
 */

@Component({
    selector: 'adf-dynamic-chip-list',
    templateUrl: './dynamic-chip-list.component.html',
    styleUrls: ['./dynamic-chip-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DynamicChipListComponent implements OnDestroy, OnInit, AfterViewInit {
    /* eslint no-underscore-dangle: ["error", { "allow": ["_elementRef"] }]*/
    @Input()
    set chips(chips: Chip[]) {
        this.initialChips = chips;
        this.chipsToDisplay = chips;
        if (this.limitChipsDisplayed && this.chipsToDisplay.length > 0) {
            this.calculateChipsToDisplay();
        }
    }

    initialChips: Chip[] = [];

    /** Show delete button */
    @Input()
    showDelete = true;

    /** Should limit number of chips displayed */
    @Input()
    limitChipsDisplayed = false;

    @Input()
    pagination: Pagination;

    @Output()
    displayAll = new EventEmitter<void>();

    @ViewChild('nodeListContainer')
    containerView: ElementRef;

    @ViewChildren(MatChip)
    matChips: QueryList<MatChip>;

    chipsToDisplay: Chip[] = [];
    calculationsDone = false;
    columnFlexDirection = false;
    moveLoadMoreButtonToNextRow = false;
    undisplayedChipsCount = 0;
    viewMoreButtonLeftOffset: number;
    viewMoreButtonTop = 0;

    private onDestroy$ = new Subject<boolean>();
    private initialLimitChipsDisplayed: boolean;
    private viewMoreButtonLeftOffsetBeforeFlexDirection: number;
    private requestedDisplayingAllChips = false;
    private resizeObserver = new ResizeObserver(() => {
        this.calculateChipsToDisplay();
        this.changeDetectorRef.detectChanges();
    });

    constructor(private changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit() {
        this.initialLimitChipsDisplayed = this.limitChipsDisplayed;
    }

    ngAfterViewInit() {
        this.resizeObserver.observe(this.containerView.nativeElement);
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
        this.resizeObserver.unobserve(this.containerView.nativeElement);
    }

    removeTag(tag: string) {
        console.log(tag);
        //this.tagService.removeTag(this.nodeId, tag).subscribe(() => {
            //this.refreshTag();
        //});
    }

    displayAllChips(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.limitChipsDisplayed = false;
        this.requestedDisplayingAllChips = true;
        this.resizeObserver.unobserve(this.containerView.nativeElement);
        this.displayAll.emit();
    }

    private calculateChipsToDisplay() {
        if (!this.requestedDisplayingAllChips) {
            this.chipsToDisplay = this.initialChips;
            this.changeDetectorRef.detectChanges();
            this.undisplayedChipsCount = 0;
            let chipsToDisplay = 1;
            const containerWidth: number = this.containerView.nativeElement.clientWidth;
            const viewMoreButton = this.containerView.nativeElement.children[1];
            const viewMoreBtnWidth: number = viewMoreButton.getBoundingClientRect().width;
            const firstChip = this.matChips.get(0);
            const chipMargin = firstChip ? this.getChipMargin(this.matChips.get(0)) : 0;
            let chipsWidth = 0;
            const chips = this.matChips.toArray();
            let lastIndex = 0;
            do {
                chipsWidth = Math.max(chips.reduce((width, val, index) => {
                    width += val._elementRef.nativeElement.getBoundingClientRect().width + chipMargin;
                    const availableSpace = index === chips.length - 1 ? containerWidth - viewMoreBtnWidth : containerWidth;
                    if (availableSpace >= width) {
                        chipsToDisplay++;
                        lastIndex++;
                        this.viewMoreButtonLeftOffset = width;
                        this.viewMoreButtonLeftOffsetBeforeFlexDirection = width;
                    }
                    return width;
                }, 0), chipsWidth);
                chips.splice(0, lastIndex);
                lastIndex = 0;
            } while (chipsToDisplay <= this.pagination?.maxItems || chipsToDisplay < this.matChips.length && this.matChips.length);
            if ((containerWidth - chipsWidth - viewMoreBtnWidth) <= 0) {
                const hasNotEnoughSpaceForMoreButton = (containerWidth < (this.matChips.last._elementRef.nativeElement.offsetWidth + this.matChips.last._elementRef.nativeElement.offsetLeft + viewMoreBtnWidth));
                this.columnFlexDirection = chipsToDisplay === 1 && !this.pagination && hasNotEnoughSpaceForMoreButton;
                this.moveLoadMoreButtonToNextRow = this.pagination && hasNotEnoughSpaceForMoreButton;
                this.undisplayedChipsCount = this.chipsToDisplay.length - chipsToDisplay;
                this.chipsToDisplay = this.chipsToDisplay.slice(0, chipsToDisplay);
            } else {
                this.moveLoadMoreButtonToNextRow = false;
            }
            this.limitChipsDisplayed = this.undisplayedChipsCount ? this.initialLimitChipsDisplayed : !!this.pagination;
            if (this.pagination) {
                const lastChipTop = this.matChips.last._elementRef.nativeElement.offsetTop;
                if (this.moveLoadMoreButtonToNextRow) {
                    this.viewMoreButtonLeftOffset = 0;
                    this.viewMoreButtonTop = lastChipTop + viewMoreButton.offsetHeight;
                } else {
                    this.viewMoreButtonLeftOffset = this.viewMoreButtonLeftOffsetBeforeFlexDirection;
                    this.viewMoreButtonTop = lastChipTop;
                }
            } else {
                this.viewMoreButtonLeftOffset = this.columnFlexDirection ? 0 : this.viewMoreButtonLeftOffsetBeforeFlexDirection;
            }
            this.calculationsDone = true;
        }
    }

    private getChipMargin(chip: MatChip): number {
        const chipStyles = window.getComputedStyle(chip._elementRef.nativeElement);
        return parseInt(chipStyles.marginLeft, 10) + parseInt(chipStyles.marginRight, 10);
    }

    /*private calculateChipsWidth(chips: QueryList<MatChip>, chipMargin, containerWidth, viewMoreBtnWidth, chipsToDisplay) {
        return chips.reduce((width, val, index) => {
            width += val._elementRef.nativeElement.offsetWidth + chipMargin;
            if (containerWidth - viewMoreBtnWidth > width || chipsToDisplay <= this.pagination?.maxItems) {
                chipsToDisplay = index + 1;
                this.viewMoreButtonLeftOffset = width;
                this.viewMoreButtonLeftOffsetBeforeFlexDirection = width;
            }
            return width;
        }, 0);
    }*/
}
