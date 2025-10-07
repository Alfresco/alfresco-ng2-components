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

import { DynamicComponentMapper } from '@alfresco/adf-core';
import { inject, Injectable } from '@angular/core';
import { APP_CUSTOM_SCREEN_TOKEN, CustomScreen } from './provide-screen';

/**
 * Service for managing and rendering custom screen components.
 *
 * Custom screens can be registered using the {@link provideScreen} helper function
 * and the {@link APP_CUSTOM_SCREEN_TOKEN} injection token.
 *
 * @example
 * ```
 * // Register a custom screen in your Angular module providers:
 * import { provideScreen, ScreenRenderingService } from '@alfresco/adf-process-services-cloud';
 *
 * @Component({
 *   template: '<div>My Custom Screen</div>'
 * })
 * class MyCustomScreenComponent {}
 *
 * @NgModule({
 *   providers: [
 *     provideScreen('my-custom-screen', MyCustomScreenComponent)
 *   ]
 * })
 * export class MyModule {}
 *
 * // The custom screen can now be resolved and rendered by ScreenRenderingService.
 * ```
 */
@Injectable({
    providedIn: 'root'
})
export class ScreenRenderingService extends DynamicComponentMapper {
    private customScreens = inject<CustomScreen[]>(APP_CUSTOM_SCREEN_TOKEN, { optional: true }) || [];

    constructor() {
        super();
        this.registerCustomScreens();
    }

    private registerCustomScreens() {
        if (this.customScreens && this.customScreens.length > 0) {
            this.customScreens.forEach((screen) => {
                if (!screen) return; // Skip null or undefined screens
                this.setComponentTypeResolver(screen.key, () => screen.component, true);
            });
        }
    }
}
