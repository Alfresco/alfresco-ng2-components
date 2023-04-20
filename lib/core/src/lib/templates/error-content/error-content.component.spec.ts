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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { ErrorContentComponent } from './error-content.component';
import { TranslationService } from '../../translation/translation.service';
import { setupTestBed } from '../../testing/setup-test-bed';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('ErrorContentComponent', () => {

    let fixture: ComponentFixture<ErrorContentComponent>;
    let errorContentComponent: ErrorContentComponent;
    let element: HTMLElement;
    let translateService: TranslationService;

    beforeEach(() => {
        fixture = TestBed.createComponent(ErrorContentComponent);
        element = fixture.nativeElement;
        errorContentComponent = fixture.debugElement.componentInstance;
        translateService = TestBed.inject(TranslationService);
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe(' with an undefined error', () => {

        setupTestBed({
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule
            ],
            providers: [
                { provide: ActivatedRoute, useValue: { params: of() } }
            ]
        });

        it('should render error code', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const errorContentElement = element.querySelector('.adf-error-content-code');
            expect(errorContentElement).not.toBeNull();
            expect(errorContentElement).toBeDefined();
        });

        it('should render error title', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const errorContentElement = element.querySelector('.adf-error-content-title');
            expect(errorContentElement).not.toBeNull();
            expect(errorContentElement).toBeDefined();
        });

        it('should render error description', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const errorContentElement = element.querySelector('.adf-error-content-description');
            expect(errorContentElement).not.toBeNull();
            expect(errorContentElement).toBeDefined();
        });

        it('should render error description', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const errorContentElement = element.querySelector('.adf-error-content-description');
            expect(errorContentElement).not.toBeNull();
            expect(errorContentElement).toBeDefined();
        });

        it('should hide secondary button if this one has no value', async () => {
            spyOn(translateService, 'instant').and.returnValue('');
            fixture.detectChanges();
            await fixture.whenStable();

            const errorContentElement = element.querySelector('.adf-error-content-description-link');
            expect(errorContentElement).toBeNull();
        });

        it('should navigate to the default error UNKNOWN if it does not find the error', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            expect(errorContentComponent.errorCode).toBe('UNKNOWN');
        });
    });

    describe(' with a specific error', () => {

        setupTestBed({
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule
            ],
            providers: [
                { provide: ActivatedRoute, useValue: { params: of({ id: '404' }) } }
            ]
        });

        it('should navigate to an error given by the route params', async () => {
            spyOn(translateService, 'instant').and.returnValue(of('404'));
            fixture.detectChanges();
            await fixture.whenStable();

            expect(errorContentComponent.errorCodeTranslated).toBe('404');
        });
    });
});
