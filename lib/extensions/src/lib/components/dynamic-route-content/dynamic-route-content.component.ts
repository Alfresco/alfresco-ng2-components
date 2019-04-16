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

import { DynamicContainerComponent } from '../dynamic-container/dynamic-container.component';
import { OnInit, Component, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PluginLoaderService } from '../../services/plugin-loader/plugin-loader.service';

export interface DynamicRouteData {
    pluginId: string;
    componentId: string;
}

/**
 * @description
 *
 * Retrieves plugin information from the `ActivatedRoute` data.
 * Automatically resolves the external plugin by `pluginId`,
 * fills its content with the dynamic component `componentId` loaded with plugin.
 *
 * @usageNotes
 * ### Example
 *
 * ```
 * const routes = [
 *   {
 *     path: 'plugin/1',
 *     component: DynamicRouteContentComponent,
 *     data: {
 *       pluginId: 'myPlugin',
 *       componentId: 'myComponent
 *     }
 *   }
 * ];
 * ```
 */
@Component({
    selector: 'adf-dynamic-route-content',
    template: `<ng-container #content></ng-container>`
})
export class DynamicRouteContentComponent extends DynamicContainerComponent
    implements OnInit {
    constructor(
        protected route: ActivatedRoute,
        injector: Injector,
        pluginLoader: PluginLoaderService
    ) {
        super(injector, pluginLoader);
    }

    ngOnInit() {
        const data = this.route.snapshot.data as DynamicRouteData;

        if (data && data.pluginId && data.componentId) {
            this.loadPlugin(data.pluginId, data.componentId);
        }
    }
}
