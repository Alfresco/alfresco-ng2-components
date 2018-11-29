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

import { Component, EventEmitter, ViewEncapsulation, Output, Input } from '@angular/core';

@Component({
  selector: 'app-cloud-fillters-demo',
  templateUrl: './cloud-filters-demo.component.html',
  styleUrls: ['cloud-filters-demo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CloudFiltersDemoComponent {

  @Input()
  appName: string;

  @Output()
  taskFilterSelect: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  processFilterSelect: EventEmitter<any> = new EventEmitter<any>();

  onTaskFilterSelected(filter) {
    this.taskFilterSelect.emit(filter);
  }

  onProcessFilterSelected(filter) {
    this.processFilterSelect.emit(filter);
  }

}
