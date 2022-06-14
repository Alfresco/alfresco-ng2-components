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

import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { loadAppConfig } from './app-config.loader';
import { AppConfigPipe } from './app-config.pipe';
import { AppConfigService } from './app-config.service';

interface AppConfigModuleConfig {
    loadConfig: boolean;
}

const defaultConfig: AppConfigModuleConfig = {
    loadConfig: true
};

@NgModule({
    imports: [
        HttpClientModule
    ],
    declarations: [
        AppConfigPipe
    ],
    exports: [
        AppConfigPipe
    ]
})
export class AppConfigModule {
    static forRoot(config: AppConfigModuleConfig = defaultConfig): ModuleWithProviders<AppConfigModule> {
        return {
            ngModule: AppConfigModule,
            providers: [
                ...(config.loadConfig ?
                    [{
                        provide: APP_INITIALIZER,
                        useFactory: loadAppConfig,
                        deps: [ AppConfigService, StorageService ], multi: true }
                    ] : []
                )
            ]
        };
    }
}
