/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

@Component({
    selector: 'app-start-task-cloud-demo',
    templateUrl: './start-task-cloud-demo.component.html',
    styleUrls: ['./start-task-cloud-demo.component.css']
})
export class StartTaskCloudDemoComponent implements OnInit {
    showStartTask = false;
    appName: string;
    createdTaskDetails: any;
    showResponse = false;

    constructor(private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.appName = params['applicationName'];
        });
    }

    navigateStartTask() {
        this.showStartTask = true;
        this.showResponse = false;
    }

    onStartTaskSuccess(event: any) {
        this.showStartTask = false;
        this.showResponse = true;
        this.createdTaskDetails = event;
    }

    onCancelStartTask() {
        this.router.navigate(['/cloud/']);
    }
}
