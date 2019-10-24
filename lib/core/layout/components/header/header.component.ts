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

import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';

@Component({
    selector: 'adf-layout-header',
    templateUrl: './header.component.html',
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-layout-header' }
})
export class HeaderLayoutComponent implements OnInit {
    /** Title of the application. */
    @Input() title: string;

    /** Path to an image file for the application logo. */
    @Input() logo: string;

    /** The router link for the application logo, when clicked. */
    @Input() redirectUrl: string | any[] = '/';

    /** The tooltip text for the application logo. */
    @Input() tooltip: string;

    /**
     * Background color for the header. It can be any hex color code or one
     * of the Material theme colors: 'primary', 'accent' or 'warn'.
     */
    @Input() color: string;

    /**
     * Toggles whether the sidenav button will be displayed in the header
     * or not.
     */
    @Input() showSidenavToggle: boolean = true;

    /** Emitted when the sidenav button is clicked. */
    @Output() clicked = new EventEmitter<boolean>();

    @Input() expandedSidenav: boolean = true;

    /** The side of the page that the drawer is attached to (can be 'start' or 'end') */
    @Input() position = 'start';

    toggleMenu() {
        this.clicked.emit(true);
        this.expandedSidenav = !this.expandedSidenav;
    }

    ngOnInit() {
        if (!this.logo) {
            this.logo = './assets/images/logo.png';
        }
    }
}
