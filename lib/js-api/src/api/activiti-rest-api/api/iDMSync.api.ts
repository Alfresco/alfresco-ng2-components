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

import { SyncLogEntryRepresentation } from '../model/syncLogEntryRepresentation';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
 * IDMSyncApi service.
 */
export class IDMSyncApi extends BaseApi {
    /**
     * Get log file for a sync log entry
     *
     * @param syncLogEntryId syncLogEntryId
     * @return Promise<{}>
     */
    getLogFile(syncLogEntryId: number): Promise<any> {
        throwIfNotDefined(syncLogEntryId, 'syncLogEntryId');

        const pathParams = {
            syncLogEntryId
        };

        return this.get({
            path: '/api/enterprise/idm-sync-log-entries/{syncLogEntryId}/logfile',
            pathParams
        });
    }

    /**
     * List sync log entries
     *
     * @param opts Optional parameters
     * @param opts.tenantId {number} tenantId
     * @param opts.page {number} page
     * @param opts.start {number} start
     * @param opts.size {number} size
     * @return Promise<SyncLogEntryRepresentation>
     */
    getSyncLogEntries(opts?: { tenantId?: number; page?: number; start?: number; size?: number }): Promise<SyncLogEntryRepresentation> {
        return this.get({
            path: '/api/enterprise/idm-sync-log-entries',
            queryParams: opts,
            returnType: SyncLogEntryRepresentation
        });
    }
}
