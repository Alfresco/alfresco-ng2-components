/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { ColorSet } from './color-set.model';

@Directive({
    selector: '[adf-color-set]',
    standalone: true
})
export class ColorSetDirective implements OnInit {
    @Input('adf-color-set') color: ColorSet;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

    ngOnInit(): void {
        if (this.color) {
            this.setColor('background-color', this.color.background);
            this.setColor('border-color', this.color.border);
            this.setColor('color', this.color.text);
        }
    }

    setColor(style: string, color: string): void {
        this.renderer.setStyle(this.elementRef.nativeElement, style, color);
    }
}
