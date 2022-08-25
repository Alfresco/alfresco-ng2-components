/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { Observable, Subject, of } from 'rxjs';
import { BpmProductVersionModel } from '../models/product-version.model';
import {
    RepositoryInfo,
    SystemPropertiesRepresentation
} from '@alfresco/js-api';

@Injectable({
    providedIn: 'root'
})
export class DiscoveryApiServiceMock {

    /**
     * Gets product information for Content Services.
     */
    ecmProductInfo$ = new Subject<RepositoryInfo>();

    public getEcmProductInfo(): Observable<RepositoryInfo | any> {
        return of({
            edition: 'Enterprise',
            version: {
                major: '7',
                minor: '2',
                patch: '0',
                hotfix: '0',
                schema: 16000,
                label: 'rde8705d0-blocal',
                display: '7.2.0.0 (rde8705d0-blocal) schema 16000'
            },
            license: {
                issuedAt: '2021-11-10T23:30:30.234+0000',
                expiresAt: '2021-11-12T00:00:00.000+0000',
                remainingDays: 1,
                holder: 'Trial User',
                mode: 'ENTERPRISE',
                entitlements: { isClusterEnabled: true, isCryptodocEnabled: false }
            },
            status: {
                isReadOnly: false,
                isAuditEnabled: true,
                isQuickShareEnabled: true,
                isThumbnailGenerationEnabled: true,
                isDirectAccessUrlEnabled: true
            },
            modules: [{
                id: 'org_alfresco_module_rm',
                title: 'AGS Repo',
                description: 'Alfresco Governance Services Repository Extension',
                version: '14.26',
                installState: 'UNKNOWN',
                versionMin: '7.0.0',
                versionMax: '999'
            }, {
                id: 'org_alfresco_integrations_S3Connector',
                title: 'S3 Connector',
                description: 'Provides Amazon S3 content storage for the contentstore and deleted contentstore',
                version: '5.0.0-A1',
                installDate: '2021-11-10T23:29:19.560+0000',
                installState: 'INSTALLED',
                versionMin: '7.2',
                versionMax: '999'
            }, {
                id: 'alfresco-trashcan-cleaner',
                title: 'alfresco-trashcan-cleaner project',
                description: 'The Alfresco Trashcan Cleaner (Alfresco Module)',
                version: '2.4.1',
                installState: 'UNKNOWN',
                versionMin: '0',
                versionMax: '999'
            }, {
                id: 'alfresco-content-connector-for-salesforce-repo',
                title: 'Alfresco Content Connector for Salesforce Repository AMP',
                description: 'Alfresco Repository artifacts needed for the Alfresco Content Connector for Salesforce Repository Amp',
                version: '2.3.0.3',
                installDate: '2021-11-10T23:29:18.918+0000',
                installState: 'INSTALLED',
                versionMin: '6.2.0',
                versionMax: '999'
            }]
        });
    }

    public getBpmProductInfo(): Observable<BpmProductVersionModel> {
        return of({
            revisionVersion: '0-RC1',
            edition: 'Alfresco Process Services (powered by Activiti)',
            type: 'bpmSuite',
            majorVersion: '2',
            minorVersion: '1'
        });
    }

    public getBPMSystemProperties(): Observable<SystemPropertiesRepresentation> {
        return of({} as any);
    }
}
