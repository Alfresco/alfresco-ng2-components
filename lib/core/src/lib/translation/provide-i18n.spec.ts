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

import { TestBed } from '@angular/core/testing';
import { ApplicationInitStatus } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { provideI18N } from './provide-i18n';
import { TranslateLoaderService } from './translate-loader.service';
import { TranslationService } from './translation.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAppConfigTesting } from '../testing';

describe('provideI18N', () => {
    describe('basic configuration', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [provideHttpClient(), provideHttpClientTesting(), provideAppConfigTesting(), provideI18N()]
            });
        });

        it('should provide TranslateService', () => {
            const translateService = TestBed.inject(TranslateService);
            expect(translateService).toBeDefined();
        });

        it('should set default language to "en" when not specified', () => {
            const translateService = TestBed.inject(TranslateService);
            expect(translateService.getFallbackLang()).toBe('en');
        });
    });

    describe('with custom default language', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [provideHttpClient(), provideHttpClientTesting(), provideAppConfigTesting(), provideI18N({ defaultLanguage: 'fr' })]
            });
        });

        it('should set custom default language', () => {
            const translateService = TestBed.inject(TranslateService);
            expect(translateService.getFallbackLang()).toBe('fr');
        });
    });

    describe('with assets configuration', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    provideHttpClient(),
                    provideHttpClientTesting(),
                    provideAppConfigTesting(),
                    provideI18N({
                        assets: [
                            ['my-app', 'assets/my-app'],
                            ['custom-lib', 'assets/custom-lib']
                        ]
                    })
                ]
            });
        });

        it('should provide translation services with assets configuration', () => {
            const translateService = TestBed.inject(TranslateService);
            const translationService = TestBed.inject(TranslationService);

            // Services should be properly configured
            expect(translateService).toBeDefined();
            expect(translationService).toBeDefined();
            expect(translateService.getFallbackLang()).toBe('en');
        });
    });

    describe('with translations configuration', () => {
        const mockTranslations = {
            WELCOME_MESSAGE: 'Welcome!',
            GOODBYE_MESSAGE: 'Goodbye!',
            'NESTED.KEY': 'Nested value'
        };

        beforeEach(async () => {
            TestBed.configureTestingModule({
                providers: [
                    provideHttpClient(),
                    provideHttpClientTesting(),
                    provideAppConfigTesting(),
                    provideI18N({
                        translations: mockTranslations
                    })
                ]
            });

            // Wait for APP_INITIALIZER to complete
            await TestBed.inject(ApplicationInitStatus).donePromise;
        });

        it('should set translations for default language', () => {
            const translateService = TestBed.inject(TranslateService);
            expect(translateService.instant('WELCOME_MESSAGE')).toBe('Welcome!');
            expect(translateService.instant('GOODBYE_MESSAGE')).toBe('Goodbye!');
            expect(translateService.instant('NESTED.KEY')).toBe('Nested value');
        });

        it('should merge translations with existing translations', async () => {
            const translateService = TestBed.inject(TranslateService);

            // Set some initial translations
            translateService.setTranslation('en', { EXISTING_KEY: 'Existing value' });

            // Set translations again to simulate the APP_INITIALIZER behavior
            translateService.setTranslation('en', mockTranslations, true);

            // The translations from config should be merged (merge flag is true)
            expect(translateService.instant('WELCOME_MESSAGE')).toBe('Welcome!');
            expect(translateService.instant('EXISTING_KEY')).toBe('Existing value');
        });
    });

    describe('with translations and custom language', () => {
        const mockTranslations = {
            HELLO: 'Bonjour!'
        };

        beforeEach(async () => {
            TestBed.configureTestingModule({
                providers: [
                    provideHttpClient(),
                    provideHttpClientTesting(),
                    provideAppConfigTesting(),
                    provideI18N({
                        defaultLanguage: 'fr',
                        translations: mockTranslations
                    })
                ]
            });

            await TestBed.inject(ApplicationInitStatus).donePromise;
        });

        it('should set translations for custom default language', () => {
            const translateService = TestBed.inject(TranslateService);
            expect(translateService.getFallbackLang()).toBe('fr');
            expect(translateService.instant('HELLO')).toBe('Bonjour!');
        });
    });

    describe('with combined configuration', () => {
        const mockTranslations = {
            'APP.TITLE': 'My Application'
        };

        beforeEach(async () => {
            TestBed.configureTestingModule({
                providers: [
                    provideHttpClient(),
                    provideHttpClientTesting(),
                    provideAppConfigTesting(),
                    provideI18N({
                        defaultLanguage: 'en',
                        assets: [['adf-core', 'assets/adf-core']],
                        translations: mockTranslations
                    })
                ]
            });

            await TestBed.inject(ApplicationInitStatus).donePromise;
        });

        it('should handle both assets and translations', () => {
            const translateService = TestBed.inject(TranslateService);
            const loader = translateService.currentLoader as TranslateLoaderService;

            expect(translateService.getFallbackLang()).toBe('en');
            expect(loader).toBeDefined();
            expect(loader.providerRegistered).toBeDefined();
            expect(loader.providerRegistered('adf-core')).toBeTruthy();
            expect(translateService.instant('APP.TITLE')).toBe('My Application');
        });
    });

    describe('with empty translations', () => {
        beforeEach(async () => {
            TestBed.configureTestingModule({
                providers: [
                    provideHttpClient(),
                    provideHttpClientTesting(),
                    provideAppConfigTesting(),
                    provideI18N({
                        translations: {}
                    })
                ]
            });

            await TestBed.inject(ApplicationInitStatus).donePromise;
        });

        it('should handle empty translations object', () => {
            const translateService = TestBed.inject(TranslateService);
            expect(translateService).toBeDefined();
            expect(translateService.getFallbackLang()).toBe('en');
        });
    });
});
