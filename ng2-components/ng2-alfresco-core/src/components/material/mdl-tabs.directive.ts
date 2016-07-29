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

import {
    Directive,
    ElementRef,
    AfterViewInit,
    OnDestroy
} from '@angular/core';

declare var componentHandler;

@Directive({
    selector: '[alfresco-mdl-tabs]'
})
export class AlfrescoMdlTabsDirective implements AfterViewInit, OnDestroy {

    private observer: MutationObserver;

    constructor(private element: ElementRef) {}

    ngAfterViewInit() {
        if (componentHandler) {
            let el = this.element.nativeElement;

            el.classList.add('mdl-tabs');
            el.classList.add('mdl-js-tabs');
            el.classList.add('mdl-js-ripple-effect');
            componentHandler.upgradeElement(el, 'MaterialTabs');

            // watch widget DOM changes and re-upgrade MDL content
            let tabBar = el.querySelector('.mdl-tabs__tab-bar');
            if (tabBar) {
                this.observer = new MutationObserver((mutations: any[]) => {
                    let upgrade = false;
                    mutations.forEach((mutation: MutationRecord) => {
                        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                            upgrade = true;
                        }

                        if (mutation.removedNodes && mutation.removedNodes.length > 0) {
                            upgrade = true;
                        }
                    });

                    if (upgrade) {
                        componentHandler.downgradeElements([el]);
                        componentHandler.upgradeElement(el);
                    }
                });

                this.observer.observe(tabBar, {
                    childList: true,
                    subtree: false
                });
            }
        }
    }

    ngOnDestroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}
