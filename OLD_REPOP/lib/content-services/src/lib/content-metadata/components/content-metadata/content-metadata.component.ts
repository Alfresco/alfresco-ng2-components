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

import { Component, DestroyRef, inject, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Category, CategoryEntry, CategoryLinkBody, CategoryPaging, Node, TagBody, TagEntry, TagPaging } from '@alfresco/js-api';
import { forkJoin, Observable, of, Subject, zip } from 'rxjs';
import {
    AppConfigService,
    CardViewBaseItemModel,
    CardViewComponent,
    CardViewItem,
    Chip,
    DynamicChipListComponent,
    NotificationService,
    TranslationService,
    UpdateNotification
} from '@alfresco/adf-core';
import { ContentMetadataService } from '../../services/content-metadata.service';
import { CardViewGroup, ContentMetadataCustomPanel, ContentMetadataPanel, PresetConfig } from '../../interfaces/content-metadata.interfaces';
import { catchError, debounceTime, map } from 'rxjs/operators';
import { CardViewContentUpdateService } from '../../../common/services/card-view-content-update.service';
import { NodesApiService } from '../../../common/services/nodes-api.service';
import { TagsCreatorMode } from '../../../tag/tags-creator/tags-creator-mode';
import { TagService } from '../../../tag/services/tag.service';
import { CategoryService } from '../../../category/services/category.service';
import { CategoriesManagementMode } from '../../../category/categories-management/categories-management-mode';
import { AllowableOperationsEnum } from '../../../common/models/allowable-operations.enum';
import { ContentService } from '../../../common/services/content.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { DynamicExtensionComponent } from '@alfresco/adf-extensions';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TagsCreatorComponent } from '../../../tag';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { ContentMetadataHeaderComponent } from './content-metadata-header.component';
import { CategoriesManagementComponent } from '../../../category/categories-management/categories-management.component';

const DEFAULT_SEPARATOR = ', ';

enum DefaultPanels {
    PROPERTIES = 'Properties',
    TAGS = 'Tags',
    CATEGORIES = 'Categories'
}

@Component({
    selector: 'adf-content-metadata',
    imports: [
        CommonModule,
        MatExpansionModule,
        ContentMetadataHeaderComponent,
        MatButtonModule,
        TranslatePipe,
        MatIconModule,
        MatChipsModule,
        CategoriesManagementComponent,
        DynamicExtensionComponent,
        MatProgressBarModule,
        TagsCreatorComponent,
        CardViewComponent,
        DynamicChipListComponent
    ],
    templateUrl: './content-metadata.component.html',
    styleUrls: ['./content-metadata.component.scss'],
    host: { class: 'adf-content-metadata' },
    encapsulation: ViewEncapsulation.None
})
export class ContentMetadataComponent implements OnChanges, OnInit {
    /** (required) The node entity to fetch metadata about */
    @Input({ required: true })
    node: Node;

    /** Toggles whether to display empty values in the card view */
    @Input()
    displayEmpty: boolean = false;

    /**
     * Toggles between expanded (ie, full information) and collapsed
     * (ie, reduced information) in the display
     */
    @Input()
    expanded: boolean = false;

    /** The multi parameter of the underlying material expansion panel, set to true to allow multi accordion to be expanded at the same time */
    @Input()
    multi = false;

    /** Name or configuration of the metadata preset, which defines aspects and their properties */
    @Input({ required: true })
    preset: string | PresetConfig;

    /** Toggles whether the metadata properties should be shown */
    @Input()
    displayDefaultProperties: boolean = true;

    /** (optional) shows the given aspect in the expanded  card */
    @Input()
    displayAspect: string = null;

    /** Toggles whether or not to enable copy to clipboard action. */
    @Input()
    copyToClipboardAction: boolean = true;

    /** Toggles whether or not to enable chips for multivalued properties. */
    @Input()
    useChipsForMultiValueProperty: boolean = true;

    /** True if tags should be displayed, false otherwise */
    @Input()
    displayTags = false;

    /** True if categories should be displayed, false otherwise */
    @Input()
    displayCategories = false;

    /** List of custom metadata panels to be displayed with registered custom components */
    @Input()
    customPanels: ContentMetadataCustomPanel[] = [];

    /**
     * (optional) This flag sets the metadata in read-only mode,
     * preventing changes.
     */
    @Input()
    readOnly = false;

    private _assignedTags: string[] = [];
    private assignedTagsEntries: TagEntry[] = [];
    private _tagsCreatorMode = TagsCreatorMode.CREATE_AND_ASSIGN;
    private _tags: string[] = [];
    private targetProperty: CardViewBaseItemModel;
    private classifiableChangedSubject = new Subject<void>();
    private _saving = false;

