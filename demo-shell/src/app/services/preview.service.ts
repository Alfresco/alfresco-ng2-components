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
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PreviewService {

    public content: Blob = null;
    public name: string = null;

    constructor(private router: Router) {}

    showResource(resourceId, versionId?): void {
        if (versionId) {
            this.router.navigate([{outlets: {overlay: ['files', resourceId, versionId, 'view']}}]);
        } else {
            this.router.navigate([{outlets: {overlay: ['files', resourceId, 'view']}}]);
        }
    }

    showBlob(name: string, content: Blob): void {
        this.name = name;
        this.content = content;
        this.router.navigate([{ outlets: { overlay: ['preview', 'blob'] } }]);
    }
}
