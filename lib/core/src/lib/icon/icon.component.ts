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

import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy, inject, ElementRef, AfterContentInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ICON_ALIAS_MAP_TOKEN } from './icon-alias-map.token';

export const DEFAULT_ICON_VALUE = 'settings';

/** @deprecated Use material icon with aria-hidden="true" attribute instead. */

@Component({
    selector: 'adf-icon',
    imports: [MatIconModule],
    templateUrl: './icon.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'adf-icon' }
})
export class IconComponent implements AfterContentInit {
    private readonly ALIAS_MAP = inject(ICON_ALIAS_MAP_TOKEN, { optional: true });
    private readonly elementRef = inject(ElementRef);

    private _value = DEFAULT_ICON_VALUE;
    private _isSvg = false;

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
        this._value = this.hasMappedAlias(value) ? this.ALIAS_MAP[value] : value;
        this._isSvg = this.hasMappedAlias(value) || this.isCustom(value);
    }

    get isSvg() {
        return this._isSvg;
    }

    /** Is icon of svg type */
    @Input()
    set isSvg(isSvg: boolean) {
        this._isSvg = isSvg;
    }

    ngAfterContentInit(): void {
        const textNode = this.getTextNode();

        if (textNode) {
            this.value = textNode.textContent.trim();
            textNode.remove();
        }
    }

    private hasMappedAlias(value: string): boolean {
        return !!this.ALIAS_MAP?.[value];
    }

    private isCustom(value: string): boolean {
        return value.includes(':');
    }

    private getTextNode(): Text | undefined {
        return Array.from(this.elementRef.nativeElement.childNodes).find(
            (node: Node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
        ) as Text | undefined;
    }
}
