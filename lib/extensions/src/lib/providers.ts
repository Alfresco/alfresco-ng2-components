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

import { EnvironmentProviders, inject, provideAppInitializer, Provider, Type } from '@angular/core';
import { AppExtensionService } from './services/app-extension.service';
import { ExtensionService } from './services/extension.service';
import { RuleEvaluator } from './config/rule.extensions';

/**
 * Provides all necessary entries for the app extensibility
 * @returns list of providers
 */
export function provideAppExtensions(): (Provider | EnvironmentProviders)[] {
    return [
        provideAppInitializer(() => {
            const appExtensionService = inject(AppExtensionService);
            return appExtensionService.load();
        })
    ];
}

/**
 * Provides a way to register extension entities in a single API
 *
 * Example:
 * ```typescript
 * providers: [
 *  provideExtensions({
 *      authGuards: {
 *          auth1: guard1,
 *          auth2: guard2
 *      },
 *      evaluators: {
 *          eval1: evaluator1,
 *          eval2: evaluator2
 *      },
 *      components: {
 *          component: component1
 *      }
 *  });
 * ]
 * ```
 * @param params Parameters for the api
 * @param params.authGuards Auth guards to register
 * @param params.evaluators Rule evaluators to register
 * @param params.components Components to register
 * @returns list of Angular providers
 */
export function provideExtensions(params: {
    authGuards?: Record<string, unknown>;
    evaluators?: Record<string, RuleEvaluator>;
    components?: Record<string, Type<any>>;
}) {
    return [
        provideAppInitializer(() => {
            const service = inject(ExtensionService);

            if (params) {
                if (params.authGuards) {
                    service.setAuthGuards(params.authGuards);
                }
                if (params.evaluators) {
                    service.setEvaluators(params.evaluators);
                }
                if (params.components) {
                    service.setComponents(params.components);
                }
            }

            return Promise.resolve();
        })
    ];
}
