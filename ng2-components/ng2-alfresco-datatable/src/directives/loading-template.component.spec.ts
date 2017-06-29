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

import { LoadingContentTemplateComponent } from './loading-template.component';
import { Injector } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { DataTableComponent } from '../components/datatable/datatable.component';

describe('LoadingContentTemplateComponent', () => {
    let injector: Injector;
    let loadingContentTemplateComponent: LoadingContentTemplateComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LoadingContentTemplateComponent,
                DataTableComponent
            ]
        });
        injector = getTestBed();
        loadingContentTemplateComponent = injector.get(LoadingContentTemplateComponent);
    });

    it('is defined', () => {
        expect(loadingContentTemplateComponent).toBeDefined();
    });
});
