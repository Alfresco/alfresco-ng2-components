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
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-cloud-breadcrumbs',
    templateUrl: './cloud-breadcrumb-component.html',
    styleUrls: ['./cloud-breadcrumb-component.scss']
})
export class CloudBreadcrumbsComponent implements OnInit {
    appName: string;
    filterName: string;

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.parent.params.subscribe(params => {
            this.appName = params.appName;
        });
        this.route.queryParams.subscribe(params => {
            if (params.filterName) {
                this.filterName = params.filterName;
            }
        });
    }
}
