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

import { SimpleChange } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { NodeFavoriteDirective } from './node-favorite.directive';
import { AlfrescoApiServiceMock } from '../mock/alfresco-api.service.mock';
import { AppConfigService } from '../app-config/app-config.service';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreTestingModule } from '../testing/core.testing.module';
import { StorageService } from '../services/storage.service';

describe('NodeFavoriteDirective', () => {

    let directive;
    let alfrescoApiService;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        alfrescoApiService = new AlfrescoApiServiceMock(new AppConfigService(null), new StorageService());
        directive = new NodeFavoriteDirective( alfrescoApiService);
    });

    describe('selection input change event', () => {
        it('should not call markFavoritesNodes() if input list is empty', () => {
            spyOn(directive, 'markFavoritesNodes');

            const change = new SimpleChange(null, [], true);
            directive.ngOnChanges({'selection': change});

            expect(directive.markFavoritesNodes).not.toHaveBeenCalledWith();
        });

        it('should call markFavoritesNodes() on input change', () => {
            spyOn(directive, 'markFavoritesNodes');

            let selection = [{ entry: { id: '1', name: 'name1' } }];

            let change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({'selection': change});

            expect(directive.markFavoritesNodes).toHaveBeenCalledWith(selection);

            selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({'selection': change});

            expect(directive.markFavoritesNodes).toHaveBeenCalledWith(selection);
        });

        it('should reset favorites if selection is empty', fakeAsync(() => {
            spyOn(alfrescoApiService.getInstance().core.favoritesApi, 'getFavorite').and.returnValue(Promise.resolve());

            const selection = [
                { entry: { id: '1', name: 'name1' } }
            ];

            let change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({'selection': change});
            tick();

            expect(directive.hasFavorites()).toBe(true);

            change = new SimpleChange(null, [], true);
            directive.ngOnChanges({'selection': change});
            tick();

            expect(directive.hasFavorites()).toBe(false);
        }));
    });

    describe('markFavoritesNodes()', () => {
        let favoritesApiSpy;

        beforeEach(() => {
            favoritesApiSpy = spyOn(alfrescoApiService.getInstance().core.favoritesApi, 'getFavorite')
                .and.returnValue(Promise.resolve());
        });

        it('should check each selected node if it is a favorite', fakeAsync(() => {
            const selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            const change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({'selection': change});

            tick();
            expect(favoritesApiSpy.calls.count()).toBe(2);

        }));

        it('should not check processed node when another is unselected', fakeAsync(() => {
            let selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            let change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({'selection': change});

            tick();
            expect(directive.favorites.length).toBe(2);
            expect(favoritesApiSpy.calls.count()).toBe(2);

            favoritesApiSpy.calls.reset();

            selection = [
                { entry: { id: '2', name: 'name2' } }
            ];

            change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({'selection': change});

            tick();
            expect(directive.favorites.length).toBe(1);
            expect(favoritesApiSpy).not.toHaveBeenCalled();
        }));

        it('should not check processed nodes when another is selected', fakeAsync(() => {
            let selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            let change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({'selection': change});

            tick();

            expect(directive.favorites.length).toBe(2);
            expect(favoritesApiSpy.calls.count()).toBe(2);

            favoritesApiSpy.calls.reset();

            selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } },
                { entry: { id: '3', name: 'name3' } }
            ];

            change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({'selection': change});
            tick();

            expect(directive.favorites.length).toBe(3);
            expect(favoritesApiSpy.calls.count()).toBe(1);
        }));
    });

    describe('toggleFavorite()', () => {
        let removeFavoriteSpy;
        let addFavoriteSpy;

        beforeEach(() => {
            removeFavoriteSpy = spyOn(alfrescoApiService.getInstance().core.favoritesApi, 'removeFavoriteSite').and.callThrough();
            addFavoriteSpy = spyOn(alfrescoApiService.getInstance().core.favoritesApi, 'addFavorite').and.callThrough();
        });

        afterEach(() => {
            removeFavoriteSpy.calls.reset();
            addFavoriteSpy.calls.reset();
        });

        it('should not perform action if favorites collection is empty', fakeAsync(() => {
            const change = new SimpleChange(null, [], true);
            directive.ngOnChanges({'selection': change});
            tick();

            directive.toggleFavorite();

            expect(removeFavoriteSpy).not.toHaveBeenCalled();
            expect(addFavoriteSpy).not.toHaveBeenCalled();
        }));

        it('should call addFavorite() if none is a favorite', () => {
            addFavoriteSpy.and.returnValue(Promise.resolve());

            directive.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: false } },
                { entry: { id: '2', name: 'name2', isFavorite: false } }
            ];

            directive.toggleFavorite();

            expect(addFavoriteSpy.calls.argsFor(0)[1].length).toBe(2);
        });

        it('should call addFavorite() on node that is not a favorite in selection', () => {
            addFavoriteSpy.and.returnValue(Promise.resolve());

            directive.favorites = [
                { entry: { id: '1', name: 'name1', isFile: true, isFolder: false, isFavorite: false } },
                { entry: { id: '2', name: 'name2', isFile: true, isFolder: false, isFavorite: true } }
            ];

            directive.toggleFavorite();

            const callArgs = addFavoriteSpy.calls.argsFor(0)[1];
            const callParameter = callArgs[0];

            expect(callArgs.length).toBe(1);
            expect(callParameter.target.file.guid).toBe('1');
        });

        it('should call removeFavoriteSite() if all are favorites', () => {
            removeFavoriteSpy.and.returnValue(Promise.resolve());

            directive.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: true } },
                { entry: { id: '2', name: 'name2', isFavorite: true } }
            ];

            directive.toggleFavorite();

            expect(removeFavoriteSpy.calls.count()).toBe(2);
        });

        it('should emit event when removeFavoriteSite() is done', fakeAsync(() => {
            removeFavoriteSpy.and.returnValue(Promise.resolve());
            spyOn(directive.toggle, 'emit');

            directive.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: true } }
            ];

            directive.toggleFavorite();
            tick();

            expect(directive.toggle.emit).toHaveBeenCalled();
        }));

        it('should emit event when addFavorite() is done', fakeAsync(() => {
            addFavoriteSpy.and.returnValue(Promise.resolve());
            spyOn(directive.toggle, 'emit');

            directive.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: false } }
            ];

            directive.toggleFavorite();
            tick();

            expect(directive.toggle.emit).toHaveBeenCalled();
        }));

        it('should emit error event when removeFavoriteSite() fails', fakeAsync(() => {
            removeFavoriteSpy.and.returnValue(Promise.reject('error'));
            spyOn(directive.error, 'emit');

            directive.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: true } }
            ];

            directive.toggleFavorite();
            tick();

            expect(directive.error.emit).toHaveBeenCalledWith('error');
        }));

        it('should emit error event when addFavorite() fails', fakeAsync(() => {
            addFavoriteSpy.and.returnValue(Promise.reject('error'));
            spyOn(directive.error, 'emit');

            directive.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: false } }
            ];

            directive.toggleFavorite();
            tick();

            expect(directive.error.emit).toHaveBeenCalledWith('error');
        }));

        it('should set isFavorites items to false', fakeAsync(() => {
            removeFavoriteSpy.and.returnValue(Promise.resolve());

            directive.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: true } }
            ];

            directive.toggleFavorite();
            tick();

            expect(directive.hasFavorites()).toBe(false);
        }));

        it('should set isFavorites items to true', fakeAsync(() => {
            addFavoriteSpy.and.returnValue(Promise.resolve());

            directive.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: false } }
            ];

            directive.toggleFavorite();
            tick();

            expect(directive.hasFavorites()).toBe(true);
        }));
    });

    describe('getFavorite()', () => {

        it('should not hit server when using 6.x api', fakeAsync(() => {
            spyOn(alfrescoApiService.favoritesApi, 'getFavorite').and.callThrough();

            const selection = [
                { entry: { id: '1', name: 'name1', isFavorite: true } }
            ];

            const change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({'selection': change});
            tick();

            expect(directive.favorites[0].entry.isFavorite).toBe(true);
            expect(alfrescoApiService.favoritesApi.getFavorite).not.toHaveBeenCalled();
        }));

        it('should process node as favorite', fakeAsync(() => {
            spyOn(alfrescoApiService.getInstance().core.favoritesApi, 'getFavorite').and.returnValue(Promise.resolve());

            const selection = [
                { entry: { id: '1', name: 'name1' } }
            ];

            const change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({'selection': change});
            tick();

            expect(directive.favorites[0].entry.isFavorite).toBe(true);
        }));

        it('should not process node as favorite', fakeAsync(() => {
            spyOn(alfrescoApiService.getInstance().core.favoritesApi, 'getFavorite').and.returnValue(Promise.reject({}));

            const selection = [
                { entry: { id: '1', name: 'name1' } }
            ];

            const change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({'selection': change});
            tick();

            expect(directive.favorites[0].entry.isFavorite).toBe(false);
        }));
    });

    describe('hasFavorites()', () => {
        it('should return false when favorites collection is empty', () => {
            directive.favorites = [];

            const hasFavorites = directive.hasFavorites();

            expect(hasFavorites).toBe(false);
        });

        it('should return false when some are not favorite', () => {
            directive.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: true } },
                { entry: { id: '2', name: 'name2', isFavorite: false } }
            ];

            const hasFavorites = directive.hasFavorites();

            expect(hasFavorites).toBe(false);
        });

        it('return true when all are favorite', () => {
            directive.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: true } },
                { entry: { id: '2', name: 'name2', isFavorite: true } }
            ];

            const hasFavorites = directive.hasFavorites();

            expect(hasFavorites).toBe(true);
        });
    });
});
