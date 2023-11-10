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

/**
 * Query.
 */
export class RequestQuery {
    /**
     * The query language in which the query is written.
     */
    language?: RequestQuery.LanguageEnum | string;
    /**
     * The exact search request typed in by the user
     */
    userQuery?: string;
    /**
     * The query which may have been generated in some way from the userQuery
     */
    query: string;

    constructor(input?: Partial<RequestQuery>) {
        if (input) {
            Object.assign(this, input);
        }
    }
}
export namespace RequestQuery {
    export type LanguageEnum = 'afts' | 'lucene' | 'cmis';
    export const LanguageEnum = {
        Afts: 'afts' as LanguageEnum,
        Lucene: 'lucene' as LanguageEnum,
        Cmis: 'cmis' as LanguageEnum
    };
}
