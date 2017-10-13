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

import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CoreModule } from '../../index';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { NodeFavoriteDirective } from './node-favorite.directive';

@Component({
    template: `
        <div [adf-node-favorite]="selection"
             (toggle)="done()">
        </div>`
})
class TestComponent {
    selection;

    done = jasmine.createSpy('done');
}

describe('NodeFavoriteDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let element: DebugElement;
    let directiveInstance;
    let apiService;
    let favoritesApi;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [
                TestComponent
            ]
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(TestComponent);
            component = fixture.componentInstance;
            element = fixture.debugElement.query(By.directive(NodeFavoriteDirective));
            directiveInstance = element.injector.get(NodeFavoriteDirective);

            apiService = TestBed.get(AlfrescoApiService);
            favoritesApi = apiService.getInstance().core.favoritesApi;
        });
    }));

    describe('selection input change event', () => {
        it('should not call markFavoritesNodes() if input list is empty', () => {
            spyOn(directiveInstance, 'markFavoritesNodes');

            component.selection = [];

            fixture.detectChanges();

            expect(directiveInstance.markFavoritesNodes).not.toHaveBeenCalledWith();
        });

        it('should call markFavoritesNodes() on input change', () => {
            spyOn(directiveInstance, 'markFavoritesNodes');

            component.selection = [{ entry: { id: '1', name: 'name1' } }];

            fixture.detectChanges();

            expect(directiveInstance.markFavoritesNodes).toHaveBeenCalledWith(component.selection);

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '1', name: 'name1' } }
            ];

            fixture.detectChanges();

            expect(directiveInstance.markFavoritesNodes).toHaveBeenCalledWith(component.selection);
        });
    });

    describe('markFavoritesNodes()', () => {
        let favoritesApiSpy;

        beforeEach(() => {
            favoritesApiSpy = spyOn(favoritesApi, 'getFavorite');
        });

        it('should check each selected node if it is a favorite', fakeAsync(() => {
            favoritesApiSpy.and.returnValue(Promise.resolve());

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            tick();

            expect(favoritesApiSpy.calls.count()).toBe(2);
        }));

        it('should not check processed node when another is unselected', fakeAsync(() => {
            favoritesApiSpy.and.returnValue(Promise.resolve());

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            tick();

            expect(directiveInstance.favorites.length).toBe(2);
            expect(favoritesApiSpy.calls.count()).toBe(2);

            favoritesApiSpy.calls.reset();

            component.selection = [
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            tick();

            expect(directiveInstance.favorites.length).toBe(1);
            expect(favoritesApiSpy).not.toHaveBeenCalled();
        }));

        it('should not check processed nodes when another is selected', fakeAsync(() => {
            favoritesApiSpy.and.returnValue(Promise.resolve());

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            tick();

            expect(directiveInstance.favorites.length).toBe(2);
            expect(favoritesApiSpy.calls.count()).toBe(2);

            favoritesApiSpy.calls.reset();

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } },
                { entry: { id: '3', name: 'name3' } }
            ];

            fixture.detectChanges();
            tick();

            expect(directiveInstance.favorites.length).toBe(3);
            expect(favoritesApiSpy.calls.count()).toBe(1);
        }));
    });

    describe('toggleFavorite()', () => {
        let removeFavoriteSpy;
        let addFavoriteSpy;

        beforeEach(() => {
            removeFavoriteSpy = spyOn(favoritesApi, 'removeFavoriteSite');
            addFavoriteSpy = spyOn(favoritesApi, 'addFavorite');
        });

        afterEach(() => {
            removeFavoriteSpy.calls.reset();
            addFavoriteSpy.calls.reset();
        });

        it('should not perform action if favorites collection is empty', () => {
            component.selection = [];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(removeFavoriteSpy).not.toHaveBeenCalled();
            expect(addFavoriteSpy).not.toHaveBeenCalled();
        });

        it('should call addFavorite() if none is a favorite', fakeAsync(() => {
            addFavoriteSpy.and.returnValue(Promise.resolve());

            directiveInstance.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: false } },
                { entry: { id: '2', name: 'name2', isFavorite: false } }
            ];

            element.triggerEventHandler('click', null);
            tick();

            expect(addFavoriteSpy.calls.argsFor(0)[1].length).toBe(2);
        }));

        it('should call addFavorite() on node that is not a favorite in selection', fakeAsync(() => {
            addFavoriteSpy.and.returnValue(Promise.resolve());

            directiveInstance.favorites = [
                { entry: { id: '1', name: 'name1', isFile: true, isFolder: false, isFavorite: false } },
                { entry: { id: '2', name: 'name2', isFile: true, isFolder: false, isFavorite: true } }
            ];

            element.triggerEventHandler('click', null);
            tick();

            const callArgs = addFavoriteSpy.calls.argsFor(0)[1];
            const callParameter = callArgs[0];

            expect(callArgs.length).toBe(1);
            expect(callParameter.target.file.guid).toBe('1');
        }));

        it('should call removeFavoriteSite() if all are favorites', fakeAsync(() => {
            removeFavoriteSpy.and.returnValue(Promise.resolve());

            directiveInstance.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: true } },
                { entry: { id: '2', name: 'name2', isFavorite: true } }
            ];

            element.triggerEventHandler('click', null);
            tick();

            expect(removeFavoriteSpy.calls.count()).toBe(2);
        }));

        it('should emit event when removeFavoriteSite() is done', fakeAsync(() => {
            removeFavoriteSpy.and.returnValue(Promise.resolve());

            directiveInstance.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: true } }
            ];

            element.triggerEventHandler('click', null);
            tick();

            expect(component.done).toHaveBeenCalled();
        }));

        it('should emit event when addFavorite() is done', fakeAsync(() => {
            addFavoriteSpy.and.returnValue(Promise.resolve());

            directiveInstance.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: false } }
            ];

            element.triggerEventHandler('click', null);
            tick();

            expect(component.done).toHaveBeenCalled();
        }));
    });

    describe('getFavorite()', () => {
        it('should process node as favorite', fakeAsync(() => {
            spyOn(favoritesApi, 'getFavorite').and.returnValue(Promise.resolve());

            component.selection = [
                { entry: { id: '1', name: 'name1' } }
            ];

            fixture.detectChanges();
            tick();

            expect(directiveInstance.favorites[0].entry.isFavorite).toBe(true);
        }));

        it('should not process node as favorite', fakeAsync(() => {
            spyOn(favoritesApi, 'getFavorite').and.returnValue(Promise.reject(null));

            component.selection = [
                { entry: { id: '1', name: 'name1' } }
            ];

            fixture.detectChanges();
            tick();

            expect(directiveInstance.favorites[0].entry.isFavorite).toBe(false);
        }));
    });

    describe('reset()', () => {
        beforeEach(() => {
            spyOn(favoritesApi, 'removeFavoriteSite').and.returnValue(Promise.resolve());
            spyOn(favoritesApi, 'addFavorite').and.returnValue(Promise.resolve());
        });

        it('should reset favorite collection after removeFavoriteSite()', fakeAsync(() => {
            directiveInstance.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: true } }
            ];

            element.triggerEventHandler('click', null);
            tick();

            expect(directiveInstance.favorites.length).toBe(0);
        }));

        it('should reset favorite collection after addFavorite()', fakeAsync(() => {
            directiveInstance.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: false } }
            ];

            element.triggerEventHandler('click', null);
            tick();

            expect(directiveInstance.favorites.length).toBe(0);
        }));
    });

    describe('hasFavorites()', () => {
        it('should return false when favorites collection is empty', () => {
            directiveInstance.favorites = [];

            const hasFavorites = directiveInstance.hasFavorites();

            expect(hasFavorites).toBe(false);
        });

        it('should return false when some are not favorite', () => {
            directiveInstance.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: true } },
                { entry: { id: '2', name: 'name2', isFavorite: false } }
            ];

            const hasFavorites = directiveInstance.hasFavorites();

            expect(hasFavorites).toBe(false);
        });

        it('return true when all are favorite', () => {
            directiveInstance.favorites = [
                { entry: { id: '1', name: 'name1', isFavorite: true } },
                { entry: { id: '2', name: 'name2', isFavorite: true } }
            ];

            const hasFavorites = directiveInstance.hasFavorites();

            expect(hasFavorites).toBe(true);
        });
    });
});
