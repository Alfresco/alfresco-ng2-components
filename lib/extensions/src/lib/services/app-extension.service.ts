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

@Injectable({
    providedIn: 'root'
})
export class AppExtensionService {
    private _references = new BehaviorSubject<ExtensionRef[]>([]);

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
            .filter((entry) => typeof entry === 'object')
            .map((entry) => <ExtensionRef> entry);
        this._references.next(references);
    }
}
