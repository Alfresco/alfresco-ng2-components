/*!
 * @license
 * Copyright 2016 - 2018 Alfresco Software, Ltd.
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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActionRef, ContentActionRef, ContentActionType } from '../config/action.extensions';
import { ExtensionElement } from '../config/extension-element';
import { filterEnabled, getValue, mergeObjects, sortByOrder } from '../config/extension-utils';
import { ExtensionConfig } from '../config/extension.config';
import { RouteRef } from '../config/routing.extensions';
import { RuleRef } from '../config/rule.extensions';

@Injectable({
    providedIn: 'root'
})
export class ExtensionLoaderService {
    constructor(private http: HttpClient) {}

    load(configPath: string, pluginsPath: string): Promise<ExtensionConfig> {
        return new Promise<any>(resolve => {
            this.loadConfig(configPath, 0).then(result => {
                let config = result.config;

                const override = sessionStorage.getItem('aca.extension.config');
                if (override) {
                    console.log('overriding extension config');
                    config = JSON.parse(override);
                }

                const externalPlugins =
                    localStorage.getItem('experimental.external-plugins') ===
                    'true';

                if (
                    externalPlugins &&
                    config.$references &&
                    config.$references.length > 0
                ) {
                    const plugins = config.$references.map((name, idx) =>
                        this.loadConfig(`${pluginsPath}/${name}`, idx)
                    );

                    Promise.all(plugins).then(results => {
                        const configs = results
                            .filter(entry => entry)
                            .sort(sortByOrder)
                            .map(entry => entry.config);

                        if (configs.length > 0) {
                            config = mergeObjects(config, ...configs);
                        }

                        resolve(config);
                    });
                } else {
                    resolve(config);
                }
            });
        });
    }

    protected loadConfig(
        url: string,
        order: number
    ): Promise<{ order: number; config: ExtensionConfig }> {
        return new Promise(resolve => {
            this.http.get<ExtensionConfig>(url).subscribe(
                config => {
                    resolve({
                        order,
                        config
                    });
                },
                error => {
                    console.log(error);
                    resolve(null);
                }
            );
        });
    }

    getElements<T extends ExtensionElement>(
        config: ExtensionConfig,
        key: string,
        fallback: Array<T> = []
    ): Array<T> {
        const values = getValue(config, key) || fallback || [];
        return values.filter(filterEnabled).sort(sortByOrder);
    }

    getContentActions(
        config: ExtensionConfig,
        key: string
    ): Array<ContentActionRef> {
        return this.getElements(config, key).map(this.setActionDefaults);
    }

    getRules(config: ExtensionConfig): Array<RuleRef> {
        if (config && config.rules) {
            return config.rules;
        }
        return [];
    }

    getRoutes(config: ExtensionConfig): Array<RouteRef> {
        if (config) {
            return config.routes || [];
        }
        return [];
    }

    getActions(config: ExtensionConfig): Array<ActionRef> {
        if (config) {
            return config.actions || [];
        }
        return [];
    }

    protected setActionDefaults(action: ContentActionRef): ContentActionRef {
        if (action) {
            action.type = action.type || ContentActionType.default;
            action.icon = action.icon || 'extension';
        }
        return action;
    }
}
