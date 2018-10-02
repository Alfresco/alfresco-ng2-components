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

import { Component } from '@angular/core';
import { HeaderDataService } from './header-data.service';

@Component({
    templateUrl: './header-data.component.html',
    styleUrls: ['./header-data.component.scss']
})
export class HeaderDataComponent {
    checkbox = true;
    position = 'start';
    hideSidenavToggle = false;

    constructor(private headerService: HeaderDataService) {
    }

    hideButton() {
        this.headerService.hideMenuButton();
    }

    changeColor(color: string) {
        this.headerService.changeColor(color);
    }

    submitTitle(title: string) {
        if (title) {
            this.headerService.changeTitle(title);
        }
    }

    submitLogo(logoPath: string) {
        if (logoPath) {
            this.headerService.changeLogo(logoPath);
        }
    }

    submitRedirectUrl(value: string) {
        const redirectUrl = JSON.parse(value);
        if (redirectUrl) {
            this.headerService.changeRedirectUrl(redirectUrl);
        }
    }

    submitTooltip(tooltip: string) {
        if (tooltip) {
            this.headerService.changeTooltip(tooltip);
        }
    }

    changePosition() {
        this.headerService.changePosition(this.position);
    }

    changeSidenavVisibility() {
        this.hideSidenavToggle = !this.hideSidenavToggle;
        this.headerService.changeSidenavVisibility(this.hideSidenavToggle);
    }
}
