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

import { AfterViewInit, Component, EventEmitter, Output, QueryList, ViewChild } from '@angular/core';
import { LanguageItem } from '../common/services/language-item.interface';
import { CommonModule } from '@angular/common';
import { MatMenu, MatMenuItem, MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageMenuComponent } from './language-menu.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'adf-picker-button',
    standalone: true,
    imports: [CommonModule, MatMenuModule, TranslatePipe, LanguageMenuComponent, MatIconModule],
    template: `
        <button mat-menu-item [matMenuTriggerFor]="langMenu">
            <mat-icon>language</mat-icon>
            {{ 'ADF.LANGUAGE' | translate }}
        </button>
        <mat-menu #langMenu="matMenu">
            <adf-language-menu (changedLanguage)="changedLanguage.emit($event)" />
        </mat-menu>
    `
})
export class LanguagePickerComponent implements AfterViewInit {
    @Output()
    public changedLanguage = new EventEmitter<LanguageItem>();

    @ViewChild('langMenu')
    menu: MatMenu;

    @ViewChild(MatMenuItem)
    menuItem: MatMenuItem;

    @ViewChild(LanguageMenuComponent)
    languageMenuComponent: LanguageMenuComponent;

    ngAfterViewInit() {
        const menuItems = this.languageMenuComponent.menuItems.filter((menuItem) => menuItem !== undefined);
        const menuItemsQueryList = new QueryList<MatMenuItem>();
        menuItemsQueryList.reset(menuItems);
        // eslint-disable-next-line no-underscore-dangle
        this.menu._allItems = menuItemsQueryList;
        this.menu.ngAfterContentInit();
    }
}
