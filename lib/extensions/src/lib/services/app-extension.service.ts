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

import { Injectable } from '@angular/core';
import { ExtensionConfig, ExtensionRef } from '../config/extension.config';
import { ExtensionService } from '../services/extension.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { ViewerExtensionRef } from '../config/viewer.extensions';
import { DocumentListPresetRef } from '../config/document-list.extensions';

@Injectable({
    providedIn: 'root'
})
export class AppExtensionService {
    references$: Observable<ExtensionRef[]>;
    private _references = new BehaviorSubject<ExtensionRef[]>([]);

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
            .filter((entry) => typeof entry === 'object')
            .map((entry) => entry as ExtensionRef);
        this._references.next(references);
    }

    /**
     * Provides a collection of document list columns for the particular preset.
     * The result is filtered by the **disabled** state.
     *
     * @param key Preset key.
     */
    getDocumentListPreset(key: string): DocumentListPresetRef[] {
        return this.extensionService
          .getElements<DocumentListPresetRef>(
            `features.documentList.${key}`
          )
          .filter((entry) => !entry.disabled);
    }

    /**
     * Provides a list of the Viewer content extensions,
     * filtered by **disabled** state and **rules**.
     */
    getViewerExtensions(): ViewerExtensionRef[] {
        return this.extensionService
            .getElements<ViewerExtensionRef>('features.viewer.content')
            .filter((extension) => !this.isViewerExtensionDisabled(extension));
    }

    protected isViewerExtensionDisabled(extension: ViewerExtensionRef): boolean {
        if (extension) {
          if (extension.disabled) {
            return true;
          }

          if (extension.rules && extension.rules.disabled) {
            return this.extensionService.evaluateRule(extension.rules.disabled);
          }
        }

        return false;
    }
}
