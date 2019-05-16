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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActionRef, ContentActionRef, ContentActionType } from '../config/action.extensions';
import { ExtensionElement } from '../config/extension-element';
import { filterEnabled, getValue, mergeObjects, sortByOrder } from '../config/extension-utils';
import { ExtensionConfig, ExtensionRef } from '../config/extension.config';
import { RouteRef } from '../config/routing.extensions';
import { RuleRef } from '../config/rule.extensions';

@Injectable({
    providedIn: 'root'
})
export class ExtensionLoaderService {
    constructor(private http: HttpClient) {
    }

    load(configPath: string, pluginsPath: string, extensions?: ExtensionConfig[]): Promise<ExtensionConfig> {
        return new Promise<any>((resolve) => {
            this.loadConfig(configPath, 0).then((result) => {
                if (result) {
                    let config = result.config;

                    const override = sessionStorage.getItem('app.extension.config');
                    if (override) {
                        config = JSON.parse(override);
                    }

                    if (config.$references && config.$references.length > 0) {
                        const plugins = config.$references.map((name, idx) =>
                            this.loadConfig(`${pluginsPath}/${name}`, idx)
                        );

                        Promise.all(plugins).then((results) => {
                            const configs = results
                                .filter((entry) => entry)
                                .sort(sortByOrder)
                                .map((entry) => entry.config);

                            if (extensions && extensions.length > 0) {
                                configs.push(...extensions);
                            }

                            if (configs.length > 0) {
                                config = mergeObjects(config, ...configs);
                            }

                            config = {
                                ...config,
                                ...this.getMetadata(result.config),
                                $references: configs.map((ext) => this.getMetadata(ext))
                            };

                            resolve(config);
                        });
                    } else {
                        resolve(config);
                    }
                }
            });
        });
    }

    protected getMetadata(config: ExtensionConfig): ExtensionRef {
        const result: any = {};

        Object
            .keys(config)
            .filter((key) => key.startsWith('$'))
            .forEach((key) => {
                result[key] = config[key];
            });

        return result;
    }

    protected loadConfig(
        url: string,
        order: number
    ): Promise<{ order: number; config: ExtensionConfig }> {
        return new Promise((resolve) => {
            this.http.get<ExtensionConfig>(url).subscribe(
                (config) => {
                    resolve({
                        order,
                        config
                    });
                },
                () => {
                    resolve(null);
                }
            );
        });
    }

    /**
     * Retrieves configuration elements.
     * Filters element by **enabled** and **order** attributes.
     * Example:
     *  `getElements<ViewerExtensionRef>(config, 'features.viewer.content')`
     */
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

    getFeatures(config: ExtensionConfig): any {
        if (config) {
            return config.features || [];
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
