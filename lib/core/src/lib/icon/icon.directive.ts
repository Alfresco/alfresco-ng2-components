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

import { Directive, ElementRef, inject, Input, OnChanges } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ICON_ALIAS_MAP_TOKEN } from './icon-alias-map.token';

@Directive({
    selector: 'mat-icon[adf-icon]',
    standalone: false
})
export class IconDirective implements OnChanges {
    private readonly matIcon = inject(MatIcon);
    private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
    private readonly aliasMap = inject(ICON_ALIAS_MAP_TOKEN, { optional: true });

    @Input('adf-icon') name: string;

    ngOnChanges() {
        const iconAlias = this.aliasMap?.[this.name];

        iconAlias ? this.setSvgIcon(iconAlias) : this.appendLigatureText();
    }

    private setSvgIcon(icon: string) {
        this.matIcon.svgIcon = icon;
    }

    private appendLigatureText() {
        this.resetSvgIcon();

        const element = this.elementRef.nativeElement;
        const textNode = this.findTextNode(element);

        if (textNode) {
            textNode.nodeValue = this.name;
        } else {
            this.elementRef.nativeElement.appendChild(document.createTextNode(this.name));
        }
    }

    private findTextNode(element: HTMLElement): ChildNode | undefined {
        return Array.from(element.childNodes).find((node: ChildNode) => node.nodeType === Node.TEXT_NODE);
    }

    private resetSvgIcon() {
        this.matIcon.svgIcon = null;
    }
}
