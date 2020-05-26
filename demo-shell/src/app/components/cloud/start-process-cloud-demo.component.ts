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
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService, AppConfigService } from '@alfresco/adf-core';
import { CloudLayoutService } from './services/cloud-layout.service';
import { PreviewService } from '../../services/preview.service';

@Component({
    templateUrl: './start-process-cloud-demo.component.html',
    styleUrls: ['./start-process-cloud-demo.component.scss']
})
export class StartProcessCloudDemoComponent implements OnInit {

    appName;
    processName: string;
    formValues: string;
    variables: any;

    constructor(private appConfig: AppConfigService,
                private cloudLayoutService: CloudLayoutService,
                private route: ActivatedRoute,
                private previewService: PreviewService,
                private notificationService: NotificationService,
                private router: Router) {
    }

    ngOnInit() {
        this.route.parent.params.subscribe((params) => {
            this.appName = params.appName;
        });

        this.processName = this.appConfig.get<string>('adf-cloud-start-process.name');
        this.formValues = this.appConfig.get<string>('adf-cloud-start-process.values');
        this.variables = this.appConfig.get<string>('adf-cloud-start-process.variables');
    }

    onStartProcessSuccess() {
        this.cloudLayoutService.setCurrentProcessFilterParam({ key: 'running-processes' });
        this.router.navigate([`/cloud/${this.appName}/processes`]);
    }

    onCancelStartProcess() {
        this.cloudLayoutService.setCurrentProcessFilterParam({ key: 'all-processes' });
        this.router.navigate([`/cloud/${this.appName}/processes`]);
    }

    openSnackMessage(event: any) {
        this.notificationService.openSnackMessage(event.response.body.entry.message);
    }

    onFormContentClicked(resourceClicked: any) {
        this.previewService.showResource(resourceClicked.nodeId);
    }
}
