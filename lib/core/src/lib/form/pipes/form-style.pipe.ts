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

import { Pipe, PipeTransform } from '@angular/core';
import { ThemeModel } from '../components/widgets/core/theme.model';

@Pipe({
    name: 'adfFormStyle',
    standalone: true
})
export class FormStylePipe implements PipeTransform {
    transform(formTheme?: ThemeModel): string {
        const theme = formTheme?.form;
        return theme ? this.flattenStyles(theme) : '';
    }

    private flattenStyles(styles: { [key: string]: string }): string {
        return Object.entries(styles)
            .map(([key, value]) => `${key}: ${value}`)
            .join(';');
    }
}
