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

import { NgModule, ModuleWithProviders, inject, provideAppInitializer } from '@angular/core';
import { AppExtensionService } from './services/app-extension.service';

/** @deprecated use provideAppExtensions() api instead */
@NgModule()
export class ExtensionsModule {
    static forRoot(): ModuleWithProviders<ExtensionsModule> {
        return {
            ngModule: ExtensionsModule,
            providers: [
                provideAppInitializer(() => {
                    const appExtensionService = inject(AppExtensionService);
                    return appExtensionService.load();
                })
            ]
        };
    }

    /**
     * @deprecated use provideAppExtensions() api instead
     * @returns Module with providers
     */
    static forChild(): ModuleWithProviders<ExtensionsModule> {
        return {
            ngModule: ExtensionsModule
        };
    }
}
