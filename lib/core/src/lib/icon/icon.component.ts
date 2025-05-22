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

import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';

@Component({
    selector: 'adf-icon',
    imports: [MatIconModule, NgIf],
    templateUrl: './icon.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'adf-icon' }
})
export class IconComponent {
    private _value = '';
    private _isCustom = false;

    /** Theme color palette for the component. */
    @Input()
    color: ThemePalette;

    /** Icon font set */
    @Input()
    fontSet: string;

    get value(): string {
        return this._value;
    }

    /** Icon value, which can be either a ligature name or a custom icon in the format `[namespace]:[name]`. */
    @Input()
    set value(value: string) {
        this._value = value || 'settings';
        this._isCustom = this._value.includes(':');
    }

    get isCustom(): boolean {
        return this._isCustom;
    }
}
