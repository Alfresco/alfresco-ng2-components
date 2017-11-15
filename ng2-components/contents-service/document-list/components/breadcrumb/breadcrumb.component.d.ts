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
import { EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MinimalNodeEntryEntity, PathElementEntity } from 'alfresco-js-api';
import { DocumentListComponent } from '../document-list.component';
export declare class DocumentListBreadcrumbComponent implements OnChanges {
    folderNode: MinimalNodeEntryEntity;
    target: DocumentListComponent;
    route: PathElementEntity[];
    navigate: EventEmitter<any>;
    ngOnChanges(changes: SimpleChanges): void;
    onRoutePathClick(route: PathElementEntity, e?: Event): void;
}
