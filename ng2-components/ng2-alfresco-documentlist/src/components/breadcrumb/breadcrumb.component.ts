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

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MinimalNodeEntryEntity, PathElementEntity } from 'alfresco-js-api';
import { DocumentListComponent } from '../document-list.component';

@Component({
    selector: 'adf-breadcrumb, alfresco-document-list-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BreadcrumbComponent implements OnChanges {

    @Input()
    folderNode: MinimalNodeEntryEntity;

    @Input()
    root: string;

    @Input()
    target: DocumentListComponent;

    route: PathElementEntity[] = [];

    @Output()
    navigate: EventEmitter<PathElementEntity> = new EventEmitter<PathElementEntity>();

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.folderNode) {

            let node: MinimalNodeEntryEntity = changes.folderNode.currentValue;

            if (node) {
                let route = <PathElementEntity[]> (node.path.elements || []);

                route.push(<PathElementEntity> {
                    id: node.id,
                    name: node.name
                });

                if (this.root) {
                    route = this.checkRoot(route);
                }

                this.route = route;
            }
        }
    }

    private checkRoot(route: PathElementEntity[]): PathElementEntity[] {
        let isRoot = false;
        route = route.filter((currentElement) => {
            if (currentElement.name === this.root) {
                isRoot = true;
            }
            return isRoot;
        });

        if (route.length === 0) {
            route.push(<PathElementEntity> {
                id: undefined,
                name: this.root
            });
        }
        return route;
    }

    public onRoutePathClick(route: PathElementEntity, event?: Event): void {
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
