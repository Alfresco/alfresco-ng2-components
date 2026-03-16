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

import { Directive, HostListener, Input, OnChanges, Output, EventEmitter, SimpleChanges, inject } from '@angular/core';
import { FavoriteBodyCreate, FavoritesApi, LazyApi } from '@alfresco/js-api';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { LibraryEntity } from '../interfaces/library-entity.interface';
import { NotificationService } from '@alfresco/adf-core';

@Directive({
    standalone: true,
    selector: '[adf-favorite-library]',
    exportAs: 'favoriteLibrary'
})
export class LibraryFavoriteDirective implements OnChanges {
    private readonly alfrescoApiService = inject(AlfrescoApiService);
    private readonly notificationService = inject(NotificationService);

    @Input('adf-favorite-library')
    library: LibraryEntity = null;

    @Output() toggle = new EventEmitter<any>();
    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() error = new EventEmitter<any>();

    private targetLibrary = null;

    @LazyApi((self: LibraryFavoriteDirective) => new FavoritesApi(self.alfrescoApiService.getInstance()))
    declare readonly favoritesApi: FavoritesApi;

    @HostListener('click')
    onClick() {
        const guid = this.targetLibrary.entry.guid;

        if (this.targetLibrary.isFavorite) {
            this.removeFavorite(guid);
        } else {
            this.addFavorite({
                target: {
                    site: {
                        guid
                    }
                }
            });
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.library.currentValue) {
            this.targetLibrary = null;
            return;
        }

        this.targetLibrary = changes.library.currentValue;
        this.markFavoriteLibrary(changes.library.currentValue);
    }

    isFavorite(): boolean {
        return this.targetLibrary?.isFavorite;
    }

    private async markFavoriteLibrary(library: LibraryEntity) {
        if (this.targetLibrary.isFavorite === undefined) {
            try {
                await this.favoritesApi.getFavoriteSite('-me-', library.entry.id);
                this.targetLibrary.isFavorite = true;
            } catch {
                this.targetLibrary.isFavorite = false;
            }
        } else {
            this.targetLibrary = library;
        }
    }

    private addFavorite(favoriteBody: FavoriteBodyCreate) {
        this.favoritesApi
            .createFavorite('-me-', favoriteBody)
            .then((libraryEntry) => {
                this.targetLibrary.isFavorite = true;
                this.notificationService.showInfo('NODE_FAVORITE_DIRECTIVE.MESSAGES.NODE_ADDED', null, { name: this.library.entry.title });
                this.toggle.emit(libraryEntry);
            })
            .catch((error) => this.error.emit(error));
    }

    private removeFavorite(favoriteId: string) {
        this.favoritesApi
            .deleteFavorite('-me-', favoriteId)
            .then((libraryBody) => {
                this.targetLibrary.isFavorite = false;
                this.notificationService.showInfo('NODE_FAVORITE_DIRECTIVE.MESSAGES.NODE_REMOVED', null, { name: this.library.entry.title });
                this.toggle.emit(libraryBody);
            })
            .catch((error) => this.error.emit(error));
    }
}
