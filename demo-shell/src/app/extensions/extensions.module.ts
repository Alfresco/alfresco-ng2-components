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

import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@alfresco/adf-core';
import { AppExtensionService } from './extension.service';
import { ExtensionsModule } from '@alfresco/adf-extensions';

export function setupExtensions(service: AppExtensionService): Function {
    return () => service.load();
}

@NgModule({
    imports: [CommonModule, CoreModule.forChild(), ExtensionsModule]
})
export class AppExtensionsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AppExtensionsModule,
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

    static forChild(): ModuleWithProviders {
        return {
            ngModule: AppExtensionsModule
        };
    }
}
