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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoleModel } from '../../models/role.model';

@Component({
  selector: 'adf-user-role-column',
  template: `
      <mat-form-field floatLabel="never">
          <mat-select
              (click)="$event.stopPropagation()"
              [placeholder]="placeholder | translate"
              [value]="value"
              [disabled]="disabled"
              (selectionChange)="onRoleChanged($event.value)">
              <mat-option *ngFor="let role of roles" [value]="role.role"
              >{{ role.label | adfLocalizedRole }}
              </mat-option>
          </mat-select>
      </mat-form-field>
  `,
    host: { class: 'adf-user-role-column adf-datatable-content-cell adf-expand-cell-4' }
})
export class UserRoleColumnComponent {

    @Input()
    roles: RoleModel[];

    @Input()
    value: string;

    @Input()
    disabled = false;

    @Input()
    placeholder: string = 'PERMISSION_MANAGER.LABELS.SELECT-ROLE';

    @Output()
    roleChanged: EventEmitter<string> = new EventEmitter<string>();

    onRoleChanged(newRole: string) {
        this.value = newRole;
        this.roleChanged.emit(newRole);
    }
}
