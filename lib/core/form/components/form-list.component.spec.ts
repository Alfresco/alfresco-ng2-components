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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslationService, TranslationMock } from '../../index';
import { of } from 'rxjs';
import { FormService } from '../services/form.service';
import { FormListComponent } from './form-list.component';
import { setupTestBed } from '../../testing/setupTestBed';
import { CoreModule } from '../../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TaskAttachmentList', () => {

    let component: FormListComponent;
    let fixture: ComponentFixture<FormListComponent>;
    let service: FormService;
    let element: any;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ],
        providers: [
            { provide: TranslationService, useClass: TranslationMock }
        ]
    });

    beforeEach(async(() => {

        fixture = TestBed.createComponent(FormListComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement.nativeElement;
        service = TestBed.get(FormService);

    }));

    it('should show the forms as a list', async(() => {
        spyOn(service, 'getForms').and.returnValue(of([
            { name: 'FakeName-1', lastUpdatedByFullName: 'FakeUser-1', lastUpdated: '2017-01-02' },
            { name: 'FakeName-2', lastUpdatedByFullName: 'FakeUser-2', lastUpdated: '2017-01-03' }
        ]));

        component.ngOnChanges();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(element.querySelectorAll('.adf-datatable-body > .adf-datatable-row').length).toBe(2);
        });
    }));

});
