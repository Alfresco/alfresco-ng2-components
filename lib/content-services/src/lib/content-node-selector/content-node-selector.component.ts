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

import { Component, DestroyRef, inject, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EmptyListComponent, NotificationService, ToolbarComponent, ToolbarTitleComponent, TranslationService } from '@alfresco/adf-core';
import { Node } from '@alfresco/js-api';
import { AllowableOperationsEnum } from '../common/models/allowable-operations.enum';
import { ContentService } from '../common/services/content.service';
import { UploadService } from '../common/services/upload.service';
import { ContentNodeSelectorComponentData } from './content-node-selector.component-data.interface';
import { NodeEntryEvent } from '../document-list/components/node.event';
import { NodeAction } from '../document-list/models/node-action.enum';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe } from '@ngx-translate/core';
import { DropdownBreadcrumbComponent } from '../breadcrumb/dropdown-breadcrumb.component';
import { NodeCounterDirective } from '../directives/node-counter.directive';
import { MatIconModule } from '@angular/material/icon';
import { UploadDragAreaComponent } from '../upload/components/upload-drag-area.component';
import { FileUploadingDialogComponent } from '../upload/components/file-uploading-dialog.component';
import { ContentNodeSelectorPanelComponent } from './content-node-selector-panel/content-node-selector-panel.component';
import { UploadButtonComponent } from '../upload/components/upload-button.component';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-content-node-selector',
    imports: [
        CommonModule,
        MatDialogModule,
        MatTabsModule,
        TranslatePipe,
        ToolbarTitleComponent,
        ToolbarComponent,
        DropdownBreadcrumbComponent,
        NodeCounterDirective,
        MatIconModule,
        UploadDragAreaComponent,
        FileUploadingDialogComponent,
        EmptyListComponent,
        ContentNodeSelectorPanelComponent,
        UploadButtonComponent,
        MatButtonModule
    ],
    templateUrl: './content-node-selector.component.html',
    styleUrls: ['./content-node-selector.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContentNodeSelectorComponent implements OnInit {
    title: string;
    action: NodeAction;
    buttonActionName: string;
    chosenNode: Node[];
    currentDirectoryId: string;
    showingSearch = false;
    hasAllowableOperations = false;
    isLoading = true;
    selectedTabIndex: number = 0;
    uploadStarted: boolean = false;

    emptyFolderImageUrl: string = './assets/images/empty_doc_lib.svg';
    breadcrumbFolderNode: Node;

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private translation: TranslationService,
        private contentService: ContentService,
        private notificationService: NotificationService,
        private uploadService: UploadService,
        private dialog: MatDialogRef<ContentNodeSelectorComponent>,
        private overlayContainer: OverlayContainer,
        @Inject(MAT_DIALOG_DATA) public data: ContentNodeSelectorComponentData
    ) {
        this.action = data.actionName ?? NodeAction.CHOOSE;
        this.buttonActionName = `NODE_SELECTOR.${this.action}`;
        this.title = data.title;
        this.currentDirectoryId = data.currentFolderId;
    }

    ngOnInit() {
        this.dialog
            .keydownEvents()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event) => {
                if (event?.key === 'Escape') {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    this.close();
                }
            });

        this.dialog
            .backdropClick()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.close();
            });

        this.dialog
            .afterOpened()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.overlayContainer.getContainerElement().setAttribute('role', 'main');
            });

        this.uploadService.fileUploadStarting.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.uploadStarted = true;
        });
    }
    close() {
        this.dialog.close();
        this.overlayContainer.getContainerElement().setAttribute('role', 'region');
    }

    onSelect(nodeList: Node[]) {
        this.chosenNode = nodeList;
    }

    onSiteChange(siteTitle: string) {
        this.updateTitle(siteTitle);
    }

    onNavigationChange(pathElement: NodeEntryEvent) {
        this.currentDirectoryId = pathElement.value.id;
        this.isLoading = true;
    }

    onClick(): void {
        this.data.select.next(this.chosenNode);
        this.close();
    }

    updateTitle(siteTitle: string) {
        if (this.action === NodeAction.CHOOSE && siteTitle) {
            this.title = this.getTitleTranslation(this.action, siteTitle);
        }
    }

    getTitleTranslation(action: NodeAction, name: string): string {
        return this.translation.instant(`NODE_SELECTOR.${action}_ITEM`, { name: this.translation.instant(name) });
    }

    getSelectedCount(): number {
        return this.chosenNode?.length || 0;
    }

    isCounterVisible(): boolean {
        return this.action === NodeAction.ATTACH || this.action === NodeAction.CHOOSE;
    }

    isMultipleSelection(): boolean {
        return this.data.selectionMode === 'multiple';
    }

    onError(error) {
        this.notificationService.showError(error);
    }

    isChooseButtonDisabled(): boolean {
        return this.uploadService.isUploading() || !this.hasNodeSelected();
    }

    hasNodeSelected(): boolean {
        return this.chosenNode?.length > 0;
    }

    onShowingSearch(value: boolean) {
        this.showingSearch = value;
    }

    onCurrentFolder(currentFolder: Node) {
        this.hasAllowableOperations = this.contentService.hasAllowableOperations(currentFolder, AllowableOperationsEnum.CREATE);
        this.breadcrumbFolderNode = currentFolder;
    }

    isNotAllowedToUpload() {
        return this.showingSearch || !this.hasAllowableOperations;
    }

    onFolderLoaded() {
        this.isLoading = false;
    }

    onTabSelectionChange(tabIndex: number) {
        this.selectedTabIndex = tabIndex;
    }

    isFileServerTabSelected(): boolean {
        return this.selectedTabIndex === 0;
    }

    isLocalUploadTabSelected(): boolean {
        return this.selectedTabIndex === 1;
    }

    isUploadEnabled(): boolean {
        return this.canPerformLocalUpload() && this.isLocalUploadTabSelected();
    }

    canPerformLocalUpload(): boolean {
        return this.data?.showLocalUploadButton;
    }

    getWarningMessage(): string {
        if (this.showingSearch) {
            return 'NODE_SELECTOR.UPLOAD_BUTTON_SEARCH_WARNING_MESSAGE';
        }
        return this.hasNoPermissionToUpload() ? 'NODE_SELECTOR.UPLOAD_BUTTON_PERMISSION_WARNING_MESSAGE' : '';
    }

    hasNoPermissionToUpload(): boolean {
        return !this.hasAllowableOperations && !this.showingSearch && !this.isLoading;
    }

    hasUploadError(): boolean {
        return this.showingSearch || this.hasNoPermissionToUpload();
    }
}
