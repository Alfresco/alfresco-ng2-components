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

import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { Category, CategoryEntry, CategoryLinkBody, CategoryPaging, Node, TagBody, TagEntry, TagPaging } from '@alfresco/js-api';
import { forkJoin, Observable, of, Subject, zip } from 'rxjs';
import {
    AppConfigService,
    CardViewBaseItemModel,
    CardViewItem,
    LogService,
    NotificationService,
    TranslationService,
    UpdateNotification
} from '@alfresco/adf-core';
import { ContentMetadataService } from '../../services/content-metadata.service';
import { CardViewGroup, PresetConfig, ContentMetadataCustomPanel } from '../../interfaces/content-metadata.interfaces';
import { catchError, debounceTime, map, takeUntil } from 'rxjs/operators';
import { CardViewContentUpdateService } from '../../../common/services/card-view-content-update.service';
import { NodesApiService } from '../../../common/services/nodes-api.service';
import { TagsCreatorMode } from '../../../tag/tags-creator/tags-creator-mode';
import { TagService } from '../../../tag/services/tag.service';
import { CategoryService } from '../../../category/services/category.service';
import { CategoriesManagementMode } from '../../../category/categories-management/categories-management-mode';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ButtonType } from './button-type.enum';
import { AllowableOperationsEnum } from '../../../common/models/allowable-operations.enum';
import { ContentService } from '../../../common/services/content.service';

const DEFAULT_SEPARATOR = ', ';

@Component({
    selector: 'adf-content-metadata',
    templateUrl: './content-metadata.component.html',
    styleUrls: ['./content-metadata.component.scss'],
    host: { class: 'adf-content-metadata' },
    encapsulation: ViewEncapsulation.None
})
export class ContentMetadataComponent implements OnChanges, OnInit, OnDestroy {
    @ViewChild(MatExpansionPanel)
    panel: MatExpansionPanel;
    protected onDestroy$ = new Subject<boolean>();

    /** (required) The node entity to fetch metadata about */
    @Input()
    node: Node;

    /** Toggles whether the edit button should be shown */
    @Input()
    set editable(editable: boolean) {
        this._editable = editable;
        this._assignedTags = [...this.tags];
    }

    get editable(): boolean {
        return this._editable;
    }

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
    @Input()
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

    /**
     * Emitted when content's editable state is changed.
     *
     * @event editableChange
     * @type {EventEmitter<boolean>}
     */
    @Output()
    editableChange = new EventEmitter<boolean>();

    /**
     * Emitted when content's editableTags state is changed.
     *
     * @event editableTagsChange
     * @type {EventEmitter<boolean>}
     */
    @Output()
    editableTagsChange = new EventEmitter<boolean>();

    /**
     * Emitted when content's editableCategories state is changed.
     *
     * @event editableCategoriesChange
     * @type {EventEmitter<boolean>}
     */
    @Output()
    editableCategoriesChange = new EventEmitter<boolean>();

    /**
     * Emitted when content's group state is changed.
     *
     * @event groupChange
     * @type {EventEmitter<CardViewGroup>}
     */
    @Output()
    groupChange = new EventEmitter<CardViewGroup>();

    /**
     * (optional) This flag toggles editable of categories content.
     *
     * @type {boolean}
     */
    @Input()
    editableCategories = false;

    /**
     * (optional) This flag toggles editable of tags content.
     *
     * @type {boolean}
     */
    @Input()
    editableTags = false;

    /**
     * Group content state
     *
     * @type {CardViewGroup}
     */
    @Input()
    group: CardViewGroup;

    private _assignedTags: string[] = [];
    private assignedTagsEntries: TagEntry[] = [];
    private _editable = false;
    private _tagsCreatorMode = TagsCreatorMode.CREATE_AND_ASSIGN;
    private _tags: string[] = [];
    private targetProperty: CardViewBaseItemModel;
    private classifiableChangedSubject = new Subject<void>();
    private _saving = false;

    multiValueSeparator: string;
    basicProperties$: Observable<CardViewItem[]>;
    groupedProperties$: Observable<CardViewGroup[]>;

