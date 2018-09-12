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

import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';

@Component({
    selector: 'adf-layout-header',
    templateUrl: './header.component.html',
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-layout-header' }
})
export class HeaderLayoutComponent implements OnInit {
    @Input() title: string;
    @Input() logo: string;
    @Input() redirectUrl: string | any[] = '/';
    @Input() tooltip: string;
    @Input() color: string;
    @Input() showSidenavToggle: boolean = true;
    @Output() clicked = new EventEmitter<any>();

    /** The side that the drawer is attached to 'start' | 'end' page */
    @Input() position = 'start';

    toggleMenu() {
        this.clicked.emit(true);
    }

    ngOnInit() {
        if (!this.logo) {
            this.logo = './assets/images/logo.png';
        }
    }
}
