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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ErrorContentComponent } from './error-content.component';
import { TranslationService } from '../../translation/translation.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { UnitTestingUtils } from '../../testing/unit-testing-utils';

describe('ErrorContentComponent', () => {
    let fixture: ComponentFixture<ErrorContentComponent>;
    let errorContentComponent: ErrorContentComponent;
    let translateService: TranslationService;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ErrorContentComponent],
            providers: [{ provide: ActivatedRoute, useValue: { params: of() } }]
        });
        fixture = TestBed.createComponent(ErrorContentComponent);
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        errorContentComponent = fixture.debugElement.componentInstance;
        translateService = TestBed.inject(TranslationService);
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    describe(' with an undefined error', () => {
        it('should render error code', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const errorContentElement = testingUtils.getByCSS('.adf-error-content-code');
            expect(errorContentElement).not.toBeNull();
            expect(errorContentElement).toBeDefined();
        });

        it('should render error title', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const errorContentElement = testingUtils.getByCSS('.adf-error-content-title');
            expect(errorContentElement).not.toBeNull();
            expect(errorContentElement).toBeDefined();
        });

        it('should render error description', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const errorContentElement = testingUtils.getByCSS('.adf-error-content-description');
            expect(errorContentElement).not.toBeNull();
            expect(errorContentElement).toBeDefined();
        });

        it('should render error description', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const errorContentElement = testingUtils.getByCSS('.adf-error-content-description');
            expect(errorContentElement).not.toBeNull();
            expect(errorContentElement).toBeDefined();
        });

        it('should hide secondary button if this one has no value', async () => {
            spyOn(translateService, 'instant').and.returnValue('');
            fixture.detectChanges();
            await fixture.whenStable();

            const errorContentElement = testingUtils.getByCSS('.adf-error-content-description-link');
            expect(errorContentElement).toBeNull();
        });

        it('should navigate to the default error UNKNOWN if it does not find the error', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            expect(errorContentComponent.errorCode).toBe('UNKNOWN');
        });
    });

    describe(' with a specific error', () => {
        it('should navigate to an error given by the route params', async () => {
            const route = TestBed.inject(ActivatedRoute);
            route.params = of({ id: '404' });
            spyOn(translateService, 'instant').and.returnValue(of('404'));
            fixture.detectChanges();
            await fixture.whenStable();

            expect(errorContentComponent.errorCodeTranslated).toBe('404');
        });
    });
});
