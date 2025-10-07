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

import { Pipe, PipeTransform } from '@angular/core';
import { FormFieldModel } from '../components/widgets/core/form-field.model';
import { ContainerModel } from '../components/widgets/core/container.model';
import { predefinedTheme } from '../components/widgets/core/predefined-theme';

@Pipe({
    name: 'adfFieldStyle'
})
export class FieldStylePipe implements PipeTransform {
    transform(field: FormFieldModel | ContainerModel): string {
        if (!field.style) {
            return '';
        }

        const themeStyle = field.form?.theme?.widgets[field.type]?.[field.style];
        const predefinedThemeStyle = predefinedTheme.widgets[field.type]?.[field.style];
        const styles = (themeStyle || predefinedThemeStyle)?.styles;

        return styles ? this.flattenStyles(styles) : '';
    }

    private flattenStyles(styles: { [key: string]: string }): string {
        return Object.entries(styles)
            .map(([key, value]) => `${key}:${value};`)
            .join('');
    }
}
