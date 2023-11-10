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

export class RequestSortDefinitionInner {
    /**
     * How to order - using a field, when position of the document in the index, score/relevance.
     */
    type?: RequestSortDefinitionInner.TypeEnum | string;
    /**
     * The name of the field
     */
    field?: string;
    /**
     * The sort order. (The ordering of nulls is determined by the SOLR configuration)
     */
    ascending?: boolean;

    constructor(input?: Partial<RequestSortDefinitionInner>) {
        if (input) {
            Object.assign(this, input);
        }
    }

}
export namespace RequestSortDefinitionInner {
    export type TypeEnum = 'FIELD' | 'DOCUMENT' | 'SCORE';
    export const TypeEnum = {
        FIELD: 'FIELD' as TypeEnum,
        DOCUMENT: 'DOCUMENT' as TypeEnum,
        SCORE: 'SCORE' as TypeEnum
    };
}
