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

export class ModelsMock extends BaseMock {
    get200getModels(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/activiti-app/api/enterprise/models')
            .query({ filter: 'myReusableForms', modelType: '2' })
            .reply(200, {
                size: 1,
                total: 1,
                start: 0,
                data: [
                    {
                        id: 1,
                        name: 'Metadata',
                        description: '',
                        createdBy: 1,
                        createdByFullName: ' Administrator',
                        lastUpdatedBy: 1,
                        lastUpdatedByFullName: ' Administrator',
                        lastUpdated: '2016-08-05T17:39:22.750+0000',
                        latestVersion: true,
                        version: 2,
                        comment: null,
                        stencilSet: null,
                        referenceId: null,
                        modelType: 2,
                        favorite: null,
                        permission: 'write',
                        tenantId: 1
                    }
                ]
            });
    }
}
