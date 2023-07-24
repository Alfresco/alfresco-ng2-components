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

import { Component, ElementRef, Inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConfigurableFocusTrap, ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import { MatMenuTrigger } from '@angular/material/menu';
import { TabbedFacetField } from '../../../models/tabbed-facet-field.interface';
import { Subject } from 'rxjs';
import { SearchQueryBuilderService } from '../../../services/search-query-builder.service';
import { SEARCH_QUERY_SERVICE_TOKEN } from '../../../search-query-service.token';
import { FacetWidget } from '../../../models/facet-widget.interface';
import { TranslationService } from '@alfresco/adf-core';
import { SearchFacetFiltersService } from '../../../services/search-facet-filters.service';
import { AutocompleteOption } from '../../../models/autocomplete-option.interface';

@Component({
  selector: 'adf-search-facet-chip-tabbed',
  templateUrl: './search-facet-chip-tabbed.component.html',
  styleUrls: ['./search-facet-chip-tabbed.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchFacetChipTabbedComponent implements OnInit, OnChanges, FacetWidget {
    @Input()
    tabbedFacet: TabbedFacetField;

    @ViewChild('menuContainer', { static: false })
    menuContainer: ElementRef;

    @ViewChild('menuTrigger', { static: false })
    menuTrigger: MatMenuTrigger;

    private resetSubject$ = new Subject<void>();

    displayValue$ = new Subject<string>();
    reset$ = this.resetSubject$.asObservable();
    focusTrap: ConfigurableFocusTrap;
    chipIcon = 'keyboard_arrow_down';
    autocompleteOptions = {};
    selectedOptions = {};
    isPopulated = false;

    constructor(@Inject(SEARCH_QUERY_SERVICE_TOKEN) private queryBuilder: SearchQueryBuilderService,
                private translationService: TranslationService,
                private searchFacetFiltersService: SearchFacetFiltersService,
                private focusTrapFactory: ConfigurableFocusTrapFactory) {
    }

    ngOnInit() {
        this.tabbedFacet.fields.forEach((field) => {
            Object.defineProperty(this.selectedOptions, field, {
                value: [],
                writable: true
            });
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.tabbedFacet) {
            this.isPopulated = this.tabbedFacet.fields.some((field) => this.tabbedFacet.facets[field]?.buckets.items.length > 0);
            this.tabbedFacet.fields.forEach((field) => {
                const options: AutocompleteOption[] = this.tabbedFacet.facets[field].buckets.items.map((item) => ({ value: item.display }));
                Object.defineProperty(this.autocompleteOptions, field, {
                    value: options,
                    writable: true
                });
            });
        }
    }

    onMenuOpen() {
        if (this.menuContainer && !this.focusTrap) {
            this.focusTrap = this.focusTrapFactory.create(this.menuContainer.nativeElement);
        }
        this.chipIcon = 'keyboard_arrow_up';
    }

    onClosed() {
        this.focusTrap.destroy();
        this.focusTrap = null;
        this.chipIcon = 'keyboard_arrow_down';
    }

    onRemove() {
        this.reset();
        this.menuTrigger.closeMenu();
    }

    onApply() {
        this.submitValues();
        this.menuTrigger.closeMenu();
    }

    onEnterKeydown() {
        if (this.isPopulated) {
            if (!this.menuTrigger.menuOpen) {
                this.menuTrigger.openMenu();
            } else {
                this.menuTrigger.closeMenu();
            }
        }
    }

    onEscKeydown() {
        if (this.menuTrigger.menuOpen) {
            this.menuTrigger.closeMenu();
        }
    }

    onOptionsChange(selectedOptions: AutocompleteOption[], field: string) {
        this.selectedOptions[field] = selectedOptions.map((selectedOption) => selectedOption.value);
        this.isPopulated = this.tabbedFacet.fields.some((facetField) => this.selectedOptions[facetField].length > 0);
        this.updateDisplayValue();
        this.updateUserFacetBuckets();
        this.queryBuilder.update();
    }

    updateDisplayValue() {
        let displayValue = '';
        this.tabbedFacet.fields.forEach((field) => {
            if (this.selectedOptions[field].length > 0) {
                const stackedOptions = this.selectedOptions[field].join(', ');
                displayValue += `${this.translationService.instant(this.tabbedFacet.facets[field].label + '_LABEL')}: ${stackedOptions} `;
            }
        });
        this.displayValue$.next(displayValue);
    }

    reset() {
        this.resetSubject$.next();
        this.updateUserFacetBuckets();
        this.updateDisplayValue();
        this.queryBuilder.update();
    }

    submitValues() {
        this.updateUserFacetBuckets();
        this.searchFacetFiltersService.updateSelectedBuckets();
        this.updateDisplayValue();
        this.queryBuilder.update();
    }

    optionComparator(option1: AutocompleteOption, option2: AutocompleteOption): boolean {
        return option1.value.toUpperCase() === option2.value.toUpperCase();
    }

    private updateUserFacetBuckets() {
        this.tabbedFacet.fields.forEach((field) => {
            this.tabbedFacet.facets[field].buckets.items.forEach((item) => {
                const matchedOption = this.selectedOptions[field].find((option) => option === item.display);
                if (matchedOption) {
                    item.checked = true;
                    this.queryBuilder.addUserFacetBucket(field, item);
                } else {
                    item.checked = false;
                    this.queryBuilder.removeUserFacetBucket(field, item);
                }
            });
        });
    }
}
