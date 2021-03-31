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

@Component({
    selector: 'adf-user-name-column',
    template: `
        <div class="adf-datatable-cell-value adf-user">
            <div class="adf-user-name-column"  title="{{ displayText$ | async }}">
                {{ displayText$ | async }}
            </div>

            <div class="adf-user-email-column" title="{{ subTitleText$ | async }}">
                {{ subTitleText$ | async }}
            </div>
        </div>
    `,
    host: { class: 'adf-user-name-column adf-datatable-content-cell' },
    styleUrls: [ './user-name-column.component.scss' ]
})
export class UserNameColumnComponent implements OnInit {
    @Input()
    context: any;

    displayText$ = new BehaviorSubject<string>('');
    subTitleText$ = new BehaviorSubject<string>('');

    ngOnInit() {
        this.updateValue();
    }

    protected updateValue() {
        const { user, group } = this.context.row.obj.entry;
        let name: string, email: string = '';

        if (user) {
            name = `${user.firstName ?? ''} ${user.lastName ?? ''}`;
            email = user.email ?? '';
        }

        if (group) {
            name = `${user.displayName}`;
        }

        this.displayText$.next(name);
        this.subTitleText$.next(email);
    }
}
