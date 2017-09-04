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

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MinimalNodeEntryEntity, PathElementEntity } from 'alfresco-js-api';
import { DocumentListComponent } from '../document-list.component';

@Component({
    selector: 'adf-breadcrumb, alfresco-document-list-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'adf-breadcrumb'
    }
})
export class BreadcrumbComponent implements OnChanges {

    @Input()
    folderNode: MinimalNodeEntryEntity;

    @Input()
    root: string;

    @Input()
    target: DocumentListComponent;

    route: PathElementEntity[] = [];

    get hasRoot(): boolean {
        return !!this.root;
    }

    @Output()
    navigate: EventEmitter<PathElementEntity> = new EventEmitter<PathElementEntity>();

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.folderNode) {

            const node: MinimalNodeEntryEntity = changes.folderNode.currentValue;

            if (node && node.path) {
                const route = <PathElementEntity[]> (node.path.elements || []).slice();

                route.push(<PathElementEntity> {
                    id: node.id,
                    name: node.name
                });

                if (this.root && route.length > 0) {
                    route[0].name = this.root;
                }

                this.route = route;
            }
        }
    }

    onRoutePathClick(route: PathElementEntity, event?: Event): void {
        if (event) {
            event.preventDefault();
        }

        if (route) {
            this.navigate.emit(route);

            if (this.target) {
                this.target.loadFolderByNodeId(route.id);
            }
        }
    }
}
