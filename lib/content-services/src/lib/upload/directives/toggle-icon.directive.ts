/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[adf-toggle-icon]',
    exportAs: 'toggleIcon'
})
export class ToggleIconDirective {
    private isFocus: boolean = false;
    private toggle: boolean = false;

    @HostListener('mouseenter') onMouseEnter() {
        if (!this.isFocus) {
            this.toggle = true;
        }
    }

    @HostListener('mouseleave') onMouseLeave() {
        if (!this.isFocus) {
            this.toggle = false;
        }

        if (this.isFocus && this.toggle) {
            this.isFocus = false;
            this.toggle = false;
        }
    }

    @HostListener('focus') onFocus() {
        this.isFocus = true;
        this.toggle = true;
    }

    @HostListener('blur') onBlur() {
        this.isFocus = false;
        this.toggle = false;
    }

    get isToggled(): boolean {
        return this.toggle;
    }

    get isFocused(): boolean {
        return this.isFocus;
    }
}
