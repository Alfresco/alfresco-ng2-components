/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

@Injectable({
    providedIn: 'root'
})
export class HeaderDataService {

    show = true;

    @Output() hideMenu: EventEmitter<boolean> = new EventEmitter();
    @Output() color: EventEmitter<string> = new EventEmitter();
    @Output() title: EventEmitter<string> = new EventEmitter();
    @Output() logo: EventEmitter<string> = new EventEmitter();
    @Output() redirectUrl: EventEmitter<string | any[]> = new EventEmitter();
    @Output() tooltip: EventEmitter<string> = new EventEmitter();
    @Output() position: EventEmitter<string> = new EventEmitter();
    @Output() hideSidenav: EventEmitter<string> = new EventEmitter();

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

    changePosition(position) {
        this.position.emit(position);
    }

    changeSidenavVisibility(hideSidenav) {
        this.hideSidenav.emit(hideSidenav);
    }
}
