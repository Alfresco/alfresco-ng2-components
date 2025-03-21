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

/* eslint-disable @angular-eslint/no-input-rename */

import { Directive, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FavoriteBodyCreate, NodeEntry, SharedLinkEntry, Node, SharedLink, FavoritesApi } from '@alfresco/js-api';
import { Observable, from, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { NotificationService } from '@alfresco/adf-core';

@Directive({
    standalone: true,
    selector: '[adf-node-favorite]',
    exportAs: 'adfFavorite'
})
export class NodeFavoriteDirective implements OnChanges {
    favorites: any[] = [];

    private _favoritesApi: FavoritesApi;
    get favoritesApi(): FavoritesApi {
        this._favoritesApi = this._favoritesApi ?? new FavoritesApi(this.alfrescoApiService.getInstance());
        return this._favoritesApi;
    }

    /** Array of nodes to toggle as favorites. */
    @Input('adf-node-favorite')
    selection: NodeEntry[] = [];

    /** Emitted when the favorite setting is complete. */
    @Output() toggle = new EventEmitter<any>();

    /** Emitted when the favorite setting fails. */
    @Output() error = new EventEmitter<any>();

    @HostListener('click')
    onClick() {
        this.toggleFavorite();
    }

    constructor(private readonly alfrescoApiService: AlfrescoApiService, private readonly notificationService: NotificationService) {}

    ngOnChanges(changes: SimpleChanges) {
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
                const id = (selected as SharedLinkEntry).entry.nodeId || selected.entry.id;

                return from(this.favoritesApi.deleteFavorite('-me-', id));
            });

            forkJoin(batch).subscribe({
                next: () => {
                    this.favorites.forEach((selected) => (selected.entry.isFavorite = false));
                    if (this.favorites.length > 1) {
                        this.notificationService.showInfo('NODE_FAVORITE_DIRECTIVE.MESSAGES.NODES_REMOVED', null, { number: this.favorites.length });
                    } else {
                        this.notificationService.showInfo('NODE_FAVORITE_DIRECTIVE.MESSAGES.NODE_REMOVED', null, {
                            name: this.favorites[0].entry.name
                        });
                    }
                    this.toggle.emit();
                },
                error: (error) => this.error.emit(error)
            });
        }

        if (!every) {
            const notFavorite = this.favorites.filter((node) => !node.entry.isFavorite);
            const body = notFavorite.map((node) => this.createFavoriteBody(node));

            from(this.favoritesApi.createFavorite('-me-', body as any)).subscribe({
                next: () => {
                    notFavorite.forEach((selected) => (selected.entry.isFavorite = true));
                    if (notFavorite.length > 1) {
                        this.notificationService.showInfo('NODE_FAVORITE_DIRECTIVE.MESSAGES.NODES_ADDED', null, { number: notFavorite.length });
                    } else {
                        this.notificationService.showInfo('NODE_FAVORITE_DIRECTIVE.MESSAGES.NODE_ADDED', null, { name: notFavorite[0].entry.name });
                    }
                    this.toggle.emit();
                },
                error: (error) => this.error.emit(error)
            });
        }
    }

    markFavoritesNodes(selection: NodeEntry[]) {
        if (selection.length <= this.favorites.length) {
            this.favorites = this.reduce(this.favorites, selection);
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

    private getProcessBatch(selection: NodeEntry[]): Observable<any>[] {
        return selection.map((selected) => this.getFavorite(selected));
    }

    private getFavorite(selected: NodeEntry | SharedLinkEntry): Observable<any> {
        const node: Node | SharedLink = selected.entry;

        // ACS 6.x with 'isFavorite' include
        if (node && Object.prototype.hasOwnProperty.call(node, 'isFavorite')) {
            return of(selected);
        }

        // ACS 5.x and 6.x without 'isFavorite' include
        const { name, isFile, isFolder } = node as Node;
        const id = (node as SharedLink).nodeId || node.id;

        const promise = this.favoritesApi.getFavorite('-me-', id);

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
            catchError(() =>
                of({
                    entry: {
                        id,
                        isFolder,
                        isFile,
                        name,
                        isFavorite: false
                    }
                })
            )
        );
    }

    private createFavoriteBody(node: NodeEntry): FavoriteBodyCreate {
        const type = this.getNodeType(node);
        // shared files have nodeId
        const id = node.entry['nodeId'] || node.entry.id;

        return {
            target: {
                [type]: {
                    guid: id
                }
            }
        };
    }

    private getNodeType(node: NodeEntry): string {
        // shared could only be files
        if (!node.entry.isFile && !node.entry.isFolder) {
            return 'file';
        }

        return node.entry.isFile ? 'file' : 'folder';
    }

    private diff(list: NodeEntry[], patch: any[]): NodeEntry[] {
        const ids = patch.map((item) => item.entry.id);

        return list.filter((item) => (ids.includes(item.entry.id) ? null : item));
    }

    private reduce(patch: any[], comparator: NodeEntry[]): any[] {
        const ids = comparator.map((item) => item.entry.id);

        return patch.filter((item) => (ids.includes(item.entry.id) ? item : null));
    }
}
