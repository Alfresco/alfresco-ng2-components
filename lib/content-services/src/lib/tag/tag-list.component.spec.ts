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
import { AppConfigService, setupTestBed } from '@alfresco/adf-core';
import { TagService } from './services/tag.service';
import { TagListComponent } from '././tag-list.component';
import { of } from 'rxjs';
import { ContentTestingModule } from '../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('TagList', () => {

    const dataTag = {
        list: {
            pagination: {
                count: 3,
                hasMoreItems: false,
                totalItems: 3,
                skipCount: 0,
                maxItems: 100
            },
            entries: [{
                entry: {tag: 'test1', id: '0ee933fa-57fc-4587-8a77-b787e814f1d2'}
            }, {entry: {tag: 'test2', id: 'fcb92659-1f10-41b4-9b17-851b72a3b597'}}, {
                entry: {tag: 'test3', id: 'fb4213c0-729d-466c-9a6c-ee2e937273bf'}
            }]
        }
    };

    let component: any;
    let fixture: ComponentFixture<TagListComponent>;
    let element: HTMLElement;
    let tagService: TagService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        const appConfig: AppConfigService = TestBed.inject(AppConfigService);
        appConfig.config.ecmHost = 'http://localhost:9876/ecm';

        tagService = TestBed.inject(TagService);
        spyOn(tagService, 'getAllTheTags').and.returnValue(of(dataTag));

        fixture = TestBed.createComponent(TagListComponent);

        element = fixture.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Rendering tests', () => {
        it('Tag list relative a single node should be rendered', (done) => {
            component.result.subscribe(() => {
                fixture.detectChanges();

                expect(element.querySelector('#tag_name_0').innerHTML).toBe('test1');
                expect(element.querySelector('#tag_name_1').innerHTML).toBe('test2');
                expect(element.querySelector('#tag_name_2').innerHTML).toBe('test3');

                done();
            });

            component.ngOnInit();
        });
    });
});
