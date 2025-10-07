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
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

export type ButtonVariant = 'basic' | 'raised' | 'stroked' | 'flat' | 'icon' | 'fab' | 'mini-fab' | undefined;
export type ButtonColor = ThemePalette;

@Component({
    selector: 'adf-button',
    imports: [CommonModule, MatButtonModule, MatIconModule],
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ButtonComponent {
    @Input() uid?: string;
    @Input() variant: ButtonVariant;
    @Input() color?: ButtonColor;
    @Input() tooltip?: string;
    @Input() icon?: string;
    @Input() disableRipple: boolean;
    @Input() disabled: boolean;
    @Input() ariaLabel?: string;
    @Input() ariaHidden?: boolean;
    @Input() testId?: string;

    @HostBinding('style.--adf-button-icon-size')
    @Input()
    iconSize = getComputedStyle(document.documentElement).getPropertyValue('--adf-button-icon-size');
}
