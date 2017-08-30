/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { Component, Input } from '@angular/core';

@Component({
    selector: 'adf-custom-sources-demo',
    templateUrl: 'custom-sources.component.html'
})
export class CustomSourcesComponent {

    @Input()
    selectedSource = '-recent-';

    sources = [
        { title: 'Favorites', value: '-favorites-' },
        { title: 'Recent', value: '-recent-' },
        { title: 'Shared Links', value: '-sharedlinks-' },
        { title: 'Sites', value: '-sites-' },
        { title: 'Trashcan', value: '-trashcan-' },
        { title: 'Root', value: '-root-' },
        { title: 'My', value: '-my-' },
        { title: 'Shared', value: '-shared-' }
    ];
}
