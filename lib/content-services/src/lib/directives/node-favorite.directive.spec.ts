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

import { SimpleChange } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NodeFavoriteDirective } from './node-favorite.directive';
import { AppConfigService, AppConfigServiceMock, NotificationService } from '@alfresco/adf-core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AlfrescoApiService } from '../services';
import { AlfrescoApiServiceMock } from '../mock';
import { ContentTestingModule } from '../testing/content.testing.module';

describe('NodeFavoriteDirective', () => {
    let directive: NodeFavoriteDirective;
    let alfrescoApiService: AlfrescoApiService;
    let notificationService: NotificationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ContentTestingModule],
            providers: [
                { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
                { provide: AppConfigService, useClass: AppConfigServiceMock }
            ]
        });
        alfrescoApiService = TestBed.inject(AlfrescoApiService);
        notificationService = TestBed.inject(NotificationService);
        directive = new NodeFavoriteDirective(alfrescoApiService, notificationService);
    });

    describe('selection input change event', () => {
        it('should not call markFavoritesNodes() if input list is empty', () => {
            spyOn(directive, 'markFavoritesNodes');

            const change = new SimpleChange(null, [], true);
            directive.ngOnChanges({ selection: change });

            expect(directive.markFavoritesNodes).not.toHaveBeenCalledWith();
        });

        it('should call markFavoritesNodes() on input change', () => {
            spyOn(directive, 'markFavoritesNodes');

            let selection = [{ entry: { id: '1', name: 'name1' } }];

            let change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({ selection: change });

            expect(directive.markFavoritesNodes).toHaveBeenCalledWith(selection);

            selection = [{ entry: { id: '1', name: 'name1' } }, { entry: { id: '2', name: 'name2' } }];

            change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({ selection: change });

            expect(directive.markFavoritesNodes).toHaveBeenCalledWith(selection);
        });

        it('should reset favorites if selection is empty', fakeAsync(() => {
            spyOn(directive.favoritesApi, 'getFavorite').and.returnValue(Promise.resolve(null));

            const selection = [{ entry: { id: '1', name: 'name1' } }];

            let change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({ selection: change });
            tick();

            expect(directive.hasFavorites()).toBe(true);

            change = new SimpleChange(null, [], true);
            directive.ngOnChanges({ selection: change });
            tick();

            expect(directive.hasFavorites()).toBe(false);
        }));
    });

    describe('markFavoritesNodes()', () => {
        let favoritesApiSpy: jasmine.Spy;

        beforeEach(() => {
            favoritesApiSpy = spyOn(directive.favoritesApi, 'getFavorite').and.returnValue(Promise.resolve(null));
        });

        it('should check each selected node if it is a favorite', fakeAsync(() => {
            const selection = [{ entry: { id: '1', name: 'name1' } }, { entry: { id: '2', name: 'name2' } }];

            const change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({ selection: change });

            tick();
            expect(favoritesApiSpy.calls.count()).toBe(2);
        }));

        it('should not check processed node when another is unselected', fakeAsync(() => {
            let selection = [{ entry: { id: '1', name: 'name1' } }, { entry: { id: '2', name: 'name2' } }];

            let change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({ selection: change });

            tick();
            expect(directive.favorites.length).toBe(2);
            expect(favoritesApiSpy.calls.count()).toBe(2);

            favoritesApiSpy.calls.reset();

            selection = [{ entry: { id: '2', name: 'name2' } }];

            change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({ selection: change });

            tick();
            expect(directive.favorites.length).toBe(1);
            expect(favoritesApiSpy).not.toHaveBeenCalled();
        }));

        it('should not check processed nodes when another is selected', fakeAsync(() => {
            let selection = [{ entry: { id: '1', name: 'name1' } }, { entry: { id: '2', name: 'name2' } }];

            let change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({ selection: change });

            tick();

            expect(directive.favorites.length).toBe(2);
            expect(favoritesApiSpy.calls.count()).toBe(2);

            favoritesApiSpy.calls.reset();

            selection = [{ entry: { id: '1', name: 'name1' } }, { entry: { id: '2', name: 'name2' } }, { entry: { id: '3', name: 'name3' } }];

            change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({ selection: change });
            tick();

            expect(directive.favorites.length).toBe(3);
            expect(favoritesApiSpy.calls.count()).toBe(1);
        }));
    });

    describe('toggleFavorite()', () => {
        let removeFavoriteSpy: jasmine.Spy;
        let addFavoriteSpy: jasmine.Spy;

        beforeEach(() => {
            removeFavoriteSpy = spyOn(directive.favoritesApi, 'deleteFavorite').and.callThrough();
            addFavoriteSpy = spyOn(directive.favoritesApi, 'createFavorite').and.callThrough();
        });

        afterEach(() => {
            removeFavoriteSpy.calls.reset();
            addFavoriteSpy.calls.reset();
        });

        it('should not perform action if favorites collection is empty', fakeAsync(() => {
            const change = new SimpleChange(null, [], true);
            directive.ngOnChanges({ selection: change });
            tick();

            directive.toggleFavorite();

            expect(removeFavoriteSpy).not.toHaveBeenCalled();
            expect(addFavoriteSpy).not.toHaveBeenCalled();
        }));

        it('should call addFavorite() and display snackbar message if none is a favorite', (done) => {
            spyOn(notificationService, 'showInfo');
            addFavoriteSpy.and.returnValue(Promise.resolve());

            directive.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: false } },
                { entry: { id: '2', name: 'name2', isFavorite: false } }
            ];

            directive.toggle.subscribe(() => {
                expect(addFavoriteSpy.calls.argsFor(0)[1].length).toBe(2);
                expect(notificationService.showInfo).toHaveBeenCalledWith('NODE_FAVORITE_DIRECTIVE.MESSAGES.NODES_ADDED', null, { number: 2 });
                done();
            });
            directive.toggleFavorite();
        });

        it('should call addFavorite() and display snackbar message on node that is not a favorite in selection', (done) => {
            spyOn(notificationService, 'showInfo');
            addFavoriteSpy.and.returnValue(Promise.resolve());

            directive.favorites = [
                { entry: { id: '1', name: 'name1', isFile: true, isFolder: false, isFavorite: false } },
                { entry: { id: '2', name: 'name2', isFile: true, isFolder: false, isFavorite: true } }
            ];

            directive.toggle.subscribe(() => {
                const callArgs = addFavoriteSpy.calls.argsFor(0)[1];
                const callParameter = callArgs[0];

                expect(callArgs.length).toBe(1);
                expect(callParameter.target.file.guid).toBe('1');
                expect(notificationService.showInfo).toHaveBeenCalledWith('NODE_FAVORITE_DIRECTIVE.MESSAGES.NODE_ADDED', null, { name: 'name1' });
                done();
            });
            directive.toggleFavorite();
        });

        it('should call removeFavoriteSite() and display snackbar message if all are favorites', (done) => {
            spyOn(notificationService, 'showInfo');
            removeFavoriteSpy.and.returnValue(Promise.resolve());

            directive.favorites = [{ entry: { id: '1', name: 'name1', isFavorite: true } }, { entry: { id: '2', name: 'name2', isFavorite: true } }];

            directive.toggle.subscribe(() => {
                expect(removeFavoriteSpy.calls.count()).toBe(2);
                expect(notificationService.showInfo).toHaveBeenCalledWith('NODE_FAVORITE_DIRECTIVE.MESSAGES.NODES_REMOVED', null, { number: 2 });
                done();
            });
            directive.toggleFavorite();
        });

        it('should emit event and display snackbar message when removeFavoriteSite() is done', (done) => {
            spyOn(notificationService, 'showInfo');
            removeFavoriteSpy.and.returnValue(Promise.resolve());
            spyOn(directive.toggle, 'emit').and.callThrough();

            directive.favorites = [{ entry: { id: '1', name: 'name1', isFavorite: true } }];

            directive.toggle.subscribe(() => {
                expect(directive.toggle.emit).toHaveBeenCalled();
                expect(notificationService.showInfo).toHaveBeenCalledWith('NODE_FAVORITE_DIRECTIVE.MESSAGES.NODE_REMOVED', null, { name: 'name1' });
                done();
            });
            directive.toggleFavorite();
        });

        it('should emit event when addFavorite() is done', (done) => {
            addFavoriteSpy.and.returnValue(Promise.resolve());
            spyOn(directive.toggle, 'emit').and.callThrough();

            directive.favorites = [{ entry: { id: '1', name: 'name1', isFavorite: false } }];

            directive.toggle.subscribe(() => {
                expect(directive.toggle.emit).toHaveBeenCalled();
                done();
            });
            directive.toggleFavorite();
        });

        it('should emit error event when removeFavoriteSite() fails', (done) => {
            const error = new Error('error');
            removeFavoriteSpy.and.returnValue(Promise.reject(error));
            spyOn(directive.error, 'emit').and.callThrough();

            directive.favorites = [{ entry: { id: '1', name: 'name1', isFavorite: true } }];

            directive.error.subscribe(() => {
                expect(directive.error.emit).toHaveBeenCalledWith(error);
                done();
            });
            directive.toggleFavorite();
        });

        it('should emit error event when addFavorite() fails', (done) => {
            const error = new Error('error');
            addFavoriteSpy.and.returnValue(Promise.reject(error));
            spyOn(directive.error, 'emit').and.callThrough();

            directive.favorites = [{ entry: { id: '1', name: 'name1', isFavorite: false } }];

            directive.error.subscribe(() => {
                expect(directive.error.emit).toHaveBeenCalledWith(error);
                done();
            });
            directive.toggleFavorite();
        });

        it('should set isFavorites items to false', (done) => {
            removeFavoriteSpy.and.returnValue(Promise.resolve());

            directive.favorites = [{ entry: { id: '1', name: 'name1', isFavorite: true } }];

            directive.toggle.subscribe(() => {
                expect(directive.hasFavorites()).toBe(false);
                done();
            });
            directive.toggleFavorite();
        });

        it('should set isFavorites items to true', (done) => {
            addFavoriteSpy.and.returnValue(Promise.resolve());

            directive.favorites = [{ entry: { id: '1', name: 'name1', isFavorite: false } }];

            directive.toggle.subscribe(() => {
                expect(directive.hasFavorites()).toBe(true);
                done();
            });
            directive.toggleFavorite();
        });
    });

    describe('getFavorite()', () => {
        it('should not hit server when using 6.x api', fakeAsync(() => {
            spyOn(directive.favoritesApi, 'getFavorite').and.callThrough();

            const selection = [{ entry: { id: '1', name: 'name1', isFavorite: true } }];

            const change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({ selection: change });
            tick();

            expect(directive.favorites[0].entry.isFavorite).toBe(true);
            expect(directive.favoritesApi.getFavorite).not.toHaveBeenCalled();
        }));

        it('should process node as favorite', fakeAsync(() => {
            spyOn(directive.favoritesApi, 'getFavorite').and.returnValue(Promise.resolve(null));

            const selection = [{ entry: { id: '1', name: 'name1' } }];

            const change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({ selection: change });
            tick();

            expect(directive.favorites[0].entry.isFavorite).toBe(true);
        }));

        it('should not process node as favorite', fakeAsync(() => {
            spyOn(directive.favoritesApi, 'getFavorite').and.returnValue(Promise.reject(new Error('error')));

            const selection = [{ entry: { id: '1', name: 'name1' } }];

            const change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({ selection: change });
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
            directive.favorites = [{ entry: { id: '1', name: 'name1', isFavorite: true } }, { entry: { id: '2', name: 'name2', isFavorite: false } }];

            const hasFavorites = directive.hasFavorites();

            expect(hasFavorites).toBe(false);
        });

        it('return true when all are favorite', () => {
            directive.favorites = [{ entry: { id: '1', name: 'name1', isFavorite: true } }, { entry: { id: '2', name: 'name2', isFavorite: true } }];

            const hasFavorites = directive.hasFavorites();

            expect(hasFavorites).toBe(true);
        });
    });
});