    changedProperties = {};
    hasMetadataChanged = false;
    tagNameControlVisible = false;
    assignedCategories: Category[] = [];
    categories: Category[] = [];
    categoriesManagementMode = CategoriesManagementMode.ASSIGN;
    categoryControlVisible = false;
    classifiableChanged = this.classifiableChangedSubject.asObservable();
    isGeneralInfoPanelVisible: boolean;
    isTagPanelVisible: boolean;
    isCategoriesPanelVisible: boolean;
    hasAllowableOperations = false;
    editableGroup: CardViewGroup;
    buttonType = ButtonType;

    constructor(
        private contentMetadataService: ContentMetadataService,
        private cardViewContentUpdateService: CardViewContentUpdateService,
        private nodesApiService: NodesApiService,
        private logService: LogService,
        private translationService: TranslationService,
        private appConfig: AppConfigService,
        private tagService: TagService,
        private categoryService: CategoryService,
        private cdr: ChangeDetectorRef,
        private contentService: ContentService,
        private notificationService: NotificationService
    ) {
        this.copyToClipboardAction = this.appConfig.get<boolean>('content-metadata.copy-to-clipboard-action');
        this.multiValueSeparator = this.appConfig.get<string>('content-metadata.multi-value-pipe-separator') || DEFAULT_SEPARATOR;
        this.useChipsForMultiValueProperty = this.appConfig.get<boolean>('content-metadata.multi-value-chips');
    }

    ngOnInit() {
        this.cardViewContentUpdateService.itemUpdated$
            .pipe(debounceTime(500), takeUntil(this.onDestroy$))
            .subscribe((updatedNode: UpdateNotification) => {
                this.hasMetadataChanged = true;
                this.targetProperty = updatedNode.target;
                this.updateChanges(updatedNode.changed);
            });

        this.cardViewContentUpdateService.updatedAspect$
            .pipe(debounceTime(500), takeUntil(this.onDestroy$))
            .subscribe((node) => this.loadProperties(node));

        this.loadProperties(this.node);
        this.hasAllowableOperations = this.contentService.hasAllowableOperations(this.node, AllowableOperationsEnum.UPDATE);
    }

