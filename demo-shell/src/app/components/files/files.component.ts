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

import {
    Component,
    Input,
    OnInit,
    OnChanges,
    OnDestroy,
    Optional,
    EventEmitter,
    ViewChild,
    SimpleChanges,
    Output,
    ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NodePaging, Pagination, Node, SearchEntry } from '@alfresco/js-api';
import {
    NotificationService,
    UserPreferencesService,
    PaginationComponent,
    ShowHeaderMode,
    FormRenderingService,
    ToolbarTitleComponent,
    ToolbarComponent,
    ToolbarDividerComponent,
    DataColumnComponent,
    HighlightPipe,
    DataColumnListComponent,
    CustomEmptyContentTemplateDirective
} from '@alfresco/adf-core';
import {
    ContentService,
    FolderCreatedEvent,
    UploadService,
    DocumentListComponent,
    PermissionStyleModel,
    FilterSearch,
    FileUploadEvent,
    UploadDragAreaComponent,
    CheckAllowableOperationDirective,
    BreadcrumbComponent,
    DropdownBreadcrumbComponent,
    NodeDownloadDirective,
    NodeDeleteDirective,
    NodeLockDirective
} from '@alfresco/adf-content-services';
import { ProcessFormRenderingService } from '@alfresco/adf-process-services';
import { Subject } from 'rxjs';
import { PreviewService } from '../../services/preview.service';
import { takeUntil, debounceTime, scan } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FolderCreateDirective } from '../../folder-directive';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

const DEFAULT_FOLDER_TO_SHOW = '-my-';

@Component({
    selector: 'app-files-component',
    standalone: true,
    imports: [
        CommonModule,
        UploadDragAreaComponent,
        MatButtonModule,
        MatIconModule,
        CheckAllowableOperationDirective,
        ToolbarTitleComponent,
        ToolbarComponent,
        BreadcrumbComponent,
        DropdownBreadcrumbComponent,
        DocumentListComponent,
        FolderCreateDirective,
        NodeDownloadDirective,
        NodeDeleteDirective,
        ToolbarDividerComponent,
        MatMenuModule,
        TranslateModule,
        DataColumnComponent,
        NodeLockDirective,
        PaginationComponent,
        HighlightPipe,
        DataColumnListComponent,
        CustomEmptyContentTemplateDirective
    ],
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [{ provide: FormRenderingService, useClass: ProcessFormRenderingService }]
})
export class FilesComponent implements OnInit, OnChanges, OnDestroy {
    protected onDestroy$ = new Subject<boolean>();

    nodeId: any;
    showViewer = false;
    allowDropFiles = true;
    includeFields = ['isFavorite', 'isLocked', 'aspectNames', 'definition'];

    // The identifier of a node. You can also use one of these well-known aliases: -my- | -shared- | -root-
    @Input()
    currentFolderId: string = DEFAULT_FOLDER_TO_SHOW;

    @Input()
    sorting = ['name', 'ASC'];

    @Input()
    sortingMode: 'server' | 'client' = 'server';

    @Input()
    showHeader = ShowHeaderMode.Always;

    @Input()
    selectionMode = 'multiple';

    @Input()
    multiselect = false;

    @Input()
    multipleFileUpload = false;

    @Input()
    folderUpload = false;

    @Input()
    acceptedFilesTypeShow = false;

    @Input()
    maxSizeShow = false;

    @Input()
    versioning = false;

    @Input()
    allowVersionDownload = true;

    @Input()
    acceptedFilesType = '.jpg,.pdf,.js';

    @Input()
    maxFilesSize: number = null;

    @Input()
    enableUpload = true;

    @Input()
    nodeResult: NodePaging;

    @Input()
    pagination: Pagination;

    @Input()
    searchTerm = '';

    @Input()
    navigationRoute = '/files';

    @Input()
    headerFilters = false;

    @Input()
    paramValues: Map<any, any> = null;

    @Input()
    filterSorting: string = null;

    @Output()
    documentListReady: EventEmitter<any> = new EventEmitter();

    @Output()
    changedPageSize: EventEmitter<Pagination> = new EventEmitter();

    @Output()
    changedPageNumber: EventEmitter<Pagination> = new EventEmitter();

    @Output()
    turnedNextPage: EventEmitter<Pagination> = new EventEmitter();

    @Output()
    turnedPreviousPage: EventEmitter<Pagination> = new EventEmitter();

    @Output()
    loadNext: EventEmitter<Pagination> = new EventEmitter();

    @Output()
    deleteElementSuccess: EventEmitter<any> = new EventEmitter();

    @ViewChild('documentList', { static: true })
    documentList: DocumentListComponent;

    @ViewChild('standardPagination')
    standardPagination: PaginationComponent;

    permissionsStyle: PermissionStyleModel[] = [];
    stickyHeader: boolean;

    constructor(
        private notificationService: NotificationService,
        private uploadService: UploadService,
        private contentService: ContentService,
        private router: Router,
        private preference: UserPreferencesService,
        private preview: PreviewService,
        @Optional() private route: ActivatedRoute
    ) {}

