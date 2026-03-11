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
import { FieldStylePipe } from '../../../pipes/field-style.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { ContainerModel } from '../core/container.model';
import { IconModule } from '../../../../icon/icon.module';

@Component({
    selector: 'adf-repeat-widget',
    templateUrl: './repeat.widget.html',
    styleUrls: ['./repeat.widget.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [FieldStylePipe, IconModule, MatButtonModule, TranslatePipe]
})
export class RepeatWidgetComponent {
    @Input() element: ContainerModel;
    @Input() isEditor: boolean = true;

    addRow() {
        this.element.field.addRow(this.element.json.fields, this.element.form);
    }
}
