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
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';

@Component({
    selector: 'adf-about-server-settings',
    templateUrl: './about-server-settings.component.html',
    styleUrls: ['./about-server-settings.component.scss']
})
export class AboutServerSettingsComponent implements OnInit {
    ecmHost = '';
    bpmHost = '';

    constructor(private appConfig: AppConfigService) {}

    ngOnInit() {
        this.ecmHost = this.appConfig.get(AppConfigValues.ECMHOST);
        this.bpmHost = this.appConfig.get(AppConfigValues.BPMHOST);
    }
}
