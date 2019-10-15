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

import { Injectable, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { Directionality, Direction } from '@angular/cdk/bidi';
import { UserPreferencesService } from '../services/user-preferences.service';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class DirectionalityConfigService {
    constructor(
        @Inject(DOCUMENT) private document: any,
        private rendererFactory: RendererFactory2,
        private userPreferencesService: UserPreferencesService,
        private directionality: Directionality
    ) {
        const renderer: Renderer2 = this.rendererFactory.createRenderer(null, null);

        this.userPreferencesService
            .select('textOrientation')
            .subscribe((direction: Direction) => {
                renderer.setAttribute(this.document.body, 'dir', direction);
                (<any> this.directionality).value = direction;
            });
    }
}
