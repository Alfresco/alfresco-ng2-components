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

import { EnvironmentProviders, inject, provideAppInitializer, Provider } from '@angular/core';
import { provideTranslateLoader, provideTranslateService, TranslateService } from '@ngx-translate/core';
import { TranslateLoaderService } from './translate-loader.service';
import { provideTranslations } from './translation.service';

export interface ProvideI18NConfig {
    /**
     * The default language to use for translations.
     * If not provided, it defaults to 'en'.
     */
    defaultLanguage?: string;
    /**
     * An array of assets to be used for i18n, where each asset is a tuple containing an identifier and a path.
     * Example: [['adf-core', 'assets/adf-core'], ['my-translations', 'assets/my-translations']]
     */
    assets?: [string, string][];

    /**
     * An object of translations to be used for i18n for the default language.
     * Example: { 'WELCOME_MESSAGE': 'Welcome!' }
     */
    translations?: Record<string, string>;
}

/**
 * Provides the i18n service.
 * This function is used to provide the i18n service in the application.
 * It is recommended to use this function in the top-level `AppModule` to ensure that the i18n service is available throughout the application.
 *
 * @param config - Configuration for the i18n service.
 * @param config.assets - An array of assets to be used for i18n, where each asset is a tuple containing an identifier and a path.
 * @returns An array of providers for the i18n service.
 */
export function provideI18N(config?: ProvideI18NConfig): (Provider | EnvironmentProviders)[] {
    const defaultLanguage = config?.defaultLanguage || 'en';

    const result: (Provider | EnvironmentProviders)[] = [
        provideTranslateService({
            loader: provideTranslateLoader(TranslateLoaderService),
            fallbackLang: defaultLanguage
        })
    ];

    if (config?.assets) {
        config.assets.forEach(([id, path]) => {
            result.push(provideTranslations(id, path));
        });
    }

    if (config?.translations) {
        result.push(
            provideAppInitializer(() => {
                const translateService = inject(TranslateService);
                translateService.setTranslation(defaultLanguage, config.translations, true);
                return Promise.resolve();
            })
        );
    }

    return result;
}
