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

import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';

import { BpmProductVersionModel } from '../../models/product-version.model';
import { AaeInfoService, ActivitiDependencyInfo } from '../services/aae-info.service';
import { AppConfigService } from '../../app-config/app-config.service';

interface VersionInfo {
    display: string;
}

interface RepositoryInfo {
    edition: string;
    version: VersionInfo;
}

@Component({
    selector: 'adf-about-platform-version',
    templateUrl: './about-platform-version.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AboutPlatformVersionComponent {

    /** repository info. */
    @Input()
    repository: RepositoryInfo = null;

    /** process info. */
    @Input()
    process: BpmProductVersionModel = null;

    modeling$: Observable<ActivitiDependencyInfo>;
    deployment$: Observable<ActivitiDependencyInfo>;
    rb$: Observable<ActivitiDependencyInfo>;
    query$: Observable<ActivitiDependencyInfo>;

    constructor(
        private aaeInfoService: AaeInfoService,
        private appConfigService: AppConfigService
    ) {
        this.modelingInfo();
        this.deploymentInfo();
        this.rbInfo();
    }

    modelingInfo() {
        this.modeling$ = this.aaeInfoService.getServiceVersion('modeling-service');
    }

    deploymentInfo() {
        this.deployment$ = this.aaeInfoService.getServiceVersion('deployment-service');
    }

    rbInfo() {
        this.rb$ = this.aaeInfoService.getServiceVersion(`${this.appConfigService.get('oauth2.clientId')}/rb`);
    }

    queryInfo() {
        this.query$ = this.aaeInfoService.getServiceVersion(`${this.appConfigService.get('oauth2.clientId')}/query`);
    }
}
