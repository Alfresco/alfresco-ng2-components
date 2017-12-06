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

import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import {
    AuthenticationService,
    AppConfigService,
    BpmProductVersionModel,
    DiscoveryApiService,
    EcmProductVersionModel,
    ObjectDataTableAdapter
} from '@alfresco/adf-core';

@Component({
    selector: 'app-about-page',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    data: ObjectDataTableAdapter;
    status: ObjectDataTableAdapter;
    license: ObjectDataTableAdapter;
    modules: ObjectDataTableAdapter;
    githubUrlCommitAlpha = 'https://github.com/Alfresco/alfresco-ng2-components/commits/';

    configFile = 'app.config.json';
    ecmHost = '';
    bpmHost = '';

    ecmVersion: EcmProductVersionModel = null;
    bpmVersion: BpmProductVersionModel = null;

    constructor(private http: Http,
                private appConfig: AppConfigService,
                private authService: AuthenticationService,
                private discovery: DiscoveryApiService) {
    }

    ngOnInit() {

        if (this.authService.isEcmLoggedIn()) {
            this.discovery.getEcmProductInfo().subscribe((ecmVers) => {
                this.ecmVersion = ecmVers;

                this.modules = new ObjectDataTableAdapter(this.ecmVersion.modules, [
                    {type: 'text', key: 'id', title: 'ID', sortable: true},
                    {type: 'text', key: 'title', title: 'Title', sortable: true},
                    {type: 'text', key: 'version', title: 'Description', sortable: true},
                    {type: 'text', key: 'installDate', title: 'Install Date', sortable: true},
                    {type: 'text', key: 'installState', title: 'Install State', sortable: true},
                    {type: 'text', key: 'versionMin', title: 'Version Minor', sortable: true},
                    {type: 'text', key: 'versionMax', title: 'Version Max', sortable: true}
                ]);

                this.status = new ObjectDataTableAdapter([this.ecmVersion.status], [
                    {type: 'text', key: 'isReadOnly', title: 'ReadOnly', sortable: true},
                    {type: 'text', key: 'isAuditEnabled', title: 'Is Audit Enable', sortable: true},
                    {type: 'text', key: 'isQuickShareEnabled', title: 'Is quick shared enable', sortable: true},
                    {type: 'text', key: 'isThumbnailGenerationEnabled', title: 'Thumbnail Generation', sortable: true}
                ]);

                this.license = new ObjectDataTableAdapter([this.ecmVersion.license], [
                    {type: 'text', key: 'issuedAt', title: 'Issued At', sortable: true},
                    {type: 'text', key: 'expiresAt', title: 'Expires At', sortable: true},
                    {type: 'text', key: 'remainingDays', title: 'Remaining Days', sortable: true},
                    {type: 'text', key: 'holder', title: 'Holder', sortable: true},
                    {type: 'text', key: 'mode', title: 'Mode', sortable: true},
                    {type: 'text', key: 'isClusterEnabled', title: 'Is Cluster Enabled', sortable: true},
                    {type: 'text', key: 'isCryptodocEnabled', title: 'Is Cryptodoc Enable', sortable: true}
                ]);
            });
        }

        if (this.authService.isBpmLoggedIn()) {
            this.discovery.getBpmProductInfo().subscribe((bpmVers) => {
                this.bpmVersion = bpmVers;
            });
        }

        this.http.get('/versions.json').subscribe(response => {
            const regexp = new RegExp('^(@alfresco)');

            const alfrescoPackages = Object.keys(response.json().dependencies).filter((val) => {
                return regexp.test(val);
            });

            const alfrescoPackagesTableRepresentation = [];
            alfrescoPackages.forEach((val) => {
                alfrescoPackagesTableRepresentation.push({
                    name: val,
                    version: response.json().dependencies[val].version
                });
            });

            this.gitHubLinkCreation(alfrescoPackagesTableRepresentation);

            this.data = new ObjectDataTableAdapter(alfrescoPackagesTableRepresentation, [
                {type: 'text', key: 'name', title: 'Name', sortable: true},
                {type: 'text', key: 'version', title: 'Version', sortable: true}
            ]);

        });

        this.ecmHost = this.appConfig.get<string>('ecmHost');
        this.bpmHost = this.appConfig.get<string>('bpmHost');
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
