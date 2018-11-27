/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@alfresco/adf-core';
import { LibraryDialogComponent } from './library.dialog';
import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {
  AlfrescoApiService,
  AlfrescoApiServiceMock,
  setupTestBed
} from '@alfresco/adf-core';

describe('LibraryDialogComponent', () => {
  let fixture;
  let component;
  let alfrescoApi;
  const dialogRef = {
    close: jasmine.createSpy('close')
  };

  setupTestBed({
    imports: [NoopAnimationsModule, CoreModule, ReactiveFormsModule],
    declarations: [LibraryDialogComponent],
    providers: [
      {
        provide: AlfrescoApiService,
        useClass: AlfrescoApiServiceMock
      },
      { provide: MatDialogRef, useValue: dialogRef }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryDialogComponent);
    component = fixture.componentInstance;
    alfrescoApi = TestBed.get(AlfrescoApiService);

    spyOn(
      alfrescoApi.getInstance().core.queriesApi,
      'findSites'
    ).and.returnValue(
      Promise.resolve({
        list: { entries: [] }
      })
    );
  });

  it('should set library id automatically on title input', fakeAsync(() => {
    spyOn(alfrescoApi.sitesApi, 'getSite').and.callFake(() => {
      return new Promise((resolve, reject) => reject());
    });

    fixture.detectChanges();
    component.form.controls.title.setValue('libraryTitle');
    tick(500);
    flush();
    fixture.detectChanges();

    expect(component.form.controls.id.value).toBe('libraryTitle');
  }));

  it('should translate library title space character to dash for library id', fakeAsync(() => {
    spyOn(alfrescoApi.sitesApi, 'getSite').and.callFake(() => {
      return new Promise((resolve, reject) => reject());
    });

    fixture.detectChanges();
    component.form.controls.title.setValue('library title');
    tick(500);
    flush();
    fixture.detectChanges();

    expect(component.form.controls.id.value).toBe('library-title');
  }));

  it('should not change custom library id on title input', fakeAsync(() => {
    spyOn(alfrescoApi.sitesApi, 'getSite').and.callFake(() => {
      return new Promise((resolve, reject) => reject());
    });

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
    spyOn(alfrescoApi.sitesApi, 'getSite').and.returnValue(Promise.resolve());

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
    spyOn(alfrescoApi.sitesApi, 'createSite').and.returnValue(
      Promise.resolve()
    );
    spyOn(alfrescoApi.sitesApi, 'getSite').and.callFake(() => {
      return new Promise((resolve, reject) => reject());
    });

    fixture.detectChanges();
    component.form.controls.title.setValue('library title');
    tick(500);
    flush();
    fixture.detectChanges();

    component.submit();
    fixture.detectChanges();
    flush();

    expect(alfrescoApi.sitesApi.createSite).toHaveBeenCalledWith({
      id: 'library-title',
      title: 'library title',
      description: '',
      visibility: 'PUBLIC'
    });
  }));

  it('should not create site when form is invalid', fakeAsync(() => {
    spyOn(alfrescoApi.sitesApi, 'createSite').and.returnValue(
      Promise.resolve({})
    );
    spyOn(alfrescoApi.sitesApi, 'getSite').and.returnValue(Promise.resolve());

    fixture.detectChanges();
    component.form.controls.title.setValue('existingLibrary');
    tick(500);
    flush();
    fixture.detectChanges();

    component.submit();
    fixture.detectChanges();
    flush();

    expect(alfrescoApi.sitesApi.createSite).not.toHaveBeenCalled();
  }));

  it('should notify on 409 conflict error (might be in trash)', fakeAsync(() => {
    const error = { message: '{ "error": { "statusCode": 409 } }' };
    spyOn(alfrescoApi.sitesApi, 'createSite').and.callFake(() => {
      return new Promise((resolve, reject) => reject(error));
    });
    spyOn(alfrescoApi.sitesApi, 'getSite').and.callFake(() => {
      return new Promise((resolve, reject) => reject());
    });

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
});
