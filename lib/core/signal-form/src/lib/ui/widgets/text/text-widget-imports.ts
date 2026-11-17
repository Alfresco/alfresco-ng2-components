/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { SignalInputMaskDirective } from '../../controls/input-mask.directive';
import { SignalFieldErrorComponent } from '../field-error/field-error.component';
import { SignalLeftLabelComponent } from '../left-label/left-label.component';

export const TEXT_WIDGET_IMPORTS = [
    FormField,
    MatFormFieldModule,
    MatInputModule,
    TranslatePipe,
    SignalInputMaskDirective,
    SignalLeftLabelComponent,
    SignalFieldErrorComponent
];
