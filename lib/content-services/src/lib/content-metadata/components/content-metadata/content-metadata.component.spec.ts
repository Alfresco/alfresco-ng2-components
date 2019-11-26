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
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Node } from '@alfresco/js-api';
import { ContentMetadataComponent } from './content-metadata.component';
import { ContentMetadataService } from '../../services/content-metadata.service';
import {
    CardViewBaseItemModel, CardViewComponent, CardViewUpdateService, NodesApiService,
    LogService, setupTestBed
} from '@alfresco/adf-core';
import { throwError, of } from 'rxjs';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { mockGroupProperties } from './mock-data';

describe('ContentMetadataComponent', () => {
    let component: ContentMetadataComponent;
    let fixture: ComponentFixture<ContentMetadataComponent>;
    let contentMetadataService: ContentMetadataService;
    let updateService: CardViewUpdateService;
    let nodesApiService: NodesApiService;
    let node: Node;
    let folderNode: Node;
    let logService: LogService;
    const preset = 'custom-preset';

    setupTestBed({
        imports: [ContentTestingModule]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ContentMetadataComponent);
        component = fixture.componentInstance;
        logService = TestBed.get(LogService);
        contentMetadataService = TestBed.get(ContentMetadataService);
        updateService = TestBed.get(CardViewUpdateService);
        nodesApiService = TestBed.get(NodesApiService);

        node = <Node> {
            id: 'node-id',
            aspectNames: [],
            nodeType: '',
            content: {},
            properties: {},
            createdByUser: {},
            modifiedByUser: {}
        };

        folderNode = <Node> {
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
            const property = <CardViewBaseItemModel> { key: 'property-key', value: 'original-value' };
            spyOn(nodesApiService, 'updateNode').and.callThrough();

            updateService.update(property, 'updated-value');

            expect(nodesApiService.updateNode).toHaveBeenCalledWith('node-id', {
                'property-key': 'updated-value'
            });
        });

        it('should update the node on successful save', async(() => {
            const property = <CardViewBaseItemModel> { key: 'property-key', value: 'original-value' };
            const expectedNode = Object.assign({}, node, { name: 'some-modified-value' });

            spyOn(nodesApiService, 'updateNode').and.callFake(() => {
                return of(expectedNode);
            });

            updateService.update(property, 'updated-value');

            fixture.whenStable().then(() => {
                expect(component.node).toEqual(expectedNode);
            });
        }));

        it('should throw error on unsuccessful save', () => {
            const property = <CardViewBaseItemModel> { key: 'property-key', value: 'original-value' };

            spyOn(logService, 'error').and.stub();
            spyOn(nodesApiService, 'updateNode').and.callFake(() => {
                return throwError(new Error('My bad'));
            });

            updateService.update(property, 'updated-value');

            expect(logService.error).toHaveBeenCalledWith(new Error('My bad'));
        });

        it('should raise error message', (done) => {
            const property = <CardViewBaseItemModel> { key: 'property-key', value: 'original-value' };

            const sub = contentMetadataService.error.subscribe((err) => {
                expect(err.statusCode).toBe(0);
                expect(err.message).toBe('METADATA.ERRORS.GENERIC');
                sub.unsubscribe();
                done();
            });

            spyOn(nodesApiService, 'updateNode').and.callFake(() => {
                return throwError(new Error('My bad'));
            });

            updateService.update(property, 'updated-value');
        });
    });

    describe('Properties loading', () => {
        let expectedNode: Node;

        beforeEach(() => {
            expectedNode = {
                ...node,
                name: 'some-modified-value'
            };
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
            spyOn(component, 'showGroup').and.returnValue(true);

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
            spyOn(component, 'showGroup').and.returnValue(true);

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            component.basicProperties$.subscribe(() => {
                fixture.detectChanges();
                const basicPropertiesComponent = fixture.debugElement.query(By.css('.adf-metadata-grouped-properties-container adf-card-view')).componentInstance;
                expect(basicPropertiesComponent.displayEmpty).toBe(false);
            });
        }));

        it('should hide card views group when the grouped properties are empty', async(() => {
            component.expanded = true;
            fixture.detectChanges();
            spyOn(contentMetadataService, 'getGroupedProperties').and.returnValue(of([{ properties: [] }]));

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            component.basicProperties$.subscribe(() => {
                fixture.detectChanges();
                const basicPropertiesGroup = fixture.debugElement.query(By.css('.adf-metadata-grouped-properties-container mat-expansion-panel'));
                expect(basicPropertiesGroup).toBeNull();
            });
        }));

        it('should display card views group when there is at least one property that is not empty', async(() => {
            component.expanded = true;
            fixture.detectChanges();
            const cardViewGroup = {title: 'Group 1', properties: [{
                data: null,
                default: null,
                displayValue: 'DefaultName',
                icon: '',
                key: 'properties.cm:default',
                label: 'To'
            }]};
            spyOn(contentMetadataService, 'getGroupedProperties').and.returnValue(of([{ properties: [cardViewGroup] }]));

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            component.basicProperties$.subscribe(() => {
                fixture.detectChanges();
                const basicPropertiesGroup = fixture.debugElement.query(By.css('.adf-metadata-grouped-properties-container mat-expansion-panel'));
                expect(basicPropertiesGroup).toBeDefined();
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

    describe('Expand the panel', () => {
        let expectedNode;

        beforeEach(() => {
            expectedNode = Object.assign({}, node, {name: 'some-modified-value'});
            spyOn(contentMetadataService, 'getGroupedProperties').and.returnValue(of(mockGroupProperties));
            component.ngOnChanges({node: new SimpleChange(node, expectedNode, false)});
        });

        it('should open and update drawer with expand section dynamically', async(() => {
            component.displayAspect = 'EXIF';
            component.expanded = true;
            component.displayEmpty = true;

            fixture.detectChanges();
            let defaultProp = queryDom(fixture);
            let exifProp = queryDom(fixture, 'EXIF');
            let customProp = queryDom(fixture, 'CUSTOM');
            expect(defaultProp.componentInstance.expanded).toBeFalsy();
            expect(exifProp.componentInstance.expanded).toBeTruthy();
            expect(customProp.componentInstance.expanded).toBeFalsy();

            component.displayAspect = 'CUSTOM';
            fixture.detectChanges();
            defaultProp = queryDom(fixture);
            exifProp = queryDom(fixture, 'EXIF');
            customProp = queryDom(fixture, 'CUSTOM');
            expect(defaultProp.componentInstance.expanded).toBeFalsy();
            expect(exifProp.componentInstance.expanded).toBeFalsy();
            expect(customProp.componentInstance.expanded).toBeTruthy();

            component.displayAspect = 'Properties';
            fixture.detectChanges();
            defaultProp = queryDom(fixture);
            exifProp = queryDom(fixture, 'EXIF');
            customProp = queryDom(fixture, 'CUSTOM');
            expect(defaultProp.componentInstance.expanded).toBeTruthy();
            expect(exifProp.componentInstance.expanded).toBeFalsy();
            expect(customProp.componentInstance.expanded).toBeFalsy();

        }));

        it('should not expand anything if input is wrong', async(() => {
            component.displayAspect = 'XXXX';
            component.expanded = true;
            component.displayEmpty = true;

            fixture.detectChanges();
            const defaultProp = queryDom(fixture);
            const exifProp = queryDom(fixture, 'EXIF');
            const customProp = queryDom(fixture, 'CUSTOM');
            expect(defaultProp.componentInstance.expanded).toBeFalsy();
            expect(exifProp.componentInstance.expanded).toBeFalsy();
            expect(customProp.componentInstance.expanded).toBeFalsy();

        }));
    });
});

function queryDom(fixture: ComponentFixture<ContentMetadataComponent>, properties: string = 'properties') {
   return fixture.debugElement.query(By.css(`[data-automation-id="adf-metadata-group-${properties}"]`));
}
