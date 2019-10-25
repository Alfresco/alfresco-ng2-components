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
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';

@Component({
    selector: 'adf-about-github-link',
    templateUrl: './about-github-link.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AboutGithubLinkComponent implements OnInit {

    /** Commit corresponding to the version of ADF to be used. */
    @Input()
    url = 'https://github.com/Alfresco/alfresco-ng2-components/commits/';

    /** Current version of the app running */
    @Input() version: string;

    ecmHost = '';
    bpmHost = '';
    application: string;

    constructor(private appConfig: AppConfigService) {}

    ngOnInit() {
        this.ecmHost = this.appConfig.get<string>(AppConfigValues.ECMHOST);
        this.bpmHost = this.appConfig.get<string>(AppConfigValues.BPMHOST);
        this.application = this.appConfig.get<string>('application.name');
    }
}
