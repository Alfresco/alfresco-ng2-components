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

import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
import { ExtensionRef } from '@alfresco/adf-extensions';

@Component({
  selector: 'adf-about-extension-list',
  templateUrl: './about-extension-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutExtensionListComponent {
  columns = [
    {
      columnDef: 'name',
      header: 'ABOUT.PLUGINS.NAME',
      cell: (row: ExtensionRef) => `${row.$name}`
    },
    {
      columnDef: 'version',
      header: 'ABOUT.PLUGINS.VERSION',
      cell: (row: ExtensionRef) => `${row.$version}`
    }
  ];

  displayedColumns = this.columns.map((x) => x.columnDef);

  @Input()
  data: Array<ExtensionRef> = [];
}
