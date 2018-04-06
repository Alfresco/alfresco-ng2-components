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
import { NodesApiService } from '@alfresco/adf-core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { PermissionDisplayModel } from '../../models/permission.model';
import { NodePermissionService } from '../../services/node-permission.service';

@Component({
    selector: 'adf-permission-list',
    templateUrl: './permission-list.component.html',
    styleUrls: ['./permission-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PermissionListComponent implements OnInit {

    @Input()
    nodeId: string = '';

    permissionList: PermissionDisplayModel[];
    settableRoles: any[];

    constructor(private nodeService: NodesApiService,
                private nodePermissionService: NodePermissionService) {

    }

    ngOnInit() {
        this.fetchNodePermissions();
    }

    reload() {
        this.fetchNodePermissions();
    }

    private fetchNodePermissions() {
        this.nodeService.getNode(this.nodeId).subscribe((node: MinimalNodeEntryEntity) => {
            this.permissionList = this.getPermissionList(node);
            this.nodePermissionService.getNodeRoles(node).subscribe((settableList: string[])=>{
                this.settableRoles =  settableList;
            });
        });
    }

    private getPermissionList(node: MinimalNodeEntryEntity): PermissionDisplayModel[] {
        let allPermissions: PermissionDisplayModel[] = [];
        if (node.permissions.locallySet) {
            node.permissions.locallySet.map((element) => {
                let permission = new PermissionDisplayModel(element);
                allPermissions.push(permission);
            });
        }
        if (node.permissions.inherited) {
            node.permissions.inherited.map((element) => {
                let permissionInherited = new PermissionDisplayModel(element);
                permissionInherited.isInherited = true;
                allPermissions.push(permissionInherited);
            });
        }
        return allPermissions;
    }

}
