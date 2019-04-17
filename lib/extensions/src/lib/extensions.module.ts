/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

/// <reference path="./typings.d.ts" />

import { DynamicExtensionComponent } from './components/dynamic-component/dynamic.component';
import { DynamicTabComponent } from './components/dynamic-tab/dynamic-tab.component';
import { DynamicColumnComponent } from './components/dynamic-column/dynamic-column.component';
import { PreviewExtensionComponent } from './components/viewer/preview-extension.component';
import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { AppExtensionService } from './services/app-extension.service';
import { setupExtensions } from './services/startup-extension-factory';
import { PluginLoaderService } from './services/plugin-loader/plugin-loader.service';
import { DefaultPluginLoaderService } from './services/plugin-loader/default-plugin-loader.service';
import { PluginsConfigProvider } from './services/plugin-loader/plugins-config.provider';
import { DynamicContainerComponent } from './components/dynamic-container/dynamic-container.component';
import { DynamicRouteContentComponent } from './components/dynamic-route-content/dynamic-route-content.component';

@NgModule({
    declarations: [
        DynamicExtensionComponent,
        DynamicTabComponent,
        DynamicColumnComponent,
        PreviewExtensionComponent,
        DynamicContainerComponent,
        DynamicRouteContentComponent
    ],
    exports: [
        DynamicExtensionComponent,
        DynamicTabComponent,
        DynamicColumnComponent,
        PreviewExtensionComponent,
        DynamicContainerComponent,
        DynamicRouteContentComponent
    ],
    entryComponents: [
        DynamicRouteContentComponent
    ]
})
export class ExtensionsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ExtensionsModule,
            providers: [
                {
                    provide: APP_INITIALIZER,
                    useFactory: setupExtensions,
                    deps: [
                        AppExtensionService,
                        PluginsConfigProvider
                    ],
                    multi: true
                },
                PluginsConfigProvider,
                { provide: PluginLoaderService, useClass: DefaultPluginLoaderService }
            ]
        };
    }

    static forChild(): ModuleWithProviders {
        return {
            ngModule: ExtensionsModule
        };
    }
}
