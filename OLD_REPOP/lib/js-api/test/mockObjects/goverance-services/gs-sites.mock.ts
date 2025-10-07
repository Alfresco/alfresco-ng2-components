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

import nock from 'nock';
import { BaseMock } from '../base.mock';

export class GsSitesApiMock extends BaseMock {
    get200Response(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/public/gs/versions/1/gs-sites/rm')
            .reply(200, {
                entry: {
                    role: 'SiteManager',
                    visibility: 'PUBLIC',
                    compliance: 'STANDARD',
                    guid: 'fd870d47-57a0-46f7-83c8-c523a4da13c4',
                    description: 'Records Management Description Test',
                    id: 'rm',
                    title: 'Records Management'
                }
            });
    }
}
