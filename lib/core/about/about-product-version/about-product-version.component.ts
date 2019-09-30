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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BpmProductVersionModel, EcmProductVersionModel } from '../../models/product-version.model';
import { ObjectDataTableAdapter } from '../../datatable/data/object-datatable-adapter';
import { AuthenticationService } from '../../services/authentication.service';
import { DiscoveryApiService } from '../../services/discovery-api.service';

@Component({
    selector: 'adf-about-product-version',
    templateUrl: './about-product-version.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AboutProductVersionComponent implements OnInit {

    ecmVersion: EcmProductVersionModel = null;
    bpmVersion: BpmProductVersionModel = null;

    status: ObjectDataTableAdapter;
    license: ObjectDataTableAdapter;
    modules: ObjectDataTableAdapter;

    constructor(private authService: AuthenticationService,
                private discovery: DiscoveryApiService) {}

    ngOnInit() {
        if (this.authService.isEcmLoggedIn()) {
            this.setECMInfo();
        }

        if (this.authService.isBpmLoggedIn()) {
            this.setBPMInfo();
        }
    }

    setECMInfo() {
        this.discovery.getEcmProductInfo().subscribe((ecmVers) => {
            this.ecmVersion = ecmVers;

            this.modules = new ObjectDataTableAdapter(this.ecmVersion.modules, [
                { type: 'text', key: 'id', title: 'ABOUT.TABLE_HEADERS.MODULES.ID', sortable: true },
                { type: 'text', key: 'title', title: 'ABOUT.TABLE_HEADERS.MODULES.TITLE', sortable: true },
                { type: 'text', key: 'version', title: 'ABOUT.TABLE_HEADERS.MODULES.DESCRIPTION', sortable: true },
                {
                    type: 'text',
                    key: 'installDate',
                    title: 'ABOUT.TABLE_HEADERS.MODULES.INSTALL_DATE',
                    sortable: true
                },
                {
                    type: 'text',
                    key: 'installState',
                    title: 'ABOUT.TABLE_HEADERS.MODULES.INSTALL_STATE',
                    sortable: true
                },
                {
                    type: 'text',
                    key: 'versionMin',
                    title: 'ABOUT.TABLE_HEADERS.MODULES.VERSION_MIN',
                    sortable: true
                },
                {
                    type: 'text',
                    key: 'versionMax',
                    title: 'ABOUT.TABLE_HEADERS.MODULES.VERSION_MAX',
                    sortable: true
                }
            ]);

            this.status = new ObjectDataTableAdapter([this.ecmVersion.status], [
                { type: 'text', key: 'isReadOnly', title: 'ABOUT.TABLE_HEADERS.STATUS.READ_ONLY', sortable: true },
                {
                    type: 'text',
                    key: 'isAuditEnabled',
                    title: 'ABOUT.TABLE_HEADERS.STATUS.AUDIT_ENABLED',
                    sortable: true
                },
                {
                    type: 'text',
                    key: 'isQuickShareEnabled',
                    title: 'ABOUT.TABLE_HEADERS.STATUS.QUICK_SHARE_ENABLED',
                    sortable: true
                },
                {
                    type: 'text',
                    key: 'isThumbnailGenerationEnabled',
                    title: 'ABOUT.TABLE_HEADERS.STATUS.THUMBNAIL_ENABLED',
                    sortable: true
                }
            ]);

            this.license = new ObjectDataTableAdapter([this.ecmVersion.license], [
                { type: 'text', key: 'issuedAt', title: 'ABOUT.TABLE_HEADERS.LICENSE.ISSUES_AT', sortable: true },
                { type: 'text', key: 'expiresAt', title: 'ABOUT.TABLE_HEADERS.LICENSE.EXPIRES_AT', sortable: true },
                {
                    type: 'text',
                    key: 'remainingDays',
                    title: 'ABOUT.TABLE_HEADERS.LICENSE.REMAINING_DAYS',
                    sortable: true
                },
                { type: 'text', key: 'holder', title: 'ABOUT.TABLE_HEADERS.LICENSE.HOLDER', sortable: true },
                { type: 'text', key: 'mode', title: 'ABOUT.TABLE_HEADERS.LICENSE.MODE', sortable: true },
                {
                    type: 'text',
                    key: 'isClusterEnabled',
                    title: 'ABOUT.TABLE_HEADERS.LICENSE.CLUSTER_ENABLED',
                    sortable: true
                },
                {
                    type: 'text',
                    key: 'isCryptodocEnabled',
                    title: 'ABOUT.TABLE_HEADERS.LICENSE.CRYPTODOC_ENABLED',
                    sortable: true
                }
            ]);
        });
    }

    setBPMInfo() {
        this.discovery.getBpmProductInfo().subscribe((bpmVersion) => {
            this.bpmVersion = bpmVersion;
        });
    }
}
