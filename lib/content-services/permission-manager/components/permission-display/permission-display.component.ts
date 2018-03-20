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
import { NodesApiService, ObjectDataTableAdapter } from '@alfresco/adf-core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';

@Component({
    selector: 'adf-permission-display',
    templateUrl: './permission-display.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PermissionDisplayComponent implements OnInit {

    @Input()
    nodeId: string = '';

    permissionList: ObjectDataTableAdapter;

    constructor(private nodeService: NodesApiService) {

    }

    ngOnInit() {
        this.nodeService.getNode(this.nodeId).subscribe((node: MinimalNodeEntryEntity) => {
            /*tslint:disable-next-line*/
            console.log(node);
            const allPermissionList = node.permissions.locallySet ? node.permissions.inherited.concat(node.permissions.locallySet) : node.permissions.inherited;
            this.permissionList = new ObjectDataTableAdapter(allPermissionList, [
                {type: 'text', key: 'accessStatus', title: 'Accessed Status', sortable: true},
                {type: 'text', key: 'authorityId', title: 'Authority ID', sortable: true},
                {type: 'text', key: 'name', title: 'Name', sortable: true},
                {type: 'boolean', key: 'inherited', title: 'Inherited', sortable: true}
            ]);
        });
    }
}
