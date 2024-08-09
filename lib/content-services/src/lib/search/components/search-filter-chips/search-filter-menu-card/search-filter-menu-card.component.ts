/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'adf-search-filter-menu-card',
    standalone: true,
    imports: [CommonModule, MatButtonModule, TranslateModule, MatIconModule, MatDividerModule],
    templateUrl: './search-filter-menu-card.component.html',
    styleUrls: ['./search-filter-menu-card.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchFilterMenuCardComponent {
    @Output()
    close = new EventEmitter();

    onClose() {
        this.close.emit();
    }
}
