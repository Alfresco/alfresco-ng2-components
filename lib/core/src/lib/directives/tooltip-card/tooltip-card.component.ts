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

import { Component, Input, SecurityContext } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'adf-tooltip-card-component',
    templateUrl: './tooltip-card.component.html',
    styleUrls: ['./tooltip-card.component.scss'],
    animations: [
        trigger('tooltip', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(200, style({ opacity: 1 }))
            ]),
            transition(':leave', [
                animate(200, style({ opacity: 0 }))

            ])
        ])
    ]
})
export class TooltipCardComponent {
    @Input() image = '';
    @Input() text = '';
    @Input() htmlContent = '';
    @Input() width = '300';

    constructor(private sanitizer: DomSanitizer) { }

    sanitizedHtmlContent(): string {
        return this.sanitizer.sanitize(SecurityContext.HTML, this.htmlContent);
    }
}
