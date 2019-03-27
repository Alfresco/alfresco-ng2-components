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

import { Directive, HostListener, ViewContainerRef, Component, ComponentFactoryResolver, Input, AfterContentInit } from '@angular/core';

@Directive({
    selector: '[adf-copy-clipboard]'
})
export class CopyClipboardDirective implements AfterContentInit {

    @Input()
    message: string;

    private value: string;

    constructor(
        public viewContainerRef: ViewContainerRef,
        private resolver: ComponentFactoryResolver) {}

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        event.stopPropagation();
        this.copyToClipboard(this.value);
    }

    @HostListener('mouseenter')
    showTooltip() {
        const componentFactory = this.resolver.resolveComponentFactory(CopyClipboardComponent);
        const componentRef = this.viewContainerRef.createComponent(componentFactory).instance;
        componentRef.copyText = this.value;
        componentRef.placeholder = this.message;
    }

    @HostListener('mouseleave')
    closeTooltip() {
        this.viewContainerRef.remove();
    }

    ngAfterContentInit() {
        setTimeout( () => {
            this.value = this.viewContainerRef.element.nativeElement.innerHTML;
        });
    }

    private copyToClipboard(item: string) {
        document.addEventListener('copy', (e: ClipboardEvent) => {
          e.clipboardData.setData('text/plain', (item));
          e.preventDefault();
          document.removeEventListener('copy', null);
        });
        document.execCommand('copy');
      }
}

@Component({
    selector: 'adf-datatable-highlight-tooltip',
    styles: [`
    #datatable-copy-tooltip {
        position: absolute;
        background: #333;
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        bottom: 88%;
        left:0;
    }`],
    template: `
        <span id='datatable-copy-tooltip'>{{ placeholder | translate }} {{ copyText }}</span>
        `
})
export class CopyClipboardComponent {
    copyText: string;
    placeholder: string;
}
