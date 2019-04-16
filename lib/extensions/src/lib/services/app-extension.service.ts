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

import { Injectable } from '@angular/core';
import { ExtensionConfig, ExtensionRef } from '../config/extension.config';
import { ExtensionService } from '../services/extension.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { ViewerExtensionRef } from '../config/viewer.extensions';
import { DocumentListPresetRef } from '../config/document-list.extensions';
import { Route } from '@angular/router';
import { DynamicRouteContentComponent } from '../components/dynamic-route-content/dynamic-route-content.component';

@Injectable({
    providedIn: 'root'
})
export class AppExtensionService {
    private _references = new BehaviorSubject<ExtensionRef[]>([]);

    defaults = {
        layout: 'app.layout.main',
        auth: ['app.auth']
    };

    references$: Observable<ExtensionRef[]>;

    constructor(protected extensionService: ExtensionService) {
        this.references$ = this._references.asObservable();
    }

    async load() {
        const config = await this.extensionService.load();
        this.setup(config);
    }

    setup(config: ExtensionConfig) {
        if (!config) {
            return;
        }

        const references = (config.$references || [])
            .filter(entry => typeof entry === 'object')
            .map(entry => <ExtensionRef> entry);
        this._references.next(references);
    }

    /**
     * Provides a collection of document list columns for the particular preset.
     * The result is filtered by the **disabled** state.
     * @param key Preset key.
     */
    getDocumentListPreset(key: string) {
        return this.extensionService
            .getElements<DocumentListPresetRef>(`features.documentList.${key}`)
            .filter(entry => !entry.disabled);
    }

    /**
     * Provides a list of the Viewer content extensions,
     * filtered by **disabled** state and **rules**.
     */
    getViewerExtensions(): ViewerExtensionRef[] {
        return this.extensionService
            .getElements<ViewerExtensionRef>('features.viewer.content')
            .filter(extension => !this.isViewerExtensionDisabled(extension));
    }

    protected isViewerExtensionDisabled(
        extension: ViewerExtensionRef
    ): boolean {
        if (extension) {
            if (extension.disabled) {
                return true;
            }

            if (extension.rules && extension.rules.disabled) {
                return this.extensionService.evaluateRule(
                    extension.rules.disabled
                );
            }
        }

        return false;
    }

    /**
     * Returns an list of application routes populated by extensions.
     */
    getApplicationRoutes(): Array<Route> {
        return this.extensionService.routes.map(route => {
            const guards = this.extensionService.getAuthGuards(
                route.auth && route.auth.length > 0
                    ? route.auth
                    : this.defaults.auth
            );

            const isDynamicPlugin = route.component.includes('#');

            const component = isDynamicPlugin
                ? DynamicRouteContentComponent
                : this.extensionService.getComponentById(route.component);

            let data = route.data || {};

            if (isDynamicPlugin) {
                const [ pluginId, componentId] = route.component.split('#');
                data = {
                    ...route.data,
                    pluginId,
                    componentId
                };
            }

            return {
                path: route.path,
                component: this.extensionService.getComponentById(
                    route.layout || this.defaults.layout
                ),
                canActivateChild: guards,
                canActivate: guards,
                children: [
                    {
                        path: '',
                        component,
                        data
                    }
                ]
            };
        });
    }
}
