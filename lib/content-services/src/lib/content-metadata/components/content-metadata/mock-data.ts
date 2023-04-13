/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

export const mockGroupProperties = [
    {
        title: 'EXIF',
        properties: [
            {
                label: 'Image Width',
                value: 363,
                key: 'properties.exif:pixelXDimension',
                default: null,
                editable: true,
                clickable: false,
                icon: '',
                data: null,
                type: 'int',
                multiline: false,
                pipes: [],
                clickCallBack: null,
                displayValue: 400
            },
            {
                label: 'Image Height',
                value: 400,
                key: 'properties.exif:pixelYDimension',
                default: null,
                editable: true,
                clickable: false,
                icon: '',
                data: null,
                type: 'int',
                multiline: false,
                pipes: [],
                clickCallBack: null,
                displayValue: 400
            }
        ]
    },
    {
        title: 'CUSTOM',
        properties: [
            {
                label: 'Height',
                value: 400,
                key: 'properties.custom:abc',
                default: null,
                editable: true,
                clickable: false,
                icon: '',
                data: null,
                type: 'int',
                multiline: false,
                pipes: [],
                clickCallBack: null,
                displayValue: 400
            }
        ]
    }
];
