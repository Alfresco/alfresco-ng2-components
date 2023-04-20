/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ComponentRef, Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TooltipCardComponent } from './tooltip-card.component';

@Directive({ selector: '[adf-tooltip-card]' })
export class TooltipCardDirective implements OnInit, OnDestroy {

    @Input('adf-tooltip-card') text = '';
    @Input() image = '';
    @Input() width = '300';
    @Input() htmlContent = '';
    @Input() originX: 'start' | 'center' | 'end' = 'start';
    @Input() originY: 'top' | 'center' | 'bottom' = 'top';
    @Input() overlayX: 'start' | 'center' | 'end' = 'start';
    @Input() overlayY: 'top' | 'center' | 'bottom' = 'bottom';
    @Input() offsetX = 0;
    @Input() offsetY = -8;

    private overlayRef: OverlayRef;

    constructor(
        private overlay: Overlay,
        private overlayPositionBuilder: OverlayPositionBuilder,
        private elementRef: ElementRef) {
    }

    ngOnDestroy(): void {
        this.hide();
    }

    ngOnInit(): void {
        const positionStrategy = this.overlayPositionBuilder
            .flexibleConnectedTo(this.elementRef)
            .withPositions([{
                originX: this.originX,
                originY: this.originY,
                overlayX: this.overlayX,
                overlayY: this.overlayY,
                offsetY: this.offsetY,
                offsetX: this.offsetX
            }]);

        this.overlayRef = this.overlay.create({ positionStrategy });
    }

    @HostListener('mouseenter')
    show() {
        const tooltipRef: ComponentRef<TooltipCardComponent>
            = this.overlayRef.attach(new ComponentPortal(TooltipCardComponent));
        tooltipRef.instance.text = this.text;
        tooltipRef.instance.image = this.image;
        tooltipRef.instance.width = this.width;
        tooltipRef.instance.htmlContent = this.htmlContent;
    }

    @HostListener('mouseleave')
    hide() {
        this.overlayRef.detach();
    }
}
