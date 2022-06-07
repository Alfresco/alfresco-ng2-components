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

import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MinimalNode, Node } from '@alfresco/js-api';
import { ContentMetadataComponent } from './content-metadata.component';
import { ContentMetadataService } from '../../services/content-metadata.service';
import {
    CardViewBaseItemModel, CardViewComponent, CardViewUpdateService, NodesApiService,
    LogService, setupTestBed
} from '@alfresco/adf-core';
import { throwError, of } from 'rxjs';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { mockGroupProperties } from './mock-data';
import { TranslateModule } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';
import { ApiClientsService } from '@alfresco/adf-core/api';

describe('ContentMetadataComponent', () => {
    let component: ContentMetadataComponent;
    let fixture: ComponentFixture<ContentMetadataComponent>;
    let contentMetadataService: ContentMetadataService;
    let updateService: CardViewUpdateService;
    let nodesApiService: NodesApiService;
    let node: Node;
    let folderNode: Node;
    const preset = 'custom-preset';

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        providers: [
            { provide: LogService, useValue: { error: jasmine.createSpy('error') } },
            MockProvider(ApiClientsService)
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ContentMetadataComponent);
        component = fixture.componentInstance;
        contentMetadataService = TestBed.inject(ContentMetadataService);
        updateService = TestBed.inject(CardViewUpdateService);
        nodesApiService = TestBed.inject(NodesApiService);

        node = {
            id: 'node-id',
            aspectNames: [],
            nodeType: 'cm:node',
            content: {},
            properties: {},
            createdByUser: {},
            modifiedByUser: {}
        } as Node;

        folderNode = {
            id: 'folder-id',
            aspectNames: [],
            nodeType: '',
            createdByUser: {},
            modifiedByUser: {}
        } as Node;

        component.node = node;
        component.preset = preset;
        spyOn(contentMetadataService, 'getContentTypeProperty').and.returnValue(of([]));
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
        it('should show the folder node', (done) => {
            component.expanded = false;
            fixture.detectChanges();

            component.basicProperties$.subscribe(() => {
                fixture.detectChanges();
                const basicPropertiesComponent = fixture.debugElement.query(By.directive(CardViewComponent)).componentInstance;
                expect(basicPropertiesComponent.properties).toBeDefined();
                done();
            });

            component.ngOnChanges({ node: new SimpleChange(node, folderNode, false) });
        });
    });

    describe('Saving', () => {
        it('itemUpdate', fakeAsync(() => {
            spyOn(component, 'updateChanges').and.callThrough();
            const property = { key: 'properties.property-key', value: 'original-value' } as CardViewBaseItemModel;
            updateService.update(property, 'updated-value');

            tick(600);
            expect(component.hasMetadataChanged).toEqual(true);
            expect(component.updateChanges).toHaveBeenCalled();
            expect(component.changedProperties).toEqual({ properties: { 'property-key': 'updated-value' } });
        }));

        it('nodeAspectUpdate', fakeAsync(() => {
            const fakeNode = { id: 'fake-minimal-node', aspectNames: ['ft:a', 'ft:b', 'ft:c'], name: 'fake-node' } as MinimalNode;
            spyOn(contentMetadataService, 'getGroupedProperties').and.stub();
            spyOn(contentMetadataService, 'getBasicProperties').and.stub();
            updateService.updateNodeAspect(fakeNode);

            tick(600);
            expect(contentMetadataService.getBasicProperties).toHaveBeenCalled();
            expect(contentMetadataService.getGroupedProperties).toHaveBeenCalled();
        }));

        it('should save changedProperties on save click', fakeAsync(async () => {
            component.editable = true;
            const property = { key: 'properties.property-key', value: 'original-value' } as CardViewBaseItemModel;
            const expectedNode = { ...node, name: 'some-modified-value' };
            spyOn(nodesApiService, 'updateNode').and.returnValue(of(expectedNode));

            updateService.update(property, 'updated-value');
            tick(600);

            fixture.detectChanges();
            await fixture.whenStable();
            const saveButton = fixture.debugElement.query(By.css('[data-automation-id="save-metadata"]'));
            saveButton.nativeElement.click();

            await fixture.whenStable();
            expect(component.node).toEqual(expectedNode);
            expect(nodesApiService.updateNode).toHaveBeenCalled();
        }));

        it('should throw error on unsuccessful save', fakeAsync((done) => {
            const logService: LogService = TestBed.inject(LogService);
            component.editable = true;
            const property = { key: 'properties.property-key', value: 'original-value' } as CardViewBaseItemModel;
            updateService.update(property, 'updated-value');
            tick(600);

            const sub = contentMetadataService.error.subscribe((err) => {
                expect(logService.error).toHaveBeenCalledWith(new Error('My bad'));
                expect(err.statusCode).toBe(0);
                expect(err.message).toBe('METADATA.ERRORS.GENERIC');
                sub.unsubscribe();
                done();
            });

            spyOn(nodesApiService, 'updateNode').and.returnValue(throwError(new Error('My bad')));

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const saveButton = fixture.debugElement.query(By.css('[data-automation-id="save-metadata"]'));
                saveButton.nativeElement.click();
                fixture.detectChanges();
            });
        }));

        it('should open the confirm dialog when content type is changed', fakeAsync(() => {
            component.editable = true;
            const property = { key: 'nodeType', value: 'ft:sbiruli' } as CardViewBaseItemModel;
            const expectedNode = { ...node, nodeType: 'ft:sbiruli' };
            spyOn(contentMetadataService, 'openConfirmDialog').and.returnValue(of(true));
            spyOn(nodesApiService, 'updateNode').and.returnValue(of(expectedNode));

            updateService.update(property, 'ft:poppoli');
            tick(600);

            fixture.detectChanges();
            tick(100);
            const saveButton = fixture.debugElement.query(By.css('[data-automation-id="save-metadata"]'));
            saveButton.nativeElement.click();

            tick(100);
            expect(component.node).toEqual(expectedNode);
            expect(contentMetadataService.openConfirmDialog).toHaveBeenCalledWith({ nodeType: 'ft:poppoli' });
            expect(nodesApiService.updateNode).toHaveBeenCalled();
        }));

        it('should retrigger the load of the properties when the content type has changed', fakeAsync(() => {
            component.editable = true;
            const property = { key: 'nodeType', value: 'ft:sbiruli' } as CardViewBaseItemModel;
            const expectedNode = Object.assign({}, node, { nodeType: 'ft:sbiruli' });
            spyOn(contentMetadataService, 'openConfirmDialog').and.returnValue(of(true));
            spyOn(updateService, 'updateNodeAspect');
            spyOn(nodesApiService, 'updateNode').and.returnValue(of(expectedNode));

            updateService.update(property, 'ft:poppoli');
            tick(600);

            fixture.detectChanges();
            tick(100);
            const saveButton = fixture.debugElement.query(By.css('[data-automation-id="save-metadata"]'));
            saveButton.nativeElement.click();

            tick(100);
            expect(component.node).toEqual(expectedNode);
            expect(updateService.updateNodeAspect).toHaveBeenCalledWith(expectedNode);
        }));
    });

    describe('Reseting', () => {
        it('should reset changedProperties on reset click', async () => {
            component.changedProperties = { properties: { 'property-key': 'updated-value' } };
            component.hasMetadataChanged = true;
            component.editable = true;
            const expectedNode = Object.assign({}, node, { name: 'some-modified-value' });
            spyOn(nodesApiService, 'updateNode').and.returnValue(of(expectedNode));

            fixture.detectChanges();
            await fixture.whenStable();
            const resetButton = fixture.debugElement.query(By.css('[data-automation-id="reset-metadata"]'));
            resetButton.nativeElement.click();

            fixture.detectChanges();
            expect(component.changedProperties).toEqual({});
            expect(nodesApiService.updateNode).not.toHaveBeenCalled();
        });
    });

    describe('Properties loading', () => {
        let expectedNode: MinimalNode;

        beforeEach(() => {
            expectedNode = { ...node, name: 'some-modified-value' };
            fixture.detectChanges();
        });

        it('should load the basic properties on node change', () => {
            spyOn(contentMetadataService, 'getBasicProperties');

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            expect(contentMetadataService.getContentTypeProperty).toHaveBeenCalledWith(expectedNode);
            expect(contentMetadataService.getBasicProperties).toHaveBeenCalledWith(expectedNode);
        });

        it('should pass through the loaded basic properties to the card view', async () => {
            const expectedProperties = [];
            component.expanded = false;

            spyOn(contentMetadataService, 'getBasicProperties').and.returnValue(of(expectedProperties));

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            fixture.detectChanges();
            await fixture.whenStable();

            const basicPropertiesComponent = fixture.debugElement.query(By.directive(CardViewComponent)).componentInstance;
            expect(basicPropertiesComponent.properties.length).toBe(expectedProperties.length);
        });

        it('should pass through the displayEmpty to the card view of basic properties', async () => {
            component.displayEmpty = false;

            fixture.detectChanges();
            await fixture.whenStable();

            spyOn(contentMetadataService, 'getBasicProperties').and.returnValue(of([]));

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            fixture.detectChanges();
            await fixture.whenStable();

            const basicPropertiesComponent = fixture.debugElement.query(By.directive(CardViewComponent)).componentInstance;
            expect(basicPropertiesComponent.displayEmpty).toBe(false);
        });

        it('should load the group properties on node change', () => {
            spyOn(contentMetadataService, 'getGroupedProperties');

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            expect(contentMetadataService.getGroupedProperties).toHaveBeenCalledWith(expectedNode, 'custom-preset');
        });

        it('should load the group properties when preset config is provided on node change', () => {
            const presetConfig = [
                {
                    title: 'My custom preset',
                    items: [
                        {
                            type: 'my:type',
                            properties: '*'
                        },
                        {
                            aspect: 'my:aspect',
                            properties: '*'
                        }
                    ]
                }
            ];
            component.preset = presetConfig;
            spyOn(contentMetadataService, 'getGroupedProperties');

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            expect(contentMetadataService.getGroupedProperties).toHaveBeenCalledWith(expectedNode, presetConfig);
        });

        it('should pass through the loaded group properties to the card view', async () => {
            const expectedProperties = [];
            component.expanded = true;

            spyOn(contentMetadataService, 'getGroupedProperties').and.returnValue(of([{ properties: expectedProperties } as any]));
            spyOn(component, 'showGroup').and.returnValue(true);

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            fixture.detectChanges();
            await fixture.whenStable();

            const firstGroupedPropertiesComponent = fixture.debugElement.query(By.css('.adf-metadata-grouped-properties-container adf-card-view')).componentInstance;
            expect(firstGroupedPropertiesComponent.properties).toBe(expectedProperties);
        });

        it('should pass through the displayEmpty to the card view of grouped properties', async () => {
            component.expanded = true;
            component.displayEmpty = false;

            spyOn(contentMetadataService, 'getGroupedProperties').and.returnValue(of([{ properties: [] } as any]));
            spyOn(component, 'showGroup').and.returnValue(true);

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            fixture.detectChanges();
            await fixture.whenStable();

            const basicPropertiesComponent = fixture.debugElement.query(By.css('.adf-metadata-grouped-properties-container adf-card-view')).componentInstance;
            expect(basicPropertiesComponent.displayEmpty).toBe(false);
        });

        it('should hide card views group when the grouped properties are empty', async () => {
            component.expanded = true;

            spyOn(contentMetadataService, 'getGroupedProperties').and.returnValue(of([{ properties: [] } as any]));

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            fixture.detectChanges();
            await fixture.whenStable();

            const basicPropertiesGroup = fixture.debugElement.query(By.css('.adf-metadata-grouped-properties-container mat-expansion-panel'));
            expect(basicPropertiesGroup).toBeNull();
        });

        it('should display card views group when there is at least one property that is not empty', async () => {
            component.expanded = true;

            const cardViewGroup = {
                title: 'Group 1', properties: [{
                    data: null,
                    default: null,
                    displayValue: 'DefaultName',
                    icon: '',
                    key: 'properties.cm:default',
                    label: 'To'
                }]
            };
            spyOn(contentMetadataService, 'getGroupedProperties').and.returnValue(of([{ properties: [cardViewGroup] } as any]));

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            fixture.detectChanges();
            await fixture.whenStable();

            const basicPropertiesGroup = fixture.debugElement.query(By.css('.adf-metadata-grouped-properties-container mat-expansion-panel'));
            expect(basicPropertiesGroup).toBeDefined();
        });
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
        let expectedNode: MinimalNode;

        beforeEach(() => {
            expectedNode = { ...node, name: 'some-modified-value' };
            spyOn(contentMetadataService, 'getGroupedProperties').and.returnValue(of(mockGroupProperties));
            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });
        });

        it('should open and update drawer with expand section dynamically', async () => {
            component.displayAspect = 'EXIF';
            component.expanded = true;
            component.displayEmpty = true;

            fixture.detectChanges();
            await fixture.whenStable();

            let defaultProp = queryDom(fixture);
            let exifProp = queryDom(fixture, 'EXIF');
            let customProp = queryDom(fixture, 'CUSTOM');
            expect(defaultProp.componentInstance.expanded).toBeFalsy();
            expect(exifProp.componentInstance.expanded).toBeTruthy();
            expect(customProp.componentInstance.expanded).toBeFalsy();

            component.displayAspect = 'CUSTOM';

            fixture.detectChanges();
            await fixture.whenStable();

            defaultProp = queryDom(fixture);
            exifProp = queryDom(fixture, 'EXIF');
            customProp = queryDom(fixture, 'CUSTOM');
            expect(defaultProp.componentInstance.expanded).toBeFalsy();
            expect(exifProp.componentInstance.expanded).toBeFalsy();
            expect(customProp.componentInstance.expanded).toBeTruthy();

            component.displayAspect = 'Properties';

            fixture.detectChanges();
            await fixture.whenStable();

            defaultProp = queryDom(fixture);
            exifProp = queryDom(fixture, 'EXIF');
            customProp = queryDom(fixture, 'CUSTOM');
            expect(defaultProp.componentInstance.expanded).toBeTruthy();
            expect(exifProp.componentInstance.expanded).toBeFalsy();
            expect(customProp.componentInstance.expanded).toBeFalsy();
        });

        it('should not expand anything if input is wrong', async () => {
            component.displayAspect = 'XXXX';
            component.expanded = true;
            component.displayEmpty = true;

            fixture.detectChanges();
            await fixture.whenStable();

            const defaultProp = queryDom(fixture);
            const exifProp = queryDom(fixture, 'EXIF');
            const customProp = queryDom(fixture, 'CUSTOM');
            expect(defaultProp.componentInstance.expanded).toBeFalsy();
            expect(exifProp.componentInstance.expanded).toBeFalsy();
            expect(customProp.componentInstance.expanded).toBeFalsy();
        });
    });

    describe('events', () => {
        it('should not propagate the event on left arrows press', () => {
            fixture.detectChanges();
            const event = { keyCode: 37, stopPropagation: () => { } };
            spyOn(event, 'stopPropagation').and.stub();
            const element = fixture.debugElement.query(By.css('adf-card-view'));
            element.triggerEventHandler('keydown', event);
            expect(event.stopPropagation).toHaveBeenCalled();
        });

        it('should not propagate the event on right arrows press', () => {
            fixture.detectChanges();
            const event = { keyCode: 39, stopPropagation: () => { } };
            spyOn(event, 'stopPropagation').and.stub();
            const element = fixture.debugElement.query(By.css('adf-card-view'));
            element.triggerEventHandler('keydown', event);
            expect(event.stopPropagation).toHaveBeenCalled();
        });

        it('should propagate the event on other keys press', () => {
            fixture.detectChanges();
            const event = { keyCode: 40, stopPropagation: () => { } };
            spyOn(event, 'stopPropagation').and.stub();
            const element = fixture.debugElement.query(By.css('adf-card-view'));
            element.triggerEventHandler('keydown', event);
            expect(event.stopPropagation).not.toHaveBeenCalled();
        });
    });
});

const queryDom = (fixture: ComponentFixture<ContentMetadataComponent>, properties: string = 'properties') =>
    fixture.debugElement.query(By.css(`[data-automation-id="adf-metadata-group-${properties}"]`));
