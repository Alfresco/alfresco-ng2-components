/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NodeEntry } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { NodeDownloadDirective } from '../../../directives/node-download.directive';

@Component({
    selector: 'adf-file-auto-download',
    imports: [CommonModule, MatDialogModule, TranslatePipe, MatButtonModule, NodeDownloadDirective],
    templateUrl: './file-auto-download.component.html'
})
export class FileAutoDownloadComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public node: NodeEntry) {}
}
