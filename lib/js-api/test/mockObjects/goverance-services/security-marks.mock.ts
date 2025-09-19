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

export class SecurityMarkApiMock extends BaseMock {
    get200GetSecurityMark(securityGroupId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/public/gs/versions/1/security-groups/' + securityGroupId + '/security-marks')
            .reply(200, {
                list: {
                    pagination: {
                        count: 1,
                        hasMoreItems: false,
                        totalItems: 1,
                        skipCount: 0,
                        maxItems: 100
                    },
                    entries: [
                        {
                            entry: {
                                groupId: securityGroupId,
                                name: 'SecurityMarkTest',
                                id: 'Sh1G8vTQ'
                            }
                        }
                    ]
                }
            });
    }

    createSecurityMark200Response(securityGroupId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .post('/alfresco/api/-default-/public/gs/versions/1/security-groups/' + securityGroupId + '/security-marks')
            .reply(200, {
                entry: {
                    groupId: securityGroupId,
                    name: 'SecurityMarkTest',
                    id: 'Sh1G8vTQ'
                }
            });
    }
    createSecurityMarks200Response(securityGroupId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .post('/alfresco/api/-default-/public/gs/versions/1/security-groups/' + securityGroupId + '/security-marks')
            .reply(200, {
                list: {
                    pagination: {
                        count: 2,
                        hasMoreItems: false,
                        totalItems: 2,
                        skipCount: 0,
                        maxItems: 100
                    },
                    entries: [
                        {
                            entry: {
                                groupId: securityGroupId,
                                name: 'SecurityMark3',
                                id: 'KsnOlXVM'
                            }
                        },
                        {
                            entry: {
                                groupId: securityGroupId,
                                name: 'SecurityMark4',
                                id: 'wFYkG8CV'
                            }
                        }
                    ]
                }
            });
    }
    get200GetSingleSecurityMark(securityGroupId: string, securityMarkId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/public/gs/versions/1/security-groups/' + securityGroupId + '/security-marks/' + securityMarkId)
            .reply(200, {
                entry: {
                    groupId: securityGroupId,
                    name: 'SecurityMarkTest',
                    id: securityMarkId
                }
            });
    }
    put200UpdateSecurityMarkResponse(securityGroupId: string, securityMarkId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .put('/alfresco/api/-default-/public/gs/versions/1/security-groups/' + securityGroupId + '/security-marks/' + securityMarkId)
            .reply(200, {
                entry: {
                    groupId: securityGroupId,
                    name: 'AlfrescoSecurityMark',
                    id: securityMarkId
                }
            });
    }
    getDeleteSecurityMarkSuccessfulResponse(securityGroupId: string, securityMarkId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .delete('/alfresco/api/-default-/public/gs/versions/1/security-groups/' + securityGroupId + '/security-marks/' + securityMarkId)
            .reply(200);
    }
    get401Response(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/public/gs/versions/1/security-groups/')
            .reply(401, {
                error: {
                    errorKey: 'framework.exception.ApiDefault',
                    statusCode: 401,
                    briefSummary: '05210059 Authentication failed for Web Script org/alfresco/api/ResourceWebScript.get',
                    stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
                    descriptionURL: 'https://api-explorer.alfresco.com'
                }
            });
    }
}
