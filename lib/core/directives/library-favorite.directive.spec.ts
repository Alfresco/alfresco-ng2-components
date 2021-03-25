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

import { Component, ViewChild } from '@angular/core';
import { LibraryEntity, LibraryFavoriteDirective } from './library-favorite.directive';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AlfrescoApiService } from '../services';
import { CoreModule } from '../core.module';
import { AlfrescoApiServiceMock } from '../mock';

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
    let api: AlfrescoApiService;
    let component: TestComponent;
    let selection: LibraryEntity;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), CoreModule.forRoot()/*, AppTestingModule*/],
            providers: [
                { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
            ],
            declarations: [TestComponent, LibraryFavoriteDirective]
        });
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        api = TestBed.inject(AlfrescoApiService);
        selection = { entry: { guid: 'guid', id: 'id', title: 'Site', visibility: 'PUBLIC' }, isLibrary: true, isFavorite: false };
        component.selection = selection;
    });

    it('should not check for favorite if no selection exists', () => {
        spyOn(api.peopleApi, 'getFavoriteSite');
        fixture.detectChanges();

        expect(api.peopleApi.getFavoriteSite).not.toHaveBeenCalled();
    });

    it('should mark selection as favorite', async () => {
        spyOn(api.peopleApi, 'getFavoriteSite').and.returnValue(Promise.resolve(null));

        delete selection.isFavorite;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(api.peopleApi.getFavoriteSite).toHaveBeenCalled();
        expect(component.directive.isFavorite()).toBe(true);
    });

    it('should mark selection not favorite', async () => {
        spyOn(api.peopleApi, 'getFavoriteSite').and.returnValue(Promise.reject());

        delete selection.isFavorite;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(api.peopleApi.getFavoriteSite).toHaveBeenCalled();
        expect(component.directive.isFavorite()).toBe(false);
    });

    it('should call addFavorite() on click event when selection is not a favorite', async () => {
        spyOn(api.peopleApi, 'getFavoriteSite').and.returnValue(Promise.reject());
        spyOn(api.peopleApi, 'addFavorite').and.returnValue(Promise.resolve(null));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.directive.isFavorite()).toBeFalsy();

        fixture.nativeElement.querySelector('button').dispatchEvent(new MouseEvent('click'));
        fixture.detectChanges();
        expect(api.peopleApi.addFavorite).toHaveBeenCalled();
    });

    it('should call removeFavoriteSite() on click event when selection is favorite', async () => {
        spyOn(api.peopleApi, 'getFavoriteSite').and.returnValue(Promise.resolve(null));
        spyOn(api.favoritesApi, 'removeFavoriteSite').and.returnValue(Promise.resolve());

        selection.isFavorite = true;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.directive.isFavorite()).toBeTruthy();

        fixture.nativeElement.querySelector('button').dispatchEvent(new MouseEvent('click'));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(api.favoritesApi.removeFavoriteSite).toHaveBeenCalled();
    });
});
