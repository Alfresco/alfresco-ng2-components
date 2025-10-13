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

import { Directive, Input, HostListener, Component, ViewContainerRef, ViewEncapsulation, OnInit, ComponentRef, OnDestroy } from '@angular/core';
import { ClipboardService } from './clipboard.service';
import { TranslatePipe } from '@ngx-translate/core';

@Directive({
    selector: '[adf-clipboard]',
    exportAs: 'adfClipboard'
})
export class ClipboardDirective implements OnDestroy {
    /** Translation key or message for the tooltip. */
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('adf-clipboard')
    placeholder: string;

    /** Reference to the HTML element containing the text to copy. */
    @Input()
    target: HTMLInputElement | HTMLTextAreaElement;

    /** Translation key or message for snackbar notification. */
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('clipboard-notification') message: string;

    private tooltipComponentRef: ComponentRef<ClipboardComponent>;
    private mouseEnterTimeout: ReturnType<typeof setTimeout>;
    private mouseLeaveTimeout: ReturnType<typeof setTimeout>;

    constructor(
        private readonly clipboardService: ClipboardService,
        public viewContainerRef: ViewContainerRef
    ) {}

    ngOnDestroy(): void {
        this.clearTimeouts();
        this.hideTooltip();
    }

    @HostListener('mouseenter')
    showTooltip() {
        if (this.mouseLeaveTimeout) {
            clearTimeout(this.mouseLeaveTimeout);
            this.mouseLeaveTimeout = null;
        }

        if (this.tooltipComponentRef) {
            return;
        }

        this.mouseEnterTimeout = setTimeout(() => {
            if (this.placeholder && !this.tooltipComponentRef) {
                this.tooltipComponentRef = this.viewContainerRef.createComponent(ClipboardComponent);
                this.tooltipComponentRef.instance.placeholder = this.placeholder;
            }
        }, 150);
    }

    @HostListener('mouseleave')
    closeTooltip() {
        if (this.mouseEnterTimeout) {
            clearTimeout(this.mouseEnterTimeout);
            this.mouseEnterTimeout = null;
        }

        this.mouseLeaveTimeout = setTimeout(() => {
            this.hideTooltip();
        }, 100);
    }

    private hideTooltip(): void {
        if (this.tooltipComponentRef) {
            this.tooltipComponentRef.destroy();
            this.tooltipComponentRef = null;
        }
    }

    private clearTimeouts(): void {
        if (this.mouseEnterTimeout) {
            clearTimeout(this.mouseEnterTimeout);
            this.mouseEnterTimeout = null;
        }
        if (this.mouseLeaveTimeout) {
            clearTimeout(this.mouseLeaveTimeout);
            this.mouseLeaveTimeout = null;
        }
    }

    @HostListener('keydown.enter', ['$event'])
    @HostListener('click', ['$event'])
    copyToClipboard(event: KeyboardEvent | MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();

        const isValidTarget = this.clipboardService.isTargetValid(this.target);

        if (isValidTarget) {
            this.clipboardService.copyToClipboard(this.target, this.message);
        } else {
            this.copyContentToClipboard(this.viewContainerRef.element.nativeElement.innerHTML);
        }
    }

    private copyContentToClipboard(content: string) {
        this.clipboardService.copyContentToClipboard(content, this.message);
    }
}

@Component({
    selector: 'adf-copy-content-tooltip',
    imports: [TranslatePipe],
    template: `<span class="adf-copy-tooltip">{{ placeholder | translate }} </span>`,
    encapsulation: ViewEncapsulation.None
})
export class ClipboardComponent implements OnInit {
    placeholder: string;

    ngOnInit() {
        this.placeholder = this.placeholder || 'CLIPBOARD.CLICK_TO_COPY';
    }
}
