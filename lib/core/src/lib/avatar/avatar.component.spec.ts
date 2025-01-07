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

import { AvatarComponent } from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('AvatarComponent', () => {
    let component: AvatarComponent;
    let fixture: ComponentFixture<AvatarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AvatarComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AvatarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    const getAvatarImageElement = (): HTMLImageElement => fixture.nativeElement.querySelector('.adf-avatar__image');

    it('should display initials when src is not provided', () => {
        component.src = '';
        fixture.detectChanges();
        const avatarElement: HTMLElement = fixture.nativeElement.querySelector('.adf-avatar__initials');
        expect(avatarElement.textContent).toContain(component.initials);
    });

    it('should display image when src is provided', () => {
        component.src = 'path/to/image.jpg';
        fixture.detectChanges();
        expect(getAvatarImageElement().src).toContain(component.src);
    });

    it('should use default initials when not provided', () => {
        fixture.detectChanges();
        const avatarElement: HTMLElement = fixture.nativeElement.querySelector('.adf-avatar__initials');
        expect(avatarElement.textContent).toContain('U');
    });

    it('should use custom initials', () => {
        component.initials = 'DV';
        fixture.detectChanges();
        const avatarElement: HTMLElement = fixture.nativeElement.querySelector('.adf-avatar__initials');
        expect(avatarElement.textContent).toContain('DV');
    });

    it('should apply custom size style when size is provided', () => {
        component.size = '48px';
        fixture.detectChanges();

        const style = getComputedStyle(getAvatarImageElement());
        expect(style.width).toBe('48px');
        expect(style.height).toBe('48px');
    });

    it('should apply custom cursor style when cursor is provided', () => {
        component.cursor = 'pointer';
        fixture.detectChanges();

        const style = getComputedStyle(getAvatarImageElement());
        expect(style.cursor).toBe('pointer');
    });

    it('should display tooltip when provided', () => {
        component.tooltip = 'User Tooltip';
        fixture.detectChanges();
        expect(getAvatarImageElement().getAttribute('title')).toBe('User Tooltip');
    });

    it('should call onImageError when the image fails to load', () => {
        component.src = 'path/to/image.jpg';
        fixture.detectChanges();

        getAvatarImageElement().dispatchEvent(new Event('error'));

        expect(component.src).toEqual('');
    });
});
