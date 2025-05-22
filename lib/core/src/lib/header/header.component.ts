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

import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemePalette } from '@angular/material/core';
import { TOOLBAR_DIRECTIVES } from '../toolbar';
import { NavbarItem } from './navbar/navbar-item.component';
import { NavbarComponent } from './navbar/navbar.component';

export type HeaderVariant = 'minimal' | 'extended';

@Component({
    selector: 'adf-header',
    imports: [CommonModule, ...TOOLBAR_DIRECTIVES, NavbarComponent],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    host: { class: 'adf-header' },
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
    @Input() variant: HeaderVariant = 'minimal';

    @HostBinding('style.--adf-toolbar-title-width')
    get width() {
        return this.variant === 'extended' ? '100%' : 'auto';
    }

    @HostBinding('style.--adf-header-height')
    @Input()
    headerHeight = getComputedStyle(document.documentElement).getPropertyValue('--adf-header-height');

    @Input()
    logoSrc: string;

    @Input()
    logoAlt: string;

    @HostBinding('style.--adf-header-logo-height')
    @Input()
    logoHeight = getComputedStyle(document.documentElement).getPropertyValue('--adf-header-logo-height');

    @HostBinding('style.--adf-header-logo-width')
    @Input()
    logoWidth = getComputedStyle(document.documentElement).getPropertyValue('--adf-header-logo-width');

    @Input()
    title: string;

    @Input()
    color: ThemePalette;

    @Input()
    navbarItems: NavbarItem[] = [];
}
