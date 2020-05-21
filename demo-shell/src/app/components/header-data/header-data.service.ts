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

import { Injectable, Output, EventEmitter, Directive } from '@angular/core';

@Directive()
@Injectable({
    providedIn: 'root'
})
// tslint:disable-next-line: directive-class-suffix
export class HeaderDataService {

    show = true;

    @Output() hideMenu = new EventEmitter<boolean>();
    @Output() color = new EventEmitter<string>();
    @Output() title = new EventEmitter<string>();
    @Output() logo = new EventEmitter<string>();
    @Output() redirectUrl = new EventEmitter<string | any[]>();
    @Output() tooltip = new EventEmitter<string>();
    @Output() position = new EventEmitter<string>();
    @Output() hideSidenav = new EventEmitter<boolean>();

    hideMenuButton() {
        this.show = !this.show;
        this.hideMenu.emit(this.show);
    }

    changeColor(color: string) {
        this.color.emit(color);
    }

    changeTitle(title: string) {
        this.title.emit(title);

    }

    changeLogo(logoPath: string) {
        this.logo.emit(logoPath);
    }

    changeRedirectUrl(redirectUrl: string | any[]) {
        this.redirectUrl.emit(redirectUrl);
    }

    changeTooltip(tooltip: string) {
        this.tooltip.emit(tooltip);
    }

    changePosition(position: string) {
        this.position.emit(position);
    }

    changeSidenavVisibility(hideSidenav: boolean) {
        this.hideSidenav.emit(hideSidenav);
    }
}
