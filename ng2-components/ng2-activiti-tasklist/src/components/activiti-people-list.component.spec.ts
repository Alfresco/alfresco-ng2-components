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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { CoreModule, AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ActivitiPeopleList } from './activiti-people-list.component';
import { User, UserEventModel } from '../models/index';
import { DataTableModule, ObjectDataRow, DataRowEvent, DataRowActionEvent } from 'ng2-alfresco-datatable';

declare let jasmine: any;

const fakeUser: User = new User({
    id: '1',
    firstName: 'fake-name',
    lastName: 'fake-last',
    email: 'fake@mail.com'
});

describe('ActivitiPeopleList', () => {

    let activitiPeopleListComponent: ActivitiPeopleList;
    let fixture: ComponentFixture<ActivitiPeopleList>;
    let element: HTMLElement;
    let componentHandler;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                DataTableModule
            ],
            declarations: [
                ActivitiPeopleList
            ]
        }).compileComponents().then(() => {

            let translateService = TestBed.get(AlfrescoTranslationService);
            spyOn(translateService, 'addTranslationFolder').and.stub();
            spyOn(translateService.translate, 'get').and.callFake((key) => { return Observable.of(key); });

            fixture = TestBed.createComponent(ActivitiPeopleList);
            activitiPeopleListComponent = fixture.componentInstance;
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

        activitiPeopleListComponent.clickRow.subscribe(selectedUser => {
            expect(selectedUser.id).toEqual('1');
            expect(selectedUser.email).toEqual('fake@mail.com');
            expect(activitiPeopleListComponent.user.id).toEqual('1');
            expect(activitiPeopleListComponent.user.email).toEqual('fake@mail.com');
            done();
        });

        activitiPeopleListComponent.selectUser(rowEvent);
    });

    it('should emit row action event', (done) => {
        let row = new ObjectDataRow(fakeUser);
        let removeObj = {
            name: 'remove',
            title: 'Remove'
        };
        let rowActionEvent = new DataRowActionEvent(row, removeObj);

        activitiPeopleListComponent.clickAction.subscribe((selectedAction: UserEventModel) => {
            expect(selectedAction.type).toEqual('remove');
            expect(selectedAction.value.id).toEqual('1');
            expect(selectedAction.value.email).toEqual('fake@mail.com');
            done();
        });

        activitiPeopleListComponent.onExecuteRowAction(rowActionEvent);
    });
});
