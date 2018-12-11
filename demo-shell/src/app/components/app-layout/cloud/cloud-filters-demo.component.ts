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

import { Component, EventEmitter, ViewEncapsulation, Output, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CloudLayoutService } from './services/cloud-layout.service';

@Component({
  selector: 'app-cloud-filters-demo',
  templateUrl: './cloud-filters-demo.component.html',
  styleUrls: ['cloud-filters-demo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CloudFiltersDemoComponent implements OnInit {

  @Input()
  appName: string;

  @Output()
  taskFilterSelect: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  processFilterSelect: EventEmitter<any> = new EventEmitter<any>();

  panelOpenStateTask: boolean;
  panelOpenStateProcess: boolean;

  currentTaskFilter$: Observable<any>;
  currentProcessFilter$: Observable<any>;

  constructor(private cloudLayoutService: CloudLayoutService) {
  }

  ngOnInit() {
    this.currentTaskFilter$  = this.cloudLayoutService.getCurrentTaskFilterParam();
    this.currentProcessFilter$  = this.cloudLayoutService.getCurrentProcessFilterParam();
  }

  onTaskFilterSelected(filter) {
    this.cloudLayoutService.setCurrentTaskFilterParam({id: filter.id});
  }

  onProcessFilterSelected(filter) {
    this.cloudLayoutService.setCurrentProcessFilterParam({id: filter.id});
  }

}
