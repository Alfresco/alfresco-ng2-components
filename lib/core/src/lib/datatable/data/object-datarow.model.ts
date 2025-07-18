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

import { ObjectUtils } from '../../common/utils';
import { DataRow } from './data-row.model';

// Simple implementation of the DataRow interface.
export class ObjectDataRow implements DataRow {
    constructor(private obj: any, public isSelected: boolean = false, public isSelectable: boolean = true) {
        if (!obj) {
            throw new Error('Object source not found');
        }
    }

    getSourceObject(): any {
        return this.obj;
    }

    getValue(key: string): any {
        return ObjectUtils.getValue(this.obj, key);
    }

    hasValue(key: string): boolean {
        return this.getValue(key) !== undefined;
    }

    imageErrorResolver(): string {
        return '';
    }
}
