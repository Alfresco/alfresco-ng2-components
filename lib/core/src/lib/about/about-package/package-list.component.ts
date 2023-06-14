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

import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { PackageInfo } from '../interfaces';

@Component({
  selector: 'adf-about-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackageListComponent implements OnInit {

  @Input()
  dependencies: any;

  columns = [
    {
      columnDef: 'title',
      header: 'ABOUT.PACKAGES.NAME',
      cell: (row: PackageInfo) => `${row.name}`
    },
    {
      columnDef: 'version',
      header: 'ABOUT.PACKAGES.VERSION',
      cell: (row: PackageInfo) => `${row.version}`
    }
  ];

  displayedColumns = this.columns.map((x) => x.columnDef);

  @Input()
  data: Array<PackageInfo> = [];

  ngOnInit() {
    const regexp = new RegExp('^(@alfresco)');

    if (this.dependencies) {
        const libs = Object.keys(this.dependencies).filter((val) => regexp.test(val));
        this.data = [];

        libs.forEach((val) => {
            this.data.push({
                name: val,
                version: (this.dependencies[val])
            });
        });
    }
  }
}
