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
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { ContentMetadataComponent } from './content-metadata.component';
import { ContentMetadataService } from '../../services/content-metadata.service';
import { CardViewBaseItemModel, CardViewComponent, CardViewUpdateService, NodesApiService, LogService, setupTestBed } from '@alfresco/adf-core';
import { throwError, of } from 'rxjs';
import { ContentTestingModule } from '../../../testing/content.testing.module';

describe('ContentMetadataComponent', () => {
    let component: ContentMetadataComponent;
    let fixture: ComponentFixture<ContentMetadataComponent>;
    let node: MinimalNodeEntryEntity;
    let folderNode: MinimalNodeEntryEntity;
    let preset = 'custom-preset';

    setupTestBed({
        imports: [ContentTestingModule],
        providers: [{ provide: LogService, useValue: { error: jasmine.createSpy('error') } }]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ContentMetadataComponent);
        component = fixture.componentInstance;
        node = <MinimalNodeEntryEntity> {
            id: 'node-id',
            aspectNames: [],
            nodeType: '',
            content: {},
            properties: {},
            createdByUser: {},
            modifiedByUser: {}
        };

        folderNode = <MinimalNodeEntryEntity> {
            id: 'folder-id',
            aspectNames: [],
            nodeType: '',
            createdByUser: {},
            modifiedByUser: {}
        };

        component.node = node;
        component.preset = preset;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Default input param values', () => {
        it('should have editable input param as false by default', () => {
            expect(component.editable).toBe(false);
        });

        it('should have displayEmpty input param as false by default', () => {
            expect(component.displayEmpty).toBe(false);
        });

        it('should have expanded input param as false by default', () => {
            expect(component.expanded).toBe(false);
        });
    });

    describe('Folder', () => {
        it('should show the folder node', () => {
            component.expanded = false;
            fixture.detectChanges();

            component.ngOnChanges({ node: new SimpleChange(node, folderNode, false) });

            component.basicProperties$.subscribe(() => {
                fixture.detectChanges();
                const basicPropertiesComponent = fixture.debugElement.query(By.directive(CardViewComponent)).componentInstance;
                expect(basicPropertiesComponent.properties).toBeDefined();
            });
        });
    });

    describe('Saving', () => {
        it('should save the node on itemUpdate', () => {
            const property = <CardViewBaseItemModel> { key: 'property-key', value: 'original-value' },
                updateService: CardViewUpdateService = fixture.debugElement.injector.get(CardViewUpdateService),
                nodesApiService: NodesApiService = TestBed.get(NodesApiService);
            spyOn(nodesApiService, 'updateNode').and.callThrough();

            updateService.update(property, 'updated-value');

            expect(nodesApiService.updateNode).toHaveBeenCalledWith('node-id', {
                'property-key': 'updated-value'
            });
        });

        it('should update the node on successful save', async(() => {
            const property = <CardViewBaseItemModel> { key: 'property-key', value: 'original-value' },
                updateService: CardViewUpdateService = fixture.debugElement.injector.get(CardViewUpdateService),
                nodesApiService: NodesApiService = TestBed.get(NodesApiService),
                expectedNode = Object.assign({}, node, { name: 'some-modified-value' });

            spyOn(nodesApiService, 'updateNode').and.callFake(() => {
                return of(expectedNode);
            });

            updateService.update(property, 'updated-value');

            fixture.whenStable().then(() => {
                expect(component.node).toEqual(expectedNode);
            });
        }));

        it('should throw error on unsuccessful save', () => {
            const property = <CardViewBaseItemModel> { key: 'property-key', value: 'original-value' },
                updateService: CardViewUpdateService = fixture.debugElement.injector.get(CardViewUpdateService),
                nodesApiService: NodesApiService = TestBed.get(NodesApiService),
                logService: LogService = TestBed.get(LogService);

            spyOn(nodesApiService, 'updateNode').and.callFake(() => {
                return throwError(new Error('My bad'));
            });

            updateService.update(property, 'updated-value');

            expect(logService.error).toHaveBeenCalledWith(new Error('My bad'));
        });
    });

    describe('Properties loading', () => {
        let expectedNode, contentMetadataService: ContentMetadataService;

        beforeEach(() => {
            expectedNode = Object.assign({}, node, { name: 'some-modified-value' });
            contentMetadataService = TestBed.get(ContentMetadataService);
            fixture.detectChanges();
        });

        it('should load the basic properties on node change', () => {
            spyOn(contentMetadataService, 'getBasicProperties');

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            expect(contentMetadataService.getBasicProperties).toHaveBeenCalledWith(expectedNode);
        });

        it('should pass through the loaded basic properties to the card view', async(() => {
            const expectedProperties = [];
            component.expanded = false;
            fixture.detectChanges();
            spyOn(contentMetadataService, 'getBasicProperties').and.callFake(() => {
                return of(expectedProperties);
            });

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            component.basicProperties$.subscribe(() => {
                fixture.detectChanges();
                const basicPropertiesComponent = fixture.debugElement.query(By.directive(CardViewComponent)).componentInstance;
                expect(basicPropertiesComponent.properties).toBe(expectedProperties);
            });
        }));

        it('should pass through the displayEmpty to the card view of basic properties', async(() => {
            component.displayEmpty = false;
            fixture.detectChanges();
            spyOn(contentMetadataService, 'getBasicProperties').and.returnValue(of([]));

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            component.basicProperties$.subscribe(() => {
                fixture.detectChanges();
                const basicPropertiesComponent = fixture.debugElement.query(By.directive(CardViewComponent)).componentInstance;
                expect(basicPropertiesComponent.displayEmpty).toBe(false);
            });
        }));

        it('should load the group properties on node change', () => {
            spyOn(contentMetadataService, 'getGroupedProperties');

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            expect(contentMetadataService.getGroupedProperties).toHaveBeenCalledWith(expectedNode, 'custom-preset');
        });

        it('should pass through the loaded group properties to the card view', async(() => {
            const expectedProperties = [];
            component.expanded = true;
            fixture.detectChanges();
            spyOn(contentMetadataService, 'getGroupedProperties').and.callFake(() => {
                return of([{ properties: expectedProperties }]);
            });

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            component.basicProperties$.subscribe(() => {
                fixture.detectChanges();
                const firstGroupedPropertiesComponent = fixture.debugElement.query(By.css('.adf-metadata-grouped-properties-container adf-card-view')).componentInstance;
                expect(firstGroupedPropertiesComponent.properties).toBe(expectedProperties);
            });
        }));

        it('should pass through the displayEmpty to the card view of grouped properties', async(() => {
            component.expanded = true;
            component.displayEmpty = false;
            fixture.detectChanges();
            spyOn(contentMetadataService, 'getGroupedProperties').and.returnValue(of([{ properties: [] }]));

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            component.basicProperties$.subscribe(() => {
                fixture.detectChanges();
                const basicPropertiesComponent = fixture.debugElement.query(By.css('.adf-metadata-grouped-properties-container adf-card-view')).componentInstance;
                expect(basicPropertiesComponent.displayEmpty).toBe(false);
            });
        }));
    });

    describe('Properties displaying', () => {
        it('should hide metadata fields if displayDefaultProperties is set to false', () => {
            component.displayDefaultProperties = false;
            fixture.detectChanges();
            const metadataContainer = fixture.debugElement.query(By.css('mat-expansion-panel[data-automation-id="adf-metadata-group-properties"]'));
            fixture.detectChanges();
            expect(metadataContainer).toBeNull();
        });

        it('should display metadata fields if displayDefaultProperties is set to true', () => {
            component.displayDefaultProperties = true;
            fixture.detectChanges();
            const metadataContainer = fixture.debugElement.query(By.css('mat-expansion-panel[data-automation-id="adf-metadata-group-properties"]'));
            fixture.detectChanges();
            expect(metadataContainer).toBeDefined();
        });

        it('should have displayDefaultProperties input param as true by default', () => {
            expect(component.displayDefaultProperties).toBe(true);
        });
    });
});
