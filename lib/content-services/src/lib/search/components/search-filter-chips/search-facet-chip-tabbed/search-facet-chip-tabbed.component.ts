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
import { MatMenuTrigger } from '@angular/material/menu';
import { TabbedFacetField } from '../../../models/tabbed-facet-field.interface';
import { Subject } from 'rxjs';

@Component({
  selector: 'adf-search-facet-chip-tabbed',
  templateUrl: './search-facet-chip-tabbed.component.html',
  styleUrls: ['./search-facet-chip-tabbed.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchFacetChipTabbedComponent {
    @Input()
    tabbedFacet: TabbedFacetField;

    @ViewChild('menuContainer', { static: false })
    menuContainer: ElementRef;

    @ViewChild('menuTrigger', { static: false })
    menuTrigger: MatMenuTrigger;

    private resetSubject$ = new Subject<void>();
    private applySubject$ = new Subject<void>();

    displayValue = '';
    reset$ = this.resetSubject$.asObservable();
    apply$ = this.applySubject$.asObservable();
    focusTrap: ConfigurableFocusTrap;
    chipIcon = 'keyboard_arrow_down';
    isPopulated = false;

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
        this.resetSubject$.next();
        this.menuTrigger.closeMenu();
    }

    onApply() {
        this.applySubject$.next();
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
}
