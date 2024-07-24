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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    const getLogoImgElement = () => fixture.nativeElement.querySelector('.adf-toolbar-logo');
    const getTitleElement = () => fixture.nativeElement.querySelector('.adf-toolbar-title');

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CommonModule, HeaderComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should have default variant as "minimal"', () => {
        expect(component.variant).toEqual('minimal');
    });

    it('should update title width based on variant', () => {
        component.variant = 'extended';
        fixture.detectChanges();
        expect(fixture.nativeElement.style.getPropertyValue('--adf-toolbar-title-width')).toBe('100%');

        component.variant = 'minimal';
        fixture.detectChanges();
        expect(fixture.nativeElement.style.getPropertyValue('--adf-toolbar-title-width')).toBe('auto');
    });

    it('should set correct logoSrc when provided', () => {
        const testLogoSrc = 'https://example.com/new-logo.png';
        component.logoSrc = testLogoSrc;
        fixture.detectChanges();
        expect(getLogoImgElement().src).toEqual(testLogoSrc);
    });

    it('should set correct logoAlt when provided', () => {
        const testLogoAlt = 'New Logo';
        component.logoAlt = testLogoAlt;
        component.logoSrc = 'test.png';
        fixture.detectChanges();
        expect(getLogoImgElement().getAttribute('alt')).toEqual(testLogoAlt);
    });

    it('should set correct logo height and width when provided', () => {
        const logoHeight = '50px';
        const logoWidth = '100px';
        component.logoSrc = 'test.png';
        component.logoHeight = logoHeight;
        component.logoWidth = logoWidth;
        fixture.detectChanges();
        const style = getComputedStyle(getLogoImgElement());
        expect(style.height).toEqual(logoHeight);
        expect(style.width).toEqual(logoWidth);
    });

    it('should set correct title when provided', () => {
        const title = 'Test Title';
        component.variant = 'extended';
        component.title = title;
        fixture.detectChanges();
        expect(getTitleElement().textContent).toEqual(title);
    });

    it('should not display title if variant = minimal', () => {
        const title = 'Test Title';
        component.variant = 'minimal';
        component.title = title;
        fixture.detectChanges();
        expect(getTitleElement().textContent).toBeFalsy();
    });

    it('should not display logo if src is not provided', () => {
        component.logoSrc = '';
        fixture.detectChanges();
        expect(getLogoImgElement()).toBeFalsy();
    });

    it('should set correct header height if provided', () => {
        const headerHeight = '150px';
        component.headerHeight = headerHeight;
        fixture.detectChanges();
        const style = getComputedStyle(fixture.nativeElement);
        expect(style.height).toEqual(headerHeight);
    });
});
