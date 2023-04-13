/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, ViewChild } from '@angular/core';
import { LibraryFavoriteDirective } from './library-favorite.directive';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AlfrescoApiServiceMock, CoreModule, AlfrescoApiService } from '@alfresco/adf-core';
import { LibraryEntity } from '../interfaces/library-entity.interface';

@Component({
    selector: 'app-test-component',
    template: ` <button #favoriteLibrary="favoriteLibrary" [adf-favorite-library]="selection">Favorite</button> `
})
class TestComponent {
    @ViewChild('favoriteLibrary', { static: true })
    directive: LibraryFavoriteDirective;

    selection: LibraryEntity = null;
}

describe('LibraryFavoriteDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let selection: LibraryEntity;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), CoreModule.forRoot()],
            providers: [
                { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
            ],
            declarations: [TestComponent, LibraryFavoriteDirective]
        });
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        selection = { entry: { guid: 'guid', id: 'id', title: 'Site', visibility: 'PUBLIC' }, isLibrary: true, isFavorite: false };
        component.selection = selection;
    });

    it('should not check for favorite if no selection exists', () => {
        spyOn(component.directive['favoritesApi'], 'getFavoriteSite');
        fixture.detectChanges();

        expect(component.directive['favoritesApi'].getFavoriteSite).not.toHaveBeenCalled();
    });

    it('should mark selection as favorite', async () => {
        spyOn(component.directive['favoritesApi'], 'getFavoriteSite').and.returnValue(Promise.resolve(null));

        delete selection.isFavorite;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.directive['favoritesApi'].getFavoriteSite).toHaveBeenCalled();
        expect(component.directive.isFavorite()).toBe(true);
    });

    it('should mark selection not favorite', async () => {
        spyOn(component.directive['favoritesApi'], 'getFavoriteSite').and.returnValue(Promise.reject());

        delete selection.isFavorite;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.directive['favoritesApi'].getFavoriteSite).toHaveBeenCalled();
        expect(component.directive.isFavorite()).toBe(false);
    });

    it('should call addFavorite() on click event when selection is not a favorite', async () => {
        spyOn(component.directive['favoritesApi'], 'getFavoriteSite').and.returnValue(Promise.reject());
        spyOn(component.directive['favoritesApi'], 'createFavorite').and.returnValue(Promise.resolve(null));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.directive.isFavorite()).toBeFalsy();

        fixture.nativeElement.querySelector('button').dispatchEvent(new MouseEvent('click'));
        fixture.detectChanges();
        expect(component.directive['favoritesApi'].createFavorite).toHaveBeenCalled();
    });

    it('should call removeFavoriteSite() on click event when selection is favorite', async () => {
        spyOn(component.directive['favoritesApi'], 'getFavoriteSite').and.returnValue(Promise.resolve(null));
        spyOn(component.directive['favoritesApi'], 'deleteFavorite').and.returnValue(Promise.resolve());

        selection.isFavorite = true;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.directive.isFavorite()).toBeTruthy();

        fixture.nativeElement.querySelector('button').dispatchEvent(new MouseEvent('click'));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.directive['favoritesApi'].deleteFavorite).toHaveBeenCalled();
    });
});
