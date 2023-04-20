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
import { Router } from '@angular/router';
import { NotificationService, AppConfigService } from '@alfresco/adf-core';
import { CloudLayoutService } from '../services/cloud-layout.service';

@Component({
    templateUrl: './community-start-process-cloud.component.html'
})
export class CommunityStartProcessCloudDemoComponent implements OnInit {

    processName: string;

    constructor(private appConfig: AppConfigService,
                private cloudLayoutService: CloudLayoutService,
                private notificationService: NotificationService,
                private router: Router) {
    }

    ngOnInit() {
        this.processName = this.appConfig.get<string>('adf-start-process-cloud.name');
    }

    onStartProcessSuccess() {
        this.cloudLayoutService.setCurrentProcessFilterParam({ key: 'running-processes' });
        this.router.navigate([`/cloud/community/processes`]);
    }

    onCancelStartProcess() {
        this.cloudLayoutService.setCurrentProcessFilterParam({ key: 'all-processes' });
        this.router.navigate([`/cloud/community/processes`]);
    }

    openSnackMessage(event: any) {
        this.notificationService.openSnackMessage(
            event.response.body.message
        );
    }
}
