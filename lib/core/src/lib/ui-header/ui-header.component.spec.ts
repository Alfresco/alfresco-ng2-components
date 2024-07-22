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
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UiHeaderComponent } from './ui-header.component';
import { ToolbarModule } from '../toolbar';
import { of } from 'rxjs';

describe('UiHeaderComponent', () => {
    let component: UiHeaderComponent;
    let fixture: ComponentFixture<UiHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CommonModule, TranslateModule.forRoot(), ToolbarModule, UiHeaderComponent, RouterTestingModule],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({ id: 'test' })
                    }
                }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UiHeaderComponent);
        component = fixture.componentInstance;
        component.logoSrc = 'test-src';
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
        const logoImage = fixture.nativeElement.querySelector('.adf-toolbar-logo');
        expect(logoImage.src).toEqual(testLogoSrc);
    });

    it('should set correct logoAlt when provided', () => {
        const testLogoAlt = 'New Logo';
        component.logoAlt = testLogoAlt;
        component.logoSrc = 'https://example.com/new-logo.png';
        fixture.detectChanges();
        const logoImage = fixture.nativeElement.querySelector('.adf-toolbar-logo');
        expect(logoImage.getAttribute('alt')).toEqual(testLogoAlt);
    });

    it('should set correct logo height and width when provided', () => {
        const logoHeight = '50px';
        const logoWidth = '100px';
        component.logoHeight = logoHeight;
        component.logoWidth = logoWidth;
        fixture.detectChanges();
        const style = getComputedStyle(fixture.nativeElement.querySelector('.adf-toolbar-logo'));
        expect(style.height).toEqual(logoHeight);
        expect(style.width).toEqual(logoWidth);
    });

    it('should set correct title when provided', () => {
        const title = 'Test Title';
        component.variant = 'extended';
        component.title = title;
        fixture.detectChanges();
        const titleElement = fixture.nativeElement.querySelector('.adf-toolbar-title');
        expect(titleElement.textContent).toEqual(title);
    });

    it('should not display title if variant = minimal', () => {
        const title = 'Test Title';
        component.variant = 'minimal';
        component.title = title;
        fixture.detectChanges();
        const titleElement = fixture.nativeElement.querySelector('.adf-toolbar-title');
        expect(titleElement.textContent).toBeFalsy();
    });

    it('should not display logo if src is not provided', () => {
        component.logoSrc = '';
        fixture.detectChanges();
        const logoImage = fixture.nativeElement.querySelector('.adf-toolbar-logo');
        expect(logoImage).toBeFalsy();
    });

    it('should set correct header height when provided', () => {
        const headerHeight = '150px';
        component.headerHeight = headerHeight;
        fixture.detectChanges();
        const style = getComputedStyle(fixture.nativeElement);
        expect(style.height).toEqual(headerHeight);
    });
});
