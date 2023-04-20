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

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-shared-link-view',
    templateUrl: './shared-link-view.component.html',
    styleUrls: [ './shared-link-view.component.scss' ],
    encapsulation: ViewEncapsulation.None,
    // eslint-disable-next-line
    host: { 'class': 'app-shared-link-view' }
})
export class SharedLinkViewComponent implements OnInit {

    sharedLinkId: string = null;

    constructor(private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.sharedLinkId = params.id;
        });
    }

    redirectTo404() {
        this.router.navigate(['error/404']);
    }

}
