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

import { DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { ActivitiProcessInstanceListComponent } from './activiti-processlist.component';
import { TranslationMock } from './../assets/translation.service.mock';
import { ObjectDataTableAdapter } from 'ng2-alfresco-datatable';
import { FilterRepresentationModel } from 'ng2-activiti-tasklist';
import { ActivitiProcessService } from '../services/activiti-process.service';
import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';

describe('ActivitiProcessInstanceListComponent', () => {

    let fixture: ComponentFixture<ActivitiProcessInstanceListComponent>;
    let component: ActivitiProcessInstanceListComponent;
    let element: DebugElement;
    let service: ActivitiProcessService;

    let mockFilter = new FilterRepresentationModel({
        appId: '1',
        filter: {
            name: '',
            state: '',
            sort: ''
        }
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                DataTableModule
            ],
            declarations: [ ActivitiProcessInstanceListComponent ], // declare the test component
            providers: [
                ActivitiProcessService,
                {provide: AlfrescoTranslationService, useClass: TranslationMock}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(ActivitiProcessInstanceListComponent);
            component = fixture.componentInstance;
            element = fixture.debugElement;
            service = element.injector.get(ActivitiProcessService);
        });
    }));

    it('should use the default schemaColumn as default', () => {
        component.ngOnInit();
        expect(component.data.getColumns()).toBeDefined();
        expect(component.data.getColumns().length).toEqual(4);
    });

    it('should use the schemaColumn passed in input', () => {
        component.data = new ObjectDataTableAdapter(
            [],
            [
                {type: 'text', key: 'fake-id', title: 'Name'}
            ]
        );

        component.ngOnInit();
        expect(component.data.getColumns()).toBeDefined();
        expect(component.data.getColumns().length).toEqual(1);
    });

    it('should fetch process instances when a filter is provided', () => {
        let getProcessInstancesSpy = spyOn(service, 'getProcessInstances').and.returnValue(Observable.of([]));
        component.filter = mockFilter;
        fixture.detectChanges();
        expect(getProcessInstancesSpy).toHaveBeenCalled();
    });

    it('should NOT fetch process instances if filter not provided', () => {
        let getProcessInstancesSpy = spyOn(service, 'getProcessInstances').and.returnValue(Observable.of([]));
        fixture.detectChanges();
        expect(getProcessInstancesSpy).not.toHaveBeenCalled();
    });

    describe('component changes', () => {

        it('should fetch new process instances when filter changed', () => {
            component.filter = new FilterRepresentationModel({});
            fixture.detectChanges();
            let getProcessInstancesSpy = spyOn(service, 'getProcessInstances').and.returnValue(Observable.of([]));
            component.ngOnChanges({ filter: new SimpleChange(mockFilter, mockFilter) });
            expect(getProcessInstancesSpy).toHaveBeenCalled();
        });

        it('should NOT fetch new process instances when properties apart from filter changed', () => {
            component.filter = mockFilter;
            fixture.detectChanges();
            let getProcessInstancesSpy = spyOn(service, 'getProcessInstances').and.returnValue(Observable.of([]));
            component.ngOnChanges({});
            expect(getProcessInstancesSpy).not.toHaveBeenCalled();
        });

    });

});
