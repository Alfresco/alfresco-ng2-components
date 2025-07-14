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

import { DynamicExtensionComponent } from './components/dynamic-component/dynamic.component';
import { DynamicTabComponent } from './components/dynamic-tab/dynamic-tab.component';
import { DynamicColumnComponent } from './components/dynamic-column/dynamic-column.component';
import { PreviewExtensionComponent } from './components/viewer/preview-extension.component';
import { NgModule, ModuleWithProviders, inject, provideAppInitializer } from '@angular/core';
import { AppExtensionService } from './services/app-extension.service';

export const EXTENSION_DIRECTIVES = [DynamicExtensionComponent, DynamicTabComponent, DynamicColumnComponent, PreviewExtensionComponent] as const;

/** @deprecated import EXTENSION_DIRECTIVES or standalone components instead */
@NgModule({
    imports: [...EXTENSION_DIRECTIVES],
    exports: [...EXTENSION_DIRECTIVES]
})
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
     * @deprecated use `ExtensionsModule` instead, `EXTENSION_DIRECTIVES` or direct standalone components
     * @returns Module with providers
     */
    static forChild(): ModuleWithProviders<ExtensionsModule> {
        return {
            ngModule: ExtensionsModule
        };
    }
}
