/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { DateCellComponent } from './date-cell.component';
import { Subject } from 'rxjs';

describe('DataTableCellComponent', () => {
    it('should use medium format by default', () => {
        const component = new DateCellComponent(null, null);
        expect(component.format).toBe('medium');
    });

    it('should use column format', () => {
        const component = new DateCellComponent(null, <any> {
            nodeUpdated: new Subject<any>()
        });
        component.column = {
            key: 'created',
            type: 'date',
            format: 'longTime'
        };

        component.ngOnInit();
        expect(component.format).toBe('longTime');
    });
});
