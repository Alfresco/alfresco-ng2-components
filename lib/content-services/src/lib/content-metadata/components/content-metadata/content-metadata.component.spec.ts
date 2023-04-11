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

import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { DebugElement, SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Category, CategoryPaging, ClassesApi, MinimalNode, Node, Tag, TagBody, TagEntry, TagPaging, TagPagingList } from '@alfresco/js-api';
import { ContentMetadataComponent } from './content-metadata.component';
import { ContentMetadataService } from '../../services/content-metadata.service';
import {
    CardViewBaseItemModel, CardViewComponent,
    LogService, setupTestBed, AppConfigService, UpdateNotification
} from '@alfresco/adf-core';
import { NodesApiService } from '../../../common/services/nodes-api.service';
import { throwError, of, EMPTY } from 'rxjs';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { mockGroupProperties } from './mock-data';
import { TranslateModule } from '@ngx-translate/core';
import { CardViewContentUpdateService } from '../../../common/services/card-view-content-update.service';
import { PropertyGroup } from '../../interfaces/property-group.interface';
import { PropertyDescriptorsService } from '../../services/property-descriptors.service';
import { CategoriesManagementComponent, CategoriesManagementMode, CategoryService, TagsCreatorComponent, TagsCreatorMode, TagService } from '@alfresco/adf-content-services';

