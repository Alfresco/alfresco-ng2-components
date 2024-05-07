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

import { Component } from '@angular/core';
import { FlagsComponent } from './flags/flags.component';

@Component({
    /* eslint-disable-next-line @angular-eslint/component-selector */
    selector: 'feature-flags-wrapper',
    standalone: true,
    imports: [FlagsComponent],
    template: `<adf-feature-flags-overrides class="feature-flags-overrides"></adf-feature-flags-overrides>`,
    styles: [
        `
            :host {
                display: flex;
                justify-content: center;
                width: 100%;
                height: 100%;
            }

            .feature-flags-overrides {
                width: 100%;
            }
        `
    ]
})
export class FeatureFlagsWrapperComponent {}
