/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ObjectUtils, StringUtils } from '../../common/utils';
import { LicenseData, StatusData } from '../interfaces';
import { RepositoryInfo } from './repository-info.interface';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AboutLicenseListComponent } from '../about-license-list/about-license-list.component';
import { ModuleListComponent } from '../about-module-list/module-list.component';
import { AboutStatusListComponent } from '../about-status-list/about-status-list.component';

@Component({
    selector: 'adf-about-repository-info',
    templateUrl: './about-repository-info.component.html',
    styleUrls: ['./about-repository-info.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, TranslatePipe, AboutLicenseListComponent, ModuleListComponent, AboutStatusListComponent]
})
export class AboutRepositoryInfoComponent implements OnInit {
    @Input()
    data: RepositoryInfo;

    statusEntries: StatusData[];
    licenseEntries: LicenseData[];

    ngOnInit(): void {
        if (this.data) {
            const repository = this.data;

            this.statusEntries = Object.keys(repository.status).map((key) => ({
                property: key,
                value: repository.status[key]
            }));

            if (repository.license) {
                this.licenseEntries = Object.keys(repository.license).map((key) => {
                    if (ObjectUtils.isObject(repository.license[key])) {
                        return {
                            property: key,
                            value: ObjectUtils.booleanPrettify(repository.license[key], StringUtils.prettifyBooleanEnabled)
                        };
                    }

                    return {
                        property: key,
                        value: repository.license[key]
                    };
                });
            }
        }
    }
}
