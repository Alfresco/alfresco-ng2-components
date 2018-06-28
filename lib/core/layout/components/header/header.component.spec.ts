/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { HeaderLayoutComponent } from './header.component';
import { setupTestBed } from '../../../testing/setupTestBed';
import { CoreTestingModule } from '../../../testing/core.testing.module';
import { By } from '@angular/platform-browser';

describe('HeaderLayoutComponent', () => {
    let fixture: ComponentFixture<HeaderLayoutComponent>;
    let component: HeaderLayoutComponent;
    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderLayoutComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should create instance of HeaderLayoutComponent', () => {
        expect(fixture.componentInstance instanceof HeaderLayoutComponent).toBe(true, 'should create HeaderLayoutComponent');
    });

    it('title element should been displayed', () => {
        const titleElement = fixture.debugElement.query(By.css('.adf-app-title'));
        expect(titleElement === null).toBeFalsy;
    });

    it('should show TEST TITLE', () => {
        component.title = 'TEST TITLE';
        fixture.detectChanges();

        const titleElement = fixture.nativeElement.querySelector('.adf-app-title');
        expect(titleElement.innerText).toEqual('TEST TITLE');
    });

    it('color attribute should be present on mat-toolbar', () => {
        const toolbar = fixture.nativeElement.querySelector('mat-toolbar');

        expect(toolbar.getAttribute('color') === null).toBeFalsy;
    });

    it('should display default logo img element with the expected src if a logo path is set', () => {
        component.logo = 'logo.png';
        fixture.detectChanges();

        const logo = fixture.nativeElement.querySelector('.adf-app-logo');
        const src = logo.getAttribute('src');
        expect(logo === null).toBeFalsy;
        expect(src).toEqual('logo.png');
    });
});
