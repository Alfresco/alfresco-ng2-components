/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

@Component({
  selector: 'adf-search-facet-chip',
  templateUrl: './search-facet-chip.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SearchFacetChipComponent {
    @Input()
    field: FacetField;

    @ViewChild('menuContainer', { static: false })
    menuContainer: ElementRef;

    focusTrap: ConfigurableFocusTrap;

    constructor(private focusTrapFactory: ConfigurableFocusTrapFactory) {}

    onMenuOpen() {
        if (this.menuContainer && !this.focusTrap) {
            this.focusTrap = this.focusTrapFactory.create(this.menuContainer.nativeElement);
            this.focusTrap.focusInitialElement();
        }
    }

    onClosed() {
        this.focusTrap.destroy();
        this.focusTrap = null;
    }
}
