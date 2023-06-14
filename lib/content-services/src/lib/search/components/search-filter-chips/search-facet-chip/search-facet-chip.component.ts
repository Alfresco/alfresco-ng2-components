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

import { Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConfigurableFocusTrap, ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import { FacetField } from '../../../models/facet-field.interface';
import { MatMenuTrigger } from '@angular/material/menu';
import { SearchFacetFieldComponent } from '../../search-facet-field/search-facet-field.component';

@Component({
  selector: 'adf-search-facet-chip',
  templateUrl: './search-facet-chip.component.html',
  styleUrls: ['./search-facet-chip.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchFacetChipComponent {
    @Input()
    field: FacetField;

    @ViewChild('menuContainer', { static: false })
    menuContainer: ElementRef;

    @ViewChild('menuTrigger', { static: false })
    menuTrigger: MatMenuTrigger;

    @ViewChild(SearchFacetFieldComponent, { static: false })
    facetFieldComponent: SearchFacetFieldComponent;

    focusTrap: ConfigurableFocusTrap;
    chipIcon = 'keyboard_arrow_down';

    constructor(private focusTrapFactory: ConfigurableFocusTrapFactory) {}

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
        this.facetFieldComponent.reset();
        this.menuTrigger.closeMenu();
    }

    onApply() {
        this.facetFieldComponent.submitValues();
        this.menuTrigger.closeMenu();
    }

    onEnterKeydown(): void {
        if (this.isPopulated()) {
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

    isPopulated(): boolean {
        return this.field.buckets?.items.length > 0;
    }
}
