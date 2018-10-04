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
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
    templateUrl: './cloud-demo.component.html',
    styleUrls: [`./cloud-demo.component.scss`]
})

export class CloudDemoComponent implements OnInit {

    appName: string;

    constructor(
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        if (this.route) {
            this.route.params.forEach((params: Params) => {
                if (params['appName']) {
                    this.appName = params['appName'];
                }
            });
        }
    }

    onFilterSelected(filter) {
        const queryParams = {
            status: filter.query.state,
            filterName: filter.name,
            sort: filter.query.sort,
            order: filter.query.order
        };
        this.router.navigate([`/activiti-cloud/${this.appName}/task-list/`], {queryParams: queryParams});
    }

    hasApp() {
        return !!this.appName;
    }
}
