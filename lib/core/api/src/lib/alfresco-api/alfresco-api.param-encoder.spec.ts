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

import { AlfrescoApiParamEncoder } from './alfresco-api.param-encoder';

describe('AlfrescoApiParamEncoder', () => {
    it('should propely encode special "+" character', () => {
        const encoder = new AlfrescoApiParamEncoder();
        const value = '2022-08-17T00:00:00.000+02:00';
        const encodeValue = '2022-08-17T00%3A00%3A00.000%2B02%3A00';

        expect(encoder.encodeValue(value)).toBe(encodeValue);
        expect(encoder.decodeValue(encodeValue)).toBe(value);
    });
});
