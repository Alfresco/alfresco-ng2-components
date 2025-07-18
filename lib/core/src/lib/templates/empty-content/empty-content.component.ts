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

import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../../icon';

@Component({
    selector: 'adf-empty-content',
    imports: [TranslatePipe, IconComponent],
    templateUrl: './empty-content.component.html',
    styleUrls: ['./empty-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-empty-content' }
})
export class EmptyContentComponent {
    /** Material Icon to use. */
    @Input()
    icon = 'cake';

    /** String or Resource Key for the title. */
    @Input()
    title = '';

    /** String or Resource Key for the subtitle. */
    @Input()
    subtitle = '';
}
