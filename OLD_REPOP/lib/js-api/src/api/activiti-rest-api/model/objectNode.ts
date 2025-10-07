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

export interface ObjectNode {
    array?: boolean;
    bigDecimal?: boolean;
    bigInteger?: boolean;
    binary?: boolean;
    // eslint-disable-next-line id-blacklist
    boolean?: boolean;
    containerNode?: boolean;
    double?: boolean;
    float?: boolean;
    floatingPointNumber?: boolean;
    int?: boolean;
    integralNumber?: boolean;
    long?: boolean;
    missingNode?: boolean;
    nodeType?: 'ARRAY' | 'BINARY' | 'BOOLEAN' | 'MISSING' | 'NULL' | 'NUMBER' | 'OBJECT' | 'POJO' | 'STRING';
    null?: boolean;
    // eslint-disable-next-line id-blacklist
    number?: boolean;
    object?: boolean;
    pojo?: boolean;
    short?: boolean;
    textual?: boolean;
    valueNode?: boolean;
}
