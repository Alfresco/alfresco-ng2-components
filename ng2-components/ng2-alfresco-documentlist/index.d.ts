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
import { ModuleWithProviders } from '@angular/core';
export * from './src/components/document-list';
export * from './src/components/content-column';
export * from './src/components/content-column-list';
export * from './src/components/content-action';
export * from './src/components/content-action-list';
export * from './src/components/empty-folder-content';
export * from './src/components/breadcrumb/breadcrumb.component';
export * from './src/data/share-datatable-adapter';
export * from './src/services/folder-actions.service';
export * from './src/services/document-actions.service';
export * from './src/services/document-list.service';
export * from './src/models/content-action.model';
export * from './src/models/document-library.model';
export declare const DOCUMENT_LIST_DIRECTIVES: any[];
export declare const DOCUMENT_LIST_PROVIDERS: any[];
export declare class DocumentListModule {
    static forRoot(): ModuleWithProviders;
}
