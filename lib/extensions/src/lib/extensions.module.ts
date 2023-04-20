/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { AppExtensionService } from './services/app-extension.service';
import { setupExtensions } from './services/startup-extension-factory';

@NgModule({
    declarations: [
        DynamicExtensionComponent,
        DynamicTabComponent,
        DynamicColumnComponent,
        PreviewExtensionComponent
    ],
    exports: [
        DynamicExtensionComponent,
        DynamicTabComponent,
        DynamicColumnComponent,
        PreviewExtensionComponent
    ]
})
export class ExtensionsModule {
    static forRoot(): ModuleWithProviders<ExtensionsModule> {
        return {
            ngModule: ExtensionsModule,
            providers: [
                {
                    provide: APP_INITIALIZER,
                    useFactory: setupExtensions,
                    deps: [AppExtensionService],
                    multi: true
                }
            ]
        };
    }

    static forChild(): ModuleWithProviders<ExtensionsModule> {
        return {
            ngModule: ExtensionsModule
        };
    }
}
