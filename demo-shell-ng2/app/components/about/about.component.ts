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
import { AlfrescoAuthenticationService, AppConfigService, BpmProductVersionModel, DiscoveryApiService, EcmProductVersionModel, LogService  } from 'ng2-alfresco-core';
import { ObjectDataTableAdapter } from 'ng2-alfresco-datatable';

@Component({
    selector: 'about-page',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    data: ObjectDataTableAdapter;
    githubUrlCommitAlpha: string = 'https://github.com/Alfresco/alfresco-ng2-components/commits/';

    configFile: string = '';
    ecmHost: string = '';
    bpmHost: string = '';

    ecmVersion: EcmProductVersionModel = null;
    bpmVersion: BpmProductVersionModel = null;

    constructor(private http: Http,
                private appConfig: AppConfigService,
                private authService: AlfrescoAuthenticationService,
                private logService: LogService,
                private discovery: DiscoveryApiService) {
    }

    ngOnInit() {

        this.discovery.getEcmProductInfo().subscribe((ecmVers) => {
            this.ecmVersion = ecmVers;
        });

        this.discovery.getBpmProductInfo().subscribe((bpmVers) => {
            this.bpmVersion = bpmVers;
        });

        this.http.get('/versions.json').subscribe(response => {
            let regexp = new RegExp('^(ng2-activiti|ng2-alfresco|alfresco-)');

            let alfrescoPackages = Object.keys(response.json().dependencies).filter((val) => {
                this.logService.log(val);
                return regexp.test(val);
            });

            let alfrescoPackagesTableRepresentation = [];
            alfrescoPackages.forEach((val) => {
                this.logService.log(response.json().dependencies[val]);
                alfrescoPackagesTableRepresentation.push({
                    name: val,
                    version: response.json().dependencies[val].version
                });
            });

            this.gitHubLinkCreation(alfrescoPackagesTableRepresentation);

            this.logService.log(alfrescoPackagesTableRepresentation);

            this.data = new ObjectDataTableAdapter(alfrescoPackagesTableRepresentation, [
                {type: 'text', key: 'name', title: 'Name', sortable: true},
                {type: 'text', key: 'version', title: 'Version', sortable: true}
            ]);
        });

        this.configFile = this.appConfig.configFile;
        this.ecmHost = this.appConfig.get<string>('ecmHost');
        this.bpmHost = this.appConfig.get<string>('bpmHost');
    }

    private gitHubLinkCreation(alfrescoPackagesTableRepresentation): void {
        let corePackage = alfrescoPackagesTableRepresentation.find((packageUp) => {
            return packageUp.name === 'ng2-alfresco-core';
        });

        if (corePackage) {
            let commitIsh = corePackage.version.split('-');
            if (commitIsh.length > 1) {
                this.githubUrlCommitAlpha = this.githubUrlCommitAlpha + commitIsh[1];
            } else {
                this.githubUrlCommitAlpha = this.githubUrlCommitAlpha + corePackage.version;
            }
        }
    }
}
