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

import { LibraryDialogComponent } from './library.dialog';
import { TestBed, fakeAsync, tick, flush, ComponentFixture, flushMicrotasks } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SiteEntry, SitePaging } from '@alfresco/js-api';
import { SitesService } from '../../common/services/sites.service';
import { NotificationService } from '@alfresco/adf-core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatRadioGroupHarness } from '@angular/material/radio/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';

describe('LibraryDialogComponent', () => {
    let fixture: ComponentFixture<LibraryDialogComponent>;
    let component: LibraryDialogComponent;
    let sitesService: SitesService;
    let findSitesSpy: jasmine.Spy<(term: string, opts?: any) => Promise<SitePaging>>;
    let notificationService: NotificationService;
    const findSitesResponse = new SitePaging({ list: { entries: [], pagination: {} } });
    const dialogRef = {
        close: jasmine.createSpy('close')
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule, LibraryDialogComponent],
            providers: [{ provide: MatDialogRef, useValue: dialogRef }],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(LibraryDialogComponent);
        component = fixture.componentInstance;
        sitesService = TestBed.inject(SitesService);
        findSitesSpy = spyOn(component['queriesApi'], 'findSites');
        notificationService = TestBed.inject(NotificationService);
    });

    afterEach(() => {
        findSitesSpy.calls.reset();
    });

    it('should set library id automatically on title input', fakeAsync(() => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        spyOn(sitesService, 'getSite').and.callFake(() => throwError(() => 'error'));

        fixture.detectChanges();
        component.form.controls.title.setValue('libraryTitle');
        tick(500);
        flush();
        fixture.detectChanges();

        expect(component.form.controls.id.value).toBe('libraryTitle');
    }));

    it('should translate library title space character to dash for library id', fakeAsync(() => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        spyOn(sitesService, 'getSite').and.callFake(() => throwError(() => 'error'));

        fixture.detectChanges();
        component.form.controls.title.setValue('library title');
        tick(500);
        flush();
        fixture.detectChanges();

        expect(component.form.controls.id.value).toBe('library-title');
    }));

    it('should not change custom library id on title input', fakeAsync(() => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        spyOn(sitesService, 'getSite').and.callFake(() => throwError(() => 'error'));

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
        spyOn(sitesService, 'createSite').and.returnValue(of({ entry: { id: 'fake-id' } } as SiteEntry).pipe(delay(100)));
        spyOn(sitesService, 'getSite').and.callFake(() => throwError(() => 'error'));

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
        const sitePaging = new SitePaging({
            list: {
                entries: [
                    {
                        entry: {
                            id: 'library-id',
                            title: 'TEST',
                            guid: '',
                            visibility: 'PUBLIC'
                        }
                    }
                ],
                pagination: {}
            }
        });
        findSitesSpy.and.returnValue(Promise.resolve(sitePaging));

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
        spyOn(sitesService, 'createSite').and.callFake(() => throwError(() => error));
        spyOn(sitesService, 'getSite').and.callFake(() => throwError(() => 'error'));

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

    it('should show generic error notification on error code other than 409', fakeAsync(() => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        const error = { message: '{ "error": { "statusCode": 404 } }' };
        spyOn(sitesService, 'createSite').and.callFake(() => throwError(() => error));
        spyOn(sitesService, 'getSite').and.callFake(() => throwError(() => 'error'));
        spyOn(notificationService, 'showError').and.callThrough();

        fixture.detectChanges();
        component.form.controls.title.setValue('test');
        tick(500);
        flush();
        fixture.detectChanges();

        component.submit();
        fixture.detectChanges();
        flush();

        expect(notificationService.showError).toHaveBeenCalledWith('CORE.MESSAGES.ERRORS.GENERIC');
    }));

    it('should handle default errors and show generic error in snackbar', fakeAsync(() => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        const error = {};
        spyOn(sitesService, 'createSite').and.callFake(() => throwError(() => error));
        spyOn(sitesService, 'getSite').and.callFake(() => throwError(() => 'error'));
        spyOn(notificationService, 'showError').and.callThrough();

        fixture.detectChanges();
        component.form.controls.title.setValue('test');
        tick(500);
        flush();
        fixture.detectChanges();

        component.submit();
        fixture.detectChanges();
        flush();

        expect(notificationService.showError).toHaveBeenCalledWith('CORE.MESSAGES.ERRORS.GENERIC');
    }));

    it('should not translate library title if value is not a valid id', fakeAsync(() => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        spyOn(sitesService, 'getSite').and.callFake(() => throwError(() => 'error'));

        fixture.detectChanges();
        component.form.controls.title.setValue('@@@####');
        tick(500);
        flush();
        fixture.detectChanges();

        expect(component.form.controls.id.value).toBe(null);
    }));

    it('should translate library title partially for library id', fakeAsync(() => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        spyOn(sitesService, 'getSite').and.callFake(() => throwError(() => 'error'));

        fixture.detectChanges();
        component.form.controls.title.setValue('@@@####library');
        tick(500);
        flush();
        fixture.detectChanges();

        expect(component.form.controls.id.value).toBe('library');
    }));

    it('should translate library title multiple space character to one dash for library id', fakeAsync(() => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        spyOn(sitesService, 'getSite').and.callFake(() => throwError(() => 'error'));

        fixture.detectChanges();
        component.form.controls.title.setValue('library     title');
        tick(500);
        flush();
        fixture.detectChanges();

        expect(component.form.controls.id.value).toBe('library-title');
    }));

    it('should invalidate library title if is too short', fakeAsync(() => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        spyOn(sitesService, 'getSite').and.callFake(() => throwError(() => 'error'));

        fixture.detectChanges();
        component.form.controls.title.setValue('l');
        tick(500);
        flush();
        fixture.detectChanges();

        expect(component.form.controls.title.errors['minlength']).toBeTruthy();
        expect(component.form.valid).toBe(false);
    }));

    it('should handle getters when form fields have no values', () => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        fixture.detectChanges();
        component.form.controls.title.setValue(null);
        component.form.controls.id.setValue(null);
        component.visibilityOption = null;

        expect(component.title).toBe('');
        expect(component.id).toBe('');
        expect(component.visibility).toBe('');
    });

    it('should handle visibility change', async () => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        fixture.detectChanges();

        const loader: HarnessLoader = TestbedHarnessEnvironment.loader(fixture);
        const radioGroup = await loader.getHarness(MatRadioGroupHarness);
        const radioButtons = await radioGroup.getRadioButtons();

        await radioButtons[1].check();
        fixture.detectChanges();

        expect(component.visibilityOption).toBe('PRIVATE');
        expect(component.visibility).toBe('PRIVATE');
    });

    it('should set libraryTitleExists to false when findSites returns no sites', () => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        fixture.detectChanges();
        component.form.controls.title.setValue('library');
        fixture.detectChanges();

        expect(component.libraryTitleExists).toBe(false);
    });

    it('should clear timeout if validator is called multiple times', () => {
        spyOn(component['sitesService'], 'getSite').and.returnValue(of(null));
        spyOn(window, 'clearTimeout').and.callThrough();

        fixture.detectChanges();

        component.form.controls.id.setValue('first');
        component.form.controls.id.setValue('second');

        expect(window.clearTimeout).toHaveBeenCalled();
    });

    it('should catch error if findLibraryByTitle fails', async () => {
        findSitesSpy.and.returnValue(Promise.reject(new Error('error')));
        const result = await component['findLibraryByTitle']('library');
        expect(result).toEqual({ list: { entries: [] } });
    });

    it('should show correct error message when value is only spaces', () => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        fixture.detectChanges();
        component.form.controls.title.setValue('   ');
        expect(component.form.controls.title.errors).toEqual({ message: 'LIBRARY.ERRORS.ONLY_SPACES' });
    });

    it('should show correct error message when value contains special characters', () => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        fixture.detectChanges();
        component.form.controls.id.setValue('wąż');
        expect(component.form.controls.id.errors).toEqual({ message: 'LIBRARY.ERRORS.ILLEGAL_CHARACTERS' });
    });

    it('should show correct error message when there is no library title', async () => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        fixture.detectChanges();
        component.form.controls.title.setValue('');
        component.form.controls.title.markAsTouched();
        fixture.detectChanges();

        const loader = TestbedHarnessEnvironment.loader(fixture);
        const titleFormField = await loader.getHarness(MatFormFieldHarness);
        const errors = await titleFormField.getTextErrors();

        expect(component.form.controls.title.errors).toEqual({ required: true });
        expect(errors[0]).toContain('LIBRARY.ERRORS.NAME_REQUIRED');
    });

    it('should show correct error message when there is no library id', async () => {
        findSitesSpy.and.returnValue(Promise.resolve(findSitesResponse));
        fixture.detectChanges();
        component.form.controls.id.setValue('');
        component.form.controls.id.markAsTouched();
        fixture.detectChanges();

        const loader = TestbedHarnessEnvironment.loader(fixture);
        const formFields = await loader.getAllHarnesses(MatFormFieldHarness);
        const idFormField = formFields[1];
        const errors = await idFormField.getTextErrors();

        expect(component.form.controls.id.errors).toEqual({ required: true });
        expect(errors[0]).toContain('LIBRARY.ERRORS.ID_REQUIRED');
    });
});
