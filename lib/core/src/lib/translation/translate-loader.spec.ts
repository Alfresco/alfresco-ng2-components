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
import { provideHttpClient } from '@angular/common/http';
import { TranslateLoaderService } from './translate-loader.service';

describe('TranslateLoader', () => {
    let customLoader: TranslateLoaderService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting(), TranslateLoaderService]
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

    describe('locale fallback', () => {
        it('should fallback from en-US to en when en-US file does not exist', fakeAsync(() => {
            let nextInvoked = false;

            const subscription = customLoader.getTranslation('en-US').subscribe({
                next: () => (nextInvoked = true),
                error: () => fail('Should not call error handler')
            });

            const enUsRequest = httpMock.expectOne((request) => request.url.includes('assets/adf-core/i18n/en-US.json'));
            enUsRequest.flush(null, { status: 404, statusText: 'Not Found' });
            tick();

            const enRequest = httpMock.expectOne((request) => request.url.includes('assets/adf-core/i18n/en.json'));
            enRequest.flush({ 'TEST.KEY': 'Test value' });
            tick();

            expect(nextInvoked).toBeTrue();
            subscription.unsubscribe();
            httpMock.verify();
        }));

        it('should fallback from en-GB to en when en-GB file does not exist', fakeAsync(() => {
            let nextInvoked = false;

            const subscription = customLoader.getTranslation('en-GB').subscribe({
                next: () => (nextInvoked = true),
                error: () => fail('Should not call error handler')
            });

            const enGbRequest = httpMock.expectOne((request) => request.url.includes('assets/adf-core/i18n/en-GB.json'));
            enGbRequest.flush(null, { status: 404, statusText: 'Not Found' });
            tick();

            const enRequest = httpMock.expectOne((request) => request.url.includes('assets/adf-core/i18n/en.json'));
            enRequest.flush({ 'TEST.KEY': 'Test value' });
            tick();

            expect(nextInvoked).toBeTrue();
            subscription.unsubscribe();
            httpMock.verify();
        }));

        it('should fallback from short locale (de) to full locale (de-DE)', fakeAsync(() => {
            let nextInvoked = false;

            const subscription = customLoader.getTranslation('de').subscribe({
                next: () => (nextInvoked = true),
                error: () => fail('Should not call error handler')
            });

            const deRequest = httpMock.expectOne((request) => request.url.includes('assets/adf-core/i18n/de.json'));
            deRequest.flush(null, { status: 404, statusText: 'Not Found' });
            tick();

            const deDeRequest = httpMock.expectOne((request) => request.url.includes('assets/adf-core/i18n/de-DE.json'));
            deDeRequest.flush({ 'TEST.KEY': 'Testwert' });
            tick();

            expect(nextInvoked).toBeTrue();
            subscription.unsubscribe();
            httpMock.verify();
        }));

        it('should use the file directly when it exists without fallback', fakeAsync(() => {
            let nextInvoked = false;

            const subscription = customLoader.getTranslation('fr-FR').subscribe({
                next: () => (nextInvoked = true),
                error: () => fail('Should not call error handler')
            });

            const frFrRequest = httpMock.expectOne((request) => request.url.includes('assets/adf-core/i18n/fr-FR.json'));
            frFrRequest.flush({ 'TEST.KEY': 'Valeur de test' });
            tick();

            expect(nextInvoked).toBeTrue();
            subscription.unsubscribe();
            httpMock.verify();
        }));

        it('should register translations under the original requested locale', fakeAsync(() => {
            let translationResult: any;

            const subscription = customLoader.getTranslation('en-US').subscribe({
                next: (result) => (translationResult = result),
                error: () => fail('Should not call error handler')
            });

            const enUsRequest = httpMock.expectOne((request) => request.url.includes('assets/adf-core/i18n/en-US.json'));
            enUsRequest.flush(null, { status: 404, statusText: 'Not Found' });
            tick();

            const enRequest = httpMock.expectOne((request) => request.url.includes('assets/adf-core/i18n/en.json'));
            enRequest.flush({ 'TEST.KEY': 'Test value' });
            tick();

            expect(translationResult).toEqual({ 'TEST.KEY': 'Test value' });
            subscription.unsubscribe();
            httpMock.verify();
        }));
    });
});
