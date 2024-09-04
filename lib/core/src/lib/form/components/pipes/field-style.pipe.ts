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

import { inject, Pipe, PipeTransform } from '@angular/core';
import { FormFieldModel } from '../widgets/core/form-field.model';
import { FormStyleService } from '../../services/form-style.service';

@Pipe({
    name: 'adfFieldStyle',
    standalone: true
})
export class FieldStylePipe implements PipeTransform {
    private readonly widgetStyleService = inject(FormStyleService);

    transform(field: FormFieldModel): string {
        return this.widgetStyleService.getFieldStyle(field.type, field.style, field.form?.theme);
    }
}
