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

import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ConnectionPositionPair, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Directive({
    selector: '[adf-pop-over]',
    exportAs: 'adfPopOver'

})
export class PopOverDirective implements OnInit, OnDestroy, AfterViewInit {
    get open(): boolean {
        return this._open;
    }

    @Input('adf-pop-over') popOver!: TemplateRef<any>;
    @Input() target!: HTMLElement;
    @Input() panelClass = 'adf-permission-pop-over';

    private _open = false;
    private destroy$ = new Subject();
    private overlayRef!: OverlayRef;

    constructor(
        private element: ElementRef,
        private overlay: Overlay,
        private vcr: ViewContainerRef
    ) { }

    ngOnInit(): void {
        this.createOverlay();
    }

    ngAfterViewInit(): void {
        this.element.nativeElement.addEventListener('click', () => this.attachOverlay());
    }

    ngOnDestroy(): void {
        this.detachOverlay();
        this.destroy$.next();
        this.destroy$.complete();
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
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this._open = false;
                this.detachOverlay();
            });
    }

    private attachOverlay(): void {
        if (!this.overlayRef.hasAttached()) {
            const periodSelectorPortal = new TemplatePortal(this.popOver, this.vcr);

            this.overlayRef.attach(periodSelectorPortal);
            this._open = true;
        }
    }

    private detachOverlay(): void {
        if (this.overlayRef.hasAttached()) {
            this.overlayRef.detach();
        }
    }
}
