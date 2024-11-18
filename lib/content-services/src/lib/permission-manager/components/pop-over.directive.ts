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

import {
    AfterViewInit,
    DestroyRef,
    Directive,
    ElementRef,
    HostListener,
    inject,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';
import { ConnectionPositionPair, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ConfigurableFocusTrap, ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
    selector: '[adf-pop-over]',
    standalone: true,
    exportAs: 'adfPopOver'
})
export class PopOverDirective implements OnInit, OnDestroy, AfterViewInit {
    get open(): boolean {
        return this._open;
    }

    @Input('adf-pop-over') popOver!: TemplateRef<any>;
    @Input() target!: HTMLElement;
    @Input() panelClass = 'adf-permission-pop-over';
    @Input() autofocusedElementSelector: string;

    private _open = false;
    private readonly destroyRef = inject(DestroyRef);
    private overlayRef!: OverlayRef;

    private focusTrap: ConfigurableFocusTrap;

    constructor(
        private element: ElementRef,
        private overlay: Overlay,
        private vcr: ViewContainerRef,
        private focusTrapFactory: ConfigurableFocusTrapFactory
    ) {}

    ngOnInit(): void {
        this.createOverlay();
    }

    ngAfterViewInit(): void {
        this.element.nativeElement.addEventListener('click', () => this.toggleOverlay());
        this.element.nativeElement.addEventListener('keydown', this.preventDefaultForEnter);
    }

    ngOnDestroy(): void {
        this.element.nativeElement.removeEventListener('keydown', this.preventDefaultForEnter);
        this.detachOverlay();
    }

    private createOverlay(): void {
        const scrollStrategy = this.overlay.scrollStrategies.reposition();
        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(this.target)
            .withPositions([
                new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
                new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' })
            ])
            .withPush(false);

        this.overlayRef = this.overlay.create({
            positionStrategy,
            scrollStrategy,
            hasBackdrop: true,
            backdropClass: 'cdk-overlay-transparent-backdrop',
            panelClass: this.panelClass
        });

        this.overlayRef
            .backdropClick()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.detachOverlay();
            });
    }

    @HostListener('keyup.enter')
    private toggleOverlay(): void {
        if (!this.overlayRef.hasAttached()) {
            this.attachOverlay();
        } else {
            this.detachOverlay();
        }
    }

    private attachOverlay(): void {
        if (!this.overlayRef.hasAttached()) {
            const periodSelectorPortal = new TemplatePortal(this.popOver, this.vcr);

            this.overlayRef.attach(periodSelectorPortal);
            this._open = true;
            if (this.autofocusedElementSelector) {
                this.overlayRef.overlayElement.querySelector<HTMLElement>(this.autofocusedElementSelector).focus();
            }

            if (this.popOver && !this.focusTrap) {
                this.focusTrap = this.focusTrapFactory.create(this.overlayRef.overlayElement);
            }
        }
    }

    @HostListener('document:keyup.esc')
    private detachOverlay(): void {
        if (this.overlayRef.hasAttached()) {
            this.overlayRef.detach();
            this._open = false;

            this.focusTrap.destroy();
            this.focusTrap = null;

            this.element.nativeElement.focus();
        }
    }

    private preventDefaultForEnter(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }
}
