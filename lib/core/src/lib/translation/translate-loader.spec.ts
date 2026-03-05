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

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateLoaderService } from './translate-loader.service';

describe('TranslateLoader', () => {
    let customLoader: TranslateLoaderService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClientTesting(), TranslateLoaderService]
        });
        customLoader = TestBed.inject(TranslateLoaderService);
        httpMock = TestBed.inject(HttpTestingController);
    });
    it('should be able to provide TranslateLoaderService', () => {
        expect(customLoader).toBeDefined();
        expect(customLoader instanceof TranslateLoaderService).toBeTruthy();
    });

    it('should add the component to the list', () => {
        customLoader.registerProvider('login', 'path/login');
        expect(customLoader.providerRegistered('login')).toBeTruthy();
    });

    it('should complete observer when gets full translation json', fakeAsync(() => {
        const language = 'en';
        let nextInvoked = false;
        let completeInvoked = false;

        const subscription = customLoader.getTranslation(language).subscribe({
            next: () => (nextInvoked = true),
            error: () => fail('Should not call error handler'),
            complete: () => (completeInvoked = true)
        });
        const expectedRequest = httpMock.expectOne((request) => request.url.includes(`assets/adf-core/i18n/${language}.json`));
        expect(expectedRequest.request.method).toBe('GET');
        expectedRequest.flush({ 'TEST.COMPONENT': 'Composant de test' });
        tick();
        expect(nextInvoked).toBeTrue();
        expect(completeInvoked).toBeTrue();
        subscription.unsubscribe();
        httpMock.verify();
    }));
});
