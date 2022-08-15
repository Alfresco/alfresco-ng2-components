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

import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
import { ModuleInfo } from '@alfresco/js-api';

@Component({
  selector: 'adf-about-module-list',
  templateUrl: './module-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModuleListComponent {
  columns = [
    {
      columnDef: 'title',
      header: 'ABOUT.MODULES.NAME',
      cell: (row: ModuleInfo) => `${row.title}`
    },
    {
      columnDef: 'version',
      header: 'ABOUT.MODULES.VERSION',
      cell: (row: ModuleInfo) => `${row.version}`
    }
  ];

  displayedColumns = this.columns.map((x) => x.columnDef);

  @Input()
  data: Array<ModuleInfo> = [];
}
