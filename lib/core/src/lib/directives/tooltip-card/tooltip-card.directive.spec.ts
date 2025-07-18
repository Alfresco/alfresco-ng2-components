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

import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipCardDirective } from './tooltip-card.directive';
import { Overlay, OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { By } from '@angular/platform-browser';

const IMAGE_URL = 'alfresco-logo.svg';

@Component({
    template: `<span
        #span
        [adf-tooltip-card]="'Sample text'"
        [image]="'${IMAGE_URL}'"
        [width]="'400'"
        [htmlContent]="'this is the <b>html</b> raw code'"
        class="test-component"
    ></span>`,
    standalone: true,
    imports: [TooltipCardDirective]
})
class TestComponent {
    @ViewChild(TooltipCardDirective, { static: true })
    directive: TooltipCardDirective;

    @ViewChild('span', { static: true })
    span: ElementRef;
}

describe('TooltipCardDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let overlay: HTMLElement;
    let overlayService: Overlay;
    let overlayContainer: OverlayContainer;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [OverlayModule, TestComponent]
        });

        fixture = TestBed.createComponent(TestComponent);
        overlayService = TestBed.inject(Overlay);
        overlayContainer = TestBed.inject(OverlayContainer);
        overlay = overlayContainer.getContainerElement();
    });

    afterEach(() => fixture.destroy());

    it('should display tooltip-card on mouse enter', () => {
        fixture.detectChanges();
        let tooltipCard = overlay.querySelector<HTMLElement>('div.adf-tooltip-card');

        expect(tooltipCard).toBeNull();

        const span = fixture.debugElement.query(By.css('span.test-component'));
        span.triggerEventHandler('mouseenter', {});
        fixture.detectChanges();
        tooltipCard = overlay.querySelector<HTMLElement>('div.adf-tooltip-card');

        expect(tooltipCard).not.toBeNull();

        const text = tooltipCard.querySelector<HTMLElement>('p');
        const img = tooltipCard.querySelector<HTMLElement>('img');
        const div = tooltipCard.querySelector<HTMLElement>('div');

        expect(tooltipCard.getAttribute('style')).toBe('width: 400px;');
        expect(text.textContent.trim()).toEqual('Sample text');
        expect(img.getAttribute('src')).toEqual(IMAGE_URL);
        expect(img.getAttribute('width')).toEqual('400');
        expect(div.innerHTML).toEqual('this is the <b>html</b> raw code');
    });

    it('should hide tooltip-card on mouse leave', () => {
        fixture.detectChanges();
        const span = fixture.debugElement.query(By.css('span.test-component'));
        span.triggerEventHandler('mouseenter', {});
        fixture.detectChanges();
        let tooltipCard = overlay.querySelector<HTMLElement>('div.adf-tooltip-card');

        expect(tooltipCard).not.toBeNull();

        span.triggerEventHandler('mouseleave', {});
        fixture.detectChanges();
        tooltipCard = overlay.querySelector<HTMLElement>('div.adf-tooltip-card');

        expect(tooltipCard).toBeNull();
    });

    it('should hide tooltip-card on destroy', () => {
        fixture.detectChanges();
        const span = fixture.debugElement.query(By.css('span.test-component'));
        span.triggerEventHandler('mouseenter', {});
        fixture.detectChanges();
        let tooltipCard = overlay.querySelector<HTMLElement>('div.adf-tooltip-card');

        expect(tooltipCard).not.toBeNull();

        fixture.componentInstance.directive.ngOnDestroy();
        fixture.detectChanges();
        tooltipCard = overlay.querySelector<HTMLElement>('div.adf-tooltip-card');

        expect(tooltipCard).toBeNull();
    });

    it('should NOT hide tooltip-card on destroy when overlay reference is undefined', () => {
        spyOn(overlayService, 'create').and.returnValue(undefined as any);
        spyOn(fixture.componentInstance.directive, 'hide');

        fixture.detectChanges();
        const tooltipCard = overlay.querySelector<HTMLElement>('div.adf-tooltip-card');

        expect(tooltipCard).toBeNull();

        fixture.componentInstance.directive.ngOnDestroy();

        expect(fixture.componentInstance.directive.hide).toHaveBeenCalledTimes(0);
    });
});
