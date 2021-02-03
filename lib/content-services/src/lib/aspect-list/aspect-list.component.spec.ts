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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodesApiService, setupTestBed } from '@alfresco/adf-core';
import { ContentTestingModule } from '../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { AspectListComponent } from './aspect-list.component';
import { AspectListService } from './aspect-list.service';
import { of } from 'rxjs';
import { AspectEntry } from '@alfresco/js-api';

const aspectListMock: AspectEntry[] = [{
    entry: {
        parentId: 'frs:aspectZero',
        id: 'frs:AspectOne',
        description: 'First Aspect with random description',
        title: 'FirstAspect',
        properties: [
            {
                id: 'channelPassword',
                title: 'The authenticated channel password',
                dataType: 'd:propA'
            },
            {
                id: 'channelUsername',
                title: 'The authenticated channel username',
                dataType: 'd:propB'
            }
        ]
    }
},
{
    entry: {
        parentId: 'frs:AspectZer',
        id: 'frs:SecondAspect',
        description: 'Second Aspect description',
        title: 'SecondAspect',
        properties: [
            {
                id: 'assetId',
                title: 'Published Asset Id',
                dataType: 'd:text'
            },
            {
                id: 'assetUrl',
                title: 'Published Asset URL',
                dataType: 'd:text'
            }
        ]
    }
}];

describe('AspectListComponent', () => {

    let component: AspectListComponent;
    let fixture: ComponentFixture<AspectListComponent>;
    let aspectListService: AspectListService;
    let nodeService: NodesApiService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        providers: [AspectListService]
    });

    describe('When passing a node id', () => {

        beforeEach(() => {
            fixture = TestBed.createComponent(AspectListComponent);
            component = fixture.componentInstance;
            aspectListService = TestBed.inject(AspectListService);
            spyOn(aspectListService, 'getAspects').and.returnValue(of(aspectListMock));
            spyOn(aspectListService, 'getVisibleAspects').and.returnValue(['frs:AspectOne']);
            nodeService = TestBed.inject(NodesApiService);
            spyOn(nodeService, 'getNode').and.returnValue(of({ id: 'fake-node-id', aspectNames: ['frs:AspectOne'] }));
            component.nodeId = 'fake-node-id';
            fixture.detectChanges();
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('should show all the aspects', () => {
            const firstElement = fixture.nativeElement.querySelector('#aspect-list-FirstAspect');
            const secondElement = fixture.nativeElement.querySelector('#aspect-list-SecondAspect');

            expect(firstElement).not.toBeNull();
            expect(firstElement).toBeDefined();
            expect(secondElement).not.toBeNull();
            expect(secondElement).toBeDefined();
        });

        it('should show the details when a row is clicked', () => {
            const firstElement = fixture.nativeElement.querySelector('#aspect-list-FirstAspect');
            firstElement.click();
            fixture.detectChanges();
            const firstElementDesc = fixture.nativeElement.querySelector('#aspect-list-0-description');
            expect(firstElementDesc).not.toBeNull();
            expect(firstElementDesc).toBeDefined();

            const firstElementPropertyTable = fixture.nativeElement.querySelector('#aspect-list-0-properties-table');
            expect(firstElementPropertyTable).not.toBeNull();
            expect(firstElementPropertyTable).toBeDefined();
            const nameProperties = fixture.nativeElement.querySelectorAll('#aspect-list-0-properties-table tbody .mat-column-name');
            expect(nameProperties[0]).not.toBeNull();
            expect(nameProperties[0]).toBeDefined();
            expect(nameProperties[0].innerText).toBe('channelPassword');
            expect(nameProperties[1]).not.toBeNull();
            expect(nameProperties[1]).toBeDefined();
            expect(nameProperties[1].innerText).toBe('channelUsername');

            const titleProperties = fixture.nativeElement.querySelectorAll('#aspect-list-0-properties-table tbody .mat-column-title');
            expect(titleProperties[0]).not.toBeNull();
            expect(titleProperties[0]).toBeDefined();
            expect(titleProperties[0].innerText).toBe('The authenticated channel password');
            expect(titleProperties[1]).not.toBeNull();
            expect(titleProperties[1]).toBeDefined();
            expect(titleProperties[1].innerText).toBe('The authenticated channel username');

            const dataTypeProperties = fixture.nativeElement.querySelectorAll('#aspect-list-0-properties-table tbody .mat-column-dataType');
            expect(dataTypeProperties[0]).not.toBeNull();
            expect(dataTypeProperties[0]).toBeDefined();
            expect(dataTypeProperties[0].innerText).toBe('d:propA');
            expect(dataTypeProperties[1]).not.toBeNull();
            expect(dataTypeProperties[1]).toBeDefined();
            expect(dataTypeProperties[1].innerText).toBe('d:propB');
        });

        it('should show as checked the node properties', () => {
            const firstAspectCheckbox: HTMLInputElement = fixture.nativeElement.querySelector('#aspect-list-0-check-input');
            expect(firstAspectCheckbox).toBeDefined();
            expect(firstAspectCheckbox).not.toBeNull();
            expect(firstAspectCheckbox.checked).toBeTruthy();
        });

        it('should remove aspects unchecked', (done) => {
            const secondElement = fixture.nativeElement.querySelector('#aspect-list-1-check-input');
            expect(secondElement).toBeDefined();
            expect(secondElement).not.toBeNull();
            expect(secondElement.checked).toBeFalsy();
            secondElement.click();
            fixture.detectChanges();
            expect(component.nodeAspects.length).toBe(2);
            expect(component.nodeAspects[1]).toBe('frs:SecondAspect');
            component.valueChanged.subscribe((aspects) => {
                expect(aspects.length).toBe(1);
                expect(aspects[0]).toBe('frs:AspectOne');
                done();
            });
            secondElement.click();
            fixture.detectChanges();
        });

        it('should reset the properties on reset', (done) => {
            const secondElement = fixture.nativeElement.querySelector('#aspect-list-1-check-input');
            expect(secondElement).toBeDefined();
            expect(secondElement).not.toBeNull();
            expect(secondElement.checked).toBeFalsy();
            secondElement.click();
            fixture.detectChanges();
            expect(component.nodeAspects.length).toBe(2);
            component.valueChanged.subscribe((aspects) => {
                expect(aspects.length).toBe(1);
                done();
            });
            component.reset();
        });

        it('should clear all the properties on clear', (done) => {
            expect(component.nodeAspects.length).toBe(1);
            component.valueChanged.subscribe((aspects) => {
                expect(aspects.length).toBe(0);
                done();
            });
            component.clear();
        });
    });

    describe('When no node id is passed', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(AspectListComponent);
            component = fixture.componentInstance;
            aspectListService = TestBed.inject(AspectListService);
            spyOn(aspectListService, 'getAspects').and.returnValue(of(aspectListMock));
            fixture.detectChanges();
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('should show all the aspects', () => {
            const firstElement = fixture.nativeElement.querySelector('#aspect-list-FirstAspect');
            const secondElement = fixture.nativeElement.querySelector('#aspect-list-SecondAspect');

            expect(firstElement).not.toBeNull();
            expect(firstElement).toBeDefined();
            expect(secondElement).not.toBeNull();
            expect(secondElement).toBeDefined();
        });
    });

});
