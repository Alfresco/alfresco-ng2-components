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

import {
    Component,
    Input,
    ViewEncapsulation,
    ChangeDetectionStrategy
} from '@angular/core';
import { ThemePalette } from '@angular/material';

@Component({
    selector: 'adf-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss'],
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
