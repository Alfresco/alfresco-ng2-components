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
import { SitesService, setupTestBed, CoreModule } from '@alfresco/adf-core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TreeViewComponent } from './tree-view.component';
import { TreeViewService } from '../services/tree-view.service';
/*tslint:disable*/
fdescribe('TreeViewComponent', () => {

    let fixture: ComponentFixture<TreeViewComponent>;
    // let element: HTMLElement;
    // let treeService: TreeViewService;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ],
        declarations: [
            TreeViewComponent
        ]
    });

    describe('', () => {

        beforeEach(async(() => {
            // treeService = TestBed.get(TreeViewService);

            fixture = TestBed.createComponent(TreeViewComponent);
            // debug = fixture.debugElement;
            // element = fixture.nativeElement;
            // component = fixture.componentInstance;
        }));

        it('should be renedered', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();

            });
        }));
    });
});
