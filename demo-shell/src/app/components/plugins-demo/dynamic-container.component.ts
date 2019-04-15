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

import { Component } from '@angular/core';

@Component({
    selector: 'app-dynamic-container',
    template: `
        <h1>Dynamic Container</h1>
        <p>Displaying the <strong>entry</strong> component loaded from the <strong>plugin1</strong> plugin.</p>
        <div>
            <adf-dynamic-container
                pluginId="plugin1"
                componentId="entry">
            </adf-dynamic-container>
        </div>
    `
})
export class AppDynamicContainerComponent {

}
