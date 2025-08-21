/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Pagination } from '@alfresco/js-api';
import { NgForOf, NgIf } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    ViewChild,
    ViewChildren,
    ViewEncapsulation
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChip, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { Chip } from './chip';

/**
 * This component shows dynamic list of chips which render depending on free space.
 */
@Component({
    selector: 'adf-dynamic-chip-list',
    templateUrl: './dynamic-chip-list.component.html',
    styleUrls: ['./dynamic-chip-list.component.scss'],
    imports: [MatChipsModule, TranslatePipe, NgForOf, MatIconModule, NgIf, MatButtonModule],
    encapsulation: ViewEncapsulation.None
})
export class DynamicChipListComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
    /* eslint no-underscore-dangle: ["error", { "allow": ["_elementRef"] }]*/
    /** Provide if you want to use paginated chips. */
    @Input()
    pagination: Pagination;

    /** List of chips to display. */
    @Input({ required: true })
    chips: Chip[];

    /** Show delete button. */
    @Input()
    showDelete = true;

    /** Disable delete button. */
    @Input()
    disableDelete = false;

    /** Should limit number of chips displayed. */
    @Input()
    limitChipsDisplayed = false;

    /** Round up chips */
    @Input()
    roundUpChips = false;

    /** Emitted when button for view more is clicked. */
    @Output()
    displayNext = new EventEmitter<void>();

    /** Emitted when any chip is removed. */
    @Output()
    removedChip = new EventEmitter<string>();

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
    paginationData: Pagination;

    private initialChips: Chip[] = [];
    private initialLimitChipsDisplayed: boolean;
    private viewMoreButtonLeftOffsetBeforeFlexDirection: number;
    private requestedDisplayingAllChips = false;
    private resizeObserver = new ResizeObserver(() => {
        if (this.initialLimitChipsDisplayed && this.chipsToDisplay.length) {
            this.calculateChipsToDisplay();
            this.changeDetectorRef.detectChanges();
        }
    });

    constructor(private changeDetectorRef: ChangeDetectorRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.pagination) {
            this.limitChipsDisplayed = this.pagination?.hasMoreItems;
            this.paginationData = this.pagination;
            this.initialLimitChipsDisplayed = this.limitChipsDisplayed;
        }
        if (changes.chips) {
            this.initialChips = this.chips;
            this.chipsToDisplay = this.initialChips;
            if (this.limitChipsDisplayed && this.chipsToDisplay.length) {
                this.calculateChipsToDisplay();
                this.changeDetectorRef.detectChanges();
            }
        }
    }

    ngOnInit(): void {
        if (this.paginationData) {
            this.limitChipsDisplayed = this.paginationData.hasMoreItems;
        }
        this.initialLimitChipsDisplayed = this.limitChipsDisplayed;
    }

    ngAfterViewInit(): void {
        this.resizeObserver.observe(this.containerView.nativeElement);
    }

    ngOnDestroy(): void {
        this.resizeObserver.unobserve(this.containerView.nativeElement);
    }

    displayNextChips(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        if (this.paginationData) {
            this.requestedDisplayingAllChips = !this.paginationData.hasMoreItems;
        } else {
            this.limitChipsDisplayed = false;
            this.requestedDisplayingAllChips = true;
        }
        if (this.requestedDisplayingAllChips) {
            this.resizeObserver.unobserve(this.containerView.nativeElement);
        }
        this.displayNext.emit();
    }

    private calculateChipsToDisplay(): void {
        if (this.requestedDisplayingAllChips || !this.chips.length) {
            return;
        }
        this.chipsToDisplay = this.initialChips;
        this.changeDetectorRef.detectChanges();
        this.undisplayedChipsCount = 0;
        let chipsToDisplay = 1;
        const containerWidth: number = this.containerView.nativeElement.clientWidth;
        const viewMoreButton: HTMLButtonElement = this.containerView.nativeElement.children[1];
        const viewMoreBtnWidth: number = viewMoreButton.getBoundingClientRect().width;
        const firstChip = this.matChips.get(0);
        const chipMargin = firstChip ? this.getChipMargin(firstChip) : 0;
        let chipsWidth = 0;
        const chips = this.matChips.toArray();
        let lastIndex = 0;
        do {
            chipsWidth = Math.max(
                chips.reduce((width, val, index) => {
                    width += val._elementRef.nativeElement.getBoundingClientRect().width + chipMargin;
                    const availableSpace =
                        (index === chips.length - 1 && width <= containerWidth) || this.paginationData
                            ? containerWidth
                            : containerWidth - viewMoreBtnWidth;
                    if (availableSpace >= width - chipMargin) {
                        chipsToDisplay = (this.paginationData ? chipsToDisplay : index) + 1;
                        lastIndex++;
                        this.viewMoreButtonLeftOffset = width;
                        this.viewMoreButtonLeftOffsetBeforeFlexDirection = width;
                    }
                    return width;
                }, 0),
                chipsWidth
            );
            chips.splice(0, lastIndex);
            lastIndex = 0;
        } while ((chips.length || (chipsToDisplay < this.matChips.length && this.matChips.length)) && this.paginationData);
        this.arrangeElements(containerWidth, chipsWidth, viewMoreBtnWidth, chipsToDisplay, viewMoreButton);
        this.calculationsDone = true;
    }

    private getChipMargin(chip: MatChip): number {
        const chipStyles = window.getComputedStyle(chip._elementRef.nativeElement);
        return parseInt(chipStyles.marginLeft, 10) + parseInt(chipStyles.marginRight, 10);
    }

    private arrangeElements(
        containerWidth: number,
        chipsWidth: number,
        viewMoreBtnWidth: number,
        chipsToDisplay: number,
        viewMoreButton: HTMLButtonElement
    ): void {
        if (containerWidth - chipsWidth - viewMoreBtnWidth <= 0) {
            const chip = this.paginationData ? this.matChips.last : this.matChips.first;
            const hasNotEnoughSpaceForMoreButton =
                containerWidth < chip?._elementRef.nativeElement.offsetWidth + chip?._elementRef.nativeElement.offsetLeft + viewMoreBtnWidth;
            this.columnFlexDirection = chipsToDisplay === 1 && !this.paginationData && hasNotEnoughSpaceForMoreButton;
            this.moveLoadMoreButtonToNextRow = this.paginationData && hasNotEnoughSpaceForMoreButton;
            this.undisplayedChipsCount = this.chipsToDisplay.length - chipsToDisplay;
            this.chipsToDisplay = this.chipsToDisplay.slice(0, chipsToDisplay);
        } else {
            this.moveLoadMoreButtonToNextRow = false;
        }
        this.limitChipsDisplayed = this.undisplayedChipsCount ? this.initialLimitChipsDisplayed : this.paginationData?.hasMoreItems;
        if (this.paginationData?.hasMoreItems) {
            const lastChipTop = this.matChips.last._elementRef.nativeElement.offsetTop;
            if (this.moveLoadMoreButtonToNextRow) {
                const buttonTopHeightCorrection = 5;
                this.viewMoreButtonLeftOffset = 0;
                this.viewMoreButtonTop = lastChipTop + viewMoreButton.offsetHeight + buttonTopHeightCorrection;
            } else {
                const buttonTopHeightCorrection = 3;
                this.viewMoreButtonLeftOffset = this.viewMoreButtonLeftOffsetBeforeFlexDirection;
                this.viewMoreButtonTop = lastChipTop - buttonTopHeightCorrection;
            }
        } else {
            this.viewMoreButtonLeftOffset = this.columnFlexDirection ? 0 : this.viewMoreButtonLeftOffsetBeforeFlexDirection;
        }

        if (!this.pagination) {
            this.viewMoreButtonTop = null;
        }
    }
}
