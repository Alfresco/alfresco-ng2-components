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

import { Directive, HostListener, ViewContainerRef, Component, ComponentFactoryResolver, Input } from '@angular/core';

@Directive({
    selector: '[adf-copy-content-tooltip]'
})
export class CopyContentTooltipDirective {

    @Input()
    text: string;

    constructor(
        private viewContainerRef: ViewContainerRef,
        private resolver: ComponentFactoryResolver) {}

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        event.stopPropagation();
        this.copyToClipboard(this.text);
    }

    @HostListener('mouseenter')
    showTooltip() {
        const componentFactory = this.resolver.resolveComponentFactory(CopyTooltipContentComponent);
        const componentRef = this.viewContainerRef.createComponent(componentFactory);
        componentRef.instance.copyText = this.text;
    }

    @HostListener('mouseleave')
    closeTooltip() {
        this.viewContainerRef.remove();
    }

    copyToClipboard(item: string) {
        document.addEventListener('copy', (e: ClipboardEvent) => {
          e.clipboardData.setData('text/plain', (item));
          e.preventDefault();
          document.removeEventListener('copy', null);
        });
        document.execCommand('copy');
      }
}

@Component({
    selector: 'adf-datatable-copy-tooltip',
    styles: [`#datatable-copy-tooltip { position: absolute; background: #333; color: white; padding:5px 10px; top:-12px; border-radius:5px}`],
    template:  `<span id="datatable-copy-tooltip" (click)="onClickCopy()">{{ 'DOCUMENT_LIST.ACTIONS.DOCUMENT.CLICK_TO_COPY' | translate }} {{ copyText }}</span>`
})
export class CopyTooltipContentComponent {
    copyText: string;
}
