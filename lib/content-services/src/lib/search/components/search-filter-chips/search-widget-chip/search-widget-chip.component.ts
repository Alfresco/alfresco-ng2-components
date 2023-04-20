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
import { SearchCategory } from '../../../models/search-category.interface';
import { ConfigurableFocusTrap, ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import { MatMenuTrigger } from '@angular/material/menu';
import { SearchWidgetContainerComponent } from '../../search-widget-container/search-widget-container.component';

@Component({
  selector: 'adf-search-widget-chip',
  templateUrl: './search-widget-chip.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SearchWidgetChipComponent  {

    @Input()
    category: SearchCategory;

    @ViewChild('menuContainer', { static: false })
    menuContainer: ElementRef;

    @ViewChild('menuTrigger', { static: false })
    menuTrigger: MatMenuTrigger;

    @ViewChild(SearchWidgetContainerComponent, { static: false })
    widgetContainerComponent: SearchWidgetContainerComponent;

    focusTrap: ConfigurableFocusTrap;

    constructor(private focusTrapFactory: ConfigurableFocusTrapFactory) {}

    onMenuOpen() {
        if (this.menuContainer && !this.focusTrap) {
            this.focusTrap = this.focusTrapFactory.create(this.menuContainer.nativeElement);
        }
    }

    onClosed() {
        this.focusTrap.destroy();
        this.focusTrap = null;
    }

    onRemove() {
        this.widgetContainerComponent.resetInnerWidget();
        this.menuTrigger.closeMenu();
    }

    onApply() {
        this.widgetContainerComponent.applyInnerWidget();
        this.menuTrigger.closeMenu();
    }

    onEnterKeydown(): void {
        if (!this.menuTrigger.menuOpen) {
            this.menuTrigger.openMenu();
        } else {
            this.menuTrigger.closeMenu();
        }
    }

    onEscKeydown() {
        if (this.menuTrigger.menuOpen) {
            this.menuTrigger.closeMenu();
        }
    }
}
