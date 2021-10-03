/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-process-status',
  templateUrl: './process-status.component.html',
  styleUrls: ['./process-status.component.scss']
})
export class ProcessStatusComponent implements OnInit {

  @Input()
  context: any;

  @Input()
  key = 'name';

  displayValue: any;

  constructor() {}

  ngOnInit() {
      this.updateValue();
  }

  protected updateValue() {
      this.displayValue = this.context.row?.obj;
  }

}
