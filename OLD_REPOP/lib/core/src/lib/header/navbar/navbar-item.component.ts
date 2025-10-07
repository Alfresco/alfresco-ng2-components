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

import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavbarItem {
    label: string;
    routerLink?: string;
}

@Component({
    selector: 'adf-navbar-item',
    templateUrl: 'navbar-item.component.html',
    styleUrls: ['./navbar-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [MatButtonModule, CommonModule, RouterModule],
    host: { class: 'adf-navbar-item' }
})
export class NavbarItemComponent {
    @Input() label: string;
    @Input() routerLink?: string;
}
