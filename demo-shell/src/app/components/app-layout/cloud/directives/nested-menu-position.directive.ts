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

import { Directive, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appNestedMenuPosition]'
})
export class NestedMenuPositionDirective {

    @Input()
    menuMinimized: string;

    nestedMenuLeftPadding: string = '220px';

    @HostListener('click', ['$event'])
    onClick(event: any) {

        const bodyRect = document.body.getBoundingClientRect();
        let overlayContainer = (document.querySelector('.cdk-overlay-connected-position-bounding-box') as HTMLElement);
        (document.querySelector('.cdk-overlay-pane') as HTMLElement).style.width = '100%';

        if (this.menuMinimized === 'false') {
            setTimeout( () => {
                const elementPosition = this.getElementOffset(event);
                overlayContainer.style.top = elementPosition.top - bodyRect.top + 'px';
                overlayContainer.style.left = this.nestedMenuLeftPadding;
            });
        }
   }

   isMenuClicked(item: string) {
       return item.includes('adf-sidenav-menu-label');
   }

   getElementOffset(event) {
       if (this.isMenuClicked(event.target.className)) {
           return event.target.offsetParent.getBoundingClientRect();
       } else {
            return event.target.getBoundingClientRect();
       }
   }
}
