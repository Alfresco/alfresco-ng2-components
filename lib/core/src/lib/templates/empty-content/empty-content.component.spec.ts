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

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { setupTestBed } from '../../testing/setup-test-bed';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { CoreTestingModule } from '../../testing/core.testing.module';

@Component({
    selector: 'adf-test-component',
    template: `
        <adf-empty-content
            icon="delete"
            [title]="'CUSTOM_TITLE'"
            [subtitle]="'CUSTOM_SUBTITLE'">
            <div class="adf-empty-content__text">SUBTITLE-1</div>
            <div class="adf-empty-content__text">SUBTITLE-2</div>
            <div class="adf-empty-content__text">SUBTITLE-3</div>
        </adf-empty-content>
    `
})
class TestComponent {}

describe('EmptyContentComponent', () => {

    let fixture: ComponentFixture<TestComponent>;
    let translateService: TranslateService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ],
        declarations: [
            TestComponent
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        translateService = TestBed.inject(TranslateService);
    });

    it('should render custom title', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        const title = fixture.debugElement.query(By.css('.adf-empty-content__title'));
        expect(title).toBeDefined('title element not found');
        expect(title.nativeElement.textContent).toContain('CUSTOM_TITLE', 'incorrect title value');
    });

    it('should translate title and subtitle', async () => {
        spyOn(translateService, 'get').and.callFake((key: string) => {
            switch (key) {
                case 'CUSTOM_TITLE':
                    return of('ENG_CUSTOM_TITLE');
                case 'CUSTOM_SUBTITLE':
                    return of('ENG_CUSTOM_SUBTITLE');
                default:
                    return of(key);
            }
        });

        fixture.detectChanges();
        await fixture.whenStable();

        const title = fixture.debugElement.query(By.css('.adf-empty-content__title'));
        const subtitle = fixture.debugElement.query(By.css('.adf-empty-content__subtitle'));

        expect(title).toBeDefined('title element not found');
        expect(title.nativeElement.textContent).toContain('ENG_CUSTOM_TITLE', 'incorrect title value');

        expect(subtitle).toBeDefined('subtitle element not found');
        expect(subtitle.nativeElement.textContent).toContain('ENG_CUSTOM_SUBTITLE', 'incorrect subtitle value');
    });

    it('should render multiple subtitle elements', () => {
        const subTitles = fixture.debugElement.queryAll(By.css('.adf-empty-content__text'));

        expect(subTitles.length).toBe(3);
        expect(subTitles[0].nativeElement.textContent).toContain('SUBTITLE-1', 'missing SUBTITLE-1');
        expect(subTitles[1].nativeElement.textContent).toContain('SUBTITLE-2', 'missing SUBTITLE-2');
        expect(subTitles[2].nativeElement.textContent).toContain('SUBTITLE-3', 'missing SUBTITLE-3');
    });
});
