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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DataTableComponent } from '../components/datatable/datatable.component';
import { LoadingContentTemplateDirective } from './loading-template.directive';
import { setupTestBed } from '../../testing/setup-test-bed';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('LoadingContentTemplateDirective', () => {

    let fixture: ComponentFixture<DataTableComponent>;
    let dataTable: DataTableComponent;
    let directive: LoadingContentTemplateDirective;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DataTableComponent);
        dataTable = fixture.componentInstance;
        directive = new LoadingContentTemplateDirective(dataTable);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('applies template to the datatable', () => {
        const template: any = 'test template';
        directive.template = template;
        directive.ngAfterContentInit();
        expect(dataTable.loadingTemplate).toBe(template);
    });
});
