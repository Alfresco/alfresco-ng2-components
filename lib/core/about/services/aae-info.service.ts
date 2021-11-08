/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
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
    providedIn: 'root',
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
                    activiti: activitiVersion,
                };
            })
        );
    }
}
