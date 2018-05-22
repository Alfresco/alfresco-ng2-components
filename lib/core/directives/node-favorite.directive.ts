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

/* tslint:disable:no-input-rename  */

import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FavoriteBody, MinimalNodeEntity } from 'alfresco-js-api';
import { Observable } from 'rxjs/Observable';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/observable/forkJoin';

@Directive({
    selector: '[adf-node-favorite]',
    exportAs: 'adfFavorite'
})
export class NodeFavoriteDirective {
    /** Array of nodes to toggle as favorites. */
    @Input('adf-node-favorite')
    selection: MinimalNodeEntity[] = [];

    /** Emitted when the favorite setting is complete. */
    @Output() toggle: EventEmitter<any> = new EventEmitter();

    /** Emitted when the favorite setting has fail. */
    @Output() error: EventEmitter<any> = new EventEmitter();

    @HostListener('click')
    onClick() {
        this.toggleFavorite();
    }

    constructor(private alfrescoApiService: AlfrescoApiService) {
    }

    toggleFavorite() {
        if (!this.selection.length) {
            return;
        }

        const every = this.selection.every((selected) => selected.entry.isFavorite);

        if (every) {
            const batch = this.selection.map((selected) => {
                // shared files have nodeId
                const id = selected.entry.nodeId || selected.entry.id;

                return Observable.fromPromise(this.alfrescoApiService.favoritesApi.removeFavoriteSite('-me-', id));
            });

            Observable.forkJoin(batch).subscribe(
                () => this.toggle.emit(),
                error => this.error.emit(error)
            );
        }

        if (!every) {
            const notFavorite = this.selection.filter((node) => !node.entry.isFavorite);
            const body: FavoriteBody[] = notFavorite.map((node) => this.createFavoriteBody(node));

            Observable
                .fromPromise(this.alfrescoApiService.favoritesApi.addFavorite('-me-', <any> body))
                .subscribe(
                    () => this.toggle.emit(),
                    error => this.error.emit(error)
                );
        }
    }

    hasFavorites(): boolean {
        if (!this.selection.length) {
            return false;
        }

        return this.selection.every((selected) => selected.entry.isFavorite);
    }

    private createFavoriteBody(node): FavoriteBody {
        const type = this.getNodeType(node);
        // shared files have nodeId
        const id = node.entry.nodeId || node.entry.id;

        return {
            target: {
                [type]: {
                    guid: id
                }
            }
        };
    }

    private getNodeType(node): string {
        // shared could only be files
        if (!node.entry.isFile && !node.entry.isFolder) {
            return 'file';
        }

        return node.entry.isFile ? 'file' : 'folder';
    }
}
