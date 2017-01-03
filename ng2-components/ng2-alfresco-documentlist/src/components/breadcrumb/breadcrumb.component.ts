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

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MinimalNodeEntryEntity, PathElementEntity } from 'alfresco-js-api';
import { DocumentList } from '../document-list';

@Component({
    moduleId: module.id,
    selector: 'alfresco-document-list-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.css']
})
export class DocumentListBreadcrumb implements OnChanges {

    @Input()
    folderNode: MinimalNodeEntryEntity;

    @Input()
    target: DocumentList;

    route: PathElementEntity[] = [];

    @Output()
    navigate: EventEmitter<any> = new EventEmitter();

    ngOnChanges(changes: SimpleChanges) {
        if (changes['folderNode']) {

            let node: MinimalNodeEntryEntity = changes['folderNode'].currentValue;
            if (node) {
                // see https://github.com/Alfresco/alfresco-js-api/issues/139
                let route = <PathElementEntity[]> (node.path.elements || []);
                route.push(<PathElementEntity> {
                    id: node.id,
                    name: node.name
                });
                this.route = route;
            }
        }
    }

    onRoutePathClick(route: PathElementEntity, e?: Event) {
        if (e) {
            e.preventDefault();
        }

        if (route) {
            this.navigate.emit({
                value: route
            });

            if (this.target) {
                this.target.loadFolderByNodeId(route.id);
            }
        }
    }
}
