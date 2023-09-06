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
import { Router } from '@angular/router';
import { NodeEntry } from '@alfresco/js-api';
import { PreviewService } from '../../services/preview.service';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
    constructor(public router: Router, private preview: PreviewService) {}

    /**
     * Called when the user submits the search, e.g. hits enter or clicks submit
     *
     * @param event Parameters relating to the search
     */
    onSearchSubmit(event: KeyboardEvent) {
        const value = (event.target as HTMLInputElement).value;
        this.router.navigate([
            '/search',
            {
                q: value
            }
        ]);
    }

    onItemClicked(event: NodeEntry) {
        if (event.entry.isFile) {
            this.preview.showResource(event.entry.id);
        } else if (event.entry.isFolder) {
            this.router.navigate(['/files', event.entry.id]);
        }
    }
}
