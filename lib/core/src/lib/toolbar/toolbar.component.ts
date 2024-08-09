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

import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { ToolbarTitleComponent } from './toolbar-title.component';
import { ToolbarDividerComponent } from './toolbar-divider.component';

@Component({
    selector: 'adf-toolbar',
    standalone: true,
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [MatToolbarModule, TranslateModule, NgIf, ToolbarTitleComponent, ToolbarDividerComponent],
    host: { class: 'adf-toolbar' }
})
export class ToolbarComponent {
    /** Toolbar title. */
    @Input()
    title: string = '';

    /** Toolbar color. Can be changed to empty value (default), `primary`, `accent` or `warn`. */
    @Input()
    color: ThemePalette;
}
