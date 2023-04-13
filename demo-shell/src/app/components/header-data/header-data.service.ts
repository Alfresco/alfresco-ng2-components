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

import { Injectable, Output, EventEmitter } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Injectable({
    providedIn: 'root'
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class HeaderDataService {

    show = true;

    @Output() hideMenu = new EventEmitter<boolean>();
    @Output() color = new EventEmitter<ThemePalette>();
    @Output() headerTextColor = new EventEmitter<string>();
    @Output() title = new EventEmitter<string>();
    @Output() logo = new EventEmitter<string>();
    @Output() redirectUrl = new EventEmitter<string | any[]>();
    @Output() tooltip = new EventEmitter<string>();
    @Output() position = new EventEmitter<'start' | 'end'>();
    @Output() hideSidenav = new EventEmitter<boolean>();

    hideMenuButton() {
        this.show = !this.show;
        this.hideMenu.emit(this.show);
    }

    changeColor(color: ThemePalette) {
        this.color.emit(color);
    }

    changeTitle(title: string) {
        this.title.emit(title);
    }

    changeLogo(logoPath: string) {
        this.logo.emit(logoPath);
    }

    changeHeaderTextColor(color: string): void {
        this.headerTextColor.emit(color);
    }

    changeRedirectUrl(redirectUrl: string | any[]) {
        this.redirectUrl.emit(redirectUrl);
    }

    changeTooltip(tooltip: string) {
        this.tooltip.emit(tooltip);
    }

    changePosition(position: 'start' | 'end') {
        this.position.emit(position);
    }

    changeSidenavVisibility(hideSidenav: boolean) {
        this.hideSidenav.emit(hideSidenav);
    }
}
