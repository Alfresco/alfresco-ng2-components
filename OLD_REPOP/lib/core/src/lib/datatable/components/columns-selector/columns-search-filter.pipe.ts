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

import { inject, Pipe, PipeTransform } from '@angular/core';
import { DataColumn } from '../../data/data-column.model';
import { TranslationService } from '../../../translation';

@Pipe({
    name: 'columnsSearchFilter'
})
export class ColumnsSearchFilterPipe implements PipeTransform {
    private translationService = inject(TranslationService);

    transform(columns: DataColumn[], searchByName: string): DataColumn[] {
        const result = [];

        for (const column of columns) {
            if (!column.title) {
                continue;
            }

            if (!searchByName) {
                result.push(column);
                continue;
            }

            const title = this.translationService.instant(column.title);

            if (this.filterString(title, searchByName)) {
                result.push(column);
            }
        }

        return result;
    }

    private filterString(value: string = '', filterBy: string = ''): string {
        const testResult = filterBy ? value.toLowerCase().indexOf(filterBy.toLowerCase()) > -1 : true;
        return testResult ? value : '';
    }
}
