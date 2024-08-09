/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { NodesApiService } from '../common/services/nodes-api.service';
import { ContentTestingModule } from '../testing/content.testing.module';
import { AspectListComponent } from './aspect-list.component';
import { AspectListService } from './services/aspect-list.service';
import { EMPTY, of } from 'rxjs';
import { AspectEntry } from '@alfresco/js-api';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatExpansionPanelHarness } from '@angular/material/expansion/testing';
import { MatTableHarness } from '@angular/material/table/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';

const aspectListMock: AspectEntry[] = [
    {
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
    }
];

const customAspectListMock: AspectEntry[] = [
    {
        entry: {
            parentId: 'cst:parentAspect',
            id: 'cst:customAspect',
            description: 'Custom Aspect with random description',
            title: 'CustomAspect',
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
            parentId: 'cst:commonaspect',
            id: 'cst:nonamedAspect',
            description: '',
            title: '',
            properties: [
                {
                    id: 'channelPassword',
                    title: 'The authenticated channel password',
                    dataType: 'd:propA'
                }
            ]
        }
    }
];

describe('AspectListComponent', () => {
    let loader: HarnessLoader;
    let component: AspectListComponent;
    let fixture: ComponentFixture<AspectListComponent>;
    let aspectListService: AspectListService;
    let nodeService: NodesApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule, AspectListComponent],
            providers: [AspectListService]
        });
    });

    describe('Loading', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(AspectListComponent);
            component = fixture.componentInstance;
            nodeService = TestBed.inject(NodesApiService);
            aspectListService = TestBed.inject(AspectListService);
            loader = TestbedHarnessEnvironment.loader(fixture);
        });

        it('should show the loading spinner when result is loading', async () => {
            spyOn(nodeService, 'getNode').and.returnValue(EMPTY);
            spyOn(aspectListService, 'getAspects').and.returnValue(EMPTY);
            fixture.detectChanges();

            expect(await loader.hasHarness(MatProgressSpinnerHarness)).toBe(true);
        });
    });

    describe('When passing a node id', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(AspectListComponent);
            component = fixture.componentInstance;
            aspectListService = TestBed.inject(AspectListService);
            spyOn(aspectListService, 'getAspects').and.returnValue(of([...aspectListMock, ...customAspectListMock]));
            spyOn(aspectListService, 'getCustomAspects').and.returnValue(of(customAspectListMock));
            spyOn(aspectListService, 'getVisibleAspects').and.returnValue(['frs:AspectOne']);
            nodeService = TestBed.inject(NodesApiService);
            spyOn(nodeService, 'getNode').and.returnValue(of({ id: 'fake-node-id', aspectNames: ['frs:AspectOne', 'stored:aspect'] } as any));
            component.nodeId = 'fake-node-id';
            loader = TestbedHarnessEnvironment.loader(fixture);
        });

        afterEach(() => {
            fixture.destroy();
        });

        describe('without excluding aspects', () => {
            beforeEach(() => {
                fixture.detectChanges();
            });

            it('should return true when same aspect list selected', () => {
                expect(component.hasEqualAspect).toBe(true);
            });

            it('should return false when different aspect list selected', () => {
                component.clear();
                expect(component.hasEqualAspect).toBe(false);
            });

            it('should show all the aspects', async () => {
                expect(await loader.hasHarness(MatExpansionPanelHarness.with({ selector: '#aspect-list-FirstAspect' }))).toBe(true);
                expect(await loader.hasHarness(MatExpansionPanelHarness.with({ selector: '#aspect-list-SecondAspect' }))).toBe(true);
            });

            it('should show aspect id when name or title is not set', () => {
                const noNameAspect = fixture.nativeElement.querySelector('#aspect-list-cst-nonamedAspect .adf-aspect-list-element-title');
                expect(noNameAspect).toBeDefined();
                expect(noNameAspect).not.toBeNull();
                expect(noNameAspect.innerText).toBe('cst:nonamedAspect');
            });

            it('should show aspect`s properties in expanded aspect panel', async () => {
                const panel = await loader.getHarness(MatExpansionPanelHarness);
                expect(await panel.getDescription()).not.toBeNull();

                const table = await panel.getHarness(MatTableHarness);
                const [row1, row2] = await table.getRows();
                const [r1c1, r1c2, r1c3] = await row1.getCells();
                const [r2c1, r2c2, r2c3] = await row2.getCells();
                expect(await r1c1.getText()).toBe('channelPassword');
                expect(await r1c2.getText()).toBe('The authenticated channel password');
                expect(await r1c3.getText()).toBe('d:propA');
                expect(await r2c1.getText()).toBe('channelUsername');
                expect(await r2c2.getText()).toBe('The authenticated channel username');
                expect(await r2c3.getText()).toBe('d:propB');
            });

            it('should show node aspects as checked', async () => {
                const panel = await loader.getHarness(MatExpansionPanelHarness);
                const checkbox = await panel.getHarness(MatCheckboxHarness);
                expect(await checkbox.isChecked()).toBe(true);
            });

            it('should add checked and remove unchecked aspects', async () => {
                const panel = (await loader.getAllHarnesses(MatExpansionPanelHarness))[1];
                const checkbox = await panel.getHarness(MatCheckboxHarness);
                expect(await checkbox.isChecked()).toBe(false);

                await checkbox.toggle();
                expect(component.nodeAspects.length).toBe(2);
                expect(component.nodeAspects[1]).toBe('frs:SecondAspect');

                await checkbox.toggle();
                expect(component.nodeAspects.length).toBe(1);
                expect(component.nodeAspects[0]).toBe('frs:AspectOne');
            });

            it('should reset aspects on reset', async () => {
                const panel = (await loader.getAllHarnesses(MatExpansionPanelHarness))[1];
                const checkbox = await panel.getHarness(MatCheckboxHarness);
                expect(await checkbox.isChecked()).toBe(false);

                await checkbox.toggle();
                expect(component.nodeAspects.length).toBe(2);

                component.reset();
                expect(component.nodeAspects.length).toBe(1);
            });

            it('should clear all aspects on clear', async () => {
                expect(component.nodeAspects.length).toBe(1);
                component.clear();
                expect(component.nodeAspects.length).toBe(0);
            });

            it('should store not listed aspects and emit all aspects and count of only visible aspects on change', async () => {
                const storedAspect = ['stored:aspect'];
                expect(component.notDisplayedAspects).toEqual(storedAspect);

                spyOn(component.valueChanged, 'emit');
                spyOn(component.updateCounter, 'emit');
                const panel = (await loader.getAllHarnesses(MatExpansionPanelHarness))[1];
                const checkbox = await panel.getHarness(MatCheckboxHarness);
                await checkbox.toggle();
                fixture.detectChanges();
                expect(component.valueChanged.emit).toHaveBeenCalledWith(['frs:AspectOne', 'frs:SecondAspect', ...storedAspect]);
                expect(component.updateCounter.emit).toHaveBeenCalledWith(2);
            });
        });

        describe('with excluded aspects', () => {
            it('should not show aspect if it is excluded aspect', () => {
                component.excludedAspects = ['cst:nonamedAspect'];

                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector(`#aspect-list-${component.excludedAspects[0].replace(':', '-')}`)).toBeNull();
            });
        });
    });

    describe('When no node id is passed', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(AspectListComponent);
            component = fixture.componentInstance;
            aspectListService = TestBed.inject(AspectListService);
            spyOn(aspectListService, 'getAspects').and.returnValue(of(aspectListMock));
            loader = TestbedHarnessEnvironment.loader(fixture);
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('should show all the aspects', async () => {
            fixture.detectChanges();
            expect(await loader.hasHarness(MatExpansionPanelHarness.with({ selector: '#aspect-list-FirstAspect' }))).toBe(true);
            expect(await loader.hasHarness(MatExpansionPanelHarness.with({ selector: '#aspect-list-SecondAspect' }))).toBe(true);
        });

        it('should not show excluded aspects', async () => {
            component.excludedAspects = ['frs:AspectOne', 'frs:SecondAspect'];

            fixture.detectChanges();
            expect(await loader.hasHarness(MatExpansionPanelHarness.with({ selector: '#aspect-list-FirstAspect' }))).toBeFalse();
            expect(await loader.hasHarness(MatExpansionPanelHarness.with({ selector: '#aspect-list-SecondAspect' }))).toBeFalse();
        });
    });
});