    get assignedTags(): string[] {
        return this._assignedTags;
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

    protected handleUpdateError(error: Error) {
        this.logService.error(error);

        let statusCode = 0;

        try {
            statusCode = JSON.parse(error.message).error.statusCode;
        } catch {}

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
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
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

    /**
     * Called after clicking the save button. It confirms all changes done for metadata and hides both category and tag name controls.
     *
     * @param buttonType - The type of button clicked.
     * @param event - The click event.
     * @param group - The group associated with the action.
     */
    saveChanges(buttonType: ButtonType, event: MouseEvent, group?: CardViewGroup) {
        event.stopPropagation();
        this.toggleEditMode(buttonType, group);
        this._saving = true;
        this.tagNameControlVisible = false;
        this.categoryControlVisible = false;
        if (this.hasContentTypeChanged(this.changedProperties)) {
            this.contentMetadataService.openConfirmDialog(this.changedProperties).subscribe(() => {
                this.updateNode();
            });
        } else {
            this.updateNode();
        }
    }

    toggleEditMode(buttonType: ButtonType, group?: CardViewGroup) {
        switch (buttonType) {
            case ButtonType.GeneralInfo:
                this.editable = !this.editable;
                break;
            case ButtonType.Tags:
                this.editableTags = !this.editableTags;
                break;
            case ButtonType.Categories:
                this.editableCategories = !this.editableCategories;
                break;
            case ButtonType.Group:
                if (group) {
                    group.editable = !group.editable;
                }
                break;
            default:
                break;
        }
    }

    /**
     * Register all tags which should be assigned to node. Please note that they are just in "register" state and are not yet saved
     * until button for saving data is clicked. Calling that function causes that save button is enabled.
     *
     * @param tags array of tags to register, they are not saved yet until we click save button.
     */
    storeTagsToAssign(tags: string[]) {
        this._tags = tags;
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
        this.tagNameControlVisible = false;
        this.categoryControlVisible = false;
    }

    cancelChanges(buttonType: ButtonType, event: MouseEvent, group?: CardViewGroup) {
        event.stopPropagation();
        this.toggleEditMode(buttonType, group);
        this.revertChanges();
        this.loadProperties(this.node);
    }

    // Returns the editing state of the panel
    isEditingPanel(): boolean {
        return (
            (this.editable || this.editableTags || this.editableCategories || this.editableGroup?.editable) && this.hasMetadataChanged
        );
    }

    toggleEdit(event: MouseEvent, group: CardViewGroup, buttonType: ButtonType): void {
        event.stopPropagation();
        if (this.isEditingPanel()) {
            this.notificationService.showError('METADATA.BASIC.SAVE_OR_DISCARD_CHANGES');
            return;
        }

        if (this.editableGroup && this.editableGroup.title !== group.title) {
            this.editableGroup.editable = false;
        }

        switch (buttonType) {
            case ButtonType.GeneralInfo:
                this.editable = !this.editable;
                this.editableChange.emit(this.editable);
                this.panel.open();
                group.editable = false;
                break;
            case ButtonType.Tags:
                this.editableTags = !this.editableTags;
                this.editableTagsChange.emit(this.editableTags);
                this.isTagPanelVisible = this.editableTags;
                this.tagNameControlVisible = true;
                group.editable = false;
                break;
            case ButtonType.Categories:
                this.editableCategories = !this.editableCategories;
                this.editableCategoriesChange.emit(this.editableCategories);
                this.isCategoriesPanelVisible = this.editableCategories;
                this.categoryControlVisible = true;
                group.editable = false;
                break;
            case ButtonType.Group:
                group.editable = !group.editable;
                this.groupChange.emit(group);
                this.editableGroup = group.editable ? group : null;
                if (group.editable) {
                    group.expanded = true;
                }
                break;
            default:
                break;
        }

        if (buttonType !== ButtonType.GeneralInfo) {
            this.editable = false;
        }

        if (buttonType !== ButtonType.Tags) {
            this.editableTags = false;
        }

        if (buttonType !== ButtonType.Categories) {
            this.editableCategories = false;
        }
    }

    toggleGeneralInfoPanel(generalPanelState: boolean) {
        this.isGeneralInfoPanelVisible = generalPanelState;
        this.cdr.detectChanges();
    }

    toggleTagsPanel(tagPanelState: boolean) {
        this.isTagPanelVisible = tagPanelState;
        this.cdr.detectChanges();
    }

    toggleCategoriesPanel(isCategoriesPanelVisible: boolean) {
        this.isCategoriesPanelVisible = isCategoriesPanelVisible;
        this.cdr.detectChanges();
    }

    showEmptyTagMessage(): boolean {
        return this.tags?.length === 0 && !this.editableTags;
    }

    showEmptyCategoryMessage(): boolean {
        return this.categories?.length === 0 && !this.editableCategories;
    }

    get hasToggleEdit(): boolean {
        return !this.editable && !this.readOnly && this.hasAllowableOperations;
    }

    get hasTagsToggleEdit(): boolean {
        return !this.editableTags && !this.readOnly && this.hasAllowableOperations;
    }

    get hasCategoriesToggleEdit(): boolean {
        return !this.editableCategories && !this.readOnly && this.hasAllowableOperations;
    }

    hasGroupToggleEdit(group: CardViewGroup): boolean {
        return !group.editable && !this.readOnly && this.hasAllowableOperations;
    }

    showGroup(group: CardViewGroup): boolean {
        const properties = group.properties.filter((property) => !this.isEmpty(property.displayValue));

        return properties.length > 0;
    }

    canExpandTheCard(groupTitle: string): boolean {
        return groupTitle === this.displayAspect;
    }

    canExpandProperties(): boolean {
        return !this.expanded || this.displayAspect === 'Properties';
    }

    keyDown(event: KeyboardEvent) {
        if (event.keyCode === 37 || event.keyCode === 39) { // ArrowLeft && ArrowRight
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

    private loadProperties(node: Node) {
        if (node) {
            this.basicProperties$ = this.getProperties(node);
            this.groupedProperties$ = this.contentMetadataService.getGroupedProperties(node, this.preset);
            if (this.displayTags) {
                this.loadTagsForNode(node.id);
            }
            if (this.displayCategories) {
                this.loadCategoriesForNode(node.id);
                if (!this.node.aspectNames.includes('generalclassifiable')) {
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
            this._tags = tagPaging.list.entries.map((tagEntry) => tagEntry.entry.tag);
            this._assignedTags = [...this._tags];
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
}
