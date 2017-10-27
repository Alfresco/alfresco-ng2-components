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

/* tslint:disable:no-input-rename */

import { Directive, EventEmitter, HostListener, Input, OnChanges, Output } from '@angular/core';
import { FavoriteBody, MinimalNodeEntity } from 'alfresco-js-api';
import { Observable } from 'rxjs/Rx';
import { AlfrescoApiService } from '../services/alfresco-api.service';

@Directive({
    selector: '[adf-node-favorite]',
    exportAs: 'adfFavorite'
})
export class NodeFavoriteDirective implements OnChanges {
    private favorites: any[] = [];

    @Input('adf-node-favorite')
    selection: MinimalNodeEntity[] = [];

    @Output() toggle: EventEmitter<any> = new EventEmitter();

    @HostListener('click')
    onClick() {
        this.toggleFavorite();
    }

    constructor(private alfrescoApiService: AlfrescoApiService) {}

    ngOnChanges(changes) {
        if (!changes.selection.currentValue.length) {
            return;
        }

        this.markFavoritesNodes(changes.selection.currentValue);
    }

    toggleFavorite() {
        if (!this.favorites.length) {
            return;
        }

        const every = this.favorites.every((selected) => selected.entry.isFavorite);

        if (every) {
            const batch = this.favorites.map((selected) => {
                // shared files have nodeId
                const id = selected.entry.nodeId || selected.entry.id;

                return Observable.fromPromise(this.alfrescoApiService.getInstance().core.favoritesApi.removeFavoriteSite('-me-', id));
            });

            Observable.forkJoin(batch).subscribe(() => {
                this.reset();
                this.toggle.emit();
            });
        }

        if (!every) {
            const notFavorite = this.favorites.filter((node) => !node.entry.isFavorite);
            const body: FavoriteBody[] = notFavorite.map((node) => this.createFavoriteBody(node));

            Observable.fromPromise(this.alfrescoApiService.getInstance().core.favoritesApi.addFavorite('-me-', <any> body))
                .subscribe(() => {
                    this.reset();
                    this.toggle.emit();
                });
        }
    }

    markFavoritesNodes(selection: MinimalNodeEntity[]) {
        if (selection.length < this.favorites.length) {
            const newFavorites = this.reduce(this.favorites, selection);
            this.favorites = newFavorites;
        }

        const result = this.diff(selection, this.favorites);
        const batch = this.getProcessBatch(result);

        Observable.forkJoin(batch).subscribe((data) => this.favorites.push(...data));
    }

    hasFavorites(): boolean {
        if (this.favorites && !this.favorites.length) {
            return false;
        }

        return this.favorites.every((selected) => selected.entry.isFavorite);
    }

    private reset() {
        this.favorites = [];
    }

    private getProcessBatch(selection): any[] {
        return selection.map((selected: MinimalNodeEntity) => this.getFavorite(selected));
    }

    private getFavorite(selected: MinimalNodeEntity): Observable<any> {
        const { name, isFile, isFolder } = selected.entry;
        // shared files have nodeId
        const id = (<any> selected).entry.nodeId || selected.entry.id;

        const promise =  this.alfrescoApiService.getInstance()
            .core.favoritesApi.getFavorite('-me-', id);

        return Observable.from(promise)
            .map(() => ({
                entry: {
                    id,
                    isFolder,
                    isFile,
                    name,
                    isFavorite: true
                }
            }))
            .catch(() => {
                return Observable.of({
                    entry: {
                        id,
                        isFolder,
                        isFile,
                        name,
                        isFavorite: false
                    }
                });
            });
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

    private diff(list, patch): any[] {
        const ids = patch.map(item => item.entry.id);

        return list.filter(item => ids.includes(item.entry.id) ? null : item);
    }

    private reduce(patch, comparator): any[] {
        const ids = comparator.map(item => item.entry.id);

        return patch.filter(item => ids.includes(item.entry.id) ? item : null);
    }
}
