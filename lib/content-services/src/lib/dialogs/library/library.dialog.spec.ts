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

import { LibraryDialogComponent } from './library.dialog';
import { TestBed, fakeAsync, tick, flush, ComponentFixture, flushMicrotasks } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { setupTestBed } from '@alfresco/adf-core';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SiteEntry } from '@alfresco/js-api';
import { SitesService } from '../../common/services/sites.service';

describe('LibraryDialogComponent', () => {
    let fixture: ComponentFixture<LibraryDialogComponent>;
    let component: LibraryDialogComponent;
    let sitesService: SitesService;
    let findSitesSpy;
    const findSitesResponse = { list: { entries: [] } };
    const dialogRef = {
        close: jasmine.createSpy('close')
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        providers: [
            { provide: MatDialogRef, useValue: dialogRef }
        ],
        schemas: [NO_ERRORS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LibraryDialogComponent);
        component = fixture.componentInstance;
        sitesService = TestBed.inject(SitesService);
        findSitesSpy = spyOn(component['queriesApi'], 'findSites');
    });

    afterEach(() => {
        findSitesSpy.calls.reset();
    });

    it('should set library id automatically on title input', fakeAsync(() => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        spyOn(sitesService, 'getSite').and.callFake(() => throwError('error'));

        fixture.detectChanges();
        component.form.controls.title.setValue('libraryTitle');
        tick(500);
        flush();
        fixture.detectChanges();

        expect(component.form.controls.id.value).toBe('libraryTitle');
    }));

    it('should translate library title space character to dash for library id', fakeAsync(() => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        spyOn(sitesService, 'getSite').and.callFake(() => throwError('error'));

        fixture.detectChanges();
        component.form.controls.title.setValue('library title');
        tick(500);
        flush();
        fixture.detectChanges();

        expect(component.form.controls.id.value).toBe('library-title');
    }));

    it('should not change custom library id on title input', fakeAsync(() => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        spyOn(sitesService, 'getSite').and.callFake(() => throwError('error'));

        fixture.detectChanges();
        component.form.controls.id.setValue('custom-id');
        component.form.controls.id.markAsDirty();
        tick(500);
        flush();
        fixture.detectChanges();

        component.form.controls.title.setValue('library title');
        tick(500);
        flush();
        fixture.detectChanges();

        expect(component.form.controls.id.value).toBe('custom-id');
    }));

    it('should invalidate form when library id already exists', fakeAsync(() => {
        spyOn(sitesService, 'getSite').and.returnValue(of(null));

        fixture.detectChanges();
        component.form.controls.id.setValue('existingLibrary');
        tick(500);
        flush();
        fixture.detectChanges();

        expect(component.form.controls.id.errors).toEqual({
            message: 'LIBRARY.ERRORS.EXISTENT_SITE'
        });
        expect(component.form.valid).toBe(false);
    }));

    it('should create site when form is valid', fakeAsync(() => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        spyOn(sitesService, 'createSite').and.returnValue(
            of({entry: {id: 'fake-id'}} as SiteEntry).pipe(delay(100))
        );
        spyOn(sitesService, 'getSite').and.callFake(() => throwError('error'));

        fixture.detectChanges();
        component.form.controls.title.setValue('library title');
        tick(500);
        flush();
        fixture.detectChanges();

        component.submit();
        fixture.detectChanges();
        const confirmButton = fixture.nativeElement.querySelector(`[data-automation-id="create-library-id"]`);
        expect(component.disableCreateButton).toBe(true);
        expect(confirmButton.disabled).toBe(true);

        tick(500);
        flushMicrotasks();
        fixture.detectChanges();

        expect(confirmButton.disabled).toBe(false);
        expect(component.disableCreateButton).toBe(false);

        expect(sitesService.createSite).toHaveBeenCalledWith({
            id: 'library-title',
            title: 'library title',
            description: '',
            visibility: 'PUBLIC'
        });
    }));

    it('should not create site when form is invalid', fakeAsync(() => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        spyOn(sitesService, 'createSite').and.returnValue(of(null));
        spyOn(sitesService, 'getSite').and.returnValue(of(null));

        fixture.detectChanges();
        component.form.controls.title.setValue('existingLibrary');
        tick(500);
        flush();
        fixture.detectChanges();

        component.submit();
        fixture.detectChanges();
        flush();

        expect(sitesService.createSite).not.toHaveBeenCalled();
    }));

    it('should notify when library title is already used', fakeAsync(() => {
        spyOn(sitesService, 'getSite').and.returnValue(of(null));
        findSitesSpy.and.returnValue(Promise.resolve(
            { list: { entries: [{ entry: { title: 'TEST', id: 'library-id' } }] } }
        ));

        fixture.detectChanges();
        component.form.controls.title.setValue('test');
        tick(500);
        flush();
        fixture.detectChanges();

        expect(component.libraryTitleExists).toBe(true);
    }));

    it('should notify on 409 conflict error (might be in trash)', fakeAsync(() => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        const error = { message: '{ "error": { "statusCode": 409 } }' };
        spyOn(sitesService, 'createSite').and.callFake(() => throwError(error));
        spyOn(sitesService, 'getSite').and.callFake(() => throwError('error'));

        fixture.detectChanges();
        component.form.controls.title.setValue('test');
        tick(500);
        flush();
        fixture.detectChanges();

        component.submit();
        fixture.detectChanges();
        flush();

        expect(component.form.controls.id.errors).toEqual({
            message: 'LIBRARY.ERRORS.CONFLICT'
        });
    }));

    it('should not translate library title if value is not a valid id', fakeAsync(() => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        spyOn(sitesService, 'getSite').and.callFake(() => throwError('error'));

        fixture.detectChanges();
        component.form.controls.title.setValue('@@@####');
        tick(500);
        flush();
        fixture.detectChanges();

        expect(component.form.controls.id.value).toBe(null);
    }));

    it('should translate library title partially for library id', fakeAsync(() => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        spyOn(sitesService, 'getSite').and.callFake(() => throwError('error'));

        fixture.detectChanges();
        component.form.controls.title.setValue('@@@####library');
        tick(500);
        flush();
        fixture.detectChanges();

        expect(component.form.controls.id.value).toBe('library');
    }));

    it('should translate library title multiple space character to one dash for library id', fakeAsync(() => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        spyOn(sitesService, 'getSite').and.callFake(() => throwError('error'));

        fixture.detectChanges();
        component.form.controls.title.setValue('library     title');
        tick(500);
        flush();
        fixture.detectChanges();

        expect(component.form.controls.id.value).toBe('library-title');
    }));

    it('should invalidate library title if is too short', fakeAsync(() => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        spyOn(sitesService, 'getSite').and.callFake(() => throwError('error'));

        fixture.detectChanges();
        component.form.controls.title.setValue('l');
        tick(500);
        flush();
        fixture.detectChanges();

        expect(component.form.controls.title.errors['minlength']).toBeTruthy();
        expect(component.form.valid).toBe(false);
    }));
});
