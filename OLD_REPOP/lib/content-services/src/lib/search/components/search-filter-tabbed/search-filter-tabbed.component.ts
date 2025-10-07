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

import { ChangeDetectorRef, Component, ContentChildren, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewEncapsulation } from '@angular/core';
import { SearchFilterTabDirective } from './search-filter-tab.directive';
import { CommonModule } from '@angular/common';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'adf-search-filter-tabbed',
    imports: [CommonModule, MatTabsModule, TranslatePipe],
    templateUrl: './search-filter-tabbed.component.html',
    styleUrls: ['./search-filter-tabbed.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchFilterTabbedComponent implements OnInit, OnDestroy {
    @ContentChildren(SearchFilterTabDirective)
    tabsContents: QueryList<SearchFilterTabDirective>;

    selectedIndex: number = 0;

    @ViewChild(MatTabGroup)
    private readonly tabGroup: MatTabGroup;

    private readonly intersectionObserver = new IntersectionObserver(
        (entries) => {
            if (!entries[0].isIntersecting) {
                this.tabGroup.selectedIndex = (this.selectedIndex + 1) % this.tabsContents.length;
                this.changeDetector.detectChanges();
                this.tabGroup.selectedIndex = this.selectedIndex;
                this.changeDetector.detectChanges();
            }
        },
        {
            threshold: [0, 1]
        }
    );

    constructor(private readonly element: ElementRef, private readonly changeDetector: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.intersectionObserver.observe(this.element.nativeElement);
    }

    ngOnDestroy(): void {
        this.intersectionObserver.disconnect();
    }

    onTabIndexChanged(index: number): void {
        this.selectedIndex = index;
    }
}
