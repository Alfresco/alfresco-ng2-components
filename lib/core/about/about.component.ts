/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { BpmProductVersionModel, EcmProductVersionModel } from '../models/product-version.model';
import { DiscoveryApiService } from '../services/discovery-api.service';
import { ObjectDataTableAdapter } from '../datatable/data/object-datatable-adapter';
import { AppConfigService, AppConfigValues } from '../app-config/app-config.service';

@Component({
    selector: 'adf-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AboutComponent implements OnInit {

    data: ObjectDataTableAdapter;
    status: ObjectDataTableAdapter;
    license: ObjectDataTableAdapter;
    modules: ObjectDataTableAdapter;
    githubUrlCommitAlpha = 'https://github.com/Alfresco/alfresco-ng2-components/commits/';

    ecmHost = '';
    bpmHost = '';

    ecmVersion: EcmProductVersionModel = null;
    bpmVersion: BpmProductVersionModel = null;

    constructor(private http: HttpClient,
                private appConfig: AppConfigService,
                private authService: AuthenticationService,
                private discovery: DiscoveryApiService) {
    }

    ngOnInit() {

        if (this.authService.isEcmLoggedIn()) {
            this.discovery.getEcmProductInfo().subscribe((ecmVers) => {
                this.ecmVersion = ecmVers;

                this.modules = new ObjectDataTableAdapter(this.ecmVersion.modules, [
                    { type: 'text', key: 'id', title: 'ABOUT.TABLE_HEADERS.MODULES.ID', sortable: true },
                    { type: 'text', key: 'title', title: 'ABOUT.TABLE_HEADERS.MODULES.TITLE', sortable: true },
                    { type: 'text', key: 'version', title: 'ABOUT.TABLE_HEADERS.MODULES.DESCRIPTION', sortable: true },
                    { type: 'text', key: 'installDate', title: 'ABOUT.TABLE_HEADERS.MODULES.INSTALL_DATE', sortable: true },
                    { type: 'text', key: 'installState', title: 'ABOUT.TABLE_HEADERS.MODULES.INSTALL_STATE', sortable: true },
                    { type: 'text', key: 'versionMin', title: 'ABOUT.TABLE_HEADERS.MODULES.VERSION_MIN', sortable: true },
                    { type: 'text', key: 'versionMax', title: 'ABOUT.TABLE_HEADERS.MODULES.VERSION_MAX', sortable: true }
                ]);

                this.status = new ObjectDataTableAdapter([this.ecmVersion.status], [
                    { type: 'text', key: 'isReadOnly', title: 'ABOUT.TABLE_HEADERS.STATUS.READ_ONLY', sortable: true },
                    { type: 'text', key: 'isAuditEnabled', title: 'ABOUT.TABLE_HEADERS.STATUS.AUDIT_ENABLED', sortable: true },
                    { type: 'text', key: 'isQuickShareEnabled', title: 'ABOUT.TABLE_HEADERS.STATUS.QUICK_SHARE_ENABLED', sortable: true },
                    { type: 'text', key: 'isThumbnailGenerationEnabled', title: 'ABOUT.TABLE_HEADERS.STATUS.THUMBNAIL_ENABLED', sortable: true }
                ]);

                this.license = new ObjectDataTableAdapter([this.ecmVersion.license], [
                    { type: 'text', key: 'issuedAt', title: 'ABOUT.TABLE_HEADERS.LICENSE.ISSUES_AT', sortable: true },
                    { type: 'text', key: 'expiresAt', title: 'ABOUT.TABLE_HEADERS.LICENSE.EXPIRES_AT', sortable: true },
                    { type: 'text', key: 'remainingDays', title: 'ABOUT.TABLE_HEADERS.LICENSE.REMAINING_DAYS', sortable: true },
                    { type: 'text', key: 'holder', title: 'ABOUT.TABLE_HEADERS.LICENSE.HOLDER', sortable: true },
                    { type: 'text', key: 'mode', title: 'ABOUT.TABLE_HEADERS.LICENSE.MODE', sortable: true },
                    { type: 'text', key: 'isClusterEnabled', title: 'ABOUT.TABLE_HEADERS.LICENSE.CLUSTER_ENABLED', sortable: true },
                    { type: 'text', key: 'isCryptodocEnabled', title: 'ABOUT.TABLE_HEADERS.LICENSE.CRYPTODOC_ENABLED', sortable: true }
                ]);
            });
        }

        if (this.authService.isBpmLoggedIn()) {
            this.discovery.getBpmProductInfo().subscribe((bpmVers) => {
                this.bpmVersion = bpmVers;
            });
        }

        this.http.get('/versions.json?' + new Date()).subscribe((response: any) => {
            const regexp = new RegExp('^(@alfresco)');

            const alfrescoPackages = Object.keys(response.dependencies).filter((val) => {
                return regexp.test(val);
            });

            const alfrescoPackagesTableRepresentation = [];
            alfrescoPackages.forEach((val) => {
                alfrescoPackagesTableRepresentation.push({
                    name: val,
                    version: response.dependencies[val].version
                });
            });

            this.gitHubLinkCreation(alfrescoPackagesTableRepresentation);

            this.data = new ObjectDataTableAdapter(alfrescoPackagesTableRepresentation, [
                { type: 'text', key: 'name', title: 'Name', sortable: true },
                { type: 'text', key: 'version', title: 'Version', sortable: true }
            ]);

        });

        this.ecmHost = this.appConfig.get<string>(AppConfigValues.ECMHOST);
        this.bpmHost = this.appConfig.get<string>(AppConfigValues.BPMHOST);
    }

    private gitHubLinkCreation(alfrescoPackagesTableRepresentation): void {
        const corePackage = alfrescoPackagesTableRepresentation.find((packageUp) => {
            return packageUp.name === '@alfresco/adf-core';
        });

        if (corePackage) {
            const commitIsh = corePackage.version.split('-');
            if (commitIsh.length > 1) {
                this.githubUrlCommitAlpha = this.githubUrlCommitAlpha + commitIsh[1];
            } else {
                this.githubUrlCommitAlpha = this.githubUrlCommitAlpha + corePackage.version;
            }
        }
    }
}
