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
import {
    AuthenticationService,
    AlfrescoApiService,
    PageTitleService
} from '@alfresco/adf-core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

    constructor(private pageTitleService: PageTitleService,
                private alfrescoApiService: AlfrescoApiService,
                private authenticationService: AuthenticationService,
                private router: Router,
                private dialogRef: MatDialog) {

    }

    ngOnInit() {
        this.pageTitleService.setTitle('title');

        this.alfrescoApiService.getInstance().on('error', (error) => {
            if (error.status === 401) {
                if (!this.authenticationService.isLoggedIn()) {
                    this.dialogRef.closeAll();
                    this.router.navigate(['/login']);
                }
            }

            if (error.status === 507) {
                if (!this.authenticationService.isLoggedIn()) {
                    this.dialogRef.closeAll();
                    this.router.navigate(['error/507']);
                }
            }
        });
    }
}
