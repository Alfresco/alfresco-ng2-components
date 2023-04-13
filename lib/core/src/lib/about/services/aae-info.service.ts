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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../app-config/app-config.service';

export interface ActivitiDependencyInfo {
    artifact: string;
    version: string;
    activiti: string;
}

@Injectable({
    providedIn: 'root'
})
export class AaeInfoService {
    contextRoot = '';

    constructor(protected httpClient: HttpClient, protected appConfigService: AppConfigService) {
        this.contextRoot = appConfigService.get('bpmHost', '');
    }

    getServiceVersion(serviceName: string): Observable<ActivitiDependencyInfo> {
        return this.httpClient.get<any>(`${this.contextRoot}/${serviceName}/actuator/info`).pipe(
            map((response: any) => {
                let activitiVersion = 'N/A';
                if (response.build.activiti) {
                    activitiVersion = response.build.activiti.version;
                }
                return {
                    artifact: response.build.artifact,
                    version: response.build.version,
                    activiti: activitiVersion
                };
            })
        );
    }
}
