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

import { fakeAsync, tick } from '@angular/core/testing';
import { NodeFavoriteDirective } from './node-favorite.directive';
import { AlfrescoApiServiceMock } from '../mock/alfresco-api.service.mock';
import { AppConfigService } from '../app-config/app-config.service';
import { StorageService } from '../services/storage.service';

describe('NodeFavoriteDirective', () => {

    let directive;
    let alfrescoApiService;

    beforeEach(() => {
        alfrescoApiService = new AlfrescoApiServiceMock(new AppConfigService(null), new StorageService());
        directive = new NodeFavoriteDirective( alfrescoApiService);
    });

    describe('toggle node as favorite', () => {
        let removeFavoriteSpy;
        let addFavoriteSpy;

        beforeEach(() => {
            removeFavoriteSpy = spyOn(alfrescoApiService.getInstance().core.favoritesApi, 'removeFavoriteSite');
            addFavoriteSpy = spyOn(alfrescoApiService.getInstance().core.favoritesApi, 'addFavorite');
        });

        afterEach(() => {
            removeFavoriteSpy.calls.reset();
            addFavoriteSpy.calls.reset();
        });

        it('should not perform action if favorites collection is empty', fakeAsync(() => {
            directive.selection = [];
            tick();

            directive.toggleFavorite();

            expect(removeFavoriteSpy).not.toHaveBeenCalled();
            expect(addFavoriteSpy).not.toHaveBeenCalled();
        }));

        it('should call addFavorite() if none is a favorite', () => {
            addFavoriteSpy.and.returnValue(Promise.resolve());

            directive.selection = [
                { entry: { id: '1', name: 'name1', isFavorite: false } },
                { entry: { id: '2', name: 'name2', isFavorite: false } }
            ];

            directive.toggleFavorite();

            expect(addFavoriteSpy.calls.argsFor(0)[1].length).toBe(2);
        });

        it('should call addFavorite() on node that is not a favorite in selection', () => {
            addFavoriteSpy.and.returnValue(Promise.resolve());

            directive.selection = [
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

            directive.selection = [
                { entry: { id: '1', name: 'name1', isFavorite: true } },
                { entry: { id: '2', name: 'name2', isFavorite: true } }
            ];

            directive.toggleFavorite();

            expect(removeFavoriteSpy.calls.count()).toBe(2);
        });

        it('should emit event when removeFavoriteSite() is done', fakeAsync(() => {
            removeFavoriteSpy.and.returnValue(Promise.resolve());
            spyOn(directive.toggle, 'emit');

            directive.selection = [
                { entry: { id: '1', name: 'name1', isFavorite: true } }
            ];

            directive.toggleFavorite();
            tick();

            expect(directive.toggle.emit).toHaveBeenCalled();
        }));

        it('should emit event when addFavorite() is done', fakeAsync(() => {
            addFavoriteSpy.and.returnValue(Promise.resolve());
            spyOn(directive.toggle, 'emit');

            directive.selection = [
                { entry: { id: '1', name: 'name1', isFavorite: false } }
            ];

            directive.toggleFavorite();
            tick();

            expect(directive.toggle.emit).toHaveBeenCalled();
        }));

        it('should emit error event when removeFavoriteSite() fails', fakeAsync(() => {
            removeFavoriteSpy.and.returnValue(Promise.reject('error'));
            spyOn(directive.error, 'emit');

            directive.selection = [
                { entry: { id: '1', name: 'name1', isFavorite: true } }
            ];

            directive.toggleFavorite();
            tick();

            expect(directive.error.emit).toHaveBeenCalledWith('error');
        }));

        it('should emit error event when addFavorite() fails', fakeAsync(() => {
            addFavoriteSpy.and.returnValue(Promise.reject('error'));
            spyOn(directive.error, 'emit');

            directive.selection = [
                { entry: { id: '1', name: 'name1', isFavorite: false } }
            ];

            directive.toggleFavorite();
            tick();

            expect(directive.error.emit).toHaveBeenCalledWith('error');
        }));
    });

    describe('hasFavorites()', () => {
        it('should return false when favorites collection is empty', () => {
            directive.selection = [];

            const hasFavorites = directive.hasFavorites();

            expect(hasFavorites).toBe(false);
        });

        it('should return false when some are not favorite', () => {
            directive.selection = [
                { entry: { id: '1', name: 'name1', isFavorite: true } },
                { entry: { id: '2', name: 'name2', isFavorite: false } }
            ];

            const hasFavorites = directive.hasFavorites();

            expect(hasFavorites).toBe(false);
        });

        it('return true when all are favorite', () => {
            directive.selection = [
                { entry: { id: '1', name: 'name1', isFavorite: true } },
                { entry: { id: '2', name: 'name2', isFavorite: true } }
            ];

            const hasFavorites = directive.hasFavorites();

            expect(hasFavorites).toBe(true);
        });
    });
});
