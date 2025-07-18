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

import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { SearchCategory } from '../../../models/search-category.interface';
import { ConfigurableFocusTrap, ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { SearchWidgetContainerComponent } from '../../search-widget-container/search-widget-container.component';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { SearchFilterMenuCardComponent } from '../search-filter-menu-card/search-filter-menu-card.component';
import { MatButtonModule } from '@angular/material/button';
import { first } from 'rxjs/operators';

@Component({
    selector: 'adf-search-widget-chip',
    imports: [
        CommonModule,
        MatChipsModule,
        MatMenuModule,
        TranslatePipe,
        MatIconModule,
        SearchFilterMenuCardComponent,
        SearchWidgetContainerComponent,
        MatButtonModule
    ],
    templateUrl: './search-widget-chip.component.html',
    styles: [
        `
            .adf-search-widget-extra-width.adf-search-filter-chip-menu-panel {
                max-width: 500px;
            }
        `
    ],
    encapsulation: ViewEncapsulation.None
})
export class SearchWidgetChipComponent implements AfterViewInit {
    @Input({ required: true })
    category: SearchCategory;

    @ViewChild('menuContainer', { static: false })
    menuContainer: ElementRef;

    @ViewChild('menuTrigger', { static: false })
    menuTrigger: MatMenuTrigger;

    @ViewChild(SearchWidgetContainerComponent, { static: false })
    widgetContainerComponent: SearchWidgetContainerComponent;

    focusTrap: ConfigurableFocusTrap;
    chipIcon = 'keyboard_arrow_down';

    constructor(private readonly cd: ChangeDetectorRef, private readonly focusTrapFactory: ConfigurableFocusTrapFactory) {}

    ngAfterViewInit(): void {
        this.widgetContainerComponent
            ?.getDisplayValue()
            .pipe(first())
            .subscribe(() => {
                this.cd.detectChanges();
            });
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
