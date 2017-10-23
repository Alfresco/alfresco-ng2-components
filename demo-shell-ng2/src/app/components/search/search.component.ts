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

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'search-component',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent {

    fileNodeId: string;
    fileShowed: boolean = false;

    constructor(public router: Router) {
    }

    nodeDbClick($event: any) {
        if ($event.value.entry.isFolder) {
            this.router.navigate(['/files', $event.value.entry.id]);
        } else {
            this.showFile($event);
        }
    }

    showFile($event) {
        if ($event.value.entry.isFile) {
            this.fileNodeId = $event.value.entry.id;
            this.fileShowed = true;
        } else {
            this.fileShowed = false;
        }
    }
}
