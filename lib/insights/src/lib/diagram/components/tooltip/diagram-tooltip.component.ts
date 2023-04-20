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

/* eslint-disable @angular-eslint/component-selector */

import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

const POSITION = { bottom: 'bottom', left: 'left', right: 'right', top: 'top' };
const STRATEGY = { cursor: 'cursor', element: 'element' };
const IS_ACTIVE_CLASS = 'adf-is-active';

@Component({
    selector: 'diagram-tooltip',
    templateUrl: './diagram-tooltip.component.html',
    styleUrls: ['./diagram-tooltip.component.scss']
})
export class DiagramTooltipComponent implements AfterViewInit, OnDestroy {
    @ViewChild('tooltipContent', { static: true })
    tooltipContent: ElementRef;

    @Input()
    data: any;

    @Input()
    position = POSITION.bottom;

    @Input()
    strategy = STRATEGY.cursor;

    private tooltipElement: any;
    private targetElement: any;
    private boundMouseEnterHandler: EventListenerObject;
    private boundMouseLeaveAndScrollHandler: EventListenerObject;

    /**
     * Set up event listeners for the target element (defined in the data.id)
     */
    ngAfterViewInit() {
        this.tooltipElement = this.tooltipContent.nativeElement;

        if (this.data.id) {
            this.targetElement = document.getElementById(this.data.id);
        }

        if (this.targetElement) {
            if (!this.targetElement.hasAttribute('tabindex')) {
                this.targetElement.setAttribute('tabindex', '0');
            }

            this.boundMouseEnterHandler = this.handleMouseEnter.bind(this);
            this.boundMouseLeaveAndScrollHandler = this.hideTooltip.bind(this);
            this.targetElement.addEventListener('mouseenter', this.boundMouseEnterHandler, false);
            this.targetElement.addEventListener('touchend', this.boundMouseEnterHandler, false);
            this.targetElement.addEventListener('mouseleave', this.boundMouseLeaveAndScrollHandler, false);
            window.addEventListener('scroll', this.boundMouseLeaveAndScrollHandler, true);
            window.addEventListener('touchstart', this.boundMouseLeaveAndScrollHandler);
        }
    }

    /**
     * Clear all bound event listeners
     */
    ngOnDestroy() {
        window.removeEventListener('scroll', this.boundMouseLeaveAndScrollHandler, true);
        window.removeEventListener('touchstart', this.boundMouseLeaveAndScrollHandler);
    }

    /**
     * Hides the tooltip
     */
    private hideTooltip(): void {
        this.tooltipElement.classList.remove(IS_ACTIVE_CLASS);
    }

    /**
     * Shows the tooltip
     */
    private showTooltip(): void {
        this.tooltipElement.classList.add(IS_ACTIVE_CLASS);
    }

    /**
     * Calculates the tooltip position and displays it
     *
     * @param event mouseenter/touchend event
     */
    private handleMouseEnter(event): void {
        let props;

        if (this.strategy === STRATEGY.element) {
            props = event.target.getBoundingClientRect();
        } else {
            props = { top: (event.pageY - 150), left: event.pageX, width: event.layerX, height: 50 };
        }

        const top = props.top + (props.height / 2);
        const marginLeft = -1 * (this.tooltipElement.offsetWidth / 2);
        const marginTop = -1 * (this.tooltipElement.offsetHeight / 2);
        let left = props.left + (props.width / 2);

        if (this.position === POSITION.left || this.position === POSITION.right) {
            left = (props.width / 2);
            if (top + marginTop < 0) {
                this.tooltipElement.style.top = '0';
                this.tooltipElement.style.marginTop = '0';
            } else {
                this.tooltipElement.style.top = top + 'px';
                this.tooltipElement.style.marginTop = marginTop + 'px';
            }
        } else {
            if (left + marginLeft < 0) {
                this.tooltipElement.style.left = '0';
                this.tooltipElement.style.marginLeft = '0';
            } else {
                this.tooltipElement.style.left = left + 'px';
                this.tooltipElement.style.marginLeft = marginLeft + 'px';
            }
        }

        if (this.position === POSITION.top) {
            this.tooltipElement.style.top = props.top - this.tooltipElement.offsetHeight - 10 + 'px';
        } else if (this.position === POSITION.right) {
            this.tooltipElement.style.left = props.left + props.width + 10 + 'px';
        } else if (this.position === POSITION.left) {
            this.tooltipElement.style.left = props.left - this.tooltipElement.offsetWidth - 10 + 'px';
        } else {
            this.tooltipElement.style.top = props.top + props.height + 10 + 'px';
        }

        this.showTooltip();
    }
}
