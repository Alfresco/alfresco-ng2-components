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

import { EnvironmentProviders, Provider } from '@angular/core';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderService } from './translate-loader.service';
import { HttpClient } from '@angular/common/http';
import { provideTranslations } from './translation.service';

export interface ProvideI18NConfig {
    /**
     * The default language to use for translations.
     * If not provided, it defaults to 'en'.
     */
    defaultLanguage?: string;
    /**
     * An array of assets to be used for i18n, where each asset is a tuple containing an identifier and a path.
     * Example: [['en', '/assets/i18n/en.json'], ['fr', '/assets/i18n/fr.json']]
     */
    assets?: [string, string][];
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
    const result: (Provider | EnvironmentProviders)[] = [
        provideTranslateService({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateLoaderService,
                deps: [HttpClient]
            },
            defaultLanguage: config?.defaultLanguage || 'en'
        })
    ];

    if (config?.assets) {
        config.assets.forEach(([id, path]) => {
            result.push(provideTranslations(id, path));
        });
    }

    return result;
}
