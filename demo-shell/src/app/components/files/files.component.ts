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

import { Component, Input, OnInit, OnChanges, OnDestroy, Optional, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NodePaging, Pagination } from '@alfresco/js-api';
import {
    PaginationComponent,
    FormRenderingService,
    ToolbarTitleComponent,
    ToolbarComponent,
    DataColumnComponent,
    DataColumnListComponent
} from '@alfresco/adf-core';
import { DocumentListComponent, BreadcrumbComponent } from '@alfresco/adf-content-services';
import { ProcessFormRenderingService } from '@alfresco/adf-process-services';
import { Subject } from 'rxjs';
import { PreviewService } from '../../services/preview.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

const DEFAULT_FOLDER_TO_SHOW = '-my-';

@Component({
    selector: 'app-files-component',
    standalone: true,
    imports: [
        CommonModule,
        ToolbarTitleComponent,
        ToolbarComponent,
        BreadcrumbComponent,
        DocumentListComponent,
        TranslateModule,
        DataColumnComponent,
        PaginationComponent,
        DataColumnListComponent
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

    // The identifier of a node. You can also use one of these well-known aliases: -my- | -shared- | -root-
    @Input()
    currentFolderId: string = DEFAULT_FOLDER_TO_SHOW;

    @Input()
    sorting = ['name', 'ASC'];

    @Input()
    nodeResult: NodePaging;

    @Input()
    pagination: Pagination;

    @Input()
    navigationRoute = '/files';

    constructor(private router: Router, private preview: PreviewService, @Optional() private route: ActivatedRoute) {}

    showFile(event) {
        const entry = event.value.entry;
        if (entry?.isFile) {
            this.preview.showResource(entry.id);
        }
    }

    ngOnInit() {
        if (!this.pagination) {
            this.pagination = {
                maxItems: 20,
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
            maxItems: 20,
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

    onFolderChange($event) {
        this.router.navigate([this.navigationRoute, $event.value.id]);
    }

    onChangePageSize(event: Pagination): void {
        this.pagination.maxItems = event.maxItems;
        this.pagination.skipCount = event.skipCount;
    }

    onChangePageNumber(event: Pagination): void {
        this.pagination.maxItems = event.maxItems;
        this.pagination.skipCount = event.skipCount;
    }

    onNextPage(event: Pagination): void {
        this.pagination.maxItems = event.maxItems;
        this.pagination.skipCount = event.skipCount;
    }

    onPrevPage(event: Pagination): void {
        this.pagination.maxItems = event.maxItems;
        this.pagination.skipCount = event.skipCount;
    }
}
