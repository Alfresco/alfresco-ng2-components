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

import { NgModule, ModuleWithProviders } from '@angular/core';
import { provideTranslations } from '@alfresco/adf-core';
import { ANALYTICS_PROCESS_DIRECTIVES } from './analytics-process/public-api';
import { DIAGRAM_DIRECTIVES } from './diagram/public-api';

/**
 * @deprecated This module is deprecated and will be removed in a future release.
 * Example:
 * ```
 * providers: [
 *  provideTranslations('adf-insights', 'assets/adf-insights')
 * ]
 * ```
 */
@NgModule({
    imports: [...ANALYTICS_PROCESS_DIRECTIVES, ...DIAGRAM_DIRECTIVES],
    exports: [...ANALYTICS_PROCESS_DIRECTIVES, ...DIAGRAM_DIRECTIVES]
})
export class InsightsModule {
    static forRoot(): ModuleWithProviders<InsightsModule> {
        return {
            ngModule: InsightsModule,
            providers: [provideTranslations('adf-insights', 'assets/adf-insights')]
        };
    }
}
