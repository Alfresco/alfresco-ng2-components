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

import { Provider, EnvironmentProviders, APP_INITIALIZER } from '@angular/core';
import { provideTranslations } from '../translation/translation.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideCoreAuthTesting } from './noop-auth.module';
import { provideAppConfig } from '../app-config/provide-app-config';
import { AppConfigService } from '../app-config/app-config.service';
import { provideI18N } from '../../..';
import { provideRouter, withHashLocation } from '@angular/router';

/**
 * Provides the core providers for the storybook.
 *
 * @returns An array of providers for the core module.
 */
export function provideStoryCore(): (Provider | EnvironmentProviders)[] {
    return [
        provideI18N(),
        provideTranslations('adf-core', 'assets/adf-core'),
        provideTranslations('adf-process-services', 'assets/adf-process-services'),
        provideTranslations('adf-process-services-cloud', 'assets/adf-process-services-cloud'),
        provideAnimations(),
        provideCoreAuthTesting(),
        provideAppConfig(),
        {
            provide: APP_INITIALIZER,
            useFactory: (appConfig: AppConfigService) => () => {
                appConfig.config.locale = 'en';
            },
            deps: [AppConfigService],
            multi: true
        },
        provideRouter([], withHashLocation())
    ];
}
