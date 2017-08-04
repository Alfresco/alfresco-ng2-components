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

import { async, TestBed } from '@angular/core/testing';
import { CoreModule } from 'ng2-alfresco-core';
import { DataTableCellComponent } from '../components/datatable/datatable-cell.component';
import { DataTableComponent } from '../components/datatable/datatable.component';
import { MaterialModule } from '../material.module';
import { NoContentTemplateDirective } from './no-content-template.directive';

describe('NoContentTemplateDirective', () => {

    let dataTable: DataTableComponent;
    let directive: NoContentTemplateDirective;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                CoreModule.forRoot()
            ],
            declarations: [
                DataTableComponent,
                DataTableCellComponent,
                NoContentTemplateDirective
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        let fixture = TestBed.createComponent(DataTableComponent);
        dataTable = fixture.componentInstance;
        directive = new NoContentTemplateDirective(dataTable);
    });

    it('applies template to the datatable', () => {
        const template = {};
        directive.template = template;
        directive.ngAfterContentInit();
        expect(dataTable.noContentTemplate).toBe(template);
    });
});
