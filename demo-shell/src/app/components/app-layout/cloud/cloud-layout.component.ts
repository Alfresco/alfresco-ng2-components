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
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CloudLayoutService } from './services/cloud-layout.service';

@Component({
    selector: 'app-cloud-layout',
    templateUrl: './cloud-layout.component.html',
    styleUrls: ['./cloud-layout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CloudLayoutComponent implements OnInit {
    displayMenu = true;
    applicationName: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private cloudLayoutService: CloudLayoutService
    ) {}

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.applicationName = params.applicationName;
        });

        this.route.queryParams.subscribe((params) => {
            if (params.id) {
                this.cloudLayoutService.setCurrentTaskFilterParam({ id: params.id });
            }
        });
    }

    onStartTask() {
        this.router.navigate([`/cloud/${this.applicationName}/start-task/`]);
    }

    onStartProcess() {
        this.router.navigate([`/cloud/${this.applicationName}/start-process/`]);
    }
}
