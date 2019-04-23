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

import { Directive, Input, HostListener, Component, ViewContainerRef, ComponentFactoryResolver, ViewEncapsulation, OnInit } from '@angular/core';
import { ClipboardService } from './clipboard.service';

@Directive({
    selector: '[adf-clipboard]',
    exportAs: 'adfClipboard'
})
export class ClipboardDirective {
    /** Translation key or message for the tooltip. */
    // tslint:disable-next-line:no-input-rename
    @Input('adf-clipboard')
    placeholder: string;

    /** Reference to the HTML element containing the text to copy. */
    @Input()
    target: HTMLInputElement | HTMLTextAreaElement;

    /** Translation key or message for snackbar notification. */
    // tslint:disable-next-line:no-input-rename
    @Input('clipboard-notification') message: string;

    constructor(private clipboardService: ClipboardService,
                public viewContainerRef: ViewContainerRef,
                private resolver: ComponentFactoryResolver) {}

    @HostListener('click', ['$event'])
    handleClickEvent(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.copyToClipboard();
    }

    @HostListener('mouseenter')
    showTooltip() {
        if (this.placeholder) {
            const componentFactory = this.resolver.resolveComponentFactory(ClipboardComponent);
            const componentRef = this.viewContainerRef.createComponent(componentFactory).instance;
            componentRef.placeholder = this.placeholder;
        }
    }

    @HostListener('mouseleave')
    closeTooltip() {
        this.viewContainerRef.remove();
    }

    private copyToClipboard() {
        const isValidTarget = this.clipboardService.isTargetValid(this.target);

        if (isValidTarget) {
            this.clipboardService.copyToClipboard(this.target, this.message);
        } else {
            this.copyContentToClipboard(this.viewContainerRef.element.nativeElement.innerHTML);
        }
    }

    private copyContentToClipboard(content) {
        this.clipboardService.copyContentToClipboard(content, this.message);
    }
}

@Component({
    selector: 'adf-copy-content-tooltip',
    template: `
        <span class='adf-copy-tooltip'>{{ placeholder | translate }} </span>
        `,
    styleUrls: ['./clipboard.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ClipboardComponent implements OnInit {
    placeholder: string;

    ngOnInit() {
        this.placeholder = this.placeholder || 'CLIPBOARD.CLICK_TO_COPY';
    }
}
