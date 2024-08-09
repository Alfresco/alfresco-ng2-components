/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { CloudLayoutService } from './services/cloud-layout.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import {
    SidebarActionMenuComponent,
    SidenavLayoutComponent,
    SidenavLayoutContentDirective,
    SidenavLayoutHeaderDirective,
    SidenavLayoutNavigationDirective
} from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CloudFiltersDemoComponent } from './cloud-filters-demo.component';
import { CloudSettingsComponent } from './shared/cloud-settings.component';

@Component({
    selector: 'app-cloud-layout',
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        SidenavLayoutComponent,
        TranslateModule,
        SidenavLayoutHeaderDirective,
        SidenavLayoutNavigationDirective,
        SidebarActionMenuComponent,
        MatIconModule,
        MatMenuModule,
        SidenavLayoutContentDirective,
        RouterOutlet,
        CloudFiltersDemoComponent,
        CloudSettingsComponent
    ],
    templateUrl: './cloud-layout.component.html',
    styleUrls: ['./cloud-layout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CloudLayoutComponent implements OnInit {
    appName: string;
    filterName: string;

    constructor(private router: Router, private route: ActivatedRoute, private cloudLayoutService: CloudLayoutService) {}

    ngOnInit() {
        let root: string = '';
        this.route.params.subscribe((params) => {
            this.appName = params.appName;
        });

        if (this.route.snapshot?.firstChild) {
            root = this.route.snapshot.firstChild.url[0].path;
        }

        this.route.queryParams.subscribe((params) => {
            if (root === 'tasks' && params.id) {
                this.cloudLayoutService.setCurrentTaskFilterParam({ id: params.id });
            }

            if (root === 'processes' && params.id) {
                this.cloudLayoutService.setCurrentProcessFilterParam({ id: params.id });
            }

            if (params.filterName) {
                this.filterName = params.filterName;
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
