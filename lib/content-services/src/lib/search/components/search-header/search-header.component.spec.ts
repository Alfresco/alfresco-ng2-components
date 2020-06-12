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
import { Subject } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NodePaging } from '@alfresco/js-api';
import { AppConfigService, SearchService, setupTestBed } from '@alfresco/adf-core';
import { SearchHeaderComponent } from './search-header.component';
import { SearchQueryBuilderService } from '../../search-query-builder.service';
import { SearchHeaderQueryBuilderService } from '../../search-header-query-builder.service';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { fakeNodePaging } from '../../../mock';

const mockCategory: any = {
    'id': 'queryName',
    'name': 'Name',
    'columnKey': 'name',
    'enabled': true,
    'expanded': true,
    'component': {
        'selector': 'text',
        'settings': {
            'pattern': "cm:name:'(.*?)'",
            'field': 'cm:name',
            'placeholder': 'Enter the name'
        }
    }
};

describe('SearchHeaderComponent', () => {
    let fixture: ComponentFixture<SearchHeaderComponent>;
    let component: SearchHeaderComponent;
    let queryBuilder: SearchHeaderQueryBuilderService;
    let appConfigService: AppConfigService;
    const searchMock: any = {
        dataLoaded: new Subject()
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        providers: [
            {
                provide: SearchService,
                useValue: searchMock
            },
            {
                provide: SearchQueryBuilderService,
                useClass: SearchHeaderQueryBuilderService
            }
        ]
    });

    beforeEach(() => {
        queryBuilder = TestBed.get(SearchHeaderQueryBuilderService);
        fixture = TestBed.createComponent(SearchHeaderComponent);
        appConfigService = TestBed.get(AppConfigService);
        component = fixture.componentInstance;
        component.col = {key: '123', type: 'text'};
        component.update = new EventEmitter();
        spyOn(queryBuilder, 'getCategoryForColumn').and.returnValue(mockCategory);
        fixture.detectChanges();
    });

    afterEach(() => fixture.destroy());

    it('should emit the node paging received from the queryBuilder after the filter gets applied', (done) => {
        const mockNodePaging: NodePaging = <NodePaging> fakeNodePaging;
        spyOn(queryBuilder, 'execute').and.callFake(() => {
            queryBuilder.executed.next(mockNodePaging);
        });

        const applyButton = fixture.debugElement.nativeElement.querySelector('.adf-filter-button');
        applyButton.click();

        component.update.subscribe((newNodePaging) => {
            expect(newNodePaging).toBe(mockNodePaging);
            done();
        });
    });
});
