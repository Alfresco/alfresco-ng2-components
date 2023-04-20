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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed, DataRowActionEvent, DataRowEvent, ObjectDataRow } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { UserEventModel } from '../../../task-list/models/user-event.model';
import { PeopleListComponent } from './people-list.component';
import { ProcessTestingModule } from '../../../testing/process.testing.module';
import { UserProcessModel } from '../../../common/models/user-process.model';

const fakeUser: UserProcessModel = new UserProcessModel({
    id: 1,
    firstName: 'fake-name',
    lastName: 'fake-last',
    email: 'fake@mail.com'
});

describe('PeopleListComponent', () => {

    let peopleListComponent: PeopleListComponent;
    let fixture: ComponentFixture<PeopleListComponent>;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PeopleListComponent);
        peopleListComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should emit row click event', (done) => {
        const row = new ObjectDataRow(fakeUser);
        const rowEvent = new DataRowEvent(row, null);

        peopleListComponent.clickRow.subscribe((selectedUser) => {
            expect(selectedUser.id).toEqual(1);
            expect(selectedUser.email).toEqual('fake@mail.com');
            expect(peopleListComponent.user.id).toEqual(1);
            expect(peopleListComponent.user.email).toEqual('fake@mail.com');
            done();
        });

        peopleListComponent.selectUser(rowEvent);
    });

    it('should emit row action event', (done) => {
        const row = new ObjectDataRow(fakeUser);
        const removeObj = {
            name: 'remove',
            title: 'Remove'
        };
        const rowActionEvent = new DataRowActionEvent(row, removeObj);

        peopleListComponent.clickAction.subscribe((selectedAction: UserEventModel) => {
            expect(selectedAction.type).toEqual('remove');
            expect(selectedAction.value.id).toEqual(1);
            expect(selectedAction.value.email).toEqual('fake@mail.com');
            done();
        });

        peopleListComponent.onExecuteRowAction(rowActionEvent);
    });
});
