/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { AfterViewInit, Directive, ElementRef } from '@angular/core';

declare var componentHandler;

@Directive({
    selector: '[adf-mdl-textfield]], [alfresco-mdl-textfield]'
})
export class AlfrescoMdlTextFieldDirective implements AfterViewInit {

    constructor(private element: ElementRef) {}

    ngAfterViewInit() {
        if (componentHandler) {
            let el = this.element.nativeElement;
            el.classList.add('mdl-textfield');
            el.classList.add('mdl-js-textfield');
            el.classList.add('mdl-textfield--floating-label');
            componentHandler.upgradeElement(el, 'MaterialTextfield');
        }
    }
}
