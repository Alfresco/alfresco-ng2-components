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

import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { AuditApi, AuditAppPaging, AuditApp, AuditBodyUpdate, AuditEntryPaging, AuditEntryEntry } from '@alfresco/js-api';

@Injectable({
    providedIn: 'root'
})
export class AuditService {
    private _auditApi: AuditApi;
    get auditApi(): AuditApi {
        this._auditApi = this._auditApi ?? new AuditApi(this.apiService.getInstance());
        return this._auditApi;
    }

    constructor(private apiService: AlfrescoApiService) {}

    /**
     * Gets a list of audit applications.
     *
     * @param opts Options.
     * @returns a list of the audit applications.
     */
    getAuditApps(opts?: any): Observable<AuditAppPaging> {
        const defaultOptions = {
            skipCount: 0
        };
        const queryOptions = Object.assign({}, defaultOptions, opts);
        return from(this.auditApi.listAuditApps(queryOptions));
    }

    /**
     * Get audit application info.
     *
     * @param auditApplicationId The identifier of an audit application.
     * @param opts Options.
     * @returns status of an audit application.
     */
    getAuditApp(auditApplicationId: string, opts?: any): Observable<AuditApp> {
        const defaultOptions = {
            auditApplicationId
        };
        const queryOptions = Object.assign({}, defaultOptions, opts);
        return from(this.auditApi.getAuditApp(queryOptions));
    }

    /**
     * Update audit application info.
     *
     * @param auditApplicationId The identifier of an audit application.
     * @param auditAppBodyUpdate The audit application to update.
     * @param opts Options.
     * @returns audit application model
     */
    updateAuditApp(auditApplicationId: string, auditAppBodyUpdate: boolean, opts?: any): Observable<AuditApp | any> {
        const defaultOptions = {};
        const queryOptions = Object.assign({}, defaultOptions, opts);
        return from(this.auditApi.updateAuditApp(auditApplicationId, new AuditBodyUpdate({ isEnabled: auditAppBodyUpdate }), queryOptions));
    }

    /**
     * List audit entries for an audit application.
     *
     * @param auditApplicationId The identifier of an audit application.
     * @param opts Options.
     * @returns a list of audit entries.
     */
    getAuditEntries(auditApplicationId: string, opts?: any): Observable<AuditEntryPaging> {
        const defaultOptions = {
            skipCount: 0,
            maxItems: 100
        };
        const queryOptions = Object.assign({}, defaultOptions, opts);
        return from(this.auditApi.listAuditEntriesForAuditApp(auditApplicationId, queryOptions));
    }

    /**
     * Get audit entry.
     *
     * @param auditApplicationId The identifier of an audit application.
     * @param auditEntryId The identifier of an audit entry.
     * @param opts Options.
     * @returns audit entry.
     */
    getAuditEntry(auditApplicationId: string, auditEntryId: string, opts?: any): Observable<AuditEntryEntry> {
        const defaultOptions = {};
        const queryOptions = Object.assign({}, defaultOptions, opts);
        return from(this.auditApi.getAuditEntry(auditApplicationId, auditEntryId, queryOptions));
    }

    /**
     * List audit entries for a node.
     *
     * @param nodeId The identifier of a node.
     * @param opts Options.
     * @returns audit entry list
     */
    getAuditEntriesForNode(nodeId: string, opts?: any): Observable<AuditEntryPaging> {
        const defaultOptions = {
            nodeId
        };
        const queryOptions = Object.assign({}, defaultOptions, opts);
        return from(this.auditApi.listAuditEntriesForNode(queryOptions));
    }

    /**
     * Permanently delete audit entries for an audit application.
     *
     * @param auditApplicationId The identifier of an audit application.
     * @param where Audit entries to permanently delete for an audit application, given an inclusive time period or range of ids.
     * @returns void operation
     */
    deleteAuditEntries(auditApplicationId: string, where: string): Observable<any> {
        return from(this.auditApi.deleteAuditEntriesForAuditApp(auditApplicationId, where));
    }

    /**
     * Permanently delete an audit entry.
     *
     * @param auditApplicationId The identifier of an audit application.
     * @param auditEntryId The identifier of an audit entry.
     * @returns void operation
     */
    deleteAuditEntry(auditApplicationId: string, auditEntryId: string): Observable<any> {
        return from(this.auditApi.deleteAuditEntry(auditApplicationId, auditEntryId));
    }
}
