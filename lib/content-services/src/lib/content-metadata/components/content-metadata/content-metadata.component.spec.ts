/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Category, CategoryPaging, ClassesApi, Node, Tag, TagBody, TagEntry, TagPaging, TagPagingList } from '@alfresco/js-api';
import { ContentMetadataComponent } from './content-metadata.component';
import { ContentMetadataService } from '../../services/content-metadata.service';
import { AppConfigService, CardViewBaseItemModel, CardViewComponent, NotificationService, UpdateNotification } from '@alfresco/adf-core';
import { NodesApiService } from '../../../common/services/nodes-api.service';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatChipHarness } from '@angular/material/chips/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EMPTY, of, throwError } from 'rxjs';
import { CategoriesManagementComponent, CategoriesManagementMode } from '../../../category';
import { TagsCreatorComponent, TagsCreatorMode } from '../../../tag';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { PropertyGroup } from '../../interfaces/property-group.interface';
import { PropertyDescriptorsService } from '../../services/property-descriptors.service';
import { TagService } from '../../../tag/services/tag.service';
import { CategoryService } from '../../../category/services/category.service';
import { CardViewContentUpdateService } from '../../../common/services/card-view-content-update.service';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SimpleChange } from '@angular/core';

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
    let getClassSpy: jasmine.Spy;
    let notificationService: NotificationService;
    let getGroupedPropertiesSpy: jasmine.Spy;

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
    const categoryPagingResponse: CategoryPaging = {
        list: {
            pagination: {},
            entries: [{ entry: category1 }, { entry: category2 }]
        }
    };

    const findTagElements = async (): Promise<string[]> => {
        const matChipHarnessList = await TestbedHarnessEnvironment.loader(fixture).getAllHarnesses(
            MatChipHarness.with({ selector: '.adf-dynamic-chip-list-chip' })
        );
        const tags = [];
        for (const matChip of matChipHarnessList) {
            tags.push(await matChip.getText());
        }
        return tags;
    };

    const findCancelButton = (): HTMLButtonElement => fixture.debugElement.query(By.css('[data-automation-id=reset-metadata]')).nativeElement;
    const findCancelTagsButton = (): HTMLButtonElement =>
        fixture.debugElement.query(By.css('[data-automation-id=reset-tags-metadata]')).nativeElement;

    const clickOnCancel = () => {
        findCancelButton().click();
        fixture.detectChanges();
    };

    const findSaveGeneralInfoButton = (): HTMLButtonElement =>
        fixture.debugElement.query(By.css('[data-automation-id=save-general-info-metadata]')).nativeElement;
    const findSaveTagsButton = (): HTMLButtonElement => fixture.debugElement.query(By.css('[data-automation-id=save-tags-metadata]')).nativeElement;
    const findSaveCategoriesButton = (): HTMLButtonElement =>
        fixture.debugElement.query(By.css('[data-automation-id=save-categories-metadata]')).nativeElement;

    const clickOnGeneralInfoSave = () => {
        findSaveGeneralInfoButton().click();
        fixture.detectChanges();
    };

    const clickOnTagsSave = () => {
        findSaveTagsButton().click();
        fixture.detectChanges();
    };

    const getGroupSaveButton = () => fixture.debugElement.query(By.css('[data-automation-id="save-metadata"]')).nativeElement;
    const clickOnGroupSaveButton = () => getGroupSaveButton().click();

    const findTagsCreator = (): TagsCreatorComponent => fixture.debugElement.query(By.directive(TagsCreatorComponent))?.componentInstance;
    const getToggleEditButton = () => fixture.debugElement.query(By.css('[data-automation-id="meta-data-general-info-edit"]'));
    const getTagsToggleEditButton = () => fixture.debugElement.query(By.css('[data-automation-id="showing-tag-input-button"]'));
    const getCategoriesToggleEditButton = () => fixture.debugElement.query(By.css('[data-automation-id="meta-data-categories-edit"]'));
    const getGroupToggleEditButton = () => fixture.debugElement.query(By.css('[data-automation-id="meta-data-card-toggle-edit"]'));

    const toggleEditModeForTags = (): void => {
        getTagsToggleEditButton().nativeElement.click();
        fixture.detectChanges();
    };

    const toggleEditModeForGeneralInfo = (): void => {
        getToggleEditButton().nativeElement.click();
        fixture.detectChanges();
    };

    const toggleEditModeForCategories = (): void => {
        getCategoriesToggleEditButton().nativeElement.click();
        fixture.detectChanges();
    };

    const toggleEditModeForGroup = (): void => {
        getGroupToggleEditButton().nativeElement.click();
        fixture.detectChanges();
    };

    const getGeneralInfoPanelContent = (): CardViewComponent =>
        fixture.debugElement.query(By.css('.adf-metadata-properties-expansion-panel')).componentInstance;

    const getGroupPanelContent = (): CardViewComponent =>
        fixture.debugElement.query(By.css('.adf-metadata-grouped-properties-container adf-card-view')).componentInstance;

    const getGeneralInfoPanel = (): MatExpansionPanel =>
        fixture.debugElement.query(By.css('[data-automation-id="adf-metadata-group-properties"]'))?.componentInstance;

    const queryDom = (properties = 'properties') => fixture.debugElement.query(By.css(`[data-automation-id="adf-metadata-group-${properties}"]`));

    /**
     * Get metadata categories
     *
     * @returns list of native elements
     */
    function getCategories(): HTMLParagraphElement[] {
        return fixture.debugElement.queryAll(By.css('.adf-metadata-categories'))?.map((debugElem) => debugElem.nativeElement);
    }

    /**
     * Get a categories management component
     *
     * @returns angular component
     */
    function getCategoriesManagementComponent(): CategoriesManagementComponent {
        return fixture.debugElement.query(By.directive(CategoriesManagementComponent))?.componentInstance;
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule, MatDialogModule, MatSnackBarModule, ContentMetadataComponent],
            providers: [
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
                }
            ]
        });
        fixture = TestBed.createComponent(ContentMetadataComponent);
        component = fixture.componentInstance;
        contentMetadataService = TestBed.inject(ContentMetadataService);
        updateService = TestBed.inject(CardViewContentUpdateService);
        nodesApiService = TestBed.inject(NodesApiService);
        tagService = TestBed.inject(TagService);
        categoryService = TestBed.inject(CategoryService);
        notificationService = TestBed.inject(NotificationService);
        const propertyDescriptorsService = TestBed.inject(PropertyDescriptorsService);
        const classesApi = propertyDescriptorsService['classesApi'];

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
        getGroupedPropertiesSpy = spyOn(contentMetadataService, 'getGroupedProperties');
        getClassSpy = spyOn(classesApi, 'getClass');
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Default input param values', () => {
        it('should have displayEmpty input param as false by default', () => {
            expect(component.displayEmpty).toBeFalse();
        });

        it('should have expanded input param as false by default', () => {
            expect(component.expanded).toBeFalse();
        });
    });

    describe('Folder', () => {
        it('should show the folder node', (done) => {
            component.expanded = false;
            getGroupedPropertiesSpy.and.returnValue(of([]));
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
            const fakeNode = {
                id: 'fake-minimal-node',
                aspectNames: ['ft:a', 'ft:b', 'ft:c'],
                name: 'fake-node'
            } as Node;
            getGroupedPropertiesSpy.and.stub();
            spyOn(contentMetadataService, 'getBasicProperties').and.stub();
            updateService.updateNodeAspect(fakeNode);

            tick(600);
            expect(contentMetadataService.getBasicProperties).toHaveBeenCalled();
            expect(contentMetadataService.getGroupedProperties).toHaveBeenCalled();
        }));

        describe('Save button - Grouped Properties', () => {
            beforeEach(() => {
                getGroupedPropertiesSpy.and.returnValue(
                    of([
                        {
                            editable: true,
                            title: 'test',
                            properties: []
                        }
                    ])
                );

                component.ngOnInit();
                component.readOnly = false;
            });

            it('should disable the save button if metadata has not changed', () => {
                fixture.detectChanges();
                toggleEditModeForGroup();
                expect(getGroupSaveButton().disabled).toBeTrue();
            });

            it('should disable the save button if there are invalid properties', fakeAsync(() => {
                updateService.update(
                    {
                        key: 'properties.property-key',
                        isValidValue: false
                    } as CardViewBaseItemModel,
                    'updated-value'
                );
                tick(500);
                fixture.detectChanges();
                toggleEditModeForGroup();
                expect(getGroupSaveButton().disabled).toBeTrue();
            }));

            it('should enable the save button if metadata has changed and there are no invalid properties', fakeAsync(() => {
                updateService.update(
                    {
                        key: 'properties.property-key',
                        isValidValue: true
                    } as CardViewBaseItemModel,
                    'updated-value'
                );
                tick(500);
                fixture.detectChanges();
                toggleEditModeForGroup();
                expect(getGroupSaveButton().disabled).toBeFalse();
            }));
        });

        describe('Save button - Basic Properties', () => {
            beforeEach(fakeAsync(() => {
                spyOn(contentMetadataService, 'getBasicProperties').and.returnValue(of([]));
                component.ngOnInit();
                component.readOnly = false;
            }));

            it('should disable the save button if metadata has not changed', fakeAsync(() => {
                fixture.detectChanges();
                toggleEditModeForGeneralInfo();
                expect(findSaveGeneralInfoButton().disabled).toBeTrue();
            }));

            it('should enable the save button if metadata has changed and there are no invalid properties', fakeAsync(() => {
                updateService.update(
                    {
                        key: 'properties.property-key',
                        isValidValue: true
                    } as CardViewBaseItemModel,
                    'updated-value'
                );
                tick(500);
                fixture.detectChanges();
                toggleEditModeForGeneralInfo();
                expect(findSaveGeneralInfoButton().disabled).toBeFalse();
            }));

            it('should disable the save button if there are invalid properties', fakeAsync(() => {
                updateService.update(
                    {
                        key: 'properties.property-key',
                        isValidValue: false
                    } as CardViewBaseItemModel,
                    'updated-value'
                );
                tick(500);
                fixture.detectChanges();
                toggleEditModeForGeneralInfo();
                expect(findSaveGeneralInfoButton().disabled).toBeTrue();
            }));
        });

        describe('updateInvalidProperties', () => {
            it('should add the property key to invalidProperties if isValidValue is false and key is not present', fakeAsync(() => {
                const property = { key: 'properties.property-key', isValidValue: false } as CardViewBaseItemModel;
                expect(component.invalidProperties.size).toBe(0);
                updateService.update(property, 'updated-value');
                tick(500);
                expect(component.invalidProperties.has(property.key)).toBeTrue();
            }));

            it('should not add the property key to invalidProperties if isValidValue is false and key is already present', fakeAsync(() => {
                const property = { key: 'properties.property-key', isValidValue: false } as CardViewBaseItemModel;
                updateService.update(property, 'updated-value-1');
                tick(500);
                updateService.update(property, 'updated-value-2');
                tick(500);
                expect(component.invalidProperties.size).toBe(1);
                expect(component.invalidProperties.has(property.key)).toBeTrue();
            }));

            it('should remove the property key from invalidProperties if isValidValue is true and key is present', fakeAsync(() => {
                updateService.update({ key: 'properties.property-key', isValidValue: false } as CardViewBaseItemModel, 'updated-value');
                tick(500);
                expect(component.invalidProperties).toContain('properties.property-key');
                updateService.update({ key: 'properties.property-key', isValidValue: true } as CardViewBaseItemModel, 'updated-value');
                tick(500);
                expect(component.invalidProperties.has('properties.property-key')).toBeFalse();
            }));

            it('should not change invalidProperties if isValidValue is true and key is not present', fakeAsync(() => {
                expect(component.invalidProperties.size).toBe(0);
                updateService.update({ key: 'properties.property-key', isValidValue: true } as CardViewBaseItemModel, 'updated-value');
                tick(500);
                expect(component.invalidProperties.size).toBe(0);
            }));
        });

        it('should save changedProperties on save click', fakeAsync(() => {
            getGroupedPropertiesSpy.and.returnValue(
                of([
                    {
                        editable: true,
                        title: 'test',
                        properties: []
                    }
                ])
            );
            updateService.itemUpdated$.next({
                changed: {}
            } as UpdateNotification);
            component.ngOnInit();
            tick(500);
            component.readOnly = false;
            fixture.detectChanges();
            const expectedNode: Node = { ...node, name: 'some-modified-value' };
            spyOn(nodesApiService, 'updateNode').and.returnValue(of(expectedNode));
            toggleEditModeForGroup();

            clickOnGroupSaveButton();
            expect(nodesApiService.updateNode).toHaveBeenCalled();
            expect(component.node).toEqual(expectedNode);
        }));

        it('should call removeTag and assignTagsToNode on TagService on save click', fakeAsync(() => {
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
            component.readOnly = false;
            updateService.update(property, 'updated-value');
            fixture.detectChanges();
            toggleEditModeForTags();
            findTagsCreator().tagsChange.emit([tagName1, tagName2]);
            fixture.detectChanges();
            tick(600);
            clickOnTagsSave();
            tick(100);
            const tag1 = new TagBody({ tag: tagName1 });
            const tag2 = new TagBody({ tag: tagName2 });
            expect(tagService.removeTag).toHaveBeenCalledWith(node.id, tagPaging.list.entries[1].entry.id);
            expect(tagService.assignTagsToNode).toHaveBeenCalledWith(node.id, [tag1, tag2]);

            discardPeriodicTasks();
            flush();
        }));

        it('should call getTagsByNodeId on TagService on save click', () => {
            component.displayTags = true;
            const property = { key: 'properties.property-key', value: 'original-value' } as CardViewBaseItemModel;
            const expectedNode = { ...node, name: 'some-modified-value' };
            spyOn(nodesApiService, 'updateNode').and.returnValue(of(expectedNode));
            const tagPaging = mockTagPaging();
            const getTagsByNodeIdSpy = spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
            component.ngOnInit();
            component.readOnly = false;
            spyOn(tagService, 'removeTag').and.returnValue(of(undefined));
            spyOn(tagService, 'assignTagsToNode').and.returnValue(of({}));

            updateService.update(property, 'updated-value');

            fixture.detectChanges();
            toggleEditModeForTags();
            findTagsCreator().tagsChange.emit([tagPaging.list.entries[0].entry.tag, 'New tag 3']);
            fixture.detectChanges();
            getTagsByNodeIdSpy.calls.reset();
            clickOnTagsSave();

            expect(tagService.getTagsByNodeId).toHaveBeenCalledWith(node.id);
        });

        it('should throw error on unsuccessful save', fakeAsync(() => {
            component.readOnly = false;
            const property = { key: 'properties.property-key', value: 'original-value' } as CardViewBaseItemModel;
            spyOn(nodesApiService, 'updateNode').and.returnValue(throwError(new Error('My bad')));

            updateService.update(property, 'updated-value');
            tick(600);

            const sub = contentMetadataService.error.subscribe((err) => {
                expect(err.statusCode).toBe(0);
                expect(err.message).toBe('METADATA.ERRORS.GENERIC');
                sub.unsubscribe();
            });

            fixture.detectChanges();
            toggleEditModeForGeneralInfo();
            fixture.whenStable().then(() => clickOnGeneralInfoSave());
            discardPeriodicTasks();
            flush();
        }));

        it('should revert changes on unsuccessful save', fakeAsync(() => {
            component.readOnly = false;
            const property = { key: 'properties.property-key', value: 'original-value' } as CardViewBaseItemModel;
            spyOn(nodesApiService, 'updateNode').and.returnValue(throwError(new Error('error message')));
            spyOn(component, 'revertChanges').and.callThrough();
            updateService.update(property, 'new-value');
            tick(600);

            fixture.detectChanges();
            toggleEditModeForGeneralInfo();
            tick(100);
            clickOnGeneralInfoSave();
            tick(100);

            expect(component.revertChanges).toHaveBeenCalled();
            expect(component.changedProperties).toEqual({});
            expect(component.hasMetadataChanged).toBeFalse();
            discardPeriodicTasks();
            flush();
        }));

        it('should open the confirm dialog when content type is changed', fakeAsync(() => {
            component.readOnly = false;
            const property = { key: 'nodeType', value: 'ft:sbiruli' } as CardViewBaseItemModel;
            const expectedNode = { ...node, nodeType: 'ft:sbiruli' };
            spyOn(contentMetadataService, 'openConfirmDialog').and.returnValue(of(true));
            spyOn(nodesApiService, 'updateNode').and.returnValue(of(expectedNode));

            updateService.update(property, 'ft:poppoli');
            tick(600);

            fixture.detectChanges();
            toggleEditModeForGeneralInfo();
            tick(100);
            clickOnGeneralInfoSave();

            tick(100);
            expect(component.node).toEqual(expectedNode);
            expect(contentMetadataService.openConfirmDialog).toHaveBeenCalledWith({ nodeType: 'ft:poppoli' });
            expect(nodesApiService.updateNode).toHaveBeenCalled();
            discardPeriodicTasks();
            flush();
        }));

        it('should call removeTag and assignTagsToNode on TagService after confirming confirmation dialog when content type is changed', fakeAsync(() => {
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
            component.readOnly = false;
            updateService.update(property, 'ft:poppoli');
            tick(600);

            fixture.detectChanges();
            toggleEditModeForTags();
            findTagsCreator().tagsChange.emit([tagName1, tagName2]);
            tick(100);
            fixture.detectChanges();
            clickOnTagsSave();

            tick(100);
            const tag1 = new TagBody({ tag: tagName1 });
            const tag2 = new TagBody({ tag: tagName2 });

            expect(tagService.removeTag).toHaveBeenCalledWith(node.id, tagPaging.list.entries[1].entry.id);
            expect(tagService.assignTagsToNode).toHaveBeenCalledWith(node.id, [tag1, tag2]);

            discardPeriodicTasks();
            flush();
        }));

        it('should retrigger the load of the properties when the content type has changed', fakeAsync(() => {
            component.readOnly = false;
            const property = { key: 'nodeType', value: 'ft:sbiruli' } as CardViewBaseItemModel;
            const expectedNode = Object.assign({}, node, { nodeType: 'ft:sbiruli' });
            spyOn(contentMetadataService, 'openConfirmDialog').and.returnValue(of(true));
            spyOn(updateService, 'updateNodeAspect');
            spyOn(nodesApiService, 'updateNode').and.returnValue(of(expectedNode));

            updateService.update(property, 'ft:poppoli');
            tick(600);

            fixture.detectChanges();
            toggleEditModeForGeneralInfo();
            tick(100);
            clickOnGeneralInfoSave();

            tick(100);
            expect(component.node).toEqual(expectedNode);
            expect(updateService.updateNodeAspect).toHaveBeenCalledWith(expectedNode);

            discardPeriodicTasks();
            flush();
        }));
    });

    describe('toggleEdit', () => {
        let showErrorSpy: jasmine.Spy;

        beforeEach(() => {
            showErrorSpy = spyOn(notificationService, 'showError').and.stub();
            getGroupedPropertiesSpy.and.returnValue(
                of([
                    {
                        editable: true,
                        title: 'test',
                        properties: []
                    }
                ])
            );
            component.displayCategories = true;
            component.displayTags = true;
            component.ngOnInit();
            component.readOnly = false;
            fixture.detectChanges();
        });

        it('should toggle General Info editing mode', () => {
            toggleEditModeForGeneralInfo();
            expect(getToggleEditButton()).toBeNull();
            expect(getGeneralInfoPanelContent().editable).toBeTrue();
            expect(getTagsToggleEditButton()).toBeDefined();
            expect(findTagsCreator()).toBeUndefined();
            expect(getCategoriesToggleEditButton()).toBeDefined();
            expect(getCategoriesManagementComponent()).toBeUndefined();
            expect(getGroupToggleEditButton()).toBeDefined();
            expect(getGroupPanelContent().editable).toBeFalse();
        });

        it('should toggle Tags editing mode', () => {
            toggleEditModeForTags();
            expect(getTagsToggleEditButton()).toBeNull();
            expect(findTagsCreator()).toBeDefined();
            expect(getToggleEditButton()).toBeDefined();
            expect(getGeneralInfoPanelContent().editable).toBeFalse();
            expect(getCategoriesToggleEditButton()).toBeDefined();
            expect(getCategoriesManagementComponent()).toBeUndefined();
            expect(getGroupToggleEditButton()).toBeDefined();
            expect(getGroupPanelContent().editable).toBeFalse();
        });

        it('should toggle Categories editing mode', () => {
            toggleEditModeForCategories();
            expect(getCategoriesToggleEditButton()).toBeNull();
            expect(getCategoriesManagementComponent()).toBeDefined();
            expect(getTagsToggleEditButton()).toBeDefined();
            expect(findTagsCreator()).toBeUndefined();
            expect(getToggleEditButton()).toBeDefined();
            expect(getGeneralInfoPanelContent().editable).toBeFalse();
            expect(getGroupToggleEditButton()).toBeDefined();
            expect(getGroupPanelContent().editable).toBeFalse();
        });

        it('should toggle Group editing mode', () => {
            toggleEditModeForGroup();
            expect(getGroupToggleEditButton()).toBeNull();
            expect(getGroupPanelContent().editable).toBeTrue();
            expect(getCategoriesToggleEditButton()).toBeDefined();
            expect(getCategoriesManagementComponent()).toBeUndefined();
            expect(getTagsToggleEditButton()).toBeDefined();
            expect(findTagsCreator()).toBeUndefined();
            expect(getToggleEditButton()).toBeDefined();
            expect(getGeneralInfoPanelContent().editable).toBeFalse();
        });

        it('should show Snackbar if trying to edit different panel when other panel has some changes', () => {
            toggleEditModeForTags();
            findTagsCreator().tagsChange.emit(['test']);

            toggleEditModeForGeneralInfo();
            expect(showErrorSpy).toHaveBeenCalledWith('METADATA.BASIC.SAVE_OR_DISCARD_CHANGES');
        });
    });

    describe('Permission', () => {
        beforeEach(() => {
            component.readOnly = false;
            component.node.allowableOperations = null;

            component.ngOnInit();
        });

        it('should hide the general info edit button if node does not have `update` permissions', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.readOnly).toBeTrue();
            expect(getToggleEditButton()).toBeNull();
        });

        it('should hide the tags edit button if node does not have `update` permissions', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.readOnly).toBeTrue();
            expect(getTagsToggleEditButton()).toBeNull();
        });

        it('should hide the categories edit button if node does not have `update` permissions', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.readOnly).toBeTrue();
            expect(getCategoriesToggleEditButton()).toBeNull();
        });

        it('should hide the groups edit button if node does not have `update` permissions', () => {
            component.readOnly = false;
            component.node.allowableOperations = null;
            fixture.detectChanges();

            expect(getGroupToggleEditButton()).toBeNull();
        });
    });

    describe('Resetting', () => {
        beforeEach(() => {
            spyOn(nodesApiService, 'updateNode').and.returnValue(EMPTY);
            component.readOnly = false;
        });

        it('should reset general info edit ability on reset click', () => {
            fixture.detectChanges();
            toggleEditModeForGeneralInfo();

            findCancelButton().click();
            fixture.detectChanges();
            expect(nodesApiService.updateNode).not.toHaveBeenCalled();
            expect(getToggleEditButton()).toBeDefined();
            expect(getGeneralInfoPanelContent().editable).toBeFalse();
        });

        it('should reset tags edit ability on reset click', () => {
            component.displayTags = true;
            fixture.detectChanges();
            toggleEditModeForTags();

            findCancelTagsButton().click();
            fixture.detectChanges();
            expect(nodesApiService.updateNode).not.toHaveBeenCalled();
            expect(getTagsToggleEditButton()).toBeDefined();
            expect(findTagsCreator()).toBeUndefined();
        });

        it('should reset categories edit ability on reset click', () => {
            component.displayCategories = true;
            fixture.detectChanges();
            toggleEditModeForCategories();

            findCancelButton().click();
            fixture.detectChanges();
            expect(nodesApiService.updateNode).not.toHaveBeenCalled();
            expect(getCategoriesToggleEditButton()).toBeDefined();
            expect(getCategoriesManagementComponent()).toBeUndefined();
        });

        it('should reset group edit ability on reset click', () => {
            getGroupedPropertiesSpy.and.returnValue(
                of([
                    {
                        editable: true,
                        title: 'test',
                        properties: []
                    }
                ])
            );
            component.ngOnInit();
            component.readOnly = false;
            fixture.detectChanges();
            toggleEditModeForGroup();

            findCancelButton().click();
            fixture.detectChanges();
            expect(nodesApiService.updateNode).not.toHaveBeenCalled();
            expect(getGroupToggleEditButton()).toBeDefined();
            expect(getGroupPanelContent().editable).toBeFalse();
        });
    });

    describe('Properties loading', () => {
        let expectedNode: Node;

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
            getGroupedPropertiesSpy.and.stub();

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
            getGroupedPropertiesSpy.and.stub();

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            expect(contentMetadataService.getGroupedProperties).toHaveBeenCalledWith(expectedNode, presetConfig);
        });

        it('should pass through the loaded group properties to the card view', async () => {
            const expectedProperties = [];
            component.expanded = true;

            getGroupedPropertiesSpy.and.returnValue(of([{ properties: expectedProperties }]));
            spyOn(component, 'showGroup').and.returnValue(true);

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            fixture.detectChanges();
            await fixture.whenStable();
            expect(getGroupPanelContent().properties).toBe(expectedProperties);
        });

        it('should pass through the displayEmpty to the card view of grouped properties', async () => {
            component.expanded = true;
            component.displayEmpty = false;

            getGroupedPropertiesSpy.and.returnValue(of([{ properties: [] }]));
            spyOn(component, 'showGroup').and.returnValue(true);

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            fixture.detectChanges();
            await fixture.whenStable();
            expect(getGroupPanelContent().displayEmpty).toBe(false);
        });

        it('should hide card views group when the grouped properties are empty', async () => {
            getGroupedPropertiesSpy.and.stub();

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            fixture.detectChanges();
            await fixture.whenStable();

            const basicPropertiesGroup = fixture.debugElement.query(By.css('.adf-metadata-grouped-properties-container .adf-content-metadata-panel'));
            expect(basicPropertiesGroup).toBeNull();
        });

        it('should display card views group when there is at least one property that is not empty', async () => {
            component.expanded = true;
            getGroupedPropertiesSpy.and.stub();

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            fixture.detectChanges();
            await fixture.whenStable();

            const basicPropertiesGroup = fixture.debugElement.query(By.css('.adf-metadata-grouped-properties-container .adf-content-metadata-panel'));
            expect(basicPropertiesGroup).toBeDefined();
        });

        it('should revert reload properties for general info panel on cancel', () => {
            component.readOnly = false;
            fixture.detectChanges();
            spyOn(contentMetadataService, 'getBasicProperties');
            toggleEditModeForGeneralInfo();

            findCancelButton().click();
            expect(contentMetadataService.getBasicProperties).toHaveBeenCalled();
        });

        it('should reload properties for group panel on cancel', () => {
            getGroupedPropertiesSpy.and.returnValue(
                of([
                    {
                        editable: true,
                        title: 'test',
                        properties: []
                    }
                ])
            );
            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });
            component.readOnly = false;
            fixture.detectChanges();
            toggleEditModeForGroup();
            getGroupedPropertiesSpy.calls.reset();

            findCancelButton().click();
            expect(getGroupedPropertiesSpy).toHaveBeenCalledWith(node, 'custom-preset');
        });

        it('should reload categories for categories panel on cancel', () => {
            spyOn(categoryService, 'getCategoryLinksForNode').and.returnValue(of(categoryPagingResponse));
            component.displayCategories = true;
            component.readOnly = false;
            fixture.detectChanges();
            toggleEditModeForCategories();

            findCancelButton().click();
            expect(categoryService.getCategoryLinksForNode).toHaveBeenCalledWith(expectedNode.id);
        });

        it('should reload tags for tags panel on cancel', () => {
            spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(mockTagPaging()));
            component.displayTags = true;
            component.readOnly = false;
            fixture.detectChanges();
            toggleEditModeForTags();

            findCancelTagsButton().click();
            expect(tagService.getTagsByNodeId).toHaveBeenCalledWith(expectedNode.id);
        });
    });

    describe('Properties displaying', () => {
        it('should hide metadata fields if displayDefaultProperties is set to false', () => {
            component.displayDefaultProperties = false;
            fixture.detectChanges();
            const metadataContainer = getGeneralInfoPanel();
            fixture.detectChanges();
            expect(metadataContainer).toBeUndefined();
        });

        it('should display metadata fields if displayDefaultProperties is set to true', () => {
            component.displayDefaultProperties = true;
            fixture.detectChanges();
            const metadataContainer = getGeneralInfoPanel();
            fixture.detectChanges();
            expect(metadataContainer).toBeDefined();
        });

        it('should have displayDefaultProperties input param as true by default', () => {
            expect(component.displayDefaultProperties).toBe(true);
        });

        it('should set default properties as active panel on displayDefaultProperties toggle', () => {
            component.displayDefaultProperties = false;
            component.currentPanel.panelTitle = 'test';
            component.currentPanel.expanded = false;

            component.ngOnChanges({ displayDefaultProperties: new SimpleChange(false, true, false) });

            fixture.detectChanges();
            expect(component.currentPanel.panelTitle).toBe(component.DefaultPanels.PROPERTIES);
            expect(component.currentPanel.expanded).toBe(true);
        });
    });

    describe('Display properties with aspect oriented config', () => {
        let appConfig: AppConfigService;
        let classesApi: ClassesApi;
        let expectedNode: Node;

        const verResponse: PropertyGroup = {
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
            const propertyDescriptorsService = TestBed.inject(PropertyDescriptorsService);
            classesApi = propertyDescriptorsService['classesApi'];
            expectedNode = {
                ...node,
                aspectNames: ['rn:renditioned', 'cm:versionable', 'cm:titled', 'cm:auditable', 'cm:author', 'cm:thumbnailModification', 'exif:exif'],
                name: 'some-modified-value',
                properties: {
                    'exif:pixelXDimension': 1024,
                    'exif:pixelYDimension': 1024
                }
            };

            component.expanded = true;
            component.preset = 'default';
            getGroupedPropertiesSpy.and.callThrough();
        });

        it('should show Versionable with given content-metadata config', async () => {
            setContentMetadataConfig('default', {
                includeAll: false,
                'cm:versionable': '*'
            });

            getClassSpy.and.returnValue(Promise.resolve(verResponse));

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });
            fixture.detectChanges();

            await component.groupedProperties$.toPromise();
            fixture.detectChanges();

            const verProp = queryDom('Versionable');

            expect(verProp).toBeTruthy();
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_versionable');
        });

        it('should show Versionable twice with given content-metadata config', async () => {
            setContentMetadataConfig('default', {
                includeAll: true,
                'cm:versionable': '*'
            });

            getClassSpy.and.returnValue(Promise.resolve(verResponse));

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });
            fixture.detectChanges();

            await component.groupedProperties$.toPromise();
            fixture.detectChanges();

            const verProps = fixture.debugElement.queryAll(By.css('[data-automation-id="adf-metadata-group-Versionable"]'));

            expect(verProps.length).toEqual(2);
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_versionable');
        });

        it('should not show Versionable with given content-metadata config', async () => {
            setContentMetadataConfig('default', {
                includeAll: true,
                exclude: 'cm:versionable'
            });

            getClassSpy.and.returnValue(Promise.resolve(verResponse));

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });
            fixture.detectChanges();

            await component.groupedProperties$.toPromise();
            fixture.detectChanges();

            const verProp = queryDom('Versionable');

            expect(verProp).toBeNull();
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_versionable');
        });

        it('should not show Versionable when excluded and included set in content-metadata config', async () => {
            setContentMetadataConfig('default', {
                includeAll: true,
                exclude: 'cm:versionable',
                'cm:versionable': '*'
            });

            getClassSpy.and.returnValue(Promise.resolve(verResponse));

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });
            fixture.detectChanges();

            await component.groupedProperties$.toPromise();
            fixture.detectChanges();

            const verProp = queryDom('Versionable');

            expect(verProp).toBeTruthy();
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_versionable');
        });

        it('should not show aspects excluded in content-metadata config', async () => {
            setContentMetadataConfig('default', {
                includeAll: true,
                exclude: ['cm:versionable', 'cm:auditable']
            });

            getClassSpy.and.returnValue(Promise.resolve(verResponse));

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });
            fixture.detectChanges();

            await component.groupedProperties$.toPromise();
            fixture.detectChanges();

            const verProp = queryDom('Versionable');
            expect(verProp).toBeNull();

            const auditableProp = queryDom('Auditable');
            expect(auditableProp).toBeNull();

            expect(classesApi.getClass).toHaveBeenCalledWith('cm_versionable');
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_auditable');
        });

        it('should show Exif even when includeAll is set to false', async () => {
            setContentMetadataConfig('default', {
                includeAll: false,
                'exif:exif': ['exif:pixelXDimension', 'exif:pixelYDimension']
            });

            getClassSpy.and.returnValue(Promise.resolve(exifResponse));

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });
            fixture.detectChanges();

            await component.groupedProperties$.toPromise();
            fixture.detectChanges();

            const exifProp = queryDom('Exif');

            expect(exifProp).toBeTruthy();
            expect(classesApi.getClass).toHaveBeenCalledWith('exif_exif');

            exifProp.nativeElement.click();

            const pixelXDimensionElement = fixture.debugElement.query(
                By.css('[data-automation-id="card-textitem-label-properties.exif:pixelXDimension"]')
            );
            expect(pixelXDimensionElement).toBeTruthy();
            expect(pixelXDimensionElement.nativeElement.textContent.trim()).toEqual('Image Width');

            const pixelYDimensionElement = fixture.debugElement.query(
                By.css('[data-automation-id="card-textitem-label-properties.exif:pixelYDimension"]')
            );
            expect(pixelYDimensionElement).toBeTruthy();
            expect(pixelYDimensionElement.nativeElement.textContent.trim()).toEqual('Image Height');
        });

        it('should show Exif twice when includeAll is set to true', async () => {
            setContentMetadataConfig('default', {
                includeAll: true,
                'exif:exif': ['exif:pixelXDimension', 'exif:pixelYDimension']
            });

            getClassSpy.and.returnValue(Promise.resolve(exifResponse));

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
        it('should general info panel be expanded by default if no displayAspect provided', () => {
            fixture.detectChanges();

            expect(getGeneralInfoPanel().expanded).toBeTrue();
        });

        it('should open and update drawer with expand section dynamically', async () => {
            component.displayEmpty = true;
            component.displayAspect = 'EXIF';
            component.expanded = true;

            fixture.detectChanges();
            await fixture.whenStable();

            let defaultProp = queryDom();
            expect(defaultProp.nativeElement.expanded).toBeFalsy();

            component.displayAspect = 'CUSTOM';

            fixture.detectChanges();
            await fixture.whenStable();

            defaultProp = queryDom();
            expect(defaultProp.nativeElement.expanded).toBeFalsy();
        });

        it('should not expand anything if input is wrong', async () => {
            component.displayAspect = 'XXXX';
            component.expanded = true;
            component.displayEmpty = true;

            fixture.detectChanges();
            await fixture.whenStable();

            const defaultProp = queryDom();
            expect(defaultProp.nativeElement.expanded).toBeFalsy();
        });

        it('should expand the section when displayAspect set as Properties', async () => {
            component.displayAspect = 'Properties';

            component.ngOnInit();
            fixture.detectChanges();

            expect(getGeneralInfoPanel().expanded).toBeTrue();
        });
    });

    describe('events', () => {
        it('should not propagate the event on left arrows press', () => {
            fixture.detectChanges();
            const event = { keyCode: 37, stopPropagation: () => {} };
            spyOn(event, 'stopPropagation').and.stub();
            const element = fixture.debugElement.query(By.css('adf-card-view'));
            element.triggerEventHandler('keydown', event);
            expect(event.stopPropagation).toHaveBeenCalled();
        });

        it('should not propagate the event on right arrows press', () => {
            fixture.detectChanges();
            const event = { keyCode: 39, stopPropagation: () => {} };
            spyOn(event, 'stopPropagation').and.stub();
            const element = fixture.debugElement.query(By.css('adf-card-view'));
            element.triggerEventHandler('keydown', event);
            expect(event.stopPropagation).toHaveBeenCalled();
        });

        it('should propagate the event on other keys press', () => {
            fixture.detectChanges();
            const event = { keyCode: 40, stopPropagation: () => {} };
            spyOn(event, 'stopPropagation').and.stub();
            const element = fixture.debugElement.query(By.css('adf-card-view'));
            element.triggerEventHandler('keydown', event);
            expect(event.stopPropagation).not.toHaveBeenCalled();
        });
    });

    describe('Tags list', () => {
        let tagPaging: TagPaging;

        const expandTagsPanel = (): void => {
            fixture.debugElement.query(By.css('[data-automation-id="adf-content-metadata-tags-panel"]'))?.componentInstance.opened.emit();
            fixture.detectChanges();
        };

        beforeEach(() => {
            tagPaging = mockTagPaging();
            component.displayTags = true;
        });

        it('should render tags after loading tags in ngOnInit', async () => {
            spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
            component.ngOnInit();
            fixture.detectChanges();

            expandTagsPanel();
            const tagElements = await findTagElements();
            expect(tagElements).toHaveSize(2);
            expect(tagElements[0]).toBe(tagPaging.list.entries[0].entry.tag);
            expect(tagElements[1]).toBe(tagPaging.list.entries[1].entry.tag);
            expect(tagService.getTagsByNodeId).toHaveBeenCalledWith(node.id);
        });

        it('should not render tags after loading tags in ngOnInit if displayTags is false', async () => {
            component.displayTags = false;
            spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
            component.ngOnInit();
            fixture.detectChanges();

            expandTagsPanel();
            const tagElements = await findTagElements();
            expect(tagElements).toHaveSize(0);
            expect(tagService.getTagsByNodeId).not.toHaveBeenCalled();
        });

        it('should render tags after loading tags in ngOnChanges', async () => {
            spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));

            component.ngOnChanges({
                node: new SimpleChange(undefined, node, false)
            });
            fixture.detectChanges();

            expandTagsPanel();
            const tagElements = await findTagElements();
            expect(tagElements).toHaveSize(2);
            expect(tagElements[0]).toBe(tagPaging.list.entries[0].entry.tag);
            expect(tagElements[1]).toBe(tagPaging.list.entries[1].entry.tag);
            expect(tagService.getTagsByNodeId).toHaveBeenCalledWith(node.id);
        });

        it('should not render tags after loading tags in ngOnChanges if displayTags is false', async () => {
            component.displayTags = false;
            spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
            component.ngOnChanges({
                node: new SimpleChange(undefined, node, false)
            });

            expandTagsPanel();
            fixture.detectChanges();
            const tagElements = await findTagElements();
            expect(tagElements).toHaveSize(0);
            expect(tagService.getTagsByNodeId).not.toHaveBeenCalled();
        });

        it('should not render tags after loading tags in ngOnChanges if node is not changed', async () => {
            spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
            component.ngOnChanges({});

            expandTagsPanel();
            fixture.detectChanges();
            const tagElements = await findTagElements();
            expect(tagElements).toHaveSize(0);
            expect(tagService.getTagsByNodeId).not.toHaveBeenCalled();
        });

        it('should not render tags after loading tags in ngOnChanges if node is changed first time', async () => {
            spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
            component.ngOnChanges({
                node: new SimpleChange(undefined, node, true)
            });

            expandTagsPanel();
            fixture.detectChanges();
            const tagElements = await findTagElements();
            expect(tagElements).toHaveSize(0);
            expect(tagService.getTagsByNodeId).not.toHaveBeenCalled();
        });

        it('should render tags after loading tags after clicking on Cancel button', fakeAsync(async () => {
            component.readOnly = false;
            fixture.detectChanges();
            toggleEditModeForTags();
            TestBed.inject(CardViewContentUpdateService).itemUpdated$.next({
                changed: {}
            } as UpdateNotification);
            tick(500);
            fixture.detectChanges();
            spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
            findCancelTagsButton().click();
            fixture.detectChanges();

            expandTagsPanel();
            const tagElements = await findTagElements();
            expect(tagElements).toHaveSize(2);
            expect(tagElements[0]).toBe(tagPaging.list.entries[0].entry.tag);
            expect(tagElements[1]).toBe(tagPaging.list.entries[1].entry.tag);
            expect(tagService.getTagsByNodeId).toHaveBeenCalledOnceWith(node.id);
        }));

        it('should be hidden when editable is true', async () => {
            spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
            component.ngOnInit();
            component.readOnly = false;
            fixture.detectChanges();

            toggleEditModeForTags();
            fixture.detectChanges();
            const noEditableTagsContainer = fixture.debugElement.query(By.css('div.adf-metadata-properties-tags'));
            expect(noEditableTagsContainer).toBeNull();
        });
    });

    describe('Tags creator', () => {
        let tagsCreator: TagsCreatorComponent;

        beforeEach(() => {
            component.displayTags = true;
            component.readOnly = false;
            fixture.detectChanges();
            toggleEditModeForTags();
            tagsCreator = findTagsCreator();
        });

        it('should have assigned true to tagNameControlVisible initially', () => {
            expect(tagsCreator.tagNameControlVisible).toBeTrue();
        });

        it('should load in create and assign mode by default', () => {
            expect(tagsCreator.mode).toBe(TagsCreatorMode.CREATE_AND_ASSIGN);
        });

        it('should enable cancel button after emitting tagsChange event', () => {
            component.readOnly = false;
            tagsCreator.tagsChange.emit(['New tag 1', 'New tag 2', 'New tag 3']);
            fixture.detectChanges();
            expect(findCancelTagsButton().disabled).toBeFalse();
        });

        it('should enable save button after emitting tagsChange event', () => {
            tagsCreator.tagsChange.emit(['New tag 1', 'New tag 2', 'New tag 3']);
            component.readOnly = false;
            fixture.detectChanges();
            expect(findSaveTagsButton().disabled).toBeFalse();
        });

        it('should have assigned false to disabledTagsRemoving', () => {
            expect(tagsCreator.disabledTagsRemoving).toBeFalse();
        });

        it('should have assigned false to disabledTagsRemoving if forkJoin fails', () => {
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
            component.readOnly = false;
            updateService.update(property, 'updated-value');

            fixture.detectChanges();
            tagsCreator.tagsChange.emit([tagName1, tagName2]);
            clickOnTagsSave();

            expect(tagsCreator.disabledTagsRemoving).toBeFalse();
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
                expect(component.assignedTags).toEqual([tagPaging.list.entries[0].entry.tag, tagPaging.list.entries[1].entry.tag]);
                expect(tagService.getTagsByNodeId).toHaveBeenCalledWith(node.id);
            });

            it('should assign correct tags after ngOnChanges', () => {
                component.ngOnInit();

                fixture.detectChanges();
                expect(component.assignedTags).toEqual([tagPaging.list.entries[0].entry.tag, tagPaging.list.entries[1].entry.tag]);
                expect(tagService.getTagsByNodeId).toHaveBeenCalledWith(node.id);
            });
        });
    });

    it('should show tags creator if displayTags is true and edit mode is toggled for tags', () => {
        component.displayTags = true;
        component.readOnly = false;
        fixture.detectChanges();

        toggleEditModeForTags();
        expect(findTagsCreator()).toBeDefined();
    });

    describe('Categories list', () => {
        const expandCategoriesPanel = (): void => {
            fixture.debugElement.query(By.css('[data-automation-id="adf-content-metadata-categories-panel"]'))?.componentInstance.opened.emit();
            fixture.detectChanges();
        };

        beforeEach(() => {
            component.displayCategories = true;
            component.node.aspectNames.push('generalclassifiable');
            spyOn(categoryService, 'getCategoryLinksForNode').and.returnValue(of(categoryPagingResponse));
        });

        it('should render categories node is assigned to', () => {
            component.ngOnInit();
            fixture.detectChanges();

            expandCategoriesPanel();
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

            expandCategoriesPanel();
            const categories = getCategories();
            expect(categories).toHaveSize(0);
            expect(categoryService.getCategoryLinksForNode).not.toHaveBeenCalled();
        });

        it('should render categories when ngOnChanges', () => {
            component.ngOnChanges({ node: new SimpleChange(undefined, node, false) });
            fixture.detectChanges();

            expandCategoriesPanel();
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

            expandCategoriesPanel();
            const categories = getCategories();
            expect(categories).toHaveSize(0);
            expect(categoryService.getCategoryLinksForNode).not.toHaveBeenCalled();
        });

        it('should not reload categories in ngOnChanges if node is not changed', () => {
            component.ngOnChanges({});
            fixture.detectChanges();

            expandCategoriesPanel();
            expect(categoryService.getCategoryLinksForNode).not.toHaveBeenCalled();
        });

        it('should render categories after discard changes button is clicked', fakeAsync(() => {
            component.readOnly = false;
            fixture.detectChanges();
            TestBed.inject(CardViewContentUpdateService).itemUpdated$.next({
                changed: {}
            } as UpdateNotification);
            tick(500);
            fixture.detectChanges();
            toggleEditModeForCategories();

            clickOnCancel();
            fixture.detectChanges();

            expandCategoriesPanel();
            const categories = getCategories();
            expect(categories.length).toBe(2);
            expect(categories[0].textContent).toBe(category1.name);
            expect(categories[1].textContent).toBe(category2.name);
            expect(categoryService.getCategoryLinksForNode).toHaveBeenCalledWith(node.id);
            discardPeriodicTasks();
            flush();
        }));

        it('should be hidden when edit mode for categories is toggled', () => {
            component.readOnly = false;
            fixture.detectChanges();

            toggleEditModeForCategories();
            expect(getCategories().length).toBe(0);
        });
    });

    describe('Categories management', () => {
        let categoriesManagementComponent: CategoriesManagementComponent;

        beforeEach(() => {
            component.displayCategories = true;
            component.readOnly = false;
            component.node.aspectNames.push('generalclassifiable');
            spyOn(categoryService, 'getCategoryLinksForNode').and.returnValue(of(categoryPagingResponse));
            fixture.detectChanges();
            toggleEditModeForCategories();
            categoriesManagementComponent = getCategoriesManagementComponent();
        });

        it('should set categoryNameControlVisible to true initially', () => {
            expect(categoriesManagementComponent.categoryNameControlVisible).toBeTrue();
        });

        it('should load with assign mode by default', () => {
            expect(categoriesManagementComponent.managementMode).toBe(CategoriesManagementMode.ASSIGN);
        });

        it('should clear categories and emit event when classifiable changes', (done) => {
            component.node.aspectNames = [];
            component.ngOnChanges({ node: new SimpleChange(undefined, node, false) });
            component.classifiableChanged.subscribe(() => {
                expect(component.categories).toEqual([]);
                done();
            });
            component.ngOnChanges({ node: new SimpleChange(undefined, node, false) });
        });

        it('should enable discard and save buttons after emitting categories change event', () => {
            categoriesManagementComponent.categoriesChange.emit([category1, category2]);
            component.readOnly = false;
            fixture.detectChanges();
            expect(findCancelButton().disabled).toBeFalse();
            expect(findSaveCategoriesButton().disabled).toBeFalse();
        });

        it('should not disable removal initially', () => {
            expect(categoriesManagementComponent.disableRemoval).toBeFalse();
        });

        it('should not disable removal if forkJoin fails', () => {
            const property = { key: 'properties.property-key', value: 'original-value' } as CardViewBaseItemModel;
            const expectedNode = { ...node, name: 'some-modified-value' };
            spyOn(nodesApiService, 'updateNode').and.returnValue(of(expectedNode));
            component.ngOnInit();
            spyOn(tagService, 'removeTag').and.returnValue(EMPTY);
            spyOn(tagService, 'assignTagsToNode').and.returnValue(EMPTY);
            spyOn(categoryService, 'unlinkNodeFromCategory').and.returnValue(EMPTY);
            spyOn(categoryService, 'linkNodeToCategory').and.returnValue(throwError({}));

            updateService.update(property, 'updated-value');

            component.readOnly = false;
            fixture.detectChanges();
            categoriesManagementComponent.categoriesChange.emit([category1, category2]);
            findSaveCategoriesButton();

            expect(categoriesManagementComponent.disableRemoval).toBeFalse();
        });

        describe('Setting categories', () => {
            it('should set correct categories after ngOnInit', () => {
                component.ngOnInit();

                fixture.detectChanges();
                expect(component.assignedCategories).toEqual([category1, category2]);
                expect(categoryService.getCategoryLinksForNode).toHaveBeenCalledWith(node.id);
            });

            it('should set correct tags after ngOnChanges', () => {
                component.ngOnChanges({ node: new SimpleChange(undefined, node, false) });

                fixture.detectChanges();
                expect(categoriesManagementComponent.categories).toEqual([category1, category2]);
                expect(categoryService.getCategoryLinksForNode).toHaveBeenCalledWith(node.id);
            });
        });
    });

    describe('Custom metadata panels', () => {
        it('should render correct custom panel with title and component', () => {
            component.customPanels = [{ panelTitle: 'testTitle', component: 'testComponent' }];
            fixture.detectChanges();
            const panelTitle = fixture.debugElement.query(By.css('.adf-metadata-custom-panel-title .adf-metadata-properties-title')).nativeElement;
            const customComponent = fixture.debugElement.query(By.css('adf-dynamic-component')).nativeElement;
            expect(panelTitle.innerText).toEqual('testTitle');
            expect(customComponent).toBeDefined();
        });
    });
});
