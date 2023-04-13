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
    appName: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private cloudLayoutService: CloudLayoutService
    ) { }

    ngOnInit() {
        let root: string = '';
        this.route.params.subscribe((params) => {
            this.appName = params.appName;
        });

        if (this.route.snapshot && this.route.snapshot.firstChild) {
            root = this.route.snapshot.firstChild.url[0].path;
        }

        this.route.queryParams.subscribe((params) => {
            if (root === 'tasks' && params.id) {
                this.cloudLayoutService.setCurrentTaskFilterParam({ id: params.id });
            }

            if (root === 'processes' && params.id) {
                this.cloudLayoutService.setCurrentProcessFilterParam({ id: params.id });
            }
        });
    }

    onStartTask() {
        this.router.navigate([`/cloud/${this.appName}/start-task/`]);
    }

    onStartProcess() {
        this.router.navigate([`/cloud/${this.appName}/start-process/`]);
    }
}
