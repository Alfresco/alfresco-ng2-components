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

import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'adf-viewer-unknown-format',
    standalone: true,
    templateUrl: './unknown-format.component.html',
    styleUrls: ['./unknown-format.component.scss'],
    imports: [MatIconModule, TranslatePipe],
    encapsulation: ViewEncapsulation.None
})
export class UnknownFormatComponent {
    /** Custom error message to be displayed . */
    @Input()
    customError: string;
}