describe('ContentMetadataComponent', () => {
    let component: ContentMetadataComponent;
    let fixture: ComponentFixture<ContentMetadataComponent>;
    let contentMetadataService: ContentMetadataService;
    let updateService: CardViewContentUpdateService;
    let nodesApiService: NodesApiService;
    let node: Node;
    let folderNode: Node;
    let tagService: TagService;
    let categoryService: CategoryService;

    const preset = 'custom-preset';

    const mockTagPaging = (): TagPaging => {
        const tagPaging = new TagPaging();
        tagPaging.list = new TagPagingList();
        const tagEntry1 = new TagEntry();
        tagEntry1.entry = new Tag();
        tagEntry1.entry.tag = 'Tag 1';
        tagEntry1.entry.id = 'some id 1';
        const tagEntry2 = new TagEntry();
        tagEntry2.entry = new Tag();
        tagEntry2.entry.tag = 'Tag 2';
        tagEntry2.entry.id = 'some id 2';
        tagPaging.list.entries = [tagEntry1, tagEntry2];
        return tagPaging;
    };

    const category1 = new Category({ id: 'test', name: 'testCat' });
    const category2 = new Category({ id: 'test2', name: 'testCat2' });
    const categoryPagingResponse: CategoryPaging = { list: { pagination: {}, entries: [ { entry: category1 }, { entry: category2 }]}};

    const findTagElements = (): DebugElement[] => fixture.debugElement.queryAll(By.css('.adf-metadata-properties-tag'));

    const findCancelButton = (): HTMLButtonElement => fixture.debugElement.query(By.css('[data-automation-id=reset-metadata]')).nativeElement;

    const clickOnCancel = () => {
        findCancelButton().click();
        fixture.detectChanges();
    };

    const findSaveButton = (): HTMLButtonElement => fixture.debugElement.query(By.css('[data-automation-id=save-metadata]')).nativeElement;

    const clickOnSave = () => {
        findSaveButton().click();
        fixture.detectChanges();
    };

    const findTagsCreator = (): TagsCreatorComponent => fixture.debugElement.query(By.directive(TagsCreatorComponent))?.componentInstance;

    const findShowingTagInputButton = (): HTMLButtonElement =>
        fixture.debugElement.query(By.css('[data-automation-id=showing-tag-input-button]')).nativeElement;

    function getCategories(): HTMLParagraphElement[] {
        return fixture.debugElement.queryAll(By.css('.adf-metadata-categories'))?.map((debugElem) => debugElem.nativeElement);
    }

    function getCategoriesManagementComponent(): CategoriesManagementComponent {
        return fixture.debugElement.query(By.directive(CategoriesManagementComponent))?.componentInstance;
    }

    function getAssignCategoriesBtn(): HTMLButtonElement {
        return fixture.debugElement.query(By.css('.adf-metadata-categories-title button')).nativeElement;
    }

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        providers: [
            {
                provide: LogService,
                useValue: {
                    error: jasmine.createSpy('error')
                }
            },
            {
                provide: TagService,
                useValue: {
                    getTagsByNodeId: () => EMPTY,
                    removeTag: () => EMPTY,
                    assignTagsToNode: () => EMPTY
                }
            },
            {
                provide: CategoryService,
                useValue: {
                    getCategoryLinksForNode: () => EMPTY,
                    linkNodeToCategory: () => EMPTY,
                    unlinkNodeFromCategory: () => EMPTY
                }
            }]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ContentMetadataComponent);
        component = fixture.componentInstance;
        contentMetadataService = TestBed.inject(ContentMetadataService);
        updateService = TestBed.inject(CardViewContentUpdateService);
        nodesApiService = TestBed.inject(NodesApiService);
        tagService = TestBed.inject(TagService);
        categoryService = TestBed.inject(CategoryService);

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
            const fakeNode = { id: 'fake-minimal-node', aspectNames: ['ft:a', 'ft:b', 'ft:c'], name: 'fake-node'} as MinimalNode;
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
            clickOnSave();

            await fixture.whenStable();
            expect(component.node).toEqual(expectedNode);
            expect(nodesApiService.updateNode).toHaveBeenCalled();
        }));

        it('should call removeTag and assignTagsToNode on TagService on save click', fakeAsync( () => {
            component.editable = true;
            component.displayTags = true;
            const property = { key: 'properties.property-key', value: 'original-value' } as CardViewBaseItemModel;
            const expectedNode = { ...node, name: 'some-modified-value' };
            spyOn(nodesApiService, 'updateNode').and.returnValue(of(expectedNode));
            const tagPaging = mockTagPaging();
            spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
            component.ngOnInit();
            spyOn(tagService, 'removeTag').and.returnValue(EMPTY);
            spyOn(tagService, 'assignTagsToNode').and.returnValue(EMPTY);
            const tagName1 = tagPaging.list.entries[0].entry.tag;
            const tagName2 = 'New tag 3';

            updateService.update(property, 'updated-value');
            tick(600);

            fixture.detectChanges();
            findTagsCreator().tagsChange.emit([tagName1, tagName2]);
            clickOnSave();

            const tag1 = new TagBody();
            tag1.tag = tagName1;
            const tag2 = new TagBody();
            tag2.tag = tagName2;
            expect(tagService.removeTag).toHaveBeenCalledWith(node.id, tagPaging.list.entries[1].entry.id);
            expect(tagService.assignTagsToNode).toHaveBeenCalledWith(node.id, [tag1, tag2]);
        }));

        it('should call getTagsByNodeId on TagService on save click', fakeAsync( () => {
            component.editable = true;
            component.displayTags = true;
            const property = { key: 'properties.property-key', value: 'original-value' } as CardViewBaseItemModel;
            const expectedNode = { ...node, name: 'some-modified-value' };
            spyOn(nodesApiService, 'updateNode').and.returnValue(of(expectedNode));
            const tagPaging = mockTagPaging();
            const getTagsByNodeIdSpy = spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
            component.ngOnInit();
            spyOn(tagService, 'removeTag').and.returnValue(of(undefined));
            spyOn(tagService, 'assignTagsToNode').and.returnValue(of({}));

            updateService.update(property, 'updated-value');
            tick(600);

            fixture.detectChanges();
            findTagsCreator().tagsChange.emit([tagPaging.list.entries[0].entry.tag, 'New tag 3']);
            getTagsByNodeIdSpy.calls.reset();
            clickOnSave();

            expect(tagService.getTagsByNodeId).toHaveBeenCalledWith(node.id);
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
            fixture.whenStable().then(() => clickOnSave());
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
            clickOnSave();

            tick(100);
            expect(component.node).toEqual(expectedNode);
            expect(contentMetadataService.openConfirmDialog).toHaveBeenCalledWith({nodeType: 'ft:poppoli'});
            expect(nodesApiService.updateNode).toHaveBeenCalled();
        }));

        it('should call removeTag and assignTagsToNode on TagService after confirming confirmation dialog when content type is changed', fakeAsync(() => {
            component.editable = true;
            component.displayTags = true;
            const property = { key: 'nodeType', value: 'ft:sbiruli' } as CardViewBaseItemModel;
            const expectedNode = { ...node, nodeType: 'ft:sbiruli' };
            spyOn(contentMetadataService, 'openConfirmDialog').and.returnValue(of(true));
            spyOn(nodesApiService, 'updateNode').and.returnValue(of(expectedNode));
            const tagPaging = mockTagPaging();
            spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
            component.ngOnInit();
            spyOn(tagService, 'removeTag').and.returnValue(EMPTY);
            spyOn(tagService, 'assignTagsToNode').and.returnValue(EMPTY);
            const tagName1 = tagPaging.list.entries[0].entry.tag;
            const tagName2 = 'New tag 3';

            updateService.update(property, 'ft:poppoli');
            tick(600);

            fixture.detectChanges();
            findTagsCreator().tagsChange.emit([tagName1, tagName2]);
            tick(100);
            fixture.detectChanges();
            clickOnSave();

            tick(100);
            const tag1 = new TagBody();
            tag1.tag = tagName1;
            const tag2 = new TagBody();
            tag2.tag = tagName2;
            expect(tagService.removeTag).toHaveBeenCalledWith(node.id, tagPaging.list.entries[1].entry.id);
            expect(tagService.assignTagsToNode).toHaveBeenCalledWith(node.id, [tag1, tag2]);
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
            clickOnSave();

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


    describe('Display properties with aspect oriented config', () => {
        let appConfig: AppConfigService;
        let classesApi: ClassesApi;
        let expectedNode: MinimalNode;

        const versionableResponse: PropertyGroup = {
            name: 'cm:versionable',
            title: 'Versionable',
            properties: {
                'cm:autoVersion': {
                    title: 'Auto Version',
                    name: 'cm:autoVersion',
                    dataType: 'd:boolean',
                    mandatory: false,
                    multiValued: false
                },
                'cm:initialVersion': {
                    title: 'Initial Version',
                    name: 'cm:initialVersion',
                    dataType: 'd:boolean',
                    mandatory: false,
                    multiValued: false
                },
                'cm:versionType': {
                    title: 'Version Type',
                    name: 'cm:versionType',
                    dataType: 'd:text',
                    mandatory: false,
                    multiValued: false
                }
            }
        };

        const exifResponse: PropertyGroup = {
            name: 'exif:exif',
            title: 'Exif',
            properties: {
                'exif:1': {
                    title: 'exif:1:id',
                    name: 'exif:1',
                    dataType: '',
                    mandatory: false,
                    multiValued: false
                },
                'exif:2': {
                    title: 'exif:2:id',
                    name: 'exif:2',
                    dataType: '',
                    mandatory: false,
                    multiValued: false
                },
                'exif:pixelXDimension': {
                    title: 'Image Width',
                    name: 'exif:pixelXDimension',
                    dataType: 'd:int',
                    mandatory: false,
                    multiValued: false
                },
                'exif:pixelYDimension': {
                    title: 'Image Height',
                    name: 'exif:pixelYDimension',
                    dataType: 'd:int',
                    mandatory: false,
                    multiValued: false
                }
            }
        };

        const setContentMetadataConfig = (presetName, presetConfig) => {
            appConfig.config['content-metadata'] = {
                presets: {
                    [presetName]: presetConfig
                }
            };
        };

        beforeEach(() => {
            appConfig = TestBed.inject(AppConfigService);
            const propertyDescriptorsService = TestBed.inject(
                PropertyDescriptorsService
            );
            classesApi = propertyDescriptorsService['classesApi'];
            expectedNode = {
                ...node,
                aspectNames: [
                    'rn:renditioned',
                    'cm:versionable',
                    'cm:titled',
                    'cm:auditable',
                    'cm:author',
                    'cm:thumbnailModification',
                    'exif:exif'
                ],
                name: 'some-modified-value',
                properties: {
                    'exif:pixelXDimension': 1024,
                    'exif:pixelYDimension': 1024
                }
            };

            component.expanded = true;
            component.preset = 'default';
        });

        it('should show Versionable with given content-metadata config', async () => {
            setContentMetadataConfig('default', {
                includeAll: false,
                'cm:versionable': '*'
            });

            spyOn(classesApi, 'getClass').and.returnValue(Promise.resolve(versionableResponse));

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });
            fixture.detectChanges();

            await component.groupedProperties$.toPromise();
            fixture.detectChanges();

            const versionableProp = queryDom(fixture, 'Versionable');

            expect(versionableProp).toBeTruthy();
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_versionable');
        });

        it('should show Versionable twice with given content-metadata config', async () => {
            setContentMetadataConfig('default', {
                includeAll: true,
                'cm:versionable': '*'
            });

            spyOn(classesApi, 'getClass').and.returnValue(Promise.resolve(versionableResponse));

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });
            fixture.detectChanges();

            await component.groupedProperties$.toPromise();
            fixture.detectChanges();

            const versionableProps = fixture.debugElement.queryAll(By.css('[data-automation-id="adf-metadata-group-Versionable"]'));

            expect(versionableProps.length).toEqual(2);
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_versionable');
        });

        it('should not show Versionable with given content-metadata config', async () => {
            setContentMetadataConfig('default', {
                includeAll: true,
                exclude: 'cm:versionable'
            });

            spyOn(classesApi, 'getClass').and.returnValue(Promise.resolve(versionableResponse));

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });
            fixture.detectChanges();

            await component.groupedProperties$.toPromise();
            fixture.detectChanges();

            const versionableProp = queryDom(fixture, 'Versionable');

            expect(versionableProp).toBeNull();
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_versionable');
        });

        it('should not show Versionable when excluded and included set in content-metadata config', async () => {
            setContentMetadataConfig('default', {
                includeAll: true,
                exclude: 'cm:versionable',
                'cm:versionable': '*'
            });

            spyOn(classesApi, 'getClass').and.returnValue(Promise.resolve(versionableResponse));

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });
            fixture.detectChanges();

            await component.groupedProperties$.toPromise();
            fixture.detectChanges();

            const versionableProp = queryDom(fixture, 'Versionable');

            expect(versionableProp).toBeTruthy();
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_versionable');
        });

        it('should not show aspects excluded in content-metadata config', async () => {
            setContentMetadataConfig('default', {
                includeAll: true,
                exclude: ['cm:versionable', 'cm:auditable']
            });

            spyOn(classesApi, 'getClass').and.returnValue(Promise.resolve(versionableResponse));

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });
            fixture.detectChanges();

            await component.groupedProperties$.toPromise();
            fixture.detectChanges();

            const versionableProp = queryDom(fixture, 'Versionable');
            expect(versionableProp).toBeNull();

            const auditableProp = queryDom(fixture, 'Auditable');
            expect(auditableProp).toBeNull();

            expect(classesApi.getClass).toHaveBeenCalledWith('cm_versionable');
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_auditable');
        });

        it('should show Exif even when includeAll is set to false', async () => {
            setContentMetadataConfig('default', {
                includeAll: false,
                'exif:exif': ['exif:pixelXDimension', 'exif:pixelYDimension']
            });

            spyOn(classesApi, 'getClass').and.returnValue(Promise.resolve(exifResponse));

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });
            fixture.detectChanges();

            await component.groupedProperties$.toPromise();
            fixture.detectChanges();

            const exifProp = queryDom(fixture, 'Exif');

            expect(exifProp).toBeTruthy();
            expect(classesApi.getClass).toHaveBeenCalledWith('exif_exif');

            exifProp.nativeElement.click();

            const pixelXDimentionElement = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-label-properties.exif:pixelXDimension"]'));
            expect(pixelXDimentionElement).toBeTruthy();
            expect(pixelXDimentionElement.nativeElement.textContent.trim()).toEqual('Image Width');

            const pixelYDimentionElement = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-label-properties.exif:pixelYDimension"]'));
            expect(pixelYDimentionElement).toBeTruthy();
            expect(pixelYDimentionElement.nativeElement.textContent.trim()).toEqual('Image Height');
        });

        it('should show Exif twice when includeAll is set to true', async () => {
            setContentMetadataConfig('default', {
                includeAll: true,
                'exif:exif': ['exif:pixelXDimension', 'exif:pixelYDimension']
            });

            spyOn(classesApi, 'getClass').and.returnValue(Promise.resolve(exifResponse));

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });
            fixture.detectChanges();

            await component.groupedProperties$.toPromise();
            fixture.detectChanges();

            const exifProps = fixture.debugElement.queryAll(By.css('[data-automation-id="adf-metadata-group-Exif"]'));

            expect(exifProps.length).toEqual(2);
            expect(classesApi.getClass).toHaveBeenCalledWith('exif_exif');
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

    describe('Tags list', () => {
        let tagPaging: TagPaging;

        beforeEach(() => {
            tagPaging = mockTagPaging();
            component.displayTags = true;
        });

        it('should render tags after loading tags in ngOnInit', () => {
            spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
            component.ngOnInit();
            fixture.detectChanges();
            const tagElements = findTagElements();
            expect(tagElements).toHaveSize(2);
            expect(tagElements[0].nativeElement.textContent).toBe(tagPaging.list.entries[0].entry.tag);
            expect(tagElements[1].nativeElement.textContent).toBe(tagPaging.list.entries[1].entry.tag);
            expect(tagService.getTagsByNodeId).toHaveBeenCalledWith(node.id);
        });

        it('should not render tags after loading tags in ngOnInit if displayTags is false', () => {
            component.displayTags = false;
            spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
            component.ngOnInit();
            fixture.detectChanges();
            const tagElements = findTagElements();
            expect(tagElements).toHaveSize(0);
            expect(tagService.getTagsByNodeId).not.toHaveBeenCalled();
        });

        it('should render tags after loading tags in ngOnChanges', () => {
            spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));

            component.ngOnChanges({
                node: new SimpleChange(undefined, node, false)
            });
            fixture.detectChanges();
            const tagElements = findTagElements();
            expect(tagElements).toHaveSize(2);
            expect(tagElements[0].nativeElement.textContent).toBe(tagPaging.list.entries[0].entry.tag);
            expect(tagElements[1].nativeElement.textContent).toBe(tagPaging.list.entries[1].entry.tag);
            expect(tagService.getTagsByNodeId).toHaveBeenCalledWith(node.id);
        });

        it('should not render tags after loading tags in ngOnChanges if displayTags is false', () => {
            component.displayTags = false;
            spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));

            component.ngOnChanges({
                node: new SimpleChange(undefined, node, false)
            });
            fixture.detectChanges();
            const tagElements = findTagElements();
            expect(tagElements).toHaveSize(0);
            expect(tagService.getTagsByNodeId).not.toHaveBeenCalled();
        });

        it('should not render tags after loading tags in ngOnChanges if node is not changed', () => {
            spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));

            component.ngOnChanges({});
            fixture.detectChanges();
            const tagElements = findTagElements();
            expect(tagElements).toHaveSize(0);
            expect(tagService.getTagsByNodeId).not.toHaveBeenCalled();
        });

        it('should not render tags after loading tags in ngOnChanges if node is changed first time', () => {
            spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));

            component.ngOnChanges({
                node: new SimpleChange(undefined, node, true)
            });
            fixture.detectChanges();
            const tagElements = findTagElements();
            expect(tagElements).toHaveSize(0);
            expect(tagService.getTagsByNodeId).not.toHaveBeenCalled();
        });

        it('should render tags after loading tags after clicking on Cancel button', fakeAsync(() => {
            component.editable = true;
            fixture.detectChanges();
            TestBed.inject(CardViewContentUpdateService).itemUpdated$.next({
                changed: {}
            } as UpdateNotification);
            tick(500);
            fixture.detectChanges();
            spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));

            clickOnCancel();
            component.editable = false;
            fixture.detectChanges();
            const tagElements = findTagElements();
            expect(tagElements).toHaveSize(2);
            expect(tagElements[0].nativeElement.textContent).toBe(tagPaging.list.entries[0].entry.tag);
            expect(tagElements[1].nativeElement.textContent).toBe(tagPaging.list.entries[1].entry.tag);
            expect(tagService.getTagsByNodeId).toHaveBeenCalledOnceWith(node.id);
        }));

        it('should be hidden when editable is true', () => {
            spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
            component.ngOnInit();
            fixture.detectChanges();

            component.editable = true;
            fixture.detectChanges();
            expect(findTagElements()).toHaveSize(0);
        });
    });

    describe('Tags creator', () => {
        let tagsCreator: TagsCreatorComponent;

        beforeEach(() => {
            component.editable = true;
            component.displayTags = true;
            fixture.detectChanges();
            tagsCreator = findTagsCreator();
        });

        it('should have assigned false to tagNameControlVisible initially', () => {
            expect(tagsCreator.tagNameControlVisible).toBeFalse();
        });

        it('should hide showing tag input button after emitting tagNameControlVisibleChange event with true', () => {
            tagsCreator.tagNameControlVisibleChange.emit(true);
            fixture.detectChanges();
            expect(findShowingTagInputButton().hasAttribute('hidden')).toBeTrue();
        });

        it('should show showing tag input button after emitting tagNameControlVisibleChange event with false', fakeAsync(() => {
            tagsCreator.tagNameControlVisibleChange.emit(true);
            fixture.detectChanges();
            tick();
            tagsCreator.tagNameControlVisibleChange.emit(false);
            fixture.detectChanges();
            tick(100);
            expect(findShowingTagInputButton().hasAttribute('hidden')).toBeFalse();
        }));

        it('should have assigned correct mode', () => {
            expect(tagsCreator.mode).toBe(TagsCreatorMode.CREATE_AND_ASSIGN);
        });

        it('should enable cancel button after emitting tagsChange event', () => {
            tagsCreator.tagsChange.emit(['New tag 1', 'New tag 2', 'New tag 3']);
            fixture.detectChanges();
            expect(findCancelButton().disabled).toBeFalse();
        });

        it('should enable save button after emitting tagsChange event', () => {
            tagsCreator.tagsChange.emit(['New tag 1', 'New tag 2', 'New tag 3']);
            fixture.detectChanges();
            expect(findSaveButton().disabled).toBeFalse();
        });

        it('should have assigned false to disabledTagsRemoving', () => {
            expect(tagsCreator.disabledTagsRemoving).toBeFalse();
        });

        it('should have assigned true to disabledTagsRemoving after clicking on update button', () => {
            tagsCreator.tagsChange.emit([]);
            fixture.detectChanges();

            clickOnSave();
            expect(tagsCreator.disabledTagsRemoving).toBeTrue();
        });

        it('should have assigned false to disabledTagsRemoving if forkJoin fails', fakeAsync( () => {
            const property = { key: 'properties.property-key', value: 'original-value' } as CardViewBaseItemModel;
            const expectedNode = { ...node, name: 'some-modified-value' };
            spyOn(nodesApiService, 'updateNode').and.returnValue(of(expectedNode));
            const tagPaging = mockTagPaging();
            spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
            component.ngOnInit();
            spyOn(tagService, 'removeTag').and.returnValue(throwError({}));
            spyOn(tagService, 'assignTagsToNode').and.returnValue(EMPTY);
            const tagName1 = tagPaging.list.entries[0].entry.tag;
            const tagName2 = 'New tag 3';

            updateService.update(property, 'updated-value');
            tick(600);

            fixture.detectChanges();
            tagsCreator.tagsChange.emit([tagName1, tagName2]);
            clickOnSave();

            expect(tagsCreator.disabledTagsRemoving).toBeFalse();
        }));

        it('should have assigned false to tagNameControlVisible after clicking on update button', () => {
            tagsCreator.tagNameControlVisibleChange.emit(true);
            tagsCreator.tagsChange.emit([]);
            fixture.detectChanges();

            clickOnSave();
            expect(tagsCreator.tagNameControlVisible).toBeFalse();
        });

        describe('Setting tags', () => {
            let tagPaging: TagPaging;

            beforeEach(() => {
                tagPaging = mockTagPaging();
                spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
            });

            it('should assign correct tags after ngOnInit', () => {
                component.ngOnInit();

                fixture.detectChanges();
                expect(tagsCreator.tags).toEqual([tagPaging.list.entries[0].entry.tag, tagPaging.list.entries[1].entry.tag]);
                expect(tagService.getTagsByNodeId).toHaveBeenCalledWith(node.id);
            });

            it('should assign correct tags after ngOnChanges', () => {
                component.ngOnInit();

                fixture.detectChanges();
                expect(tagsCreator.tags).toEqual([tagPaging.list.entries[0].entry.tag, tagPaging.list.entries[1].entry.tag]);
                expect(tagService.getTagsByNodeId).toHaveBeenCalledWith(node.id);
            });
        });
    });

    it('should show tags creator if editable is true and displayTags is true', () => {
        component.editable = true;
        component.displayTags = true;
        fixture.detectChanges();
        expect(findTagsCreator()).toBeDefined();
    });

    describe('Categories list', () => {
        beforeEach(() => {
            component.displayCategories = true;
            component.node.aspectNames.push('generalclassifiable');
            spyOn(categoryService, 'getCategoryLinksForNode').and.returnValue(of(categoryPagingResponse));
        });

        it('should render categories node is assigned to', () => {
            component.ngOnInit();
            fixture.detectChanges();

            const categories = getCategories();
            expect(categories.length).toBe(2);
            expect(categories[0].textContent).toBe(category1.name);
            expect(categories[1].textContent).toBe(category2.name);
            expect(categoryService.getCategoryLinksForNode).toHaveBeenCalledWith(node.id);
        });

        it('should not render categories after loading categories in ngOnInit if displayCategories is false', () => {
            component.displayCategories = false;
            component.ngOnInit();
            fixture.detectChanges();

            const categories = getCategories();
            expect(categories).toHaveSize(0);
            expect(categoryService.getCategoryLinksForNode).not.toHaveBeenCalled();
        });

        it('should render categories when ngOnChanges', () => {
            component.ngOnChanges({ node: new SimpleChange(undefined, node, false)});
            fixture.detectChanges();

            const categories = getCategories();
            expect(categories.length).toBe(2);
            expect(categories[0].textContent).toBe(category1.name);
            expect(categories[1].textContent).toBe(category2.name);
            expect(categoryService.getCategoryLinksForNode).toHaveBeenCalledWith(node.id);
        });

        it('should not render categories after loading categories in ngOnChanges if displayCategories is false', () => {
            component.displayCategories = false;
            component.ngOnChanges({
                node: new SimpleChange(undefined, node, false)
            });
            fixture.detectChanges();
            const categories = getCategories();
            expect(categories).toHaveSize(0);
            expect(categoryService.getCategoryLinksForNode).not.toHaveBeenCalled();
        });

        it('should not reload categories in ngOnChanges if node is not changed', () => {

            component.ngOnChanges({});
            fixture.detectChanges();

            expect(categoryService.getCategoryLinksForNode).not.toHaveBeenCalled();
        });

        it('should render categories after discard changes button is clicked', fakeAsync(() => {
            component.editable = true;
            fixture.detectChanges();
            TestBed.inject(CardViewContentUpdateService).itemUpdated$.next({
                changed: {}
            } as UpdateNotification);
            tick(500);
            fixture.detectChanges();

            clickOnCancel();
            component.editable = false;
            fixture.detectChanges();

            const categories = getCategories();
            expect(categories.length).toBe(2);
            expect(categories[0].textContent).toBe(category1.name);
            expect(categories[1].textContent).toBe(category2.name);
            expect(categoryService.getCategoryLinksForNode).toHaveBeenCalledWith(node.id);
        }));

        it('should be hidden when editable is true', () => {
            component.editable = true;
            fixture.detectChanges();
            expect(getCategories().length).toBe(0);
        });
    });

    describe('Categories management', () => {
        let categoriesManagementComponent: CategoriesManagementComponent;

        beforeEach(() => {
            component.editable = true;
            component.displayCategories = true;
            component.node.aspectNames.push('generalclassifiable');
            spyOn(categoryService, 'getCategoryLinksForNode').and.returnValue(of(categoryPagingResponse));
            fixture.detectChanges();
            categoriesManagementComponent = getCategoriesManagementComponent();
        });

        it('should set categoryNameControlVisible to false initially', () => {
            expect(categoriesManagementComponent.categoryNameControlVisible).toBeFalse();
        });

        it('should hide assign categories button when categoryNameControlVisible changes to true', () => {
            categoriesManagementComponent.categoryNameControlVisibleChange.emit(true);
            fixture.detectChanges();
            expect(getAssignCategoriesBtn().hasAttribute('hidden')).toBeTrue();
        });

        it('should show assign categories button when categoryNameControlVisible changes to false', fakeAsync(() => {
            categoriesManagementComponent.categoryNameControlVisibleChange.emit(true);
            fixture.detectChanges();
            tick();
            categoriesManagementComponent.categoryNameControlVisibleChange.emit(false);
            fixture.detectChanges();
            tick(100);
            expect(getAssignCategoriesBtn().hasAttribute('hidden')).toBeFalse();
        }));

        it('should have correct mode', () => {
            expect(categoriesManagementComponent.managementMode).toBe(CategoriesManagementMode.ASSIGN);
        });

        it('should clear categories and emit event when classifiable changes', (done) => {
            component.node.aspectNames = [];
            component.ngOnChanges({ node: new SimpleChange(undefined, node, false)});
            component.classifiableChanged.subscribe(() => {
                expect(component.categories).toEqual([]);
                done();
            });
            component.ngOnChanges({ node: new SimpleChange(undefined, node, false)});
        });

        it('should enable discard and save buttons after emitting categories change event', () => {
            categoriesManagementComponent.categoriesChange.emit([category1, category2]);
            fixture.detectChanges();
            expect(findCancelButton().disabled).toBeFalse();
            expect(findSaveButton().disabled).toBeFalse();
        });

        it('should not disable removal initially', () => {
            expect(categoriesManagementComponent.disableRemoval).toBeFalse();
        });

        it('should disable removal on saving', () => {
            categoriesManagementComponent.categoriesChange.emit([]);
            fixture.detectChanges();

            clickOnSave();
            expect(categoriesManagementComponent.disableRemoval).toBeTrue();
        });

        it('should not disable removal if forkJoin fails', fakeAsync( () => {
            const property = { key: 'properties.property-key', value: 'original-value' } as CardViewBaseItemModel;
            const expectedNode = { ...node, name: 'some-modified-value' };
            spyOn(nodesApiService, 'updateNode').and.returnValue(of(expectedNode));
            component.ngOnInit();
            spyOn(tagService, 'removeTag').and.returnValue(EMPTY);
            spyOn(tagService, 'assignTagsToNode').and.returnValue(EMPTY);
            spyOn(categoryService, 'unlinkNodeFromCategory').and.returnValue(EMPTY);
            spyOn(categoryService, 'linkNodeToCategory').and.returnValue(throwError({}));

            updateService.update(property, 'updated-value');
            tick(600);

            fixture.detectChanges();
            categoriesManagementComponent.categoriesChange.emit([category1, category2]);
            clickOnSave();

            expect(categoriesManagementComponent.disableRemoval).toBeFalse();
        }));

        it('should set categoryNameControlVisible to false after saving', () => {
            categoriesManagementComponent.categoryNameControlVisibleChange.emit(true);
            categoriesManagementComponent.categoriesChange.emit([]);
            fixture.detectChanges();

            clickOnSave();
            expect(categoriesManagementComponent.categoryNameControlVisible).toBeFalse();
        });

        describe('Setting categories', () => {
            it('should set correct categories after ngOnInit', () => {
                component.ngOnInit();

                fixture.detectChanges();
                expect(categoriesManagementComponent.categories).toEqual([ category1, category2 ]);
                expect(categoryService.getCategoryLinksForNode).toHaveBeenCalledWith(node.id);
            });

            it('should set correct tags after ngOnChanges', () => {
                component.ngOnChanges({ node: new SimpleChange(undefined, node, false)});

                fixture.detectChanges();
                expect(categoriesManagementComponent.categories).toEqual([ category1, category2 ]);
                expect(categoryService.getCategoryLinksForNode).toHaveBeenCalledWith(node.id);
            });
        });
    });
});

const queryDom = (fixture: ComponentFixture<ContentMetadataComponent>, properties: string = 'properties') =>
    fixture.debugElement.query(By.css(`[data-automation-id="adf-metadata-group-${properties}"]`));
