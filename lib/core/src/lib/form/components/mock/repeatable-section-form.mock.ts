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

export const repeatableSectionForm = (required: boolean = false, initialNumberOfRows: number = 2) => ({
    id: 'repeatable-form',
    fields: [
        {
            id: 'RepeatableSection0lp64g',
            name: 'Repeatable Section',
            type: 'repeatable-section',
            numberOfColumns: 1,
            params: { initialNumberOfRows, allowInitialRowsDelete: true, maxNumberOfRows: null },
            fields: {
                '1': [
                    {
                        id: 'section',
                        name: 'Section',
                        type: 'section',
                        numberOfColumns: 1,
                        fields: { '1': [{ id: 'Text0bere0', name: 'Text', type: 'text', required }] }
                    }
                ]
            }
        }
    ]
});
