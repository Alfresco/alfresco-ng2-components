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

import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[adf-mat-chip-list-a11y]'
})
export class SearchChipListDirective {
    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngAfterViewInit() {
        setTimeout(() => {
            this.renderer.setAttribute(this.el.nativeElement.querySelector('.mat-chip-list-wrapper'), 'role', 'presentation');
            this.renderer.removeAttribute(this.el.nativeElement, 'role');
            this.renderer.removeAttribute(this.el.nativeElement, 'tabindex');
        }, 1000);
    }
}
