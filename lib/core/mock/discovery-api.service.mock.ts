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
import { from, Observable, throwError, Subject, of } from 'rxjs';
import { BpmProductVersionModel } from '../models/product-version.model';
import { AlfrescoApiService } from './alfresco-api.service';
import { catchError, map, switchMap, filter, take } from 'rxjs/operators';
import {
    AboutApi,
    DiscoveryApi,
    RepositoryInfo,
    SystemPropertiesApi,
    SystemPropertiesRepresentation
} from '@alfresco/js-api';
import { AuthenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root'
})
export class DiscoveryApiServiceMock {

    /**
     * Gets product information for Content Services.
     */
    ecmProductInfo$ = new Subject<RepositoryInfo>();

    constructor()

    public getEcmProductInfo(): Observable<RepositoryInfo> {
        return of({
            "id": "f40e345c-4e04-4c1f-95f3-0707c533186e",
            "edition": "Enterprise",
            "version": {
                "major": "7",
                "minor": "2",
                "patch": "0",
                "hotfix": "0",
                "schema": 16000,
                "label": "rde8705d0-blocal",
                "display": "7.2.0.0 (rde8705d0-blocal) schema 16000"
            },
            "license": {
                "issuedAt": "2021-11-10T23:30:30.234+0000",
                "expiresAt": "2021-11-12T00:00:00.000+0000",
                "remainingDays": 1,
                "holder": "Trial User",
                "mode": "ENTERPRISE",
                "entitlements": { "isClusterEnabled": true, "isCryptodocEnabled": false }
            },
            "status": {
                "isReadOnly": false,
                "isAuditEnabled": true,
                "isQuickShareEnabled": true,
                "isThumbnailGenerationEnabled": true,
                "isDirectAccessUrlEnabled": true
            },
            "modules": [{
                "id": "org_alfresco_module_rm",
                "title": "AGS Repo",
                "description": "Alfresco Governance Services Repository Extension",
                "version": "14.26",
                "installState": "UNKNOWN",
                "versionMin": "7.0.0",
                "versionMax": "999"
            }, {
                "id": "alfresco-aos-module",
                "title": "Alfresco Office Services Module",
                "description": "Allows applications that can talk to a SharePoint server to talk to your Alfresco installation",
                "version": "1.4.0.1",
                "installDate": "2021-11-10T23:29:18.817+0000",
                "installState": "INSTALLED",
                "versionMin": "6.0",
                "versionMax": "999"
            }, {
                "id": "alfresco-saml-repo",
                "title": "Alfresco SAML Repository AMP Module",
                "description": "The Repository piece of the Alfresco SAML Module",
                "version": "1.2.2",
                "installDate": "2021-11-10T23:29:19.639+0000",
                "installState": "INSTALLED",
                "versionMin": "6.0.1",
                "versionMax": "999"
            }, {
                "id": "org.alfresco.integrations.google.docs",
                "title": "Alfresco / Google Docs Integration",
                "description": "The Repository side artifacts of the Alfresco / Google Docs Integration.",
                "version": "3.2.1.3",
                "installDate": "2021-11-10T23:29:19.064+0000",
                "installState": "INSTALLED",
                "versionMin": "6.2.0",
                "versionMax": "999"
            }, {
                "id": "org_alfresco_integrations_S3Connector",
                "title": "S3 Connector",
                "description": "Provides Amazon S3 content storage for the contentstore and deleted contentstore",
                "version": "5.0.0-A1",
                "installDate": "2021-11-10T23:29:19.560+0000",
                "installState": "INSTALLED",
                "versionMin": "7.2",
                "versionMax": "999"
            }, {
                "id": "org_alfresco_device_sync_repo",
                "title": "Alfresco Device Sync Amp",
                "description": "Alfresco Device Sync Amp",
                "version": "3.5.0-A2",
                "installDate": "2021-11-10T23:29:18.951+0000",
                "installState": "INSTALLED",
                "versionMin": "7.0",
                "versionMax": "999"
            }, {
                "id": "alfresco-ai-repo",
                "title": "Alfresco Intelligence Services Repository AMP",
                "description": "Extensions in Alfresco Repository for the Alfresco Intelligence Services",
                "version": "1.4.0",
                "installState": "UNKNOWN",
                "versionMin": "6.2.2",
                "versionMax": "999"
            }, {
                "id": "alfresco-rm-enterprise-repo",
                "title": "AGS Enterprise Repo",
                "description": "Alfresco Governance Services Enterprise Repository Extension",
                "version": "14.25",
                "installDate": "2021-11-10T23:29:19.529+0000",
                "installState": "INSTALLED",
                "versionMin": "7.0.0",
                "versionMax": "999"
            }, {
                "id": "alfresco-share-services",
                "title": "Alfresco Share Services AMP",
                "description": "Module to be applied to alfresco.war, containing APIs for Alfresco Share",
                "version": "14.26",
                "installDate": "2021-11-10T23:29:18.998+0000",
                "installState": "INSTALLED",
                "versionMin": "6.1",
                "versionMax": "999"
            }, {
                "id": "alfresco-trashcan-cleaner",
                "title": "alfresco-trashcan-cleaner project",
                "description": "The Alfresco Trashcan Cleaner (Alfresco Module)",
                "version": "2.4.1",
                "installState": "UNKNOWN",
                "versionMin": "0",
                "versionMax": "999"
            }, {
                "id": "alfresco-content-connector-for-salesforce-repo",
                "title": "Alfresco Content Connector for Salesforce Repository AMP",
                "description": "Alfresco Repository artifacts needed for the Alfresco Content Connector for Salesforce Repository Amp",
                "version": "2.3.0.3",
                "installDate": "2021-11-10T23:29:18.918+0000",
                "installState": "INSTALLED",
                "versionMin": "6.2.0",
                "versionMax": "999"
            }]
        });
    }

    public getBpmProductInfo(): Observable<BpmProductVersionModel> {
        return of({
            "revisionVersion": "0-RC1",
            "edition": "Alfresco Process Services (powered by Activiti)",
            "type": "bpmSuite",
            "majorVersion": "2",
            "minorVersion": "1"
        });
    }

    public getBPMSystemProperties(): Observable<SystemPropertiesRepresentation> {
        return {};
    }
}
