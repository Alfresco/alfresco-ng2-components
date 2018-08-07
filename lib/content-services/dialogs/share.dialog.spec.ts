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

import { async, TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { of } from 'rxjs';
import { ShareDialogComponent } from './share.dialog';
import { ContentTestingModule } from '../testing/content.testing.module';
import { SharedLinksApiService, setupTestBed } from '@alfresco/adf-core';

describe('ShareDialogComponent', () => {

    let fixture: ComponentFixture<ShareDialogComponent>;
    let spyCreate: any;
    let spyDelete: any;
    let component: ShareDialogComponent;
    let sharedLinksApiService: SharedLinksApiService;
    const dialogRef = {
        close: jasmine.createSpy('close')
    };

    let data: any = {
        node: { entry: { properties: { 'qshare:sharedId': 'example-link' }, name: 'example-name' } },
        baseShareUrl: 'baseShareUrl-example'
    };

    setupTestBed({
        imports: [ContentTestingModule],
        providers: [
            { provide: MatDialogRef, useValue: dialogRef },
            { provide: MAT_DIALOG_DATA, useValue: data }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ShareDialogComponent);
        sharedLinksApiService = TestBed.get(SharedLinksApiService);
        component = fixture.componentInstance;

        fixture.detectChanges();

        spyCreate = spyOn(sharedLinksApiService, 'createSharedLinks').and.returnValue(of({ entry: { id: 'test-sharedId' } }));
        spyDelete = spyOn(sharedLinksApiService, 'deleteSharedLink').and.returnValue(of({}));
    });

    it('should init the dialog with the file name and baseShareUrl', async(() => {
        component.data = {
            baseShareUrl: 'base-url/',
            node: { entry: { properties: { 'qshare:sharedId': 'example-link' }, name: 'example-name' } }
        };

        component.ngOnInit();

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelector('#adf-share-link').value).toBe('base-url/example-link');
        });
    }));

    describe('public link creation', () => {

        it('should not create the public link if it already present in the node', () => {
            component.data = {
                node: { entry: { properties: { 'qshare:sharedId': 'example-link' }, name: 'example-name' } }
            };

            component.ngOnInit();

            expect(spyCreate).not.toHaveBeenCalled();
        });

        it('should not create the public link if is not present in the node', () => {
            component.data = {
                node: { entry: { properties: {}, name: 'example-name' } },
                baseShareUrl: 'baseShareUrl-example'
            };

            component.ngOnInit();

            expect(spyCreate).not.toHaveBeenCalled();
        });

        it('should be able to delete the shared link', async(() => {
            component.data = {
                node: { entry: { name: 'example-name', properties: { 'qshare:sharedId': 'example-link' } } },
                baseShareUrl: 'baseShareUrl-example'
            };
            component.ngOnInit();
            fixture.detectChanges();
            fixture.nativeElement.querySelector('#adf-share-toggle-input').click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(spyDelete).toHaveBeenCalled();
                expect(component.data.node.entry.properties['qshare:sharedId']).toBeNull();
            });
        }));

        it('should show the toggle disabled when the shareid property is null', async(() => {
            component.data = {
                node: { entry: { name: 'example-name', properties: { 'qshare:sharedId': null } } },
                baseShareUrl: 'baseShareUrl-example'
            };
            component.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(fixture.nativeElement.querySelector('#adf-share-toggle')).not.toBeNull();
                expect(fixture.nativeElement.querySelector('#adf-share-toggle.mat-checked')).toBeNull();
            });
        }));
    });

});
