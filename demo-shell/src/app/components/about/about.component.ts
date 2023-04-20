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

import { Component, OnInit } from '@angular/core';
import { AppExtensionService, ExtensionRef } from '@alfresco/adf-extensions';
import { AuthenticationService, BpmProductVersionModel, RepositoryInfo } from '@alfresco/adf-core';
import { DiscoveryApiService } from '@alfresco/adf-content-services';
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
        private authenticationService: AuthenticationService,
        private appExtensionService: AppExtensionService,
        private discoveryApiService: DiscoveryApiService
    ) {
        this.pkg = pkg;
        this.extensions$ = this.appExtensionService.references$;
    }

    ngOnInit(): void {
        if (this.authenticationService.isEcmLoggedIn()) {
            this.setECMInfo();
        }

        if (this.authenticationService.isBpmLoggedIn()) {
            this.setBPMInfo();
        }
    }

    setECMInfo() {
        this.discoveryApiService.getEcmProductInfo().subscribe((repository) => {
            this.repository = repository as RepositoryInfo;
        });
    }

    setBPMInfo() {
        this.discoveryApiService.getBpmProductInfo().subscribe((bpmVersion) => {
            this.bpmVersion = bpmVersion;
        });
    }
}
