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

import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NodeEntry, PermissionElement } from '@alfresco/js-api';
import { AddPermissionDialogData } from './add-permission-dialog-data.interface';
import { MemberModel } from '../../models/member.model';

@Component({
    selector: 'adf-add-permission-dialog',
    templateUrl: './add-permission-dialog.component.html',
    styleUrls: ['./add-permission-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddPermissionDialogComponent {
    isSearchActive = true;
    selectedMembers: MemberModel[] = [];

    private existingMembers: PermissionElement[] = [];
    currentSelection: NodeEntry[] = [];

    constructor(@Inject(MAT_DIALOG_DATA) public data: AddPermissionDialogData,
                private dialogRef: MatDialogRef<AddPermissionDialogComponent>) {
        this.existingMembers = this.data.node.permissions.locallySet || [];
    }

    onSelect(items: NodeEntry[]) {
        this.currentSelection = items;
    }

    onAddClicked() {
        const selection = this.selectedMembers.filter(member => !member.readonly).map(member => member.toPermissionElement());
        this.data.confirm.next(selection);
        this.data.confirm.complete();
    }

    onSearchAddClicked() {
        const newMembers = this.currentSelection.map(item => MemberModel.parseFromSearchResult(item))
            .filter(({id}) => !this.selectedMembers.find((member) => member.id === id));
        this.selectedMembers = this.selectedMembers.concat(newMembers);

        this.selectedMembers.forEach((member) => {
            const existingMember = this.existingMembers.find(({authorityId}) => authorityId === member.id);
            if (!!existingMember) {
                member.role = existingMember.name;
                member.accessStatus = existingMember.accessStatus;
                member.readonly = true; // make role non editable
            }
        });
        this.disableSearch();
    }

    canCloseDialog() {
        if (!!this.selectedMembers.length) {
            this.disableSearch();
        } else {
            this.dialogRef.close();
        }
    }

    enableSearch() {
        this.isSearchActive = true;
    }

    disableSearch() {
        this.isSearchActive = false;
    }

    onBulkUpdate(role: string) {
        this.selectedMembers.filter(member => !member.readonly)
            .forEach(member => (member.role = role));
    }

    onMemberDelete({ id }: MemberModel) {
        const index = this.selectedMembers.findIndex((member) => member.id === id);
        this.selectedMembers.splice(index, 1);
        if (this.selectedMembers.length === 0) {
            this.enableSearch();
            this.currentSelection = [];
        }
    }

    onMemberUpdate(role: string, member: MemberModel) {
        const memberInstance = this.selectedMembers.find(({ id }) => id === member.id);
        memberInstance.role = role;
    }

    isValid(): boolean {
        return this.selectedMembers.filter(({readonly}) => !readonly).length && this.selectedMembers.every(({role}) => !!role);
    }
}
