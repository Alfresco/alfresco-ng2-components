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

import { Injectable, NgModuleFactory } from '@angular/core';
import { PluginLoaderService } from './plugin-loader.service';
import { PLUGIN_EXTERNALS_MAP } from './plugin-externals';
import { PluginsConfigProvider } from './plugins-config.provider';

@Injectable({
    providedIn: 'root'
})
export class DefaultPluginLoaderService extends PluginLoaderService {
    constructor(private configProvider: PluginsConfigProvider) {
        super();
    }

    provideExternals() {
        Object.keys(PLUGIN_EXTERNALS_MAP).forEach(externalKey =>
            window.define(
                externalKey,
                [],
                () => PLUGIN_EXTERNALS_MAP[externalKey]
            )
        );
    }

    load<T>(pluginName: string): Promise<NgModuleFactory<T>> {
        const { config } = this.configProvider;
        if (!config[pluginName]) {
            throw Error(`Can't find appropriate plugin`);
        }

        const depsPromises = (config[pluginName].deps || []).map(dep => {
            return window.System.import(config[dep].path).then(m => {
                window['define'](dep, [], () => m.default);
            });
        });

        return Promise.all(depsPromises).then(() => {
            return window.System
                .import(config[pluginName].path)
                .then(module => module.default.default);
        });
    }
}
