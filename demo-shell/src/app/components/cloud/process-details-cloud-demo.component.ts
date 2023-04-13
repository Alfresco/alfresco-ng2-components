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

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: './process-details-cloud-demo.component.html',
    styleUrls: ['./process-details-cloud-demo.component.scss']
})
export class ProcessDetailsCloudDemoComponent {

    processInstanceId: string;
    appName: string;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.route.params.subscribe((params) => {
            this.processInstanceId = params.processInstanceId;
        });

        this.route.parent.params.subscribe((params) => {
            this.appName = params.appName;
        });
    }

    onGoBack() {
        this.router.navigate([`/cloud/${this.appName}/`]);
    }

    onRowClick(taskId: string) {
        if (taskId) {
            this.router.navigate([`/cloud/${this.appName}/task-details/${taskId}`]);
        }
    }
}