    DefaultPanels = DefaultPanels;
    multiValueSeparator: string;
    basicProperties$: Observable<CardViewItem[]>;
    groupedProperties$: Observable<CardViewGroup[]>;

    tagsToDisplay: Chip[];
    changedProperties = {};
    hasMetadataChanged = false;
    assignedCategories: Category[] = [];
    categories: Category[] = [];
    categoriesManagementMode = CategoriesManagementMode.ASSIGN;
    classifiableChanged = this.classifiableChangedSubject.asObservable();
    editing = false;
    invalidProperties = new Set<string>();
    editedPanelTitle = '';
    currentPanel: ContentMetadataPanel = {
        expanded: false,
        panelTitle: ''
    };

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private contentMetadataService: ContentMetadataService,
        private cardViewContentUpdateService: CardViewContentUpdateService,
        private nodesApiService: NodesApiService,
        private translationService: TranslationService,
        private appConfig: AppConfigService,
        private tagService: TagService,
        private categoryService: CategoryService,
        private contentService: ContentService,
        private notificationService: NotificationService
    ) {
        this.copyToClipboardAction = this.appConfig.get<boolean>('content-metadata.copy-to-clipboard-action');
        this.multiValueSeparator = this.appConfig.get<string>('content-metadata.multi-value-pipe-separator') || DEFAULT_SEPARATOR;
        this.useChipsForMultiValueProperty = this.appConfig.get<boolean>('content-metadata.multi-value-chips');
    }

    ngOnInit() {
        this.cardViewContentUpdateService.itemUpdated$
            .pipe(debounceTime(500), takeUntilDestroyed(this.destroyRef))
            .subscribe((updatedNode: UpdateNotification) => {
                this.hasMetadataChanged = true;
                this.targetProperty = updatedNode.target;
                this.updateInvalidProperties();
                this.updateChanges(updatedNode.changed);
            });

        this.cardViewContentUpdateService.updatedAspect$.pipe(debounceTime(500), takeUntilDestroyed(this.destroyRef)).subscribe((node) => {
            this.node.aspectNames = node?.aspectNames;
            this.loadProperties(node);
        });

        this.loadProperties(this.node);
        this.verifyAllowableOperations();

        this.currentPanel.panelTitle = this.displayAspect ?? this.DefaultPanels.PROPERTIES;
        this.currentPanel.expanded = true;
    }

    private verifyAllowableOperations() {
        if (!this.node?.allowableOperations || !this.contentService.hasAllowableOperations(this.node, AllowableOperationsEnum.UPDATE)) {
            this.readOnly = true;
        }
    }

    get assignedTags(): string[] {
        return this._assignedTags;
    }

    set tags(tags: string[]) {
        this._tags = tags;
        this.tagsToDisplay = this.tags.map((tag) => ({ id: tag, name: tag }));
    }

    get tags(): string[] {
        return this._tags;
    }

    get tagsCreatorMode(): TagsCreatorMode {
        return this._tagsCreatorMode;
    }

    get saving(): boolean {
        return this._saving;
    }

    isPanelEditing(panelTitle: string): boolean {
        return (
            this.editing &&
            ((this.currentPanel.panelTitle === panelTitle && this.editedPanelTitle === panelTitle) || this.editedPanelTitle === panelTitle)
        );
    }

    protected handleUpdateError(error: Error) {
        let statusCode = 0;

        try {
            statusCode = JSON.parse(error.message).error.statusCode;
        } catch {
            /* empty */
        }

        let message = `METADATA.ERRORS.${statusCode}`;

        if (this.translationService.instant(message) === message) {
            message = 'METADATA.ERRORS.GENERIC';
        }

        this.contentMetadataService.error.next({
            statusCode,
            message
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.node && !changes.node.firstChange) {
            this.loadProperties(changes.node.currentValue);
        }

        if (changes.readOnly?.currentValue) {
            this.resetEditing();
            this.loadProperties(this.node);
        }

        if (changes.displayAspect?.currentValue) {
            this.currentPanel.panelTitle = changes.displayAspect.currentValue;
            this.currentPanel.expanded = true;
        }

        if (changes.displayDefaultProperties?.currentValue) {
            this.expandPanel(this.DefaultPanels.PROPERTIES);
        }
    }

    updateChanges(updatedNodeChanges) {
        Object.keys(updatedNodeChanges).map((propertyGroup: string) => {
            if (typeof updatedNodeChanges[propertyGroup] === 'object') {
                this.changedProperties[propertyGroup] = {
                    ...this.changedProperties[propertyGroup],
                    ...updatedNodeChanges[propertyGroup]
                };
            } else {
                this.changedProperties[propertyGroup] = updatedNodeChanges[propertyGroup];
            }
        });
    }

    saveChanges(event?: MouseEvent) {
        event?.stopPropagation();
        this.resetEditing();
        this._saving = true;

        if (this.hasContentTypeChanged(this.changedProperties)) {
            this.contentMetadataService.openConfirmDialog(this.changedProperties).subscribe(() => {
                this.updateNode();
            });
        } else {
            this.updateNode();
        }
    }

    /**
     * Register all tags which should be assigned to node. Please note that they are just in "register" state and are not yet saved
     * until button for saving data is clicked. Calling that function causes that save button is enabled.
     *
     * @param tags array of tags to register, they are not saved yet until we click save button.
     */
    storeTagsToAssign(tags: string[]) {
        this.tags = tags;
        this._assignedTags = tags;
        this.hasMetadataChanged = true;
    }

    /**
     * Store all categories that node should be assigned to. Please note that they are just in "stored" state and are not yet saved
     * until button for saving data is clicked. Calling that function causes that save button is enabled.
     *
     * @param categoriesToAssign array of categories to store.
     */
    storeCategoriesToAssign(categoriesToAssign: Category[]) {
        this.categories = categoriesToAssign;
        this.hasMetadataChanged = true;
    }

    revertChanges() {
        this.changedProperties = {};
        this.hasMetadataChanged = false;
    }

    get showEmptyTagMessage(): boolean {
        return this.tags?.length === 0 && !this.isPanelEditing('Tags');
    }

    get showEmptyCategoryMessage(): boolean {
        return this.categories?.length === 0 && !this.isPanelEditing('Categories');
    }

    toggleGroupEditing(panelTitle: string, event?: MouseEvent) {
        event?.stopPropagation();
        if (this.editing && this.hasMetadataChanged) {
            this.notificationService.showError('METADATA.BASIC.SAVE_OR_DISCARD_CHANGES');
            return;
        }
        this.editing = true;
        this.editedPanelTitle = panelTitle;
        this.expandPanel(panelTitle);
    }

    cancelGroupEditing(panelTitle: string, event?: MouseEvent) {
        event?.stopPropagation();
        this.resetEditing();
        this.revertChanges();
        const loadBasicProps = panelTitle === this.DefaultPanels.PROPERTIES;
        const loadTags = panelTitle === this.DefaultPanels.TAGS;
        const loadCategories = panelTitle === this.DefaultPanels.CATEGORIES;
        const loadGroupedProps = !loadBasicProps && !loadTags && !loadCategories;
        this.loadProperties(this.node, loadBasicProps, loadGroupedProps, loadTags, loadCategories);
    }

    expandPanel(panelTitle: string) {
        this.currentPanel.panelTitle = panelTitle;
        this.currentPanel.expanded = true;
    }

    closePanel(panelTitle: string) {
        if (this.currentPanel.panelTitle === panelTitle) {
            this.currentPanel.expanded = false;
        }
    }

    resetEditing() {
        this.editing = false;
        this.editedPanelTitle = '';
    }

    showGroup(group: CardViewGroup): boolean {
        const properties = group.properties.filter((property) => !this.isEmpty(property.displayValue));

        return properties.length > 0;
    }

    keyDown(event: KeyboardEvent) {
        if (event.keyCode === 37 || event.keyCode === 39) {
            // ArrowLeft && ArrowRight
            event.stopPropagation();
        }
    }

    private updateNode() {
        forkJoin({
            updatedNode: this.nodesApiService.updateNode(this.node.id, this.changedProperties),
            ...(this.displayTags ? this.saveTags() : {}),
            ...(this.displayCategories ? this.saveCategories() : {})
        })
            .pipe(
                catchError((err) => {
                    this.cardViewContentUpdateService.updateElement(this.targetProperty);
                    this.handleUpdateError(err);
                    this._saving = false;
                    this.revertChanges();
                    this.loadProperties(this.node);
                    return of(null);
                })
            )
            .subscribe((result: any) => {
                if (result) {
                    this.updateUndefinedNodeProperties(result.updatedNode);
                    if (this.hasContentTypeChanged(this.changedProperties)) {
                        this.cardViewContentUpdateService.updateNodeAspect(this.node);
                    }
                    this.revertChanges();
                    Object.assign(this.node, result.updatedNode);
                    this.nodesApiService.nodeUpdated.next(this.node);
                    if (Object.keys(result).length > 1 && this.displayTags) {
                        this.loadTagsForNode(this.node.id);
                    }
                    if (this.displayCategories && !!result.LinkingCategories) {
                        this.assignedCategories = result.LinkingCategories.list
                            ? result.LinkingCategories.list.entries.map((entry: CategoryEntry) => entry.entry)
                            : [result.LinkingCategories.entry];
                    }
                }
                this._saving = false;
            });
    }

    private hasContentTypeChanged(changedProperties): boolean {
        return !!changedProperties?.nodeType;
    }

    private updateUndefinedNodeProperties(node: Node): void {
        if (!node.properties) {
            node.properties = {};
        }
    }

    private loadProperties(node: Node, loadBasicProps = true, loadGroupedProps = true, loadTags = true, loadCategories = true) {
        if (node) {
            if (loadBasicProps) {
                this.basicProperties$ = this.getProperties(node);
            }
            if (loadGroupedProps) {
                this.groupedProperties$ = this.contentMetadataService.getGroupedProperties(node, this.preset);
            }

            if (this.displayTags && loadTags) {
                this.loadTagsForNode(node.id);
            }

            if (this.displayCategories && loadCategories) {
                this.loadCategoriesForNode(node.id);

                const aspectNames = node.aspectNames || [];
                if (!aspectNames.includes('generalclassifiable')) {
                    this.categories = [];
                    this.classifiableChangedSubject.next();
                }
            }
        }
    }

    private getProperties(node: Node) {
        const properties$ = this.contentMetadataService.getBasicProperties(node);
        const contentTypeProperty$ = this.contentMetadataService.getContentTypeProperty(node);
        return zip(properties$, contentTypeProperty$).pipe(
            map(([properties, contentTypeProperty]) => {
                const filteredProperties = contentTypeProperty.filter(
                    (property) => properties.findIndex((baseProperty) => baseProperty.key === property.key) === -1
                );
                return [...properties, ...filteredProperties];
            })
        );
    }

    private isEmpty(value: any): boolean {
        return value === undefined || value === null || value === '';
    }

    private loadCategoriesForNode(nodeId: string) {
        this.assignedCategories = [];
        this.categoryService.getCategoryLinksForNode(nodeId).subscribe((categoryPaging) => {
            this.categories = categoryPaging.list.entries.map((categoryEntry) => {
                const path = categoryEntry.entry.path ? categoryEntry.entry.path.split('/').splice(3).join('/') : null;
                categoryEntry.entry.name = path ? `${path}/${categoryEntry.entry.name}` : categoryEntry.entry.name;
                return categoryEntry.entry;
            });
            this.assignedCategories = [...this.categories];
        });
    }

    private saveCategories(): { [key: string]: Observable<CategoryPaging | CategoryEntry | void> } {
        const observables: { [key: string]: Observable<CategoryPaging | CategoryEntry | void> } = {};
        if (this.categories) {
            this.assignedCategories.forEach((assignedCategory) => {
                if (this.categories.every((category) => category.name !== assignedCategory.name)) {
                    observables[`Removing ${assignedCategory.id}`] = this.categoryService.unlinkNodeFromCategory(this.node.id, assignedCategory.id);
                }
            });
            const categoryLinkBodies = this.categories.map((category) => {
                const categoryLinkBody = new CategoryLinkBody();
                categoryLinkBody.categoryId = category.id;
                return categoryLinkBody;
            });
            if (categoryLinkBodies.length > 0) {
                observables['LinkingCategories'] = this.categoryService.linkNodeToCategory(this.node.id, categoryLinkBodies);
            }
        }
        return observables;
    }

    private loadTagsForNode(id: string) {
        this.tagService.getTagsByNodeId(id).subscribe((tagPaging) => {
            this.assignedTagsEntries = tagPaging.list.entries;
            this.tags = tagPaging.list.entries.map((tagEntry) => tagEntry.entry.tag);
            this._assignedTags = [...this.tags];
        });
    }

    private saveTags(): { [key: string]: Observable<TagPaging | TagEntry | void> } {
        const observables: { [key: string]: Observable<TagPaging | TagEntry | void> } = {};
        if (this.tags) {
            this.assignedTagsEntries.forEach((tagEntry) => {
                if (!this.tags.some((tag) => tagEntry.entry.tag === tag)) {
                    observables[`${tagEntry.entry.id}Removing`] = this.tagService.removeTag(this.node.id, tagEntry.entry.id);
                }
            });
            if (this.tags.length) {
                observables.tagsAssigning = this.tagService.assignTagsToNode(
                    this.node.id,
                    this.tags.map((tag) => {
                        const tagBody = new TagBody();
                        tagBody.tag = tag;
                        return tagBody;
                    })
                );
            }
        }
        return observables;
    }

    private updateInvalidProperties() {
        if (this.targetProperty?.isValidValue === false) {
            this.invalidProperties.add(this.targetProperty.key);
        } else if (this.targetProperty?.isValidValue === true) {
            this.invalidProperties.delete(this.targetProperty.key);
        }
    }
}
