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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { DataRowActionEvent, DataRowEvent, DataTableModule, ObjectDataRow } from 'ng2-alfresco-datatable';
import { Observable } from 'rxjs/Observable';
import { UserEventModel } from '../models/user-event.model';
import { User } from '../models/user.model';
import { PeopleListComponent } from './people-list.component';

declare let jasmine: any;

const fakeUser: User = new User({
    id: '1',
    firstName: 'fake-name',
    lastName: 'fake-last',
    email: 'fake@mail.com'
});

describe('PeopleListComponent', () => {

    let peopleListComponent: PeopleListComponent;
    let fixture: ComponentFixture<PeopleListComponent>;
    let element: HTMLElement;
    let componentHandler;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                DataTableModule
            ],
            declarations: [
                PeopleListComponent
            ]
        }).compileComponents().then(() => {

            let translateService = TestBed.get(AlfrescoTranslationService);
            spyOn(translateService, 'addTranslationFolder').and.stub();
            spyOn(translateService.translate, 'get').and.callFake((key) => {
                return Observable.of(key);
            });

            fixture = TestBed.createComponent(PeopleListComponent);
            peopleListComponent = fixture.componentInstance;
            element = fixture.nativeElement;
            componentHandler = jasmine.createSpyObj('componentHandler', [
                'upgradeAllRegistered'
            ]);

            window['componentHandler'] = componentHandler;
            fixture.detectChanges();
        });
    }));

    it('should emit row click event', (done) => {
        let row = new ObjectDataRow(fakeUser);
        let rowEvent = new DataRowEvent(row, null);

        peopleListComponent.clickRow.subscribe(selectedUser => {
            expect(selectedUser.id).toEqual('1');
            expect(selectedUser.email).toEqual('fake@mail.com');
            expect(peopleListComponent.user.id).toEqual('1');
            expect(peopleListComponent.user.email).toEqual('fake@mail.com');
            done();
        });

        peopleListComponent.selectUser(rowEvent);
    });

    it('should emit row action event', (done) => {
        let row = new ObjectDataRow(fakeUser);
        let removeObj = {
            name: 'remove',
            title: 'Remove'
        };
        let rowActionEvent = new DataRowActionEvent(row, removeObj);

        peopleListComponent.clickAction.subscribe((selectedAction: UserEventModel) => {
            expect(selectedAction.type).toEqual('remove');
            expect(selectedAction.value.id).toEqual('1');
            expect(selectedAction.value.email).toEqual('fake@mail.com');
            done();
        });

        peopleListComponent.onExecuteRowAction(rowActionEvent);
    });
});
