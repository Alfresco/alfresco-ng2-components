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

export const displayTextSchema = {
    // proposition:
    // general: [
    // {
    //     name: 'ADV_FORM_EDITOR.FIELD_PROPERTIES.LABEL',
    //     type: 'string'
    // }
    // ],
    theme: [
        {
            name: 'Font size', // todo - translation key
            fieldVariableName: '--adf-readonly-text-font-size',
            formVariableName: '--adf-form-label-font-size'
        },
        {
            name: 'Font family', // todo - translation key
            fieldVariableName: '--adf-readonly-text-font-family',
            formVariableName: '--adf-form-label-font-family'
        },
        {
            name: 'Font weight', // todo - translation key
            fieldVariableName: '--adf-readonly-text-font-weight',
            formVariableName: '--adf-form-label-font-weight'
        },
        {
            name: 'Text decoration', // todo - translation key
            fieldVariableName: '--adf-readonly-text-text-decoration',
            formVariableName: '--adf-form-label-text-decoration'
        },
        {
            name: 'Text color', // todo - translation key
            fieldVariableName: '--adf-readonly-text-color',
            formVariableName: '--adf-form-label-color'
        }
    ]
};
