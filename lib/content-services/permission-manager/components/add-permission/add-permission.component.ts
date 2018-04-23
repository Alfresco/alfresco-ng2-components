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

import { Component, ViewEncapsulation, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
import { SearchPermissionConfigurationService } from './search-config-permission.service';
import { SearchService, SearchConfigurationService, NodesApiService } from '@alfresco/adf-core';
import { SearchComponent } from '../../../search/components/search.component';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MinimalNodeEntity, PermissionElement, MinimalNodeEntryEntity } from 'alfresco-js-api';
import { NodePermissionService } from '../../services/node-permission.service';

@Component({
    selector: 'adf-add-permission',
    templateUrl: './add-permission.component.html',
    styleUrls: ['./add-permission.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: SearchConfigurationService, useClass: SearchPermissionConfigurationService },
        SearchService
    ]
})
export class AddPermissionComponent implements OnInit {

    @ViewChild('search')
    search: SearchComponent;

    @Input()
    nodeId: string;

    @Output()
    select: EventEmitter<any> = new EventEmitter();

    @Output()
    success: EventEmitter<any> = new EventEmitter();

    @Output()
    error: EventEmitter<any> = new EventEmitter();

    searchInput: FormControl = new FormControl();
    searchedWord = '';
    debounceSearch: number = 200;

    selectedItems: MinimalNodeEntity[] = [];
    currentNode: MinimalNodeEntryEntity;
    currentNodeRoles: string[];

    constructor(private nodeService: NodesApiService,
                private nodePermissionService: NodePermissionService) {
        this.searchInput.valueChanges
        .pipe(
            debounceTime(this.debounceSearch)
        )
        .subscribe((searchValue) => {
            this.searchedWord = searchValue;
            if (!searchValue) {
                this.search.resetResults();
            }
        });
    }

    ngOnInit() {
        this.nodeService.getNode(this.nodeId).subscribe(( node: MinimalNodeEntryEntity) => {
            this.currentNode = node;
            this.nodePermissionService.getNodeRoles(node).subscribe((nodeRoles: string[]) => {
                this.currentNodeRoles = nodeRoles;
             });
        });
    }

    elementClicked(item: MinimalNodeEntity) {
        if (this.isAlreadySelected(item)) {
            this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
        } else {
            this.selectedItems.push(item);
        }
        this.select.emit(this.selectedItems);
    }

    private isAlreadySelected(item: MinimalNodeEntity): boolean {
        return this.selectedItems.indexOf(item) >= 0;
    }

    clearSearch() {
        this.searchedWord = '';
        this.selectedItems.splice(0, this.selectedItems.length);
        this.search.resetResults();
    }

    applySelection() {
        const permissionElementList = this.transformNodeToPermissionElement(this.selectedItems);
        this.nodePermissionService.updateLocallySetPermissions(this.currentNode, permissionElementList)
            .subscribe((node) => {
                this.success.emit(node);
            });
    }

    private transformNodeToPermissionElement(nodes: MinimalNodeEntity[]): PermissionElement[] {
        return nodes.map((node) => {
            let newPermissionElement: PermissionElement = <PermissionElement> {
                'authorityId': node.entry.properties['cm:authorityName'] ?
                    node.entry.properties['cm:authorityName'] :
                    node.entry.properties['cm:userName'],
                'name': this.currentNodeRoles[0],
                'accessStatus': 'ALLOWED'
            };
            return newPermissionElement;
        });
    }

}
