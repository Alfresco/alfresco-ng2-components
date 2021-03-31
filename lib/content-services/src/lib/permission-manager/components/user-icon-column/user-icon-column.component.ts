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

import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '@alfresco/adf-core';

@Component({
    selector: 'adf-user-icon-column',
    template: `
        <div class="adf-cell-value" *ngIf="!context.row.isSelected">
            <ng-container *ngIf="!showIcon && (displayText$ | async) as user">
                <div [outerHTML]="user | usernameInitials: 'adf-userinfo-profile-initials'"></div>
            </ng-container>

            <ng-container *ngIf="showIcon">
                <mat-icon *ngIf="isUser">perm_identity</mat-icon>
                <mat-icon *ngIf="!isUser">people_alt</mat-icon>
            </ng-container>
        </div>

        <mat-icon *ngIf="context.row.isSelected" class="adf-cell-value" svgIcon="selected"></mat-icon>
    `,
    host: { class: 'adf-user-icon-column adf-datatable-content-cell' }
})
export class UserIconColumnComponent implements OnInit {
    @Input()
    context: any;

    @Input()
    showIcon = false;

    displayText$ = new BehaviorSubject<User>(null);
    isUser = false;

    ngOnInit() {
        this.updateValue();
    }

    protected updateValue() {
        const { person, group } = this.context.row.obj.entry;
        this.isUser = !!person;
        this.displayText$.next(person || group);
    }
}
