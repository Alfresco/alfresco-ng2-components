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
import { By } from '@angular/platform-browser';
import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';
import { Observable } from 'rxjs/Rx';
import { EcmModelService } from '../services/ecm-model.service';
import { FormService } from '../services/form.service';
import { FormListComponent } from './form-list.component';
import { MaterialModule } from './material.module';

describe('TaskAttachmentList', () => {

    let component: FormListComponent;
    let fixture: ComponentFixture<FormListComponent>;
    let service: FormService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                DataTableModule,
                MaterialModule
            ],
            declarations: [
                FormListComponent
            ],
            providers: [
                FormService,
                EcmModelService
            ]
        }).compileComponents();

        let translateService = TestBed.get(AlfrescoTranslationService);
        spyOn(translateService, 'addTranslationFolder').and.stub();
        spyOn(translateService, 'get').and.callFake((key) => {
            return Observable.of(key);
        });
    }));

    beforeEach(async(() => {

        fixture = TestBed.createComponent(FormListComponent);
        component = fixture.componentInstance;

        service = TestBed.get(FormService);

    }));

    it('should show the forms as a list', async(() => {
        spyOn(service, 'getForms').and.returnValue(Observable.of([
            { name: 'FakeName-1', lastUpdatedByFullName: 'FakeUser-1', lastUpdated: '2017-01-02' },
            { name: 'FakeName-2', lastUpdatedByFullName: 'FakeUser-2', lastUpdated: '2017-01-03' }
        ]));

        component.ngOnChanges({});

        fixture.whenStable()
            .then(() => {
                fixture.detectChanges();
                expect(fixture.debugElement.queryAll(By.css('alfresco-datatable tbody tr')).length).toBe(2);
            });
    }));

});
