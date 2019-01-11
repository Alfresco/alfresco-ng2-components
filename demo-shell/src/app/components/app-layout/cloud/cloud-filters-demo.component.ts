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

import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CloudLayoutService } from './services/cloud-layout.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-cloud-filters-demo',
    templateUrl: './cloud-filters-demo.component.html',
    styleUrls: ['cloud-filters-demo.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CloudFiltersDemoComponent implements OnInit {

    @Input()
    appName: string;

    currentTaskFilter$: Observable<any>;
    currentProcessFilter$: Observable<any>;

    toggleTaskFilter = true;
    toggleProcessFilter = true;

    expandTaskFilter = true;
    expandProcessFilter = false;

    constructor(
        private cloudLayoutService: CloudLayoutService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.currentTaskFilter$ = this.cloudLayoutService.getCurrentTaskFilterParam();
        this.currentProcessFilter$ = this.cloudLayoutService.getCurrentProcessFilterParam();
        let root = '';
        if ( this.route.snapshot && this.route.snapshot.firstChild) {
            root = this.route.snapshot.firstChild.url[0].path;
            if (root === 'tasks') {
                this.expandTaskFilter = true;
                this.expandProcessFilter = false;
            } else if (root === 'processes') {
                this.expandProcessFilter = true;
                this.expandTaskFilter = false;
            }
        }
    }

    onTaskFilterSelected(filter) {
        this.cloudLayoutService.setCurrentTaskFilterParam({id: filter.id});
        const currentFilter = Object.assign({}, filter);
        this.router.navigate([`/cloud/${this.appName}/tasks/`], { queryParams: currentFilter });
    }

    onProcessFilterSelected(filter) {
        this.cloudLayoutService.setCurrentProcessFilterParam({id: filter.id});
        const currentFilter = Object.assign({}, filter);
        this.router.navigate([`/cloud/${this.appName}/processes/`], { queryParams: currentFilter });
    }

    onTaskFilterOpen(): boolean {
        this.expandTaskFilter = true;
        this.expandProcessFilter = false;
        return this.toggleTaskFilter;
    }

    onTaskFilterClose(): boolean {
        return !this.toggleTaskFilter;
    }

    onProcessFilterOpen(): boolean {
        this.expandProcessFilter = true;
        this.expandTaskFilter = false;
        return this.toggleProcessFilter;
    }

    onProcessFilterClose(): boolean {
        return !this.toggleProcessFilter;
    }
}
