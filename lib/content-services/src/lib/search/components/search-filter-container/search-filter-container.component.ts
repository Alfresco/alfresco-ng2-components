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

import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConfigurableFocusTrap, ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import { DataColumn, IconComponent, TranslationService } from '@alfresco/adf-core';
import { SearchWidgetContainerComponent } from '../search-widget-container/search-widget-container.component';
import { SearchHeaderQueryBuilderService } from '../../services/search-header-query-builder.service';
import { SearchCategory } from '../../models/search-category.interface';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { FilterSearch } from '../../models/filter-search.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslatePipe } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'adf-search-filter-container',
    imports: [
        CommonModule,
        MatButtonModule,
        MatMenuModule,
        IconComponent,
        MatBadgeModule,
        SearchWidgetContainerComponent,
        TranslatePipe,
        MatDialogModule
    ],
    templateUrl: './search-filter-container.component.html',
    styleUrls: ['./search-filter-container.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchFilterContainerComponent implements OnInit {
    /** The column the filter will be applied on. */
    @Input({ required: true })
    col: DataColumn;

    /** The column the filter will be applied on. */
    @Input()
    value: any;

    /** Emitted when a filter value is selected */
    @Output()
    filterChange: EventEmitter<any> = new EventEmitter();

    @ViewChild(SearchWidgetContainerComponent)
    widgetContainer: SearchWidgetContainerComponent;

    @ViewChild('filterContainer')
    filterContainer: ElementRef;

    category: SearchCategory;
    focusTrap: ConfigurableFocusTrap;
    initialValue: any;

    constructor(
        private searchFilterQueryBuilder: SearchHeaderQueryBuilderService,
        private translationService: TranslationService,
        private focusTrapFactory: ConfigurableFocusTrapFactory
    ) {}

    ngOnInit() {
        this.category = this.searchFilterQueryBuilder.getCategoryForColumn(this.col.key);
        this.initialValue = this.value?.[this.col.key] ? this.value[this.col.key] : undefined;
    }

    onKeyPressed(event: KeyboardEvent, menuTrigger: MatMenuTrigger) {
        if (event.key === 'Enter' && this.widgetContainer.selector !== 'check-list') {
            this.onApply();
            menuTrigger.closeMenu();
        }
    }

    onApply() {
        if (this.widgetContainer.hasValueSelected()) {
            this.searchFilterQueryBuilder.setActiveFilter(this.category.columnKey, this.widgetContainer.getCurrentValue());
            this.filterChange.emit();
            this.widgetContainer.applyInnerWidget();
        } else {
            this.resetSearchFilter();
        }
    }

    onClearButtonClick(event: Event) {
        event.stopPropagation();
        this.resetSearchFilter();
    }

    resetSearchFilter() {
        this.widgetContainer.resetInnerWidget();
        this.searchFilterQueryBuilder.removeActiveFilter(this.category.columnKey);
        this.filterChange.emit();
    }

    getTooltipTranslation(columnTitle: string): string {
        if (!columnTitle) {
            columnTitle = 'SEARCH.SEARCH_HEADER.TYPE';
        }
        return this.translationService.instant('SEARCH.SEARCH_HEADER.FILTER_BY', { category: this.translationService.instant(columnTitle) });
    }

    isActive(): boolean {
        return this.searchFilterQueryBuilder.getActiveFilters().findIndex((f: FilterSearch) => f.key === this.category.columnKey) > -1;
    }

    onMenuOpen() {
        if (this.filterContainer && !this.focusTrap) {
            this.focusTrap = this.focusTrapFactory.create(this.filterContainer.nativeElement);
            this.focusTrap.focusInitialElement();
        }
    }

    onClosed() {
        this.focusTrap.destroy();
        this.focusTrap = null;
    }
}
