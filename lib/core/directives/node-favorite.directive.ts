/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Directive, EventEmitter, HostListener, Input, OnChanges, Output } from '@angular/core';
import { FavoriteBody, NodeEntry, SharedLinkEntry, Node, SharedLink } from '@alfresco/js-api';
import { Observable, from, forkJoin, of } from 'rxjs';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { catchError, map } from 'rxjs/operators';

@Directive({
    selector: '[adf-node-favorite]',
    exportAs: 'adfFavorite'
})
export class NodeFavoriteDirective implements OnChanges {
    favorites: any[] = [];

    /** Array of nodes to toggle as favorites. */
    @Input('adf-node-favorite')
    selection: NodeEntry[] = [];

    /** Emitted when the favorite setting is complete. */
    @Output() toggle: EventEmitter<any> = new EventEmitter();

    /** Emitted when the favorite setting fails. */
    @Output() error: EventEmitter<any> = new EventEmitter();

    @HostListener('click')
    onClick() {
        this.toggleFavorite();
    }

    constructor(private alfrescoApiService: AlfrescoApiService) {
    }

    ngOnChanges(changes) {
        if (!changes.selection.currentValue.length) {
            this.favorites = [];

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
            const batch = this.favorites.map((selected: NodeEntry | SharedLinkEntry) => {
                // shared files have nodeId
                const id = (<SharedLinkEntry> selected).entry.nodeId || selected.entry.id;

                return from(this.alfrescoApiService.favoritesApi.removeFavoriteSite('-me-', id));
            });

            forkJoin(batch).subscribe(
                () => {
                    this.favorites.map((selected) => selected.entry.isFavorite = false);
                    this.toggle.emit();
                },
                (error) => this.error.emit(error)
            );
        }

        if (!every) {
            const notFavorite = this.favorites.filter((node) => !node.entry.isFavorite);
            const body: FavoriteBody[] = notFavorite.map((node) => this.createFavoriteBody(node));

            from(this.alfrescoApiService.favoritesApi.addFavorite('-me-', <any> body))
                .subscribe(
                    () => {
                        notFavorite.map((selected) => selected.entry.isFavorite = true);
                        this.toggle.emit();
                    },
                    (error) => this.error.emit(error)
                );
        }
    }

    markFavoritesNodes(selection: NodeEntry[]) {
        if (selection.length <= this.favorites.length) {
            const newFavorites = this.reduce(this.favorites, selection);
            this.favorites = newFavorites;
        }

        const result = this.diff(selection, this.favorites);
        const batch = this.getProcessBatch(result);

        forkJoin(batch).subscribe((data) => {
            this.favorites.push(...data);
        });
    }

    hasFavorites(): boolean {
        if (this.favorites && !this.favorites.length) {
            return false;
        }

        return this.favorites.every((selected) => selected.entry.isFavorite);
    }

    private getProcessBatch(selection): any[] {
        return selection.map((selected: NodeEntry) => this.getFavorite(selected));
    }

    private getFavorite(selected: NodeEntry | SharedLinkEntry): Observable<any> {
        const node: Node | SharedLink = selected.entry;

        // ACS 6.x with 'isFavorite' include
        if (node && node.hasOwnProperty('isFavorite')) {
            return of(selected);
        }

        // ACS 5.x and 6.x without 'isFavorite' include
        const { name, isFile, isFolder } = <Node> node;
        const id =  (<SharedLink> node).nodeId || node.id;

        const promise = this.alfrescoApiService.favoritesApi.getFavorite('-me-', id);

        return from(promise).pipe(
            map(() => ({
                entry: {
                    id,
                    isFolder,
                    isFile,
                    name,
                    isFavorite: true
                }
            })),
            catchError(() => {
                return of({
                    entry: {
                        id,
                        isFolder,
                        isFile,
                        name,
                        isFavorite: false
                    }
                });
            })
        );
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
        const ids = patch.map((item) => item.entry.id);

        return list.filter((item) => ids.includes(item.entry.id) ? null : item);
    }

    private reduce(patch, comparator): any[] {
        const ids = comparator.map((item) => item.entry.id);

        return patch.filter((item) => ids.includes(item.entry.id) ? item : null);
    }
}
