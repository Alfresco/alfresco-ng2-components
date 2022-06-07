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

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AppExtensionService, ExtensionRef } from '@alfresco/adf-extensions';
import { Observable } from 'rxjs';
import { AppConfigService } from '../app-config/app-config.service';
import { RepositoryInfo } from '@alfresco/js-api';

import { BpmProductVersionModel } from '../models/product-version.model';
import { AuthenticationService } from '../services/authentication.service';
import { DiscoveryApiService } from '../services/discovery-api.service';
import { LicenseData, PackageInfo, StatusData } from './interfaces';

@Component({
    selector: 'adf-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AboutComponent implements OnInit {

    repository: RepositoryInfo = null;
    bpmVersion: BpmProductVersionModel = null;

    statusEntries: StatusData[];
    licenseEntries: LicenseData[];

    dependencyEntries: PackageInfo[] = [];
    url: string;
    version: string;
    dependencies: string;
    application: string;

    /** If active show more information about the app and the platform useful in debug. */
    @Input() dev: boolean = false;

    /** pkg json. */
    @Input() pkg: any;

    /** Regular expression for filtering dependencies packages. */
    @Input() regexp = '^(@alfresco)';

    extensions$: Observable<ExtensionRef[]>;

    constructor(private authService: AuthenticationService,
        private discovery: DiscoveryApiService,
        private appExtensions: AppExtensionService,
        private appConfigService: AppConfigService) {
        this.extensions$ = this.appExtensions.references$;
        this.application = this.appConfigService.get<string>(
            'application.name'
        );
    }

    ngOnInit() {
        this.url = `https://github.com/Alfresco/${this.pkg?.name}/commits/${this.pkg?.commit}`;
        this.version = this.pkg?.version;
        this.dependencies = this.pkg?.dependencies;

        if (this.dependencies) {
            const alfrescoPackages = Object.keys(this.dependencies).filter((val) => new RegExp(this.regexp).test(val));

            alfrescoPackages.forEach((val) => {
                this.dependencyEntries.push({
                    name: val,
                    version: (this.dependencies[val])
                });
            });
        }
        if (this.authService.isEcmLoggedIn()) {
            this.setECMInfo();
        }

        if (this.authService.isBpmLoggedIn()) {
            this.setBPMInfo();
        }
    }

    setECMInfo() {
        this.discovery.getEcmProductInfo().subscribe((repository) => {
            this.repository = repository;

            this.statusEntries = Object.keys(repository.status).map((key) => ({
                property: key,
                value: repository.status[key]
            }));

            if (repository.license) {
                this.licenseEntries = Object.keys(repository.license).map((key) => ({
                    property: key,
                    value: repository.license[key]
                }));
            }
        });
    }

    setBPMInfo() {
        this.discovery.getBpmProductInfo().subscribe((bpmVersion) => {
            this.bpmVersion = bpmVersion;
        });
    }

}