    showFile(event) {
        const entry = event.value.entry;
        if (entry?.isFile) {
            this.preview.showResource(entry.id);
        }
    }

    ngOnInit() {
        if (!this.pagination) {
            this.pagination = {
                maxItems: this.preference.paginationSize,
                skipCount: 0
            } as Pagination;
        }

        if (this.route) {
            this.route.params.forEach((params: Params) => {
                if (params['id'] && this.currentFolderId !== params['id']) {
                    this.currentFolderId = params['id'];
                }
            });
        }

        this.uploadService.fileUploadComplete
            .pipe(
                debounceTime(300),
                scan((files, currentFile) => [...files, currentFile], []),
                takeUntil(this.onDestroy$)
            )
            .subscribe((value: any[]) => {
                this.onFileUploadEvent(value[0]);
            });

        this.uploadService.fileUploadDeleted.pipe(takeUntil(this.onDestroy$)).subscribe((value) => this.onFileUploadEvent(value));

        this.contentService.folderCreated.pipe(takeUntil(this.onDestroy$)).subscribe((value) => this.onFolderCreated(value));

        this.contentService.folderCreate.pipe(takeUntil(this.onDestroy$)).subscribe((value) => this.onFolderAction(value));

        this.contentService.folderEdit.pipe(takeUntil(this.onDestroy$)).subscribe((value) => this.onFolderAction(value));
    }

    onFileUploadEvent(event: FileUploadEvent) {
        if (event && event.file.options.parentId === this.documentList.currentFolderId) {
            this.documentList.reload();
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.nodeResult?.currentValue) {
            this.nodeResult = changes.nodeResult.currentValue;
            this.pagination = this.nodeResult.list.pagination;
        }
        if (!this.pagination) {
            this.giveDefaultPaginationWhenNotDefined();
        }
    }

    giveDefaultPaginationWhenNotDefined() {
        this.pagination = {
            maxItems: this.preference.paginationSize,
            skipCount: 0,
            totalItems: 0,
            hasMoreItems: false
        } as Pagination;
    }

    onNavigationError(error: any) {
        if (error) {
            this.router.navigate(['/error', error.status]);
        }
    }

    onFolderCreated(event: FolderCreatedEvent) {
        if (event && event.parentId === this.documentList.currentFolderId) {
            this.documentList.reload();
        }
    }

    onFolderAction(node) {
        if (node && node.parentId === this.documentList.currentFolderId) {
            this.documentList.reload();
        }
    }

    onFolderChange($event) {
        this.router.navigate([this.navigationRoute, $event.value.id]);
    }

    openSnackMessageError(error: any) {
        this.notificationService.showError(error.value || error);
    }

    emitReadyEvent(event: NodePaging) {
        this.documentListReady.emit(event);
    }

    hasSelection(selection: Array<any>): boolean {
        return selection && selection.length > 0;
    }

    canCreateContent(parentNode: Node): boolean {
        if (parentNode) {
            return this.contentService.hasAllowableOperations(parentNode, 'create');
        }
        return false;
    }

    onChangePageSize(event: Pagination): void {
        this.preference.paginationSize = event.maxItems;
        this.pagination.maxItems = event.maxItems;
        this.pagination.skipCount = event.skipCount;
        this.changedPageSize.emit(event);
    }

    onChangePageNumber(event: Pagination): void {
        this.pagination.maxItems = event.maxItems;
        this.pagination.skipCount = event.skipCount;
        this.changedPageNumber.emit(event);
    }

    onNextPage(event: Pagination): void {
        this.pagination.maxItems = event.maxItems;
        this.pagination.skipCount = event.skipCount;
        this.turnedNextPage.emit(event);
    }

    onPrevPage(event: Pagination): void {
        this.pagination.maxItems = event.maxItems;
        this.pagination.skipCount = event.skipCount;
        this.turnedPreviousPage.emit(event);
    }

    searchResultsHighlight(search: SearchEntry): string {
        if (search?.highlight) {
            return search.highlight.map((currentHighlight) => currentHighlight.snippets).join(', ');
        }
        return '';
    }

    onFilterSelected(activeFilters: FilterSearch[]) {
        if (activeFilters.length) {
            this.navigateToFilter(activeFilters);
        } else {
            this.clearFilterNavigation();
        }
    }

    navigateToFilter(activeFilters: FilterSearch[]) {
        const objectFromMap = {};
        activeFilters.forEach((filter: FilterSearch) => {
            let paramValue = null;
            if (filter.value?.from && filter.value.to) {
                paramValue = `${filter.value.from}||${filter.value.to}`;
            } else {
                paramValue = filter.value;
            }
            objectFromMap[filter.key] = paramValue;
        });

        this.router.navigate([], { relativeTo: this.route, queryParams: objectFromMap });
    }

    clearFilterNavigation() {
        this.documentList.node = null;
        if (this.currentFolderId === '-my-') {
            this.router.navigate([this.navigationRoute, '']);
        } else {
            this.router.navigate([this.navigationRoute, this.currentFolderId]);
        }
        this.documentList.reload();
    }
}
