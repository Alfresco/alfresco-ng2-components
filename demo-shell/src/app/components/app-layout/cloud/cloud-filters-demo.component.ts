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
import { Router } from '@angular/router';
@Component({
  selector: 'app-cloud-filters-demo',
  templateUrl: './cloud-filters-demo.component.html',
  styleUrls: ['cloud-filters-demo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CloudFiltersDemoComponent implements OnInit {

  @Input()
  appName: string;

  panelOpenStateTask: boolean;
  panelOpenStateProcess: boolean;

  currentTaskFilter$: Observable<any>;
  currentProcessFilter$: Observable<any>;

  constructor(private cloudLayoutService: CloudLayoutService, private router: Router) {
  }

  ngOnInit() {
    this.currentTaskFilter$  = this.cloudLayoutService.getCurrentTaskFilterParam();
    this.currentProcessFilter$  = this.cloudLayoutService.getCurrentProcessFilterParam();
  }

  onTaskFilterSelected(filter) {
    this.cloudLayoutService.setCurrentTaskFilterParam({id: filter.id});
    const currentFilter = Object.assign({}, filter);
    this.router.navigate([`/cloud/${this.appName}/tasks/`], { queryParams: currentFilter });
    this.cloudLayoutService.resetCurrentTaskFilterParam();
  }

  onProcessFilterSelected(filter) {
    this.cloudLayoutService.setCurrentProcessFilterParam({id: filter.id});
    const currentFilter = Object.assign({}, filter);
    this.router.navigate([`/cloud/${this.appName}/processes/`], { queryParams: currentFilter });
    this.cloudLayoutService.resetCurrentProcessFilterParam();
  }

}
