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

import { Component, Directive, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'adf-info-drawer-layout',
    imports: [CommonModule],
    templateUrl: './info-drawer-layout.component.html',
    styleUrls: ['./info-drawer-layout.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-info-drawer-layout' }
})
export class InfoDrawerLayoutComponent {
    /** The visibility of the header. */
    @Input()
    showHeader: boolean = true;
}

/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0
 */
@Directive({
    selector: '[adf-info-drawer-title], [info-drawer-title]'
})
export class InfoDrawerTitleDirective {}

@Directive({
    selector: '[adf-info-drawer-buttons], [info-drawer-buttons]'
})
export class InfoDrawerButtonsDirective {}

@Directive({
    selector: '[adf-info-drawer-content], [info-drawer-content]'
})
export class InfoDrawerContentDirective {}
