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

import { Component, OnInit } from '@angular/core';
import { AppExtensionService, ExtensionRef } from '@alfresco/adf-extensions';
import { AuthenticationService, BpmProductVersionModel, DiscoveryApiService, RepositoryInfo } from '@alfresco/adf-core';
import pkg from '../../../../../package.json';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-about-page',
    templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {
    pkg: any;
    dev: true;

    extensions$: Observable<ExtensionRef[]>;
    repository: RepositoryInfo = null;
    bpmVersion: BpmProductVersionModel = null;

    constructor(
        private authService: AuthenticationService,
        private appExtensions: AppExtensionService,
        private discovery: DiscoveryApiService
    ) {
        this.pkg = pkg;
        this.extensions$ = this.appExtensions.references$;
    }

    ngOnInit(): void {
        if (this.authService.isEcmLoggedIn()) {
            this.setECMInfo();
        }

        if (this.authService.isBpmLoggedIn()) {
            this.setBPMInfo();
        }
    }

    setECMInfo() {
        this.discovery.getEcmProductInfo().subscribe((repository) => {
            this.repository = repository as RepositoryInfo;
        });
    }

    setBPMInfo() {
        this.discovery.getBpmProductInfo().subscribe((bpmVersion) => {
            this.bpmVersion = bpmVersion;
        });
    }
}
