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

import { AfterViewInit, DestroyRef, Directive, EventEmitter, inject, Inject, Output } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const SELECT_ITEM_HEIGHT_EM = 3;

@Directive({
    selector: '[adf-infinite-select-scroll]'
})
export class InfiniteSelectScrollDirective implements AfterViewInit {
    static readonly MAX_ITEMS = 50;

    /** Emitted when scroll reaches the last item. */
    @Output() scrollEnd = new EventEmitter<Event>();

    private readonly destroyRef = inject(DestroyRef);
    private itemHeightToWaitBeforeLoadNext = 0;

    constructor(@Inject(MatSelect) private matSelect: MatSelect) {}

    ngAfterViewInit() {
        this.matSelect.openedChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((opened: boolean) => {
            if (opened) {
                this.itemHeightToWaitBeforeLoadNext = this.getItemHeight() * (InfiniteSelectScrollDirective.MAX_ITEMS / 2);
                this.matSelect.panel.nativeElement.addEventListener('scroll', (event: Event) => this.handleScrollEvent(event));
            }
        });
    }

    private handleScrollEvent(event: Event) {
        if (this.isScrollInNextFetchArea(event)) {
            this.scrollEnd.emit(event);
        }
    }

    private isScrollInNextFetchArea(event: Event): boolean {
        const target = event.target as HTMLElement;
        return target.scrollTop >= target.scrollHeight - target.offsetHeight - this.itemHeightToWaitBeforeLoadNext;
    }

    private getItemHeight(): number {
        return parseFloat(getComputedStyle(this.matSelect.panel.nativeElement).fontSize || '0') * SELECT_ITEM_HEIGHT_EM;
    }
}
