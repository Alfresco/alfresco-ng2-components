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
import { PreviewService } from '../../services/preview.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'bob-preview.component.html'
})
export class BlobPreviewComponent {
    content: Blob;
    name: string;

    constructor(preview: PreviewService, router: Router) {
        if (preview.content === null || preview.name === null) {
            router.navigate([{ outlets: { overlay: null } }]);
            return;
        }

        this.content = preview.content;
        this.name = preview.name;
    }
}
