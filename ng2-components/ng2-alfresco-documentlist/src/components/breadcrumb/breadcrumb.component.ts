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

import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { DocumentList } from '../document-list';

@Component({
    moduleId: module.id,
    selector: 'alfresco-document-list-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.css']
})
export class DocumentListBreadcrumb {

    private _currentFolderPath: string = '/';

    get currentFolderPath(): string {
        return this._currentFolderPath;
    }

    @Input()
    set currentFolderPath(val: string) {
        if (this._currentFolderPath !== val) {
            if (val) {
                this._currentFolderPath = val;
                this.route = this.parsePath(val);
            } else {
                this._currentFolderPath = this.rootFolder.path;
                this.route = [ this.rootFolder ];
            }
            this.pathChanged.emit({
                value: this._currentFolderPath,
                route: this.route
            });
        }
    }

    @Input()
    target: DocumentList;

    private rootFolder: PathNode = {
        name: 'Root',
        path: '/'
    };

    route: PathNode[] = [ this.rootFolder ];

    @Output()
    navigate: EventEmitter<any> = new EventEmitter();

    @Output()
    pathChanged: EventEmitter<any> = new EventEmitter();

    onRoutePathClick(route: PathNode, e?: Event) {
        if (e) {
            e.preventDefault();
        }

        if (route) {
            this.navigate.emit({
                value: {
                    name: route.name,
                    path: route.path
                }
            });

            if (this.target) {
                this.target.currentFolderPath = route.path;
            }
        }
    }

    private parsePath(path: string): PathNode[] {
        let parts = path.split('/').filter(val => val ? true : false);

        let result = [
            this.rootFolder
        ];

        let parentPath: string = this.rootFolder.path;

        for (let i = 0; i < parts.length; i++) {
            if (!parentPath.endsWith('/')) {
                parentPath += '/';
            }
            parentPath += parts[i];

            result.push({
                name: parts[i],
                path: parentPath
            });
        }

        return result;
    };
}

export interface PathNode {
    name: string;
    path: string;
}
